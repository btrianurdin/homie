import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: `${process.env.DB_PG_URL}`,
  },
  migrations: {
    table: "migrations",
    schema: "public",
  },
});
