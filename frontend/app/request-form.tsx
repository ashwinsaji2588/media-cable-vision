"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";

type Kind = "connections" | "issues";
type Result = {
  reference?: string;
  message?: string;
  errors?: Record<string, string>;
};

export function RequestForm({
  kind,
  initialService,
}: {
  kind: Kind;
  initialService?: string;
}) {
  const issue = kind === "issues";
  const [locality, setLocality] = useState("Angadical");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result>({});
  const key = useRef<{ id: string; body: string } | null>(null);
  const inFlight = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const body = JSON.stringify(data);
    inFlight.current = true;
    setPending(true);
    setResult({});
    try {
      if (key.current?.body !== body)
        key.current = { id: crypto.randomUUID(), body };
      const response = await fetch(`/api/requests/${kind}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current.id,
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });
      const payload: Result = await response.json();
      if (response.ok && payload.reference)
        setResult({ reference: payload.reference });
      else
        setResult({
          message:
            payload.message ?? "We couldn’t confirm receipt. Please try again.",
          errors: payload.errors,
        });
    } catch {
      setResult({ message: "We couldn’t confirm receipt. Please try again." });
    } finally {
      inFlight.current = false;
      setPending(false);
      requestAnimationFrame(() => feedback.current?.focus());
    }
  }

  return (
    <div className="formShell card">
      {result.reference ? (
        <div className="success" ref={feedback} tabIndex={-1} role="status">
          <h2>
            {issue ? "Issue report received" : "Connection request received"}
          </h2>
          <p>
            Reference <strong>{result.reference}</strong>. We’ll follow up using
            the number you provided.
          </p>
          <Link className="textLink" href="/track-request">
            Find this request later using your mobile number
          </Link>
        </div>
      ) : (
        <form method="post" onSubmit={submit}>
          <fieldset className="formGrid" disabled={pending}>
            <label className="field">
              Full name
              <input name="name" required autoComplete="name" maxLength={100} />
            </label>
            <label className="field">
              Mobile number
              <input
                name="phone"
                required
                type="tel"
                autoComplete="tel"
                pattern="(?:\+91[ ]?)?[6-9][0-9]{9}"
                maxLength={14}
                placeholder="10-digit Indian mobile number"
              />
            </label>
            <label className="field">
              Service
              <select
                name="service"
                required
                defaultValue={initialService ?? ""}
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option value="BROADBAND">Broadband</option>
                <option value="CABLE_TV">Cable TV</option>
                {!issue && <option value="BOTH">Both</option>}
              </select>
            </label>
            <label className="field">
              Locality
              <select
                name="locality"
                value={locality}
                onChange={(event) => setLocality(event.target.value)}
              >
                <option>Angadical</option>
                <option>Chandanappally</option>
                <option value="OTHER">Other nearby area</option>
              </select>
            </label>
            {locality === "OTHER" && (
              <label className="field full">
                Nearby locality
                <input name="otherLocality" required maxLength={120} />
              </label>
            )}
            <label className="field full">
              {issue ? "Describe the issue" : "Address or nearby landmark"}
              <textarea
                name="details"
                required
                minLength={5}
                maxLength={2000}
                rows={4}
                placeholder={
                  issue
                    ? "Tell us what happened and when it started."
                    : "Include enough detail for us to check availability."
                }
              />
            </label>
            <p className="formNote full">
              We’ll use these details to respond to your submission.{" "}
              <Link href="/privacy">Privacy Policy</Link>
            </p>
            <div className="full">
              <button className="button" type="submit" disabled={pending}>
                {pending
                  ? "Sending…"
                  : issue
                    ? "Send Issue Report"
                    : "Send Connection Request"}
              </button>
            </div>
          </fieldset>
          {result.message && (
            <div className="error" role="alert" ref={feedback} tabIndex={-1}>
              <p>{result.message}</p>
              {result.errors && (
                <ul>
                  {Object.entries(result.errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
