export interface GatewayHelloPacket {
    heartbeat_interval: number; /* millisecond interval of the client heartbeat */
    _trace: string[]; /* an array of stringified json values acting as the connection trace for debugging */
}