export const dynamic = "force-dynamic";
export const revalidate = 86400; // Revalidate once per day

export async function GET() {
  const response = await fetch(
    "https://srv.adstxtmanager.com/19390/flyballhub.com",
    { next: { revalidate: 86400 } }
  );

  if (!response.ok) {
    return new Response("# ads.txt temporarily unavailable", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const content = await response.text();

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
