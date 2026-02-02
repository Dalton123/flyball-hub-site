import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(
    "https://srv.adstxtmanager.com/19390/flyballhub.com",
    302, // Temporary redirect - allows Ezoic to manage content
  );
}
