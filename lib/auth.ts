import { cookies } from "next/headers";
import { query } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "session_token";
const SESSION_TTL_DAYS = 30;

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = await query<{
    user_id: string;
    email: string;
  }>(
    `select s.user_id, u.email
     from sessions s
     join users u on u.id = s.user_id
     where s.token = $1 and s.expires_at > now()
     limit 1`,
    [token],
  );

  if (!result.rowCount) return null;

  return {
    userId: result.rows[0].user_id,
    email: result.rows[0].email,
    token,
  };
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_TTL_DAYS);

  await query(
    `insert into sessions (token, user_id, expires_at, expires, id)
     values ($1, $2, $3, $3, $1)`,
    [token, userId, expires.toISOString()],
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires,
    path: "/",
  });

  return token;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return;
  await query("delete from sessions where token = $1", [token]);
  cookieStore.delete(SESSION_COOKIE);
}

export async function registerUser(email: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  const existing = await query<{ id: string }>(
    "select id from users where email = $1 limit 1",
    [email.toLowerCase()],
  );
  if (existing.rowCount) {
    throw new Error("Email already registered");
  }

  await query(
    `insert into users (id, email, password_hash)
     values ($1, $2, $3)`,
    [id, email.toLowerCase(), hash],
  );

  return id;
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<string | null> {
  const result = await query<{ id: string; password_hash: string }>(
    "select id, password_hash from users where email = $1 limit 1",
    [email.toLowerCase()],
  );

  if (!result.rowCount) return null;

  const valid = await bcrypt.compare(password, result.rows[0].password_hash);
  return valid ? result.rows[0].id : null;
}
