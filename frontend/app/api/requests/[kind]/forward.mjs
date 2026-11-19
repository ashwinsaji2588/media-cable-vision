const maxBytes = 16_384;

export async function forwardRequest(request, kind, backend, send = fetch) {
  if (!["connections", "issues", "lookup"].includes(kind)) {
    return Response.json({ message: "Unknown request type." }, { status: 404 });
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return Response.json(
      { message: "Submit this form as JSON." },
      { status: 415 },
    );
  }

  const body = await readBody(request);
  if (!body)
    return Response.json(
      { message: "The request is too large or empty." },
      { status: 400 },
    );

  try {
    const upstream = await send(new URL(`/api/requests/${kind}`, backend), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": request.headers.get("idempotency-key") ?? "",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if ([200, 201, 400, 409].includes(upstream.status)) {
      return Response.json(await upstream.json(), {
        status: upstream.status,
        headers: { "Cache-Control": "no-store" },
      });
    }
  } catch {
    // The client can retry with the same idempotency key.
  }
  return Response.json(
    { message: kind === "lookup" ? "Lookup is temporarily unavailable. Please try again." : "We couldn’t confirm receipt. Please try again." },
    { status: 503 },
  );
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const bytes = new Uint8Array(maxBytes);
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return length ? bytes.subarray(0, length) : null;
      if (length + value.length > maxBytes) {
        await reader.cancel();
        return null;
      }
      bytes.set(value, length);
      length += value.length;
    }
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}
