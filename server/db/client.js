import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readServerConfig } from "../config.js";
import * as schema from "./schema.js";

let connection;
let db;

export function getDb(config = readServerConfig()) {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required before database-backed routes can run");
  }

  if (!connection) {
    connection = postgres(config.databaseUrl, { max: 5 });
    db = drizzle(connection, { schema });
  }

  return db;
}

export async function closeDb() {
  if (connection) {
    await connection.end();
    connection = undefined;
    db = undefined;
  }
}
