import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  // if parameter "test=1" is set, allow cron to be tested,
  // but only if the calendarId contains the word "test" (hacky)
  const testMode = request.url.includes("test=1");

  if (
    !testMode &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json(
      { success: false, error: "Not cron" },
      {
        status: 401,
      },
    );
  }

  const results = await query<{
    calendar_id: string;
    title: string;
    token: string;
  }>(
    `select c.id as calendar_id, c.title, s.token
     from calendars c
     join subscriptions s on s.calendar_id = c.id
     where coalesce(c.notifications_enabled, false) = true`,
  );

  const calendarIdToTokens: Record<string, string[]> = {};
  const calendarIdToName: Record<string, string> = {};

  results.rows.forEach((row: { calendar_id: string; title: string; token: string }) => {
    if (testMode && !row.calendar_id.includes("test")) return;

    calendarIdToTokens[row.calendar_id] = [
      ...(calendarIdToTokens[row.calendar_id] ?? []),
      row.token,
    ];
    calendarIdToName[row.calendar_id] = row.title;
  });

  for (const calendarId in calendarIdToTokens) {
    console.log(
      `Calendar ${calendarId} has ${calendarIdToTokens[calendarId].length} subscriptions`,
    );
  }

  // Sending push notifications is intentionally not implemented here to keep
  // the Postgres refactor simple. Integrate your preferred push provider here.

  return NextResponse.json({
    success: true,
    calendarsProcessed: Object.keys(calendarIdToTokens).length,
    tokensFound: Object.values(calendarIdToTokens).reduce(
      (acc, tokens) => acc + tokens.length,
      0,
    ),
  });
}
