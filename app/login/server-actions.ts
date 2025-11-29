"use server";

import { createSession, registerUser, verifyUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type Mode = "login" | "register";

export async function authAction(mode: Mode, formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (mode === "register") {
    const inviteCode = (formData.get("inviteCode") as string | null)?.trim() ?? "";
    
    if (!inviteCode) {
      throw new Error("Invite code is required");
    }

    // Validate invite code
    if (inviteCode !== process.env.INVITE_TOKEN) {
      throw new Error("Invalid invite code");
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
      throw new Error("Invalid credentials");
    }
    await createSession(userId);
  }

  redirect("/");
}
