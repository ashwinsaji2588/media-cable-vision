import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const base = process.env.SMOKE_URL ?? "http://localhost:3000";
const password = process.env.STAGING_PASSWORD;
const authorization = password
  ? { Authorization: `Basic ${Buffer.from(`staging:${password}`).toString("base64")}` }
  : {};
const request = (path, options = {}) => fetch(base + path, {
  ...options,
  headers: { ...authorization, ...options.headers },
  redirect: "error",
});
for (const [path, title] of [
  ["/", "Reliable connections."], ["/broadband", "Broadband in Angadical"],
  ["/cable-tv", "Cable TV in Angadical"], ["/service-areas", "Chandanappally"],
  ["/contact", "Contact Media Cable Vision"], ["/new-connection", "Request a new connection"],
  ["/report-issue", "Report a service issue"], ["/privacy", "Privacy Policy"],
  ["/track-request", "Track your request"],
]) {
  const page = await request(path);
  assert.equal(page.status, 200, path);
  assert.ok((await page.text()).includes(title), path);
}

const data = {
  name: "Smoke Test", phone: "9876543210", service: "BROADBAND",
  locality: "Chandanappally", details: "Synthetic smoke test request."
};
const references = [];
for (const kind of ["connections", "issues"]) {
  const headers = { "Content-Type": "application/json", "Idempotency-Key": randomUUID() };
  const submit = payload => request(`/api/requests/${kind}`, {
    method: "POST", headers, body: JSON.stringify(payload)
  });
  const invalid = await submit({ ...data, phone: "invalid" });
  assert.equal(invalid.status, 400);
  assert.ok((await invalid.json()).errors.phone);
  const response = await submit(data);
  assert.equal(response.status, 201);
  const { reference } = await response.json();
  assert.match(reference, /^MCV-[0-9]{6,}$/);
  references.push(reference);
  const repeat = await submit(data);
  assert.equal(repeat.status, 201);
  assert.equal((await repeat.json()).reference, reference);
  assert.equal((await submit({ ...data, locality: "Angadical" })).status, 409);
}
const lookup = phone => request("/api/requests/lookup", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone })
});
const result = await lookup("+91 " + data.phone);
assert.equal(result.status, 200);
assert.equal(result.headers.get("cache-control"), "no-store");
const receipts = await result.json();
for (const reference of references) {
  const receipt = receipts.find(item => item.reference === reference);
  assert.ok(receipt);
  assert.deepEqual(Object.keys(receipt).sort(), ["kind", "receivedOn", "reference", "status"]);
  assert.match(receipt.receivedOn, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(receipt.status, "RECEIVED");
}
assert.deepEqual(await (await lookup("6999999999")).json(), []);
assert.equal((await lookup("invalid")).status, 400);
console.log("Verified public pages, both submissions, validation, retry idempotency and mobile lookup.");
