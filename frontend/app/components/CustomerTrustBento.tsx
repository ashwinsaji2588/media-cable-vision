"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon3D } from "./Icon3D";
import { businessPhone } from "../site";

/**
 * Aceternity & Linear inspired Customer Trust Bento Grid.
 * Conveys local reliability, direct human support, and carrier redundancy.
 */
export function CustomerTrustBento() {
  return (
    <section className="wrap section">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1d4ed8] text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
          <span>The Local Difference</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#070d1a] tracking-tight">
          Why 1,500+ Homes in Angadical &amp; Chandanappally Choose Us
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Experience local accountability, ultra-low latency optical peering, and
          technicians who live right in your neighborhood.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 2-Hour Doorstep Support (Hero Bento Card - spans 2 cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-2 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50/20 to-blue-50/30 p-7 sm:p-9 shadow-xl shadow-slate-900/5 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold uppercase mb-4 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Doorstep Support in Under 2 Hours</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#070d1a]">
                Direct Local Support. No Endless Call Center Menus.
              </h3>
              <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                When your internet goes down, you don&apos;t talk to an automated robot in
                another state. Our field team is based directly in Pathanamthitta
                and arrives at your gate to fix cut drops or spliced fiber within 2 hours.
              </p>
            </div>
            <Icon3D name="phone" size={72} className="shrink-0 self-start" />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-[#070d1a] text-white flex items-center justify-center font-bold text-sm">
                📞
              </span>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Direct Dispatch Hotline
                </span>
                <a
                  href={`tel:${businessPhone()}`}
                  className="text-sm font-extrabold text-[#1d4ed8] hover:underline"
                >
                  {businessPhone()}
                </a>
              </div>
            </div>

            <Link
              href="/report-issue"
              className="text-xs font-bold text-slate-700 hover:text-[#1d4ed8] transition-colors"
            >
              Report a service issue online →
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Ultra-Low Latency Optical Peering */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-sky-100 text-sky-800">
                5ms Optical Latency
              </span>
              <Icon3D name="broadband" size={48} animateFloat={false} />
            </div>
            <h3 className="text-xl font-extrabold text-[#070d1a]">
              Direct Optical Peering
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Direct connection to Kochi &amp; Chennai internet exchanges ensures instant
              video conferencing, lag-free online gaming, and immediate 4K HDR playback.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>● 99.98% Monitored Uptime</span>
            <span className="text-slate-400">Zero Buffering</span>
          </div>
        </motion.div>

        {/* Card 3: Multi-Carrier Freedom */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800">
                Multi-Carrier Hub
              </span>
              <Icon3D name="request" size={48} animateFloat={false} />
            </div>
            <h3 className="text-xl font-extrabold text-[#070d1a]">
              Freedom of Choice
            </h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              We aren&apos;t tied to a single ISP monopoly. We inspect whether Asianet,
              Kerala Vision, BSNL, or KFON has the closest distribution box to your house
              for maximum signal strength.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/plans"
              className="text-xs font-extrabold text-[#1d4ed8] hover:underline"
            >
              Compare all 26 plans →
            </Link>
          </div>
        </motion.div>

        {/* Card 4: Digital Cable TV with Malayalam & Sports (spans 2 cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="md:col-span-2 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/20 to-white p-7 sm:p-9 shadow-xl shadow-slate-900/5 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-extrabold uppercase mb-4 border border-indigo-200">
                <span>Rain-Fade Resistant HD Broadcast</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#070d1a]">
                300+ Crystal HD Channels &amp; Local Community Feed
              </h3>
              <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                Unlike satellite dish connections that blackout during monsoon rains in Kerala,
                our terrestrial optical cable delivers uninterrupted HD broadcasts for Asianet,
                Surya, Star Sports HD, plus local Angadical church and festival announcements.
              </p>
            </div>
            <Icon3D name="cable-tv" size={72} className="shrink-0 self-start" />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                🏏 Live IPL &amp; Cricket HD
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                📺 Malayalam All-Inclusive
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                🌧️ Monsoon Proof
              </span>
            </div>

            <Link
              href="/cable-tv"
              className="text-xs font-extrabold text-[#1d4ed8] hover:underline"
            >
              Explore Cable TV packages →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
