import { isOpen } from "@/app/utils/calendarUtils";
import WindowContent from "@/components/content/WindowContent";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Link from "next/link";
import { query } from "@/lib/db";

interface Params {
  params: Promise<{
    day: string;
    calendarId: string;
  }>;
}

export default async function Page({
  params,
}: Params): Promise<JSX.Element> {
  const { calendarId, day } = await params;
  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber)) {
    return (
      <div className="flex items-center justify-center text-primary text-2xl flex-col gap-4">
        <div>Invalid day</div>
        <div className="h-96">:(</div>
      </div>
    );
  }

  const windowResult = await query<WindowContentData>(
    "select day, title, text, content from windows where calendar_id = $1 and day = $2 limit 1",
    [calendarId, dayNumber],
  );

  if (!windowResult.rowCount) {
    return (
      <div className="flex items-center justify-center text-primary text-2xl flex-col gap-4">
        <div>Window not found</div>
        <div className="h-96">:(</div>
      </div>
    );
  }

  const win = windowResult.rows[0];

  return (
    <div className="flex flex-col gap-8 items-stretch justify-center">
      <Card>
        {isOpen(day) ? (
          <div className="flex flex-col items-stretch justify-center">
            <CardHeader>
              <h1 className="text-3xl font-bold text-center text-primary flex items-center justify-center flex-start">
                <div className="flex items-center justify-center w-10 h-10 mr-2 rounded-full bg-primary text-white text-lg">
                  {day}
                </div>
                {win.title}
              </h1>
            </CardHeader>
            <CardBody>
              <p className="whitespace-pre-wrap">{win.text}</p>
            </CardBody>
            <WindowContent content={win.content} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-primary">This window is not open yet.</p>
          </div>
        )}
      </Card>
      <Button as={Link} href={`/c/${calendarId}#day-${day}`} color="secondary">
        Back
      </Button>
    </div>
  );
}
