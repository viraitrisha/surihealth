import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "../db";
import { 
  users as user, 
  sessions as session, 
  accounts as account, 
  verifications as verification 
} from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { 
    provider: "pg", 
    schema: {
      user,
      session,
      account,
      verification
    }
  }),
  plugins: [tanstackStartCookies()],
  emailAndPassword: { enabled: true }
});
