const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  const cols = await pool.query("select column_name, data_type from information_schema.columns where table_name = 'sessions' order by ordinal_position");
  console.log(cols.rows);
  await pool.end();
})();
