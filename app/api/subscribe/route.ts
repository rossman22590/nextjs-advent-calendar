import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  const jsonData = (await request.json()) as {
    token: string;
    calendarId: string;
    hour: number;
  };

  const token = jsonData.token;

  if (!token?.length) {
    return NextResponse.json(
      { success: false, error: "No token provided" },
      {
        status: 400,
      },
    );
  }

  const calendarId = jsonData.calendarId;

  const calendar = await query("select 1 from calendars where id = $1", [
    calendarId,
  ]);

  if (!calendar.rowCount) {
    return NextResponse.json(
      { success: false, error: "Calendar not found" },
      {
        status: 404,
      },
    );
  }

  await query(
    `insert into subscriptions (calendar_id, token, hour)
     values ($1, $2, $3)
     on conflict (calendar_id, token)
     do update set hour = excluded.hour`,
    [calendarId, token, jsonData.hour ?? 8],
  );

  return NextResponse.json({ success: true });
}
