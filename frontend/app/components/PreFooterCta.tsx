"use client";

import React from "react";
import Link from "next/link";
import { businessPhone } from "../site";

/**
 * High-Converting Pre-Footer Call-to-Action.
 * Follows Codikko Reference Kit (1 clear goal, doubt-removing microcopy, large wordmark).
 */
export function PreFooterCta() {
  return (
    <section className="wrap my-16">
      <div className="relative rounded-3xl bg-[#070d1a] border border-slate-800 p-8 sm:p-14 overflow-hidden text-center text-white shadow-2xl shadow-blue-950/30">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(29, 78, 216, 0.45) 0%, rgba(6, 182, 212, 0.15) 45%, transparent 75%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-400/30">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Serving Angadical, Chandanappally &amp; Surrounding Areas</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to upgrade your home internet &amp; entertainment?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Choose from 26+ plans across Asianet, Kerala Vision, BSNL, and KFON.
            Our field team inspects the nearest drop pole and gets you online in under 24 hours.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/new-connection"
              className="button shrink-0 text-base px-8 py-4 shadow-xl shadow-blue-600/30"
              style={{
                backgroundColor: "#1d4ed8",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 800 }}>
                Check Availability &amp; Book Connection →
              </span>
            </Link>

            <a
              href={`tel:${businessPhone()}`}
              className="button secondary shrink-0 text-base px-6 py-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span style={{ color: "#ffffff" }}>📞 Speak with Dispatch</span>
            </a>
          </div>

          {/* Doubt-removing microcopy */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-400">
            <span>✓ No upfront payment required</span>
            <span>•</span>
            <span>✓ Free on-site feasibility survey</span>
            <span>•</span>
            <span>✓ Active in 24 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
}
