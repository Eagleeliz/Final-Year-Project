import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Validate environment variable
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create Neon HTTP client
const client = neon(process.env.DATABASE_URL);

// Create Drizzle instance with schema
const db = drizzle(client, { 
  schema, 
  logger: process.env.NODE_ENV === "development" // Log only in dev
});

// Export the Drizzle instance
export default db;

// Optional: Export types for convenience
export type * from "./schema";
