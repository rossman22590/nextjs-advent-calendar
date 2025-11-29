import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import UserTable from "./UserTable";

interface User {
  id: string;
  email: string;
  claimed_days: number;
  wheel_spins: number;
}

export default async function AdminPage() {
  const session = await getSession();
  
  // Check if user is admin
  if (!session || session.email !== process.env.ADMIN?.toLowerCase()) {
    redirect("/login?from=/admin");
  }

  // Get all users with their stats
  const usersResult = await query<User>(
    `SELECT 
      u.id,
      u.email,
      COUNT(DISTINCT ow.day) as claimed_days,
      COUNT(DISTINCT ps.calendar_id) as wheel_spins
     FROM users u
     LEFT JOIN opened_windows ow ON u.id = ow.user_id
     LEFT JOIN prize_spins ps ON u.id = ps.user_id
     GROUP BY u.id, u.email
     ORDER BY u.email ASC`
  );

  const users = usersResult.rows || [];

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
        <Button as={Link} href="/c/TSI" color="secondary">
          Back to Calendar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">All Users ({users.length})</h2>
        </CardHeader>
        <CardBody>
          <UserTable users={users} />
        </CardBody>
      </Card>
    </div>
  );
}
