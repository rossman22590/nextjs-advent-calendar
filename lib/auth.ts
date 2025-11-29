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

export async function registerUser(email: string, password: string, ipAddress?: string) {
  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  const existing = await query<{ id: string }>(
    "select id from users where email = $1 limit 1",
    [email.toLowerCase()],
  );
  if (existing.rowCount) {
    throw new Error("Email already registered");
  }

  // Check if IPLOCK is enabled
  if (process.env.IPLOCK === "true" && ipAddress) {
    const ipExists = await query<{ user_id: string }>(
      "select user_id from user_ips where ip_address = $1 limit 1",
      [ipAddress],
    );
    if (ipExists.rowCount) {
      throw new Error("An account has already been created from this IP address");
    }
  }

  await query(
    `insert into users (id, email, password_hash)
     values ($1, $2, $3)`,
    [id, email.toLowerCase(), hash],
  );

  // Store IP if IPLOCK is enabled and IP is provided
  if (process.env.IPLOCK === "true" && ipAddress) {
    await query(
      `insert into user_ips (user_id, ip_address)
       values ($1, $2)`,
      [id, ipAddress],
    );
  }

  return id;
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<string | null> {
  // Check if logging in as admin
  if (process.env.ADMIN && process.env.ADMIN_PW && email.toLowerCase() === process.env.ADMIN.toLowerCase()) {
    if (password === process.env.ADMIN_PW) {
      // Find or create admin user
      const adminResult = await query<{ id: string }>(
        "select id from users where email = $1 limit 1",
        [process.env.ADMIN.toLowerCase()],
      );

      if (adminResult.rowCount) {
        return adminResult.rows[0].id;
      }

      // Create admin user if doesn't exist
      const adminId = crypto.randomUUID();
      const hash = await bcrypt.hash(process.env.ADMIN_PW, 10);
      await query(
        `insert into users (id, email, password_hash)
         values ($1, $2, $3)`,
        [adminId, process.env.ADMIN.toLowerCase(), hash],
      );
      return adminId;
    }
    return null;
  }

  const result = await query<{ id: string; password_hash: string }>(
    "select id, password_hash from users where email = $1 limit 1",
    [email.toLowerCase()],
  );

  if (!result.rowCount) return null;

  const valid = await bcrypt.compare(password, result.rows[0].password_hash);
  return valid ? result.rows[0].id : null;
}
