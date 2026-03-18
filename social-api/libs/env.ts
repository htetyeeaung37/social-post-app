import dotenv from "dotenv";

// Load .env locally (Vercel/production should provide env vars via its dashboard).
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(
      `Missing required environment variable ${key}. Set it in your environment (e.g. Vercel Project Environment Variables).`,
    );
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};
