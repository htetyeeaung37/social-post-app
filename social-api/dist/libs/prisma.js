"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const env_1 = require("./env");
const globalForPrisma = global;
// Ensure required env vars are loaded early. `env` throws if something is missing.
void env_1.env;
const prismaAdapter = new adapter_pg_1.PrismaPg({ connectionString: env_1.env.DATABASE_URL });
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient({ adapter: prismaAdapter });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
