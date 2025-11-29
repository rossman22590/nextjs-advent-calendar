import NotificationManager from "@/components/NotificationManager";
import WindowsGrid from "@/components/WindowsGrid";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    calendarId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { calendarId } = await params;
  const session = await getSession();
  
  const configResult = await query<{
    title: string;
    notifications_enabled: boolean | null;
  }>(
    "select title, notifications_enabled from calendars where id = $1",
    [calendarId],
  );

  if (!configResult.rowCount) {
    return (
      <div className="flex items-center justify-center text-primary text-2xl flex-col gap-4">
        <div>Calendar not found</div>
        <div className="h-96">:(</div>
      </div>
    );
  }

  const config = {
    title: configResult.rows[0].title,
    notificationsEnabled: configResult.rows[0].notifications_enabled ?? false,
  };

  const windowsResult = await query<WindowContentData>(
    "select day, title, text, content from windows where calendar_id = $1 order by day asc",
    [calendarId],
  );

  let openedDays: number[] = [];
  if (session) {
    const openedResult = await query<{ day: number }>(
      "select day from opened_windows where calendar_id = $1 and user_id = $2",
      [calendarId, session.userId],
    );
    openedDays = openedResult.rows.map((r: { day: number }) => r.day);
  }

  const windows: WindowContentData[] = windowsResult.rows.map((w: WindowContentData) => ({
    ...w,
    opened: openedDays.includes(w.day),
  }));

  return (
    <div className="flex flex-col gap-8 items-stretch justify-center">
      <h1 className="text-3xl font-bold text-center text-primary">
        {config.title}
      </h1>

      {config.notificationsEnabled && <NotificationManager />}
      <WindowsGrid windows={windows} />
    </div>
  );
}
