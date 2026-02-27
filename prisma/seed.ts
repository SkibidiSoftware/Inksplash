import { DATABASE_URL, SERVER_URL } from "../src/modules/constants";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { randomBytes } from "crypto";

import { generateSnowflake } from "../src/modules/snowflake";
import { generateUserToken } from "../src/modules/token";

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const superadminAccountPass = randomBytes(32).toString("hex");
const superadminPassHash = await Bun.password.hash(superadminAccountPass, "argon2id");
const superadminSnowflake = generateSnowflake();
console.log("Superadmin account password:", `admin@${SERVER_URL}`, superadminAccountPass);
console.log("Generated token for superadmin:", generateUserToken(superadminSnowflake, Date.now(), superadminPassHash));

const superadminAccount = await prisma.user.create({
    data: {
        id: superadminSnowflake,
        email: `admin@${SERVER_URL}`,
        username: "discord",
        displayName: "Discord",
        password: superadminPassHash,
        isSystem: true,
        emailVerified: true
    }
});

console.log(superadminAccount)

await prisma.$disconnect();
await pool.end();