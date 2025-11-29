"use server";

import { createSession, registerUser, verifyUser } from "@/lib/auth";
import { redirect } from "next/navigation";

type Mode = "login" | "register";

export async function authAction(mode: Mode, formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (mode === "register") {
    const userId = await registerUser(email, password);
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
