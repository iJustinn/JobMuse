import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

export default defineConfig({
  schema: "./server/db/schema.js",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/jobmuse",
  },
  strict: true,
  verbose: true,
});
