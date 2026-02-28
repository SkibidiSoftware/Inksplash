export enum ResourceReadStateType {
    CHANNEL = 0,
    GUILD_EVENT = 1,
    NOTIFICATION_CENTER = 2,
    GUILD_HOME = 3,
    GUILD_ONBOARDING_QUESTION = 4,
    MESSAGE_REQUESTS = 5,
}

export interface ResourceReadState {
    id: string; // for which resource
    read_state_type?: ResourceReadStateType;
    last_message_id?: string;
    last_acked_id?: string;
    mention_count?: number;
    badge_count?: number;
    last_pin_timestamp?: Date;
    flags?: number;
    last_viewed?: number; // days since discord epoch
}