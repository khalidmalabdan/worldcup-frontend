import { NextResponse } from "next/server";

export async function GET() {
  // Clear token from browser
  const res = NextResponse.redirect("/");

  res.cookies.set("token", "", {
    httpOnly: false,
    expires: new Date(0),
  });

  return res;
}
