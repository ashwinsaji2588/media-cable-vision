import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export const config = { matcher: ["/((?!api/health$).*)"] };

const publicImages = new Set([
  "/connected-home.jpg",
  "/logo.svg",
  "/providers/asianet.webp",
  "/providers/kerala-vision.webp",
  "/providers/bsnl.webp",
]);

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // Next's image optimizer fetches the source without the browser's credentials.
  if (
    publicImages.has(pathname) ||
    (pathname === "/_next/image" && publicImages.has(searchParams.get("url") ?? ""))
  ) {
    return NextResponse.next();
  }

  const password = process.env.STAGING_PASSWORD;
  if (password) {
    const expected = `Basic ${Buffer.from(`staging:${password}`).toString("base64")}`;
    const provided = request.headers.get("authorization") ?? "";
    const digest = (value: string) => createHash("sha256").update(value).digest();
    if (!timingSafeEqual(digest(expected), digest(provided))) {
      return new NextResponse("Staging sign-in required.", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="MCV staging"', "Cache-Control": "no-store" },
      });
    }
  }
  return NextResponse.next();
}
