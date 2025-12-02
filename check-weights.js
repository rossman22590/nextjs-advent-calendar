// Quick script to check current prize weights in database
const { Pool } = require('pg');
const fs = require('fs');

// Read .env file manually
const envFile = fs.readFileSync('.env', 'utf8');
const DATABASE_URL = envFile.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1].trim();

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkWeights() {
  try {
    const result = await pool.query(
      "SELECT id, name, weight FROM prizes WHERE calendar_id = 'TSI' ORDER BY id"
    );
    
    console.log('\n📊 Current Prize Weights:\n');
    console.log('ID | Name                    | Weight | Probability');
    console.log('---|-------------------------|--------|------------');
    
    const totalWeight = result.rows.reduce((sum, p) => sum + parseFloat(p.weight), 0);
    
    result.rows.forEach(prize => {
      const prob = ((parseFloat(prize.weight) / totalWeight) * 100).toFixed(2);
      console.log(
        `${prize.id.toString().padEnd(2)} | ${prize.name.padEnd(23)} | ${parseFloat(prize.weight).toFixed(1).padStart(6)} | ${prob.padStart(6)}%`
      );
    });
    
    console.log('\nTotal Weight:', totalWeight.toFixed(2));
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

checkWeights();
