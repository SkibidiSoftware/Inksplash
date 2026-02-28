import type { User } from "#/prisma/client";
import { UserFlags, type UserPacket } from "@/classes/user";
import { warn } from "modules/logger";

export function privateToPublicFlags(privateFlags: bigint): number {
    const flagsToExpose: bigint =
        UserFlags.STAFF |
        UserFlags.PARTNER |
        UserFlags.HYPESQUAD |
        UserFlags.BUG_HUNTER_LEVEL_1 |
        UserFlags.HYPESQUAD_ONLINE_BRAVERY |
        UserFlags.HYPESQUAD_ONLINE_BRILLIANCE |
        UserFlags.HYPESQUAD_ONLINE_BALANCE |
        UserFlags.PREMIUM_EARLY_SUPPORTER |
        UserFlags.TEAM_PSEUDO_USER |
        UserFlags.SYSTEM |
        UserFlags.BUG_HUNTER_LEVEL_2 |
        UserFlags.VERIFIED_BOT |
        UserFlags.VERIFIED_DEVELOPER |
        UserFlags.CERTIFIED_MODERATOR |
        UserFlags.BOT_HTTP_INTERACTIONS |
        UserFlags.SPAMMER |
        UserFlags.ACTIVE_DEVELOPER |
        UserFlags.PROVISIONAL_ACCOUNT
    
    const publicFlags = privateFlags & flagsToExpose;
    if (publicFlags < Number.MIN_SAFE_INTEGER || publicFlags > Number.MAX_SAFE_INTEGER) warn(`WARNING: Flags ${privateFlags} extend the safe Number boundary and won't be serialized properly. Please fix.`);
    return Number(publicFlags);
}

export function privateToNonInternalFlags(privateFlags: bigint): number {
    const flagsToNotExpose: bigint =
        UserFlags.IS_HUBSPOT_CONTACT |
        UserFlags.UNDERAGE_DELETED |
        UserFlags.HIGH_GLOBAL_RATE_LIMIT |
        UserFlags.DELETED |
        UserFlags.DISABLED_SUSPICIOUS_ACTIVITY |
        UserFlags.SELF_DELETED |
        UserFlags.PREMIUM_DISCRIMINATOR |
        UserFlags.HAS_USED_DESKTOP_CLIENT |
        UserFlags.HAS_USED_WEB_CLIENT |
        UserFlags.HAS_USED_MOBILE_CLIENT |
        UserFlags.DISABLED |
        UserFlags.HAS_SESSION_STARTED |
        UserFlags.QUARANTINED |
        UserFlags.PREMIUM_ELIGIBLE_FOR_USERNAME |
        UserFlags.COLLABORATOR |
        UserFlags.RESTRICTED_COLLABORATOR;
    
    return privateToPublicFlags(privateFlags & (~flagsToNotExpose));
}

export function hasFlag(flags: bigint, toCheck: bigint): boolean {
    return (flags & toCheck) == toCheck;
}

export function packetizeUser(user: User, privateFields: boolean = false): UserPacket {
    return {
        id: user.id,
        username: user.username,
        discriminator: "0",
        
        global_name: user.displayName,
        pronouns: user.pronouns,
        bio: user.bio,
        avatar: user.avatarHash ?? ((parseInt(user.id) >> 22) % 6).toString(),
        banner: user.bannerHash,
        accent_color: user.accentColor,

        flags: privateFields ? privateToNonInternalFlags(user.flags) : undefined,
        public_flags: privateToPublicFlags(user.flags),
        bot: user.isBot,
        system: user.isSystem || hasFlag(user.flags, UserFlags.SYSTEM),
        
        verified: privateFields ? user.emailVerified : undefined,
        mfa_enabled: privateFields ? false : undefined, // todo
        nsfw_allowed: privateFields ? true : undefined,
    };
}