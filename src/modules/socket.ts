import { green } from "colorette";
import { dbg } from "modules/logger";

export enum GatewayOp {
    DISPATCH                        = 0, // receive
    HEARTBEAT                       = 1, // send/receive
    IDENTIFY                        = 2, // send
    PRESENCE_UPDATE                 = 3, // send
    VOICE_STATE_UPDATE              = 4, // send
    VOICE_PING                      = 5, // send
    RESUME                          = 6, // send
    RECONNECT                       = 7, // receive
    REQUEST_GUILD_MEMBERS           = 8, // send
    INVALID_SESSION                 = 9, // receive
    HELLO                           = 10, // receive
    HEARTBEAT_ACK                   = 11, // receive
    GUILD_SYNC                      = 12, // obsolete, send
    CALL_CONNECT                    = 13, // send
    REGISTER_GUILD_EVENTS           = 14, // send
    LOBBY_CONNECT                   = 15, // obsolete, send
    LOBBY_DISCONNECT                = 16, // obsolete, send
    LOBBY_VOICE_STATES_UPDATE       = 17, // receive
    STREAM_CREATE                   = 18, // send
    STREAM_DELETE                   = 19, // send
    STREAM_WATCH                    = 20, // send
    STREAM_PING                     = 21, // send
    STREAM_SET_PAUSED               = 22, // send
    LFG_SUBSCRIPTIONS               = 23, // obsolete, send
    REQUEST_GUILD_APP_COMMANDS      = 24, // obsolete, send
    EMBEDDED_ACTIVITY_CREATE        = 25, // obsolete, send
    EMBEDDED_ACTIVITY_DELETE        = 26, // obsolete, send
    EMBEDDED_ACTIVITY_UPDATE        = 27, // obsolete, send
    REQUEST_FORUM_UNREADS           = 28, // send
    REMOTE_COMMAND                  = 29, // send
    REQUEST_DELETED_ENTITY_IDS      = 30, // send
    REQUEST_SOUNDBOARD_SOUNDS       = 31, // send
    CLIENT_SPEEDTEST_CREATE         = 32, // send
    CLIENT_SPEEDTEST_DELETE         = 33, // send
	REQUEST_LAST_MESSAGES           = 34, // send
	SEARCH_RECENT_MESSAGES          = 35, // send
	REQUEST_CHANNEL_STATUSES        = 36, // send
    GUILD_SUBSCRIPTIONS_BULK        = 37, // send
    GUILD_CHANNELS_RESYNC           = 38, // send
	REQUEST_CHANNEL_MEMBER_COUNT    = 39, // send
    QOS_HEARTBEAT                   = 40, // send
    UPDATE_TIME_SPENT_SESSION_ID    = 41, // send
    LOBBY_VOICE_SERVER_PING         = 42, // send
    REQUEST_CHANNEL_INFO            = 43, // send
}

export interface PacketBase {
    op: GatewayOp; // (op)eration code
    d: unknown; // event (d)ata
    s?: number; // (s)equence number
    t?: string // event name (DISPATCH opcode only)
}

export type GatewayClientData = {
    id: string;
    accountId: string;
    created: Date;
    encoding: "etf" | "json";
    compress: "none" | "zlib-stream" | "zstd-stream";
}

export type GatewayClientSock = Bun.ServerWebSocket<GatewayClientData>;

export function gatewaySend<T>(
    client: GatewayClientSock,
    op: GatewayOp = GatewayOp.HEARTBEAT_ACK,
    data?: T
) {
    // todo, leave this to me i'll do it tomorrow
}

export function gatewayReceive(
    ws: GatewayClientSock,
    data: string | Buffer<ArrayBuffer>
) {
    dbg(`Message from ${green(ws.data.id)} received: ${data}`);
}