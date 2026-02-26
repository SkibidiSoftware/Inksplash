import { green } from "colorette";
import { msg } from "modules/logger";
import { INK_GATEWAY_PORT, PROJECT_NAME } from "modules/constants";
import { gatewayReceive, type GatewayClientData } from "modules/socket";

Bun.serve({
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
                accountId: "0",
                created: new Date(),
                encoding,
                compress,
            }
        });
        if (success) return undefined;

        return Response.json({ success: true });
    },
    error(e) {
        return Response.json({ success: false, message: e.message });
    },
    websocket: {
        data: {} as GatewayClientData,

        open: ws => {
            msg(`New client ${green(ws.data.id)} connected to the ${PROJECT_NAME} Gateway`);
        },
        close: ws => {
            msg(`Client ${green(ws.data.id)} disconnected from the ${PROJECT_NAME} Gateway`);
        },
        message: gatewayReceive,
    },
});