import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

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

    // Check if user already spun
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

    // Get all prizes with weights
    const prizesResult = await query<{
      id: number;
      name: string;
      weight: number;
    }>(
      "SELECT id, name, weight FROM prizes WHERE calendar_id = $1",
      [calendarId]
    );

    if (prizesResult.rowCount === 0) {
      return NextResponse.json({ error: "No prizes available" }, { status: 400 });
    }

    const prizes = prizesResult.rows;

    // Weighted random selection
    const totalWeight = prizes.reduce((sum: number, p: { id: number; name: string; weight: number }) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      random -= prize.weight;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Record the spin
    await query(
      "INSERT INTO prize_spins (calendar_id, user_id, prize_id) VALUES ($1, $2, $3)",
      [calendarId, session.userId, selectedPrize.id]
    );

    return NextResponse.json({
      prizeId: selectedPrize.id,
      prizeName: selectedPrize.name,
    });
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json({ error: "Failed to spin" }, { status: 500 });
  }
}
