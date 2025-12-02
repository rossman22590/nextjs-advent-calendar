import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

type PrizeRow = {
  id: number;
  name: string;
  weight: number | string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { calendarId } = await request.json();

    if (!calendarId) {
      return NextResponse.json({ error: "Missing calendarId" }, { status: 400 });
    }

    // Debug mode: ONLY works if DEBUG_SPIN=true AND not in production
    // Defaults to false for safety
    const isDebugMode = process.env.DEBUG_SPIN === "true" && process.env.NODE_ENV !== "production";

    // Check if user already spun (skip in debug mode)
    if (!isDebugMode) {
      const existingSpin = await query(
        "SELECT prize_id FROM prize_spins WHERE calendar_id = $1 AND user_id = $2",
        [calendarId, session.userId]
      );

      if (existingSpin.rowCount! > 0) {
        return NextResponse.json(
          { error: "You have already spun the wheel" },
          { status: 400 }
        );
      }
    }

    // Get all prizes with weights
    const prizesResult = await query<PrizeRow>(
      "SELECT id, name, weight FROM prizes WHERE calendar_id = $1",
      [calendarId]
    );

    if (prizesResult.rowCount === 0) {
      return NextResponse.json({ error: "No prizes available" }, { status: 400 });
    }

    const prizes = prizesResult.rows.map((p: PrizeRow) => ({
      ...p,
      weight: typeof p.weight === "number" ? p.weight : parseFloat(p.weight), // Ensure weight is a number, not string
    }));

    // Weighted random selection
    const totalWeight = prizes.reduce((sum: number, p: { id: number; name: string; weight: number }) => sum + p.weight, 0);
    const randomValue = Math.random() * totalWeight;
    let random = randomValue;
    let selectedPrize = prizes[0];

    if (isDebugMode) {
      console.log("\n🎯 DEBUG SPIN:");
      console.log("Total Weight:", totalWeight);
      console.log("Random Value:", randomValue);
      console.log("\nPrizes loaded from DB:");
      prizes.forEach(p => {
        console.log(`  ID ${p.id}: ${p.name.padEnd(20)} weight=${p.weight} (${((p.weight/totalWeight)*100).toFixed(2)}%)`);
      });
    }

    for (const prize of prizes) {
      if (isDebugMode) {
        console.log(`  Checking ${prize.name}: random=${random.toFixed(2)} - weight=${prize.weight} = ${(random - prize.weight).toFixed(2)}`);
      }
      random -= prize.weight;
      if (random <= 0) {
        selectedPrize = prize;
        if (isDebugMode) {
          console.log(`  ✅ WINNER: ${prize.name}`);
        }
        break;
      }
    }

    if (isDebugMode) {
      console.log("\n🎁 Final Selected:", selectedPrize.name, `(ID: ${selectedPrize.id})\n`);
    }

    // Record the spin (skip in debug mode to allow re-spinning)
    if (!isDebugMode) {
      await query(
        "INSERT INTO prize_spins (calendar_id, user_id, prize_id) VALUES ($1, $2, $3)",
        [calendarId, session.userId, selectedPrize.id]
      );
    }

    return NextResponse.json({
      prizeId: selectedPrize.id,
      prizeName: selectedPrize.name,
      debugMode: isDebugMode,
    });
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json({ error: "Failed to spin" }, { status: 500 });
  }
}
