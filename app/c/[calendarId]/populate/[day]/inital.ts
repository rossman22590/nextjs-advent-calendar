import { query } from "@/lib/db";

export default async function initialPopulate({
  calendarId,
}: {
  calendarId: string;
}): Promise<{ title: string }> {
  await query(
    `insert into calendars (id, title)
     values ($1, $2)
     on conflict (id) do nothing`,
    [calendarId, "Advent Calendar"],
  );

  const windows = [];

  for (let i = 1; i <= 24; i++) {
    windows.push({
      day: i,
      title: "Title",
      text: "Text",
      content: [
        {
          type: "placeholder",
          title: "Placeholder",
          text: "This is a placeholder.",
        },
      ],
    });
  }

  await Promise.all(
    windows.map((window) =>
      query(
        `insert into windows (calendar_id, day, title, text, content)
         values ($1, $2, $3, $4, $5)
         on conflict (calendar_id, day) do nothing`,
        [
          calendarId,
          window.day,
          window.title,
          window.text,
          JSON.stringify(window.content),
        ],
      ),
    ),
  );

  console.log("Done");

  const doc = await query<{ title: string }>(
    "select title from calendars where id = $1 limit 1",
    [calendarId],
  );

  return { title: doc.rows[0]?.title ?? "Advent Calendar" };
}
