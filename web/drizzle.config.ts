import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: "../web/src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});