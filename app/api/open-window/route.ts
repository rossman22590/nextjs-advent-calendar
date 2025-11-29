import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { calendarId, day } = await request.json();

    if (!calendarId || !day) {
      return NextResponse.json({ error: "Missing calendarId or day" }, { status: 400 });
    }

    await query(
      `INSERT INTO opened_windows (calendar_id, user_id, day) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (calendar_id, user_id, day) DO NOTHING`,
      [calendarId, session.userId, day]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error opening window:", error);
    return NextResponse.json({ error: "Failed to open window" }, { status: 500 });
  }
}
