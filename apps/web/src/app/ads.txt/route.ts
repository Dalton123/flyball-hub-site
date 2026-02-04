import { NextResponse } from "next/server";

export const revalidate = 86400; // 24 hours

export async function GET() {
  return NextResponse.redirect(
    "https://srv.adstxtmanager.com/19390/flyballhub.com",
    302, // Temporary redirect - allows Ezoic to manage content
  );
}
