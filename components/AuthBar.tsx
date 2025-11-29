import { getSession } from "@/lib/auth";
import Link from "next/link";
import { logout } from "@/app/auth/actions";

export default async function AuthBar() {
  const session = await getSession();

  return (
    <div className="flex items-center justify-end gap-3 py-2">
      {session ? (
        <>
          <Link
            href="/my-prizes"
            className="px-3 py-1 rounded-md bg-purple-600 text-white text-sm hover:opacity-90 transition"
          >
            My Prizes 🎁
          </Link>
          <span className="text-sm text-white drop-shadow">
            {session.email ?? "Logged in"}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="px-3 py-1 rounded-md bg-primary text-white text-sm hover:opacity-90 transition"
            >
              Log out
            </button>
          </form>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1 rounded-md bg-primary text-white text-sm hover:opacity-90 transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-3 py-1 rounded-md bg-secondary text-white text-sm hover:opacity-90 transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
