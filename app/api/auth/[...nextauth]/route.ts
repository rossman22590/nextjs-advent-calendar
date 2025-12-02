import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { query } from "@/lib/db";
import { createSession } from "@/lib/auth";
import crypto from "crypto";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists
        const existingUser = await query<{ id: string }>(
          "SELECT id FROM users WHERE email = $1 LIMIT 1",
          [user.email.toLowerCase()]
        );

        let userId: string;

        if (existingUser.rowCount) {
          // Existing user - allow login
          userId = existingUser.rows[0].id;
          
          // Create session
          await createSession(userId);
          return true;
        } else {
          // New user trying to login - check if they came from register page with invite code
          const cookieStore = await cookies();
          const inviteCode = cookieStore.get("google_invite_code")?.value;
          
          if (!inviteCode || inviteCode !== process.env.INVITE_TOKEN) {
            // No valid invite code - redirect to register page
            console.log("New user attempted Google login without invite code");
            return "/login?error=not_registered";
          }

          // Valid invite code - create new user
          userId = crypto.randomUUID();
          
          await query(
            `INSERT INTO users (id, email, password_hash)
             VALUES ($1, $2, $3)`,
            [userId, user.email.toLowerCase(), ""] // Empty password for OAuth users
          );

          // Clear the invite code cookie after use
          cookieStore.delete("google_invite_code");
          
          // Create session
          await createSession(userId);
          return true;
        }
      } catch (error) {
        console.error("Error during Google sign-in:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // If there's an error parameter, preserve it
      if (url.includes("error=")) {
        return url;
      }
      // Otherwise redirect to home page
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
