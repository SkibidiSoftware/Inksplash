import type { UserConsentType, UserGuildSettings, UserPacket, UserRequiredActionType } from "classes/user";
import type { VersionedArray } from "classes/generic";
import type { ResourceReadState } from "classes/resources";
import type { ApexExperiments } from "classes/experiments";

export interface GatewayHelloPacket {
    heartbeat_interval: number; /* millisecond interval of the client heartbeat */
    _trace: string[]; /* an array of stringified json values acting as the connection trace for debugging */
}

export interface GatewayReadyEventPacket {
    _trace: string[];
    v: number; // version
    user: UserPacket;
    user_settings_proto: string;
    notification_settings: { flags: number };
    user_guild_settings: VersionedArray<UserGuildSettings>;
    read_state: VersionedArray<ResourceReadState>;
    guilds: unknown[];
    guild_join_requests: unknown[];
    relationships: unknown[];
    game_relationships: unknown[];
    friend_suggestion_count?: number;
    private_channels: unknown[];
    connected_accounts: unknown[];
    notes: { [snowflake: string]: string };
    presences: unknown[];
    merged_presences: unknown;
    merged_members: unknown[];
    users: unknown[];
    linked_users: unknown[];
    application?: unknown; // oauth/bot application
    scopes?: string[];
    session_id: string;
    session_type: string;
    sessions: unknown[];
    static_client_session_id: string;
    auth_session_id_hash: string;
    auth_token?: string; // refreshed auth token
    analytics_token: string;
    authenticator_types: number[];
    required_action?: UserRequiredActionType;
    country_code: string;
    geo_ordered_rtc_regions: string[];
    consents: { [consentType in UserConsentType]: { consented: boolean } };
    tutorial?: unknown;
    shard?: unknown[];
    resume_gateway_url: string;
    api_code_version: number;
    experiments: unknown[];
    guild_experiments: unknown[];
    apex_experiments: ApexExperiments;
    explicit_content_scan_version: number;
    pending_payments?: unknown[];
    av_sf_protocol_floor?: number;
    feature_flags?: unknown;
    lobbies?: unknown[];
    user_application_profiles?: { [snowflake: string]: unknown[] },
    connection_request_data?: unknown
}