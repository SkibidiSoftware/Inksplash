import type { UserFindFirstArgs } from "#/prisma/models";
import { prisma } from "@/handlers/database";
import { RedisClient } from "bun";
import { REDIS_URL } from "modules/constants";
import { err, msg } from "modules/logger";

// dont export so that we have to make helper functions for cache instead of rawdogging the client
const r = new RedisClient(REDIS_URL);
r.onconnect = () => msg("Connected to Redis!");
r.onclose = e => err(`Disconnected from Redis: ${e}`);
await r.connect();

// todo use redis cuz idfk how it works yet
export function fetchUser(id: string, options: UserFindFirstArgs = {}) {
    return prisma.user.findFirst({ ...options, where: { ...options.where, id } });
}

export function fetchUserEmail(email: string, options: UserFindFirstArgs = {}) {
    return prisma.user.findFirst({ ...options, where: { ...options.where, email } });
}