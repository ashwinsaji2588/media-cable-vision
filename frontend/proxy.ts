import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

export const config = { matcher: ["/((?!api/health$).*)"] };

export function proxy(request: NextRequest) {
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
