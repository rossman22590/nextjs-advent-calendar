import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@nextui-org/button";

import { revalidatePath } from "next/cache";
import dynamic from "next/dynamic";
import WindowCardPreview from "./WindowCardPreview";
import initialPopulate from "./inital";
import React from "react";
import Link from "next/link";
import WindowEditor from "./WindowEditor";
import { query } from "@/lib/db";
import { ContentData } from "./types";

export default async function InitalPopulate({
  params,
}: {
  params: Promise<{ calendarId: string; day: string }>;
}) {
  const { calendarId, day } = await params;
  const existingConfig = await query<{ title: string }>(
    "select title from calendars where id = $1 limit 1",
    [calendarId],
  );

  const config =
    existingConfig.rows[0] ?? (await initialPopulate({ calendarId }));

  const windowsResult = await query<WindowContentData>(
    "select day, title, text, content from windows where calendar_id = $1 order by day asc",
    [calendarId],
  );

  const windows: WindowContentData[] = windowsResult.rows;

  async function create(formData: FormData) {
    "use server";

    const dataString = formData.get("data") as string | null;
    if (!dataString) throw new Error("No data");
    const data = JSON.parse(dataString);

    const dayNumber = Number(day);

    await query(
      `insert into calendars (id, title)
       values ($1, $2)
       on conflict (id) do nothing`,
      [calendarId, config.title ?? "Advent Calendar"],
    );

    await query(
      `insert into windows (calendar_id, day, title, text, content)
       values ($1, $2, $3, $4, $5)
       on conflict (calendar_id, day) do update
       set title = excluded.title,
           text = excluded.text,
           content = excluded.content`,
      [
        calendarId,
        dayNumber,
        data.title,
        data.text,
        JSON.stringify(data.content ?? []),
      ],
    );

    revalidatePath(`/c/${calendarId}/populate/${day}`);
  }

  const calendarWindow = windows.find((window) => `${window.day}` === `${day}`);

  return (
    <div className="flex flex-col gap-8 items-stretch justify-center">
      <h1 className="text-3xl font-bold text-center text-primary">
        <Link href={`/c/${calendarId}/populate`}>Populate {config.title}</Link>
      </h1>
      {calendarWindow ? (
        <>
          <div className="flex flex-row gap-2 items-stretch justify-center flex-wrap">
            {windows.map((window) => (
              <a
                key={window.day}
                href={`/c/${calendarId}/populate/${window.day}`}
                className="text-center text-primary"
              >
                {`${window.day}` === `${day}` ? (
                  <span className="font-bold">{window.day}</span>
                ) : (
                  window.day
                )}
              </a>
            ))}
          </div>
          <form
            action={create}
            className="flex flex-col gap-8 items-stretch justify-center w-full"
          >
            <WindowEditor defaultValue={{ ...calendarWindow, name: "data", content: calendarWindow.content as ContentData[] }} name="data" />
            <Button type="submit">Save</Button>
          </form>
          <ErrorBoundary fallback={<div>Invalid data</div>}>
            <WindowCardPreview window={calendarWindow} />
          </ErrorBoundary>
        </>
      ) : (
        // list of windows including title
        <div className="flex flex-col gap-8 items-stretch justify-center w-full">
          {windows.map((window) => (
            <div
              key={window.day}
              className="flex flex-col gap-8 items-stretch justify-center w-full"
            >
              <a href={`/c/${calendarId}/populate/${window.day}`}>
                {window.day} - {window.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
