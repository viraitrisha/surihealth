import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../lib/db';
import * as schema from '../db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dagen
    updateAge: 60 * 60 * 24,     // elke dag vernieuwen
  },
  user: {
    modelName: 'user',
    additionalFields: {
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
});