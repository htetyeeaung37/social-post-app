import { defineConfig } from "prisma/config";
import { env } from "./libs/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env.DATABASE_URL as string,
  },
});
