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
  initialPlan,
  initialSpeed,
  initialLocality,
  initialLandmark,
  initialPincode,
  initialOtherLocality,
}: {
  kind: Kind;
  initialService?: string;
  initialPlan?: string;
  initialSpeed?: string;
  initialLocality?: string;
  initialLandmark?: string;
  initialPincode?: string;
  initialOtherLocality?: string;
}) {
  const issue = kind === "issues";
  const [locality, setLocality] = useState(initialLocality || "Angadical");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result>({});
  const reference = result.reference;
  const [copyMessage, setCopyMessage] = useState("");
  const key = useRef<{ id: string; body: string } | null>(null);
  const inFlight = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  // Compute default details prefill if plan, speed, landmark, or pincode was passed
  const parts: string[] = [];
  if (initialPlan) parts.push(`Selected Plan: ${initialPlan}${initialSpeed ? ` (${initialSpeed} Mbps)` : ""}`);
  else if (initialSpeed) parts.push(`Interested in ${initialSpeed} Mbps plan`);
  if (initialPincode) parts.push(`PIN Code: ${initialPincode}`);
  if (initialLandmark) parts.push(`Landmark: ${initialLandmark}`);
  const defaultDetails = parts.length > 0 ? parts.join("\n") + "\n" : "";

  function fieldState(name: string) {
    const invalid = Boolean(result.errors?.[name]);
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `request-error-${name}` : undefined,
    };
  }

  function fieldError(name: string) {
    const message = result.errors?.[name];
    return (
      message && (
        <small id={`request-error-${name}`} className="fieldError">
          {message}
        </small>
      )
    );
  }

  async function copyReference(reference: string) {
    try {
      await navigator.clipboard.writeText(reference);
      setCopyMessage("Reference copied.");
    } catch {
      setCopyMessage("Select the reference above to copy it manually.");
    }
  }

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
      {/* Prominent Pre-Selected Plan or PIN Banner */}
      {initialPlan ? (
        <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
              style={{ backgroundColor: "#1d4ed8", color: "#ffffff" }}
            >
              ✓
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
                Pre-Selected Plan
              </span>
              <strong className="text-sm sm:text-base text-[#070d1a] font-extrabold block">
                {initialPlan}
              </strong>
            </div>
          </div>
          <Link
            href="/plans"
            className="text-xs font-bold text-[#1d4ed8] hover:underline shrink-0"
          >
            Change Plan
          </Link>
        </div>
      ) : initialPincode ? (
        <div className="p-4 mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
              style={{ backgroundColor: "#059669", color: "#ffffff" }}
            >
              📍
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Coverage Verification Area
              </span>
              <strong className="text-sm sm:text-base text-[#070d1a] font-extrabold block">
                PIN Code: {initialPincode} {initialLocality && initialLocality !== "OTHER" ? `(${initialLocality})` : ""}
              </strong>
            </div>
          </div>
          <Link
            href="/#coverage"
            className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
          >
            Change Location
          </Link>
        </div>
      ) : null}

      {reference ? (
        <div
          className="success referencePanel"
          ref={feedback}
          tabIndex={-1}
          aria-labelledby="request-confirmation"
        >
          <h2 id="request-confirmation">
            {issue ? "Issue report received" : "Connection request received"}
          </h2>
          <p>Your reference</p>
          <div className="referenceValue">
            <strong>{reference}</strong>
            <button
              type="button"
              className="button secondary"
              onClick={() => copyReference(reference)}
            >
              Copy reference
            </button>
          </div>
          <div role="status">{copyMessage}</div>
          <p>We’ll follow up using the number you provided.</p>
          <Link className="textLink" href="/track-request">
            Find this request later using your mobile number
          </Link>
        </div>
      ) : (
        <form method="post" onSubmit={submit}>
          <fieldset className="formGrid" disabled={pending}>
            <label className="field">
              Full name
              <input
                name="name"
                required
                autoComplete="name"
                maxLength={100}
                {...fieldState("name")}
              />
              {fieldError("name")}
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
                {...fieldState("phone")}
              />
              {fieldError("phone")}
            </label>
            <label className="field">
              Service
              <select
                name="service"
                required
                defaultValue={initialService ?? ""}
                {...fieldState("service")}
              >
                <option value="" disabled>
                  Select a service
                </option>
                <option value="BROADBAND">Broadband</option>
                <option value="CABLE_TV">Cable TV</option>
                {!issue && <option value="BOTH">Both</option>}
              </select>
              {fieldError("service")}
            </label>
            <label className="field">
              Locality
              <select
                name="locality"
                value={locality}
                onChange={(event) => setLocality(event.target.value)}
                {...fieldState("locality")}
              >
                <option>Angadical</option>
                <option>Chandanappally</option>
                <option value="OTHER">Other nearby area</option>
              </select>
              {fieldError("locality")}
            </label>
            {locality === "OTHER" && (
              <label className="field full">
                Nearby locality
                <input
                  name="otherLocality"
                  required
                  defaultValue={initialOtherLocality}
                  maxLength={120}
                  {...fieldState("otherLocality")}
                />
                {fieldError("otherLocality")}
              </label>
            )}
            <label className="field full">
              {issue
                ? "Describe the issue"
                : "Address or nearby landmark (Pre-filled with your chosen plan)"}
              <textarea
                name="details"
                required
                minLength={5}
                maxLength={2000}
                rows={4}
                defaultValue={defaultDetails}
                {...fieldState("details")}
                placeholder={
                  issue
                    ? "Tell us what happened and when it started."
                    : "Include your house name, road, or nearby landmark."
                }
              />
              {fieldError("details")}
            </label>
            <p className="formNote full">
              We’ll use these details to respond to your submission.{" "}
              <Link href="/privacy">Privacy Policy</Link>
            </p>
            <div className="full">
              <button
                className="button"
                type="submit"
                disabled={pending}
                style={{ color: "#ffffff", backgroundColor: "#1d4ed8" }}
              >
                <span style={{ color: "#ffffff" }}>
                  {pending
                    ? "Sending…"
                    : issue
                    ? "Send Issue Report"
                    : "Send Connection Request"}
                </span>
              </button>
            </div>
          </fieldset>
          {result.message && (
            <div className="error" role="alert" ref={feedback} tabIndex={-1}>
              <p>{result.message}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
