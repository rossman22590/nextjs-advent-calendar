/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const migrationsDir = path.join(__dirname, "..", "migrations");

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to run migrations");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "create table if not exists _migrations (id text primary key, run_at timestamptz default now())",
    );

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const id = file;

      const alreadyRan = await client.query(
        "select 1 from _migrations where id = $1 limit 1",
        [id],
      );
      if (alreadyRan.rowCount) continue;

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      console.log(`Running migration ${id}`);
      await client.query(sql);
      await client.query(
        "insert into _migrations (id) values ($1) on conflict do nothing",
        [id],
      );
    }

    await client.query("COMMIT");
    console.log("Migrations complete");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
