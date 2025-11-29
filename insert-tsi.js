const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  await pool.query("insert into calendars (id,title,notifications_enabled) values ('TSI','TSI Advent',false) on conflict (id) do nothing;");
  await pool.query("insert into windows (calendar_id, day, title, text, content) select 'TSI', gs, concat('Day ', gs, ' title'), 'Placeholder text', '[{\"type\":\"placeholder\",\"text\":\"Placeholder\"}]'::jsonb from generate_series(1,24) as gs on conflict (calendar_id, day) do nothing;");
  console.log('Calendar TSI ready');
  await pool.end();
})();
