import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import PrizeWheel from "@/components/PrizeWheel";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    calendarId: string;
  }>;
}

export default async function ChancePage({ params }: PageProps) {
  const { calendarId } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?redirect=/c/${calendarId}/chance`);
  }

  const prizesResult = await query<{
    id: number;
    name: string;
    color: string;
    weight: number;
    description: string | null;
  }>(
    "SELECT id, name, color, weight, description FROM prizes WHERE calendar_id = $1 ORDER BY id",
    [calendarId]
  );

  const spinResult = await query<{
    prize_id: number;
  }>(
    "SELECT prize_id FROM prize_spins WHERE calendar_id = $1 AND user_id = $2",
    [calendarId, session.userId]
  );

  const hasSpun = spinResult.rowCount! > 0;
  const wonPrizeId = hasSpun ? spinResult.rows[0].prize_id : null;

  const prizes = prizesResult.rows;

  if (prizes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-3xl font-bold text-pink-500">Prize Wheel</h1>
        <p className="text-gray-500">No prizes configured yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      <h1 className="text-3xl font-bold text-pink-500">Spin to Win!</h1>
      <PrizeWheel
        prizes={prizes}
        calendarId={calendarId}
        hasSpun={hasSpun}
        wonPrizeId={wonPrizeId}
      />
    </div>
  );
}
