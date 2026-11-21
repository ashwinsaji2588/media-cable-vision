"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Icon3D } from "./Icon3D";

interface CoverageZone {
  pincode: string;
  name: string;
  town: string;
  tier: "CORE" | "EXTENDED" | "FEASIBLE";
  status: "ACTIVE" | "FEASIBLE";
  providers: string[];
  latency: string;
  installationTime: string;
  cableTvStatus: string;
  landmarks: string[];
  description: string;
}

const COVERAGE_ZONES: CoverageZone[] = [
  {
    pincode: "689648",
    name: "Chandanappally & Angadical North",
    town: "Chandanappally",
    tier: "CORE",
    status: "ACTIVE",
    providers: ["Asianet", "Kerala Vision", "KFON", "Extranet", "BSNL"],
    latency: "5ms",
    installationTime: "Within 24 Hours",
    cableTvStatus: "Digital HD Ready (300+ Channels)",
    landmarks: [
      "Chandanappally St. George Church",
      "Market Junction",
      "Angadical North High School Road",
      "Kaipattoor Link Road",
      "Adoor Main Highway",
    ],
    description:
      "Core optical fiber distribution hub active. High-density aerial & underground lines with immediate port availability.",
  },
  {
    pincode: "691555",
    name: "Angadical South & Kodumon Link",
    town: "Angadical",
    tier: "CORE",
    status: "ACTIVE",
    providers: ["Asianet", "Kerala Vision", "KFON", "Extranet", "BSNL"],
    latency: "6ms",
    installationTime: "Within 24 Hours",
    cableTvStatus: "Digital HD Ready (300+ Channels)",
    landmarks: [
      "Angadical South Junction",
      "Kodumon Link Road",
      "Kurampala Border Road",
      "Panchayat Office Junction",
    ],
    description:
      "Core optical distribution active. Symmetrical high-speed fiber drops across Asianet & Kerala Vision lines.",
  },
  {
    pincode: "691523",
    name: "Adoor Central & Bypass",
    town: "Adoor",
    tier: "EXTENDED",
    status: "ACTIVE",
    providers: ["Asianet", "Kerala Vision", "BSNL", "KFON"],
    latency: "6ms",
    installationTime: "24 - 48 Hours",
    cableTvStatus: "Digital Cable Feasible",
    landmarks: ["Adoor KSRTC Junction", "Central Town", "Bypass Road"],
    description:
      "Extended coverage zone served through our feeder trunk lines. Subject to local DP pole distance.",
  },
  {
    pincode: "689645",
    name: "Kurampala & Pandalam Border",
    town: "Kurampala",
    tier: "FEASIBLE",
    status: "FEASIBLE",
    providers: ["Kerala Vision", "Asianet", "Extranet"],
    latency: "8ms",
    installationTime: "24 - 48 Hours",
    cableTvStatus: "Digital Cable Feasible",
    landmarks: ["Kurampala Junction", "Pandalam Link", "South Border"],
    description:
      "Feasible via Kurampala distribution line. Field technician inspects wire drop distance upon request.",
  },
  {
    pincode: "689647",
    name: "Ezhamkulam & Enathu",
    town: "Ezhamkulam",
    tier: "FEASIBLE",
    status: "FEASIBLE",
    providers: ["Asianet", "Kerala Vision", "BSNL"],
    latency: "7ms",
    installationTime: "24 - 48 Hours",
    cableTvStatus: "Digital Cable Feasible",
    landmarks: ["Ezhamkulam Temple Area", "Enathu Bridge Road"],
    description:
      "Connected through our regional partner ring. Cable drop verified on site within 2 hours of inquiry.",
  },
];

export function CoverageChecker() {
  const [query, setQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<CoverageZone | null>(
    COVERAGE_ZONES[0]
  );

  const cleanQuery = query.trim();
  const isPincode = /^\d{1,6}$/.test(cleanQuery);

  // Exact or partial matching logic
  const matchedZone = COVERAGE_ZONES.find((z) => {
    if (!cleanQuery) return false;
    if (z.pincode === cleanQuery) return true;
    if (z.pincode.startsWith(cleanQuery) && cleanQuery.length >= 3) return true;
    return (
      z.name.toLowerCase().includes(cleanQuery.toLowerCase()) ||
      z.town.toLowerCase().includes(cleanQuery.toLowerCase()) ||
      z.landmarks.some((l) => l.toLowerCase().includes(cleanQuery.toLowerCase()))
    );
  });

  const activeZone = matchedZone || (cleanQuery ? null : selectedZone);

  // Is it a valid 6-digit Indian PIN outside our pre-mapped hubs?
  const isCustom6DigitPin = /^\d{6}$/.test(cleanQuery) && !matchedZone;
  const isNearbyKeralaPin = isCustom6DigitPin && (cleanQuery.startsWith("689") || cleanQuery.startsWith("691"));

  return (
    <div className="coverageCheckerShell rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optical Network Feasibility</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#070d1a]">
            Check Coverage by PIN Code or Landmark
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Enter your 6-digit PIN code (e.g. <strong>689648</strong>,{" "}
            <strong>691555</strong>) or locality to inspect fiber drop availability.
          </p>
        </div>

        <Icon3D name="location" size={64} className="self-start md:self-center" />
      </div>

      {/* Search Input supporting PIN code or Landmark */}
      <div className="mt-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Enter 6-Digit PIN Code or Locality Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={30}
            placeholder="e.g. 689648, 691555, Chandanappally, Angadical..."
            className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all text-sm sm:text-base font-medium"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            📍
          </span>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedZone(COVERAGE_ZONES[0]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick PIN Code Pills */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs font-bold text-slate-400 uppercase mr-1">
          Quick PINs:
        </span>
        {COVERAGE_ZONES.map((zone) => (
          <button
            key={zone.pincode}
            type="button"
            onClick={() => {
              setQuery(zone.pincode);
              setSelectedZone(zone);
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeZone?.pincode === zone.pincode
                ? "bg-[#070d1a] text-white border-[#070d1a] shadow-xs"
                : "bg-slate-100/90 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
          >
            <span>📮 {zone.pincode}</span>
            <span className="text-[11px] opacity-75 hidden sm:inline">
              ({zone.town})
            </span>
            {zone.tier === "CORE" && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        ))}
      </div>

      {/* Coverage Status Result Card */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {activeZone ? (
            <motion.div
              key={activeZone.pincode}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`rounded-2xl border p-6 ${
                activeZone.tier === "CORE"
                  ? "border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/30"
                  : "border-sky-200 bg-gradient-to-br from-sky-50/40 via-white to-slate-50/40"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${
                      activeZone.tier === "CORE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-sky-500/10 text-sky-600"
                    }`}
                  >
                    {activeZone.tier === "CORE" ? "✓" : "⚡"}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black px-2.5 py-0.5 rounded-md bg-[#070d1a] text-white tracking-wider">
                        PIN {activeZone.pincode}
                      </span>
                      <h4 className="text-lg font-extrabold text-[#070d1a]">
                        {activeZone.name}
                      </h4>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          activeZone.tier === "CORE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {activeZone.tier === "CORE"
                          ? "● 100% Core Fiber Hub"
                          : "● Feasible via Feeder Line"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {activeZone.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/new-connection?locality=${encodeURIComponent(
                    activeZone.town.toUpperCase()
                  )}&pincode=${activeZone.pincode}&landmark=${encodeURIComponent(
                    activeZone.landmarks[0]
                  )}`}
                  className="button btn-dark shrink-0"
                  style={{
                    backgroundColor: "#070d1a",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span style={{ color: "#ffffff", fontWeight: 700 }}>
                    Book Installation for PIN {activeZone.pincode} →
                  </span>
                </Link>
              </div>

              {/* Detailed Technical Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 mt-5 border-t border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">
                    Supported Networks
                  </span>
                  <span className="font-bold text-[#070d1a] text-sm mt-0.5 block">
                    {activeZone.providers.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">
                    Setup Turnaround
                  </span>
                  <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
                    {activeZone.installationTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">
                    Local Latency
                  </span>
                  <span className="font-bold text-[#070d1a] text-sm mt-0.5 block">
                    {activeZone.latency} (Optical)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">
                    Digital Cable TV
                  </span>
                  <span className="font-bold text-indigo-700 text-sm mt-0.5 block">
                    {activeZone.cableTvStatus}
                  </span>
                </div>
              </div>

              {/* Landmark coverage tags */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-400">Key Points:</span>
                {activeZone.landmarks.map((l) => (
                  <span
                    key={l}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : isCustom6DigitPin ? (
            /* Custom 6-digit PIN result */
            <motion.div
              key={cleanQuery}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-2xl border border-sky-200 bg-sky-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black px-2.5 py-0.5 rounded-md bg-[#070d1a] text-white">
                    PIN {cleanQuery}
                  </span>
                  <h4 className="text-lg font-bold text-[#070d1a]">
                    {isNearbyKeralaPin
                      ? "Pathanamthitta Network Boundary Feasibility"
                      : "Custom Location Feasibility Inquiry"}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {isNearbyKeralaPin
                    ? `PIN ${cleanQuery} is in our extended service district. We routinely extend aerial drops across neighboring roads. Submit your address and our technician will check pole line distance within 2 hours.`
                    : `PIN ${cleanQuery} is outside our core optical hubs (689648 & 691555). We can check if our partner networks (KFON / Extranet / BSNL) can activate a connection for your address.`}
                </p>
              </div>

              <Link
                href={`/new-connection?locality=OTHER&pincode=${cleanQuery}&otherLocality=PIN%20${cleanQuery}`}
                className="button shrink-0"
                style={{
                  backgroundColor: "#1d4ed8",
                  color: "#ffffff",
                }}
              >
                <span style={{ color: "#ffffff", fontWeight: 700 }}>
                  Check Pole Feasibility for PIN {cleanQuery} →
                </span>
              </Link>
            </motion.div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
              <p className="font-semibold text-slate-700">
                No direct match found for &ldquo;{cleanQuery}&rdquo;
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try entering your 6-digit postal code (e.g. 689648 or 691555) or select one of the quick PINs above.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
