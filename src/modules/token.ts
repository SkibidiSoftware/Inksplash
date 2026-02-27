import { prisma } from "handlers/database";
import { createHmac, randomBytes } from "crypto";
import { DISCORD_EPOCH } from "modules/constants";

export function generateUserToken(snowflake: string, timestamp: number, passwordHash: string): string {
    const encId = Buffer.from(snowflake).toString("base64url");
    const encTime = Buffer.from((timestamp - DISCORD_EPOCH).toString()).toString("base64url");
    const content = `${encId}.${encTime}`;
    
    const sig = createHmac("sha256", passwordHash).update(content).digest("base64url");
    return `${content}.${sig}`;
}

export async function isUserTokenValid(token: string, botsAllowed: boolean = true): Promise<boolean> {
    const p = token.split(".");
    if (p.length != 3) return false;

    const [encId, time, sig] = p;
    
    const id = Buffer.from(encId, "base64url").toString();
    const u = await prisma.user.findFirst({ where: { id } }); // todo: redis-ify this?

    if (u?.isBot && !botsAllowed) return false;

    /*
        compute SOMETHING to make sure that it takes the same amount of time to process a request
        both if the account exists and if it does not
    */
    let passwordHash = u?.password ?? randomBytes(64).toString("hex");
    const content = `${encId}.${time}`;
    const sigTest = createHmac("sha256", passwordHash).update(content).digest("base64url");

    return sig == sigTest;
}

export async function getUserIdFromToken(token: string, ignoreChecks: boolean = false): Promise<string> {
    if (!ignoreChecks && !await isUserTokenValid(token)) return "-1";
    return Buffer.from(token.split(".")[0], "base64url").toString();
}