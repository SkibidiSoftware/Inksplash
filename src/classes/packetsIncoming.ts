import type { GatewayCapabilities } from "classes/gateway";

export interface GatewayIdentifyProperties {
    os: string;
    browser: string;
    device: string;
    system_locale: string;
    browser_user_agent: string;
    browser_version: string;
    os_version: string;
    referrer: string;
    referring_domain: string;
    referrer_current: string;
    referring_domain_current: string;
    release_channel: string;
    client_build_number: number;
    client_event_source: unknown;
    has_client_mods: boolean; // what??
    client_launch_id: string;
    client_heartbeat_session_id: string;
    client_app_state: string;
    launch_signature: string;
    is_fast_connect: boolean;
    gateway_connect_reasons: string;
}

export interface GatewayIdentifyPresence {
    status: "unknown" | "online" | "idle" | "dnd" | "invisible" | "offline";
    since: number; /* in ms, unix timestamp */
    afk: boolean;
    activities: unknown // todo
}

export interface GatewayIdentifyPacket {
    token: string;
    capabilities: GatewayCapabilities;
    properties: GatewayIdentifyProperties;
    presence?: GatewayIdentifyPresence;
    /* intents later */
}