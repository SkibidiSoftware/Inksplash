import { green } from "colorette";
import { msg } from "modules/logger";
import { INK_GATEWAY_PORT, PROJECT_NAME, GATEWAY_IDENTIFIER, INK_GATEWAY_HEARTBEAT_INTERVAL_MS } from "modules/constants";
import { gatewayReceive, gatewaySend } from "modules/socket";
import { GatewayOp, type GatewayClientData } from "classes/gateway";
import type { GatewayHelloPacket } from "classes/packetsOutgoing";
import { constants, Deflate } from "fast-zlib";

Bun.serve({
    id: GATEWAY_IDENTIFIER,
    port: INK_GATEWAY_PORT,
    fetch(req, server) {
        const params = new URLSearchParams(req.url.split("?")[1]);
        const encoding = params.has("encoding") ? params.get("encoding") : "json";
        const compress = params.has("compress") ? params.get("compress") : "none";

        if (encoding != "json" && encoding != "etf") throw new Error("Unsupported encoding method");
        if (compress != "zlib-stream" && compress != "zstd-stream" && compress != "none") throw new Error("Unsupported compression method");

        const success = server.upgrade(req, {
            data: {
                id: Bun.randomUUIDv7(),
                accountId: "-1" /* not authenticated */,
                created: new Date(),
                lastHeartbeat: new Date(),
                encoding,
                compress,
                sequence: 0,

                deflate: new Deflate({ chunkSize: 65535, flush: constants.Z_SYNC_FLUSH })
            }
        });
        if (success) return undefined;

        return Response.json({ success: true });
    },
    error(e) {
        return Response.json({ success: false, message: e.message });
    },
    websocket: {
        idleTimeout: Math.ceil(INK_GATEWAY_HEARTBEAT_INTERVAL_MS / 1000) + 5,
        data: {} as GatewayClientData,

        open: ws => {
            msg(`New client ${green(ws.data.id)} connected to the ${PROJECT_NAME} Gateway`);
            gatewaySend<GatewayHelloPacket>(ws, GatewayOp.HELLO, {
                content: {
                    heartbeat_interval: INK_GATEWAY_HEARTBEAT_INTERVAL_MS,
                    _trace: [ JSON.stringify([
                        GATEWAY_IDENTIFIER,
                        { micros: 0.0 }
                    ]) ]
                }
            });
        },
        close: ws => {
            msg(`Client ${green(ws.data.id)} disconnected from the ${PROJECT_NAME} Gateway`);
        },
        message: gatewayReceive,
    },
});