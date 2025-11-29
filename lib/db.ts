import { Pool, PoolClient } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL env var is required for Postgres");
}

const pool = new Pool({
  connectionString,
});

// @ts-ignore - Generic constraint issue with pg types
export async function query<T = any>(text: string, params?: any[]) {
  // @ts-ignore - Bypassing pg type constraint
  return pool.query<T>(text, params) as any;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
