import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    // Validate the invite code
    if (code !== process.env.INVITE_TOKEN) {
      return NextResponse.json({ success: false }, { status: 403 });
    }
    
    // Set a short-lived cookie for the OAuth flow
    const cookieStore = await cookies();
    cookieStore.set("google_invite_code", code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 300, // 5 minutes
      path: "/",
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
