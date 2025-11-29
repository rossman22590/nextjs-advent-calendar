"use server";

import { createSession, registerUser, verifyUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type Mode = "login" | "register";

type AuthResult = {
  success: boolean;
  error?: string;
};

export async function authAction(mode: Mode, formData: FormData): Promise<AuthResult | never> {
  try {
    const email = (formData.get("email") as string | null)?.trim() ?? "";
    const password = (formData.get("password") as string | null) ?? "";

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (mode === "register") {
      const inviteCode = (formData.get("inviteCode") as string | null)?.trim() ?? "";
      
      if (!inviteCode) {
        return { success: false, error: "Invite code is required" };
      }

      // Validate invite code
      if (inviteCode !== process.env.INVITE_TOKEN) {
        return { success: false, error: "Invalid invite code" };
      }

      // Get IP address from headers
      const headersList = await headers();
      const ipAddress = 
        headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
        headersList.get("x-real-ip") ||
        "unknown";
      
      const userId = await registerUser(email, password, ipAddress);
      await createSession(userId);
    } else {
      const userId = await verifyUser(email, password);
      if (!userId) {
        return { success: false, error: "Invalid credentials" };
      }
      await createSession(userId);
    }

    redirect("/");
  } catch (error: any) {
    // If it's a redirect, re-throw it
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    // Otherwise return error
    return { success: false, error: error.message || "Authentication failed" };
  }
}
