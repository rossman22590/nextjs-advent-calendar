import { getSession, destroySession } from "@/lib/auth";
import Link from "next/link";

async function logout() {
  "use server";
  await destroySession();
}

export default async function AuthBar() {
  const session = await getSession();

  return (
    <div className="flex items-center justify-end gap-3 py-2">
      {session ? (
        <>
          <span className="text-sm text-default-600">
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
