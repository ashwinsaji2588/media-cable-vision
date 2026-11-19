import test from "node:test";
import assert from "node:assert/strict";
import { forwardRequest } from "../app/api/requests/[kind]/forward.mjs";

function request(body = '{"name":"Sample"}') {
  return new Request("http://localhost:3000/api/requests/issues", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": "example-key",
    },
  });
}

test("forwards the request and returns the backend confirmation", async () => {
  const response = await forwardRequest(
    request(),
    "issues",
    "http://backend:8080",
    async (url, init) => {
      assert.equal(url.href, "http://backend:8080/api/requests/issues");
      assert.equal(init.headers["Idempotency-Key"], "example-key");
      assert.equal(new TextDecoder().decode(init.body), '{"name":"Sample"}');
      return Response.json({ reference: "MCV-123" }, { status: 201 });
    },
  );
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { reference: "MCV-123" });
});

test("preserves field validation feedback", async () => {
  const feedback = {
    message: "Check your entries.",
    errors: { phone: "Enter a valid number." },
  };
  const response = await forwardRequest(
    request(),
    "connections",
    "http://backend",
    async () => Response.json(feedback, { status: 400 }),
  );
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), feedback);
});

test("maps an unavailable backend to retryable feedback", async () => {
  const response = await forwardRequest(
    request(),
    "connections",
    "http://backend",
    async () => {
      throw new Error("connection refused");
    },
  );
  assert.equal(response.status, 503);
});

test("rejects unknown kinds and oversized bodies without calling the backend", async () => {
  let calls = 0;
  const send = async () => {
    calls++;
  };
  assert.equal(
    (await forwardRequest(request(), "other", "http://backend", send)).status,
    404,
  );
  assert.equal(
    (
      await forwardRequest(
        request("a".repeat(16_385)),
        "issues",
        "http://backend",
        send,
      )
    ).status,
    400,
  );
  assert.equal(calls, 0);
});
