import { DATABASE_URL } from "modules/constants";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#/prisma/client";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };