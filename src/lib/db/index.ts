import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema";
import { env } from "@/env";
import postgres from "postgres"
const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });



if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const client = postgres(process.env.DATABASE_URL)


