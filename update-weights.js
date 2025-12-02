const { Pool } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const DATABASE_URL = envFile.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1].trim();

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateWeights() {
  try {
    console.log('Updating prize weights...\n');
    
    await pool.query(`
      UPDATE prizes 
      SET weight = CASE id
        WHEN 1 THEN 0.5
        WHEN 2 THEN 5.0
        WHEN 3 THEN 1.0
        WHEN 4 THEN 4.0
        WHEN 5 THEN 0.3
        WHEN 6 THEN 2.0
        ELSE weight
      END
      WHERE calendar_id = 'TSI'
    `);
    
    const result = await pool.query(
      "SELECT id, name, weight FROM prizes WHERE calendar_id = 'TSI' ORDER BY id"
    );
    
    console.log('✅ Updated weights:\n');
    const totalWeight = result.rows.reduce((sum, p) => sum + parseFloat(p.weight), 0);
    
    result.rows.forEach(prize => {
      const prob = ((parseFloat(prize.weight) / totalWeight) * 100).toFixed(2);
      console.log(`ID ${prize.id}: ${prize.name.padEnd(25)} weight=${parseFloat(prize.weight).toFixed(1)} (${prob}%)`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

updateWeights();
