import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { passcode } = await request.json();

  const correctPasscode = process.env.PREVIEW_PASSCODE || "0000";

  if (passcode === correctPasscode) {
    const response = NextResponse.json({ success: true });

    response.cookies.set("preview_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30日間有効
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
}
