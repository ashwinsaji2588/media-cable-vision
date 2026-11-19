export async function GET() {
  try {
    const backend = process.env.BACKEND_URL ?? "http://localhost:8080";
    const response = await fetch(new URL("/actuator/health", backend), {
      cache: "no-store",
      signal: AbortSignal.timeout(2_000),
    });
    if (response.ok) return new Response("OK");
  } catch {
    // Health checks should return a failure without backend connection details.
  }
  return new Response("Unavailable", { status: 503 });
}
