"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon3D } from "./Icon3D";

interface StepItem {
  number: string;
  badge: string;
  timeframe: string;
  title: string;
  description: string;
  icon: "request" | "phone" | "calendar";
  actionText?: string;
  actionHref?: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    badge: "Step 1: Check & Select",
    timeframe: "Instant Online Check",
    title: "Choose Plan & Verify PIN",
    description:
      "Explore 26+ plans from Asianet, Kerala Vision, BSNL, or KFON. Type your 6-digit PIN code (e.g. 689648 or 691555) to check nearest optical distribution pole distance.",
    icon: "request",
    actionText: "Check PIN Feasibility →",
    actionHref: "#coverage",
  },
  {
    number: "02",
    badge: "Step 2: Rapid Confirmation",
    timeframe: "Within 30 Minutes",
    title: "Technician Call & Wire Route",
    description:
      "Our Pathanamthitta dispatch team calls to confirm building layout, drop cable path, and optimal Wi-Fi router placement. No upfront payment required.",
    icon: "phone",
  },
  {
    number: "03",
    badge: "Step 3: Go Live",
    timeframe: "Guaranteed < 24 Hours",
    title: "Optical Drop & Instant Activation",
    description:
      "Field engineers run heavy-duty armored fiber from the nearest pole, calibrate light levels with an optical power meter, and activate your gigabit line & HD set-top box.",
    icon: "calendar",
    actionText: "Book Installation Now →",
    actionHref: "/new-connection",
  },
];

/**
 * daisyUI-inspired Connected Steps & Timeline Component.
 * Integrates an interconnected glowing fiber line and live network pulse beacon.
 */
export function InstallationTimeline() {
  return (
    <div className="installationTimelineShell relative my-8">
      {/* Live Operational Status Beacon (daisyUI stat/indicator inspired) */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-transparent border border-emerald-500/25">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
          </span>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 block">
              Network Status: 100% Operational
            </span>
            <span className="text-sm font-extrabold text-[#070d1a]">
              Chandanappally & Angadical Core Hubs Active • ~5ms Local Latency
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
            ⚡ 24h Average Turnaround
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200">
            🛡️ Free Site Survey
          </span>
        </div>
      </div>

      {/* Connected 3-Step Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Optical Connecting Line (desktop only) */}
        <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400 z-0 opacity-40" />

        {STEPS.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 hover:border-sky-300 transition-all hover:shadow-2xl hover:-translate-y-1 group z-10"
          >
            {/* Step Header with Step Badge & 3D Icon */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="h-10 w-10 rounded-2xl bg-[#070d1a] text-white flex items-center justify-center font-black text-sm shadow-md shadow-slate-900/20 group-hover:bg-[#1d4ed8] transition-colors">
                    {step.number}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
                      {step.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      ⏱️ {step.timeframe}
                    </span>
                  </div>
                </div>

                <Icon3D name={step.icon} size={48} animateFloat={false} />
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-[#070d1a]">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Step Action Link if present */}
            {step.actionText && step.actionHref && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={step.actionHref}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1d4ed8] hover:text-blue-800 transition-colors group-hover:translate-x-1 duration-200"
                >
                  <span>{step.actionText}</span>
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
