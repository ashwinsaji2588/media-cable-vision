"use client";

import { useRef, useState, type FormEvent } from "react";

type Receipt = {
  reference: string;
  kind: "CONNECTION" | "ISSUE";
  receivedOn: string;
  status: "RECEIVED";
};

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function LookupForm() {
  const [pending, setPending] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>();
  const [error, setError] = useState("");
  const busy = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const phone = new FormData(event.currentTarget).get("phone");
    busy.current = true;
    setPending(true);
    setReceipts(undefined);
    setError("");
    try {
      const response = await fetch("/api/requests/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (response.ok && Array.isArray(result)) setReceipts(result);
      else
        setError(result.errors?.phone ?? result.message ?? "Please try again.");
    } catch {
      setError("Lookup is temporarily unavailable. Please try again.");
    } finally {
      busy.current = false;
      setPending(false);
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }

  return (
    <div className="formShell card">
      <form method="post" onSubmit={submit}>
        <fieldset className="formGrid" disabled={pending}>
          <label className="field">
            Mobile number
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              pattern="(?:\+91[ ]?)?[6-9][0-9]{9}"
              maxLength={14}
              placeholder="10-digit Indian mobile number"
            />
          </label>
          <div className="full">
            <button className="button" type="submit">
              {pending ? "Searching…" : "Find My Requests"}
            </button>
          </div>
        </fieldset>
      </form>
      {error && (
        <div className="error" role="alert" ref={feedback} tabIndex={-1}>
          {error}
        </div>
      )}
      {receipts && (
        <div className="lookupResults" ref={feedback} tabIndex={-1}>
          <h2>{receipts.length ? "Recent requests" : "No requests found"}</h2>
          {receipts.length ? (
            <ul className="receiptList">
              {receipts.map(({ reference, kind, receivedOn, status }) => (
                <li key={reference}>
                  <strong>{reference}</strong>
                  <span>
                    {kind === "CONNECTION" ? "New connection" : "Issue report"}
                  </span>
                  <time dateTime={receivedOn}>
                    {dateFormat.format(new Date(receivedOn))}
                  </time>
                  <span className="receiptStatus">
                    {status === "RECEIVED" ? "Received" : status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Check the mobile number you entered and try again.</p>
          )}
        </div>
      )}
    </div>
  );
}
