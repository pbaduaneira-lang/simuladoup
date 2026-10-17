import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/libsql";
import { nextCookies } from "better-auth/next-js";
import { randomBytes } from "node:crypto";
import { getDb } from "./database.mjs";
import * as schema from "./auth-schema";
let instance: ReturnType<typeof buildAuth> | undefined;
const devSecret = randomBytes(32).toString("hex");
function buildAuth(db: ReturnType<typeof drizzle>) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (
    process.env.NODE_ENV === "production" &&
    (!secret || secret.length < 32 || !process.env.BETTER_AUTH_URL)
  )
    throw new Error("Configure BETTER_AUTH_SECRET e BETTER_AUTH_URL.");
  return betterAuth({
    appName: "SimuladoUp",
    secret: secret || devSecret,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3005",
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    user: {
      deleteUser: {
        enabled: true,
        beforeDelete: async (user) => {
          await (
            await getDb()
          ).execute({
            sql: "DELETE FROM battles WHERE hostId=? OR guestId=?",
            args: [`user:${user.id}`, `user:${user.id}`],
          });
        },
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
        "/sign-up/email": { window: 60, max: 3 },
      },
    },
    plugins: [nextCookies()],
  });
}
export async function getAuth() {
  if (instance) return instance;
  const db = drizzle(await getDb(), { schema });
  return (instance = buildAuth(db));
}
