import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const dbClient = postgres(`${process.env.DB_PG_URL}`, {
  max: 2,
  onclose: () => console.log("Database connection closed"),
});

const db = drizzle(dbClient, {
  schema: schema,
});

export default db;
