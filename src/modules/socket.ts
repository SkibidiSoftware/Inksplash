import { green } from "colorette";
import { dbg, err, msg } from "modules/logger";
import { constructPacket, receivePacket } from "modules/compress";
import { type GatewayClientSock, GatewayCloseEventCode, type GatewayDispatchEvent, GatewayOp, type PacketBase } from "classes/gateway";
import type { GatewayIdentifyPacket } from "classes/packetsIncoming";
import { getUserIdFromToken, isUserTokenValid } from "modules/token";
import { fetchUser } from "modules/cache";
import type { GatewayReadyEventPacket } from "classes/packetsOutgoing";
import { GATEWAY_IDENTIFIER, INK_GATEWAY_HOST, IS_HTTPS } from "modules/constants";
import { packetizeUser } from "modules/user";
import { VersionedArray } from "classes/generic";
import type { UserGuildSettings } from "classes/user";
import type { ResourceReadState } from "classes/resources";

export async function gatewaySend<T>(
    client: GatewayClientSock,
    op: GatewayOp = GatewayOp.HEARTBEAT_ACK,
    data: { event?: GatewayDispatchEvent | null, content?: T } = { event: null },
) {
    const p = await constructPacket(
        { compress: client.data.compress, zlibDeflate: client.data.deflate, encoding: client.data.encoding },
        op,
        data?.content ?? {},
        data?.event ?? null,
        client.data.sequence);

    if (!p) { err("ERROR: Gateway failed to send packet! Please investigate!!"); return; }
    dbg(`Sending client ${client.data.id} content with ${p.byteLength} byte(s)`)
    await client.sendBinary(p, false);
}

export async function gatewayReceive(
    ws: GatewayClientSock,
    data: string | Buffer<ArrayBuffer>
) {
    dbg(`Message from ${green(ws.data.id)} received`);
    var p = await receivePacket<PacketBase<unknown>>({ encoding: ws.data.encoding }, data);
    switch (p?.op) {
        default: { dbg(`UNSUPPORTED OPCODE RECEIVED: ${p?.op}`); break; }
        case GatewayOp.IDENTIFY: {
            const d = p.d as GatewayIdentifyPacket;
            
            if (!await isUserTokenValid(d.token)) return ws.close(GatewayCloseEventCode.AUTHENTICATION_FAILED);

            const uid = await getUserIdFromToken(d.token, true);
            msg(`Gateway client ${green(ws.data.id)} authenticated as ${green(uid)}.`);
            ws.data.accountId = uid;

            const u = await fetchUser(uid);
            if (!u) return ws.close(GatewayCloseEventCode.UNKNOWN_ERROR);

            const payload: GatewayReadyEventPacket = {
                _trace: [ JSON.stringify([
                    GATEWAY_IDENTIFIER,
                    { micros: 0.0 }
                ]) ],
                v: 9,
                user: packetizeUser(u),
                user_settings_proto: "",
                notification_settings: { flags: 0 },
                user_guild_settings: new VersionedArray<UserGuildSettings>(),
                read_state: new VersionedArray<ResourceReadState>(),
                guilds: [],
                guild_join_requests: [],
                relationships: [],
                game_relationships: [],
                private_channels: [],
                connected_accounts: [],
                notes: {},
                presences: [],
                merged_members: [],
                merged_presences: {},
                users: [],
                linked_users: [],
                session_id: "",
                session_type: "",
                sessions: [],
                static_client_session_id: "",
                auth_session_id_hash: "",
                analytics_token: "",
                authenticator_types: [],
                required_action: "AGREEMENTS",
                country_code: "us",
                geo_ordered_rtc_regions: [],
                consents: { personalization: { consented: false }, usage_statistics: { consented: false } },
                resume_gateway_url: `ws${IS_HTTPS ? "s" : ""}://${INK_GATEWAY_HOST}`,
                api_code_version: 0,
                experiments: [],
                guild_experiments: [],
                apex_experiments: { assignments: [] },
                explicit_content_scan_version: 0,
            };
            gatewaySend<GatewayReadyEventPacket>(
                ws,
                GatewayOp.DISPATCH,
                {
                    event: "READY",
                    content: payload
                });
            break;
        }

        case GatewayOp.HEARTBEAT:
        case GatewayOp.QOS_HEARTBEAT: {
            ws.data.lastHeartbeat = new Date();
            gatewaySend(ws, GatewayOp.HEARTBEAT_ACK);
            break;
        }
    }
}