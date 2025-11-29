import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import Image from "next/image";
import { getIconForDay } from "@/app/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Params {
  params: Promise<{
    userId: string;
  }>;
}

interface UserInfo {
  id: string;
  email: string;
}

interface ClaimedDay {
  calendar_id: string;
  calendar_title: string;
  day: number;
  day_title: string;
  day_text: string;
  content: any;
  opened_at: string;
}

interface WheelPrize {
  calendar_id: string;
  calendar_title: string;
  prize_name: string;
  prize_description: string | null;
  prize_color: string;
  spun_at: string;
}

export default async function AdminUserPage({ params }: Params) {
  const { userId } = await params;
  const session = await getSession();
  
  // Check if user is admin
  if (!session || session.email !== process.env.ADMIN?.toLowerCase()) {
    redirect("/login?from=/admin");
  }

  // Get user info
  const userResult = await query<UserInfo>(
    `SELECT id, email FROM users WHERE id = $1`,
    [userId]
  );

  if (!userResult.rowCount) {
    redirect("/admin");
  }

  const user = userResult.rows[0];

  // Get claimed days
  const daysResult = await query<ClaimedDay>(
    `SELECT 
      ow.calendar_id,
      c.title as calendar_title,
      ow.day,
      w.title as day_title,
      w.text as day_text,
      w.content,
      ow.opened_at
     FROM opened_windows ow
     JOIN calendars c ON ow.calendar_id = c.id
     LEFT JOIN windows w ON w.calendar_id = ow.calendar_id AND w.day = ow.day
     WHERE ow.user_id = $1
     ORDER BY ow.day ASC`,
    [userId]
  );

  const claimedDays = daysResult.rows || [];

  // Get wheel prizes
  const wheelResult = await query<WheelPrize>(
    `SELECT 
      ps.calendar_id,
      c.title as calendar_title,
      p.name as prize_name,
      p.description as prize_description,
      p.color as prize_color,
      ps.spun_at
     FROM prize_spins ps
     JOIN prizes p ON ps.prize_id = p.id
     JOIN calendars c ON ps.calendar_id = c.id
     WHERE ps.user_id = $1
     ORDER BY ps.spun_at DESC`,
    [userId]
  );

  const wheelPrizes = wheelResult.rows || [];

  const getWheelEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("grand")) return "👑";
    if (lower.includes("mystery")) return "❓";
    if (lower.includes("gift") || lower.includes("card")) return "💳";
    if (lower.includes("coffee")) return "☕";
    if (lower.includes("movie")) return "🎬";
    if (lower.includes("chocolate")) return "🍫";
    return "🎁";
  };

  const getImageFromContent = (content: any): string | null => {
    if (!content || !Array.isArray(content)) return null;
    
    for (const item of content) {
      if (item.type === "image" && item.url) {
        return item.url;
      }
      if (item.type === "gallery" && item.images && item.images.length > 0) {
        return item.images[0];
      }
    }
    return null;
  };

  const totalPrizes = claimedDays.length + wheelPrizes.length;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <Button as={Link} href="/admin" color="secondary">
            Back to Admin Panel
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">{user.email}</h1>
            <p className="text-gray-400 mt-2">
              Total Prizes: {totalPrizes}
            </p>
          </div>
        </div>
      </div>

      {totalPrizes === 0 ? (
        <Card>
          <CardBody className="text-center py-16">
            <p className="text-xl text-gray-400">This user hasn&apos;t claimed any prizes yet!</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Wheel Prizes */}
          {wheelPrizes.map((prize, index) => (
            <Card 
              key={`wheel-${prize.calendar_id}-${index}`}
              className="hover:shadow-xl transition-shadow border-2 border-purple-300"
            >
              <div className="w-full aspect-video relative overflow-hidden rounded-t-lg">
                <Image
                  src="https://img.mytsi.org/i/HAWx1053.png"
                  alt={prize.prize_name}
                  fill
                  className="object-cover"
                />
                <div 
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: prize.prize_color }}
                >
                  <span className="text-xl">{getWheelEmoji(prize.prize_name)}</span>
                </div>
              </div>
              <CardHeader className="flex flex-col items-start gap-2 pb-2">
                <h3 className="text-xl font-bold">{prize.prize_name}</h3>
                <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Wheel Spin</span>
              </CardHeader>
              <CardBody className="text-left pt-0">
                <p className="text-sm text-gray-500 mb-2">
                  From: <span className="font-semibold">{prize.calendar_title}</span>
                </p>
                {prize.prize_description && (
                  <p className="text-gray-600 text-sm mt-3 border-t border-gray-200 pt-3">
                    {prize.prize_description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  Won: {new Date(prize.spun_at).toLocaleDateString()} at {new Date(prize.spun_at).toLocaleTimeString()}
                </p>
              </CardBody>
            </Card>
          ))}

          {/* Opened Days */}
          {claimedDays.map((day) => {
            const imageUrl = getImageFromContent(day.content);
            return (
            <Card 
              key={`day-${day.calendar_id}-${day.day}`}
              className="hover:shadow-xl transition-shadow"
            >
              {imageUrl ? (
                <div className="w-full aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={imageUrl}
                    alt={`Day ${day.day}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-12 h-12 rounded-tl-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <FontAwesomeIcon 
                      icon={getIconForDay(day.day)}
                      className="w-6 h-6 text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-t-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon 
                    icon={getIconForDay(day.day)}
                    className="w-20 h-20 text-white"
                  />
                </div>
              )}
              <CardHeader className="flex flex-col items-start gap-2 pb-2">
                <h3 className="text-xl font-bold">Day {day.day}</h3>
                {day.day_title && (
                  <p className="text-sm text-gray-600">{day.day_title}</p>
                )}
              </CardHeader>
              <CardBody className="text-left pt-0">
                <p className="text-sm text-gray-500 mb-2">
                  From: <span className="font-semibold">{day.calendar_title}</span>
                </p>
                {day.day_text && (
                  <p className="text-gray-600 text-sm mt-3 border-t border-gray-200 pt-3 line-clamp-2">
                    {day.day_text}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  Opened: {new Date(day.opened_at).toLocaleDateString()} at {new Date(day.opened_at).toLocaleTimeString()}
                </p>
              </CardBody>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
