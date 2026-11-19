import { forwardRequest } from "./forward.mjs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  return forwardRequest(
    request,
    kind,
    process.env.BACKEND_URL ?? "http://localhost:8080",
  );
}
