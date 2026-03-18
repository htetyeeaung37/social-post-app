import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "./env";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Ensure required env vars are loaded early. `env` throws if something is missing.
void env;

const prismaAdapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter: prismaAdapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
