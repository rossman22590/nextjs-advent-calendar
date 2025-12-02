import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    const isValid = code === process.env.INVITE_TOKEN;
    
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
