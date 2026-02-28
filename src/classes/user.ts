export const UserFlags = {
    STAFF:                              1n << 0n,
    PARTNER:                            1n << 1n,
    HYPESQUAD:                          1n << 2n,
    BUG_HUNTER_LEVEL_1:                 1n << 3n,
    MFA_SMS:                            1n << 4n,
    PREMIUM_PROMO_DISMISSED:            1n << 5n,
    HYPESQUAD_ONLINE_BRAVERY:           1n << 6n,
    HYPESQUAD_ONLINE_BRILLIANCE:        1n << 7n,
    HYPESQUAD_ONLINE_BALANCE:           1n << 8n,
    PREMIUM_EARLY_SUPPORTER:            1n << 9n,
    TEAM_PSEUDO_USER:                   1n << 10n, // user is a team
    IS_HUBSPOT_CONTACT:                 1n << 11n,
    SYSTEM:                             1n << 12n, // obsolete
    HAS_UNREAD_URGENT_MESSAGES:         1n << 13n,
    BUG_HUNTER_LEVEL_2:                 1n << 14n,
    UNDERAGE_DELETED:                   1n << 15n,
    VERIFIED_BOT:                       1n << 16n,
    VERIFIED_DEVELOPER:                 1n << 17n,
    CERTIFIED_MODERATOR:                1n << 18n,
    BOT_HTTP_INTERACTIONS:              1n << 19n,
    SPAMMER:                            1n << 20n,
    DISABLE_PREMIUM:                    1n << 21n, // manually disabled premium features?
    ACTIVE_DEVELOPER:                   1n << 22n,
    PROVISIONAL_ACCOUNT:                1n << 23n,
    // 24n ... 32n
    HIGH_GLOBAL_RATE_LIMIT:             1n << 33n,
    DELETED:                            1n << 34n,
    DISABLED_SUSPICIOUS_ACTIVITY:       1n << 35n,
    SELF_DELETED:                       1n << 36n,
    PREMIUM_DISCRIMINATOR:              1n << 37n,
    HAS_USED_DESKTOP_CLIENT:            1n << 38n,
    HAS_USED_WEB_CLIENT:                1n << 39n,
    HAS_USED_MOBILE_CLIENT:             1n << 40n,
    DISABLED:                           1n << 41n,
    // 42n
    HAS_SESSION_STARTED:                1n << 43n,
    QUARANTINED:                        1n << 44n,
    // 43n .. 46n
    PREMIUM_ELIGIBLE_FOR_USERNAME:      1n << 47n, // early access to pomelo
    COLLABORATOR:                       1n << 50n, // staff
    RESTRICTED_COLLABORATOR:            1n << 51n, // staff
}

export type UserFlags = typeof UserFlags;

export interface UserPacket {
    // Identity
    id: string;
    username: string;
    discriminator: string; // 0 if migrated
    phone?: string;

    // Profile
    global_name: string | null; // display name
    pronouns?: string;
    bio: string;
    avatar: string | null // avatarHash
    banner: string | null // bannerHash
    accent_color?: number;
    
    // Not Implemented Yet
    // avatar_decoration_data
    // collectibles
    // display_name_styles
    // primary_guild (tag)
    // linked_users (family center)
    // age_verification_status?: UserAgeVerificationStatus
    // locale?: string;
    // premium_type: UserPremiumType
    // premium_state?: UserPremiumState
    // personal_connection_id?: string; // non-employee personal account

    // Flags
    flags?: number;
    public_flags: number;
    purchased_flags?: number;
    premium_usage_flags?: number;
    bot?: boolean;
    verified?: boolean; // email verified
    system?: boolean;
    mfa_enabled?: boolean;
    nsfw_allowed?: boolean;
}

export interface UserGuildSettings {
    version: number;
    suppress_roles: boolean;
    suppress_everyone: boolean;
    notify_highlights: number;
    mute_config?: unknown; // todo
    muted: boolean;
    mute_scheduled_events: boolean;
    mobile_push: boolean;
    message_notifications: number;
    hide_muted_channels: boolean;
    guild_id?: string;
    flags: number;
    channel_overrides: unknown[]; // todo
}

export type UserRequiredActionType =
    "AGREEMENTS" |
    "REQUIRE_CAPTCHA" |
    "REQUIRE_VERIFIED_EMAIL" | "REQUIRE_REVERIFIED_EMAIL" |
    "REQUIRE_VERIFIED_PHONE" | "REQUIRE_REVERIFIED_PHONE" |
    "REQUIRE_VERIFIED_PHONE_THEN_EMAIL" |
    "REQUIRE_VERIFIED_EMAIL_OR_VERIFIED_PHONE" |
    "REQUIRE_REVERIFIED_EMAIL_OR_VERIFIED_PHONE" |
    "REQUIRE_VERIFIED_EMAIL_OR_REVERIFIED_PHONE" |
    "REQUIRE_REVERIFIED_EMAIL_OR_REVERIFIED_PHONE";

export type UserConsentType = "personalization" | "usage_statistics";