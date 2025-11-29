const { Client } = require("pg");

async function addPrizes() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  const calendarId = process.argv[2];
  if (!calendarId) {
    console.error("Usage: node add-sample-prizes.js <calendarId>");
    process.exit(1);
  }

  const prizes = [
    { name: "Gift Card $50", color: "#ec4899", weight: 1 },
    { name: "Free Coffee", color: "#8b5cf6", weight: 5 },
    { name: "Movie Tickets", color: "#3b82f6", weight: 3 },
    { name: "Chocolate Box", color: "#10b981", weight: 4 },
    { name: "Grand Prize!", color: "#f59e0b", weight: 1 },
    { name: "Mystery Gift", color: "#ef4444", weight: 2 },
  ];

  for (const prize of prizes) {
    await client.query(
      "INSERT INTO prizes (calendar_id, name, color, weight) VALUES ($1, $2, $3, $4)",
      [calendarId, prize.name, prize.color, prize.weight]
    );
    console.log(`Added prize: ${prize.name}`);
  }

  await client.end();
  console.log("Done!");
}

addPrizes().catch(console.error);
