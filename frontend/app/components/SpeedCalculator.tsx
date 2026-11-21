"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Icon3D } from "./Icon3D";

interface SpeedTier {
  speed: number;
  label: string;
  tagline: string;
  devices: string;
  streaming: string;
  gaming: string;
  downloads: string;
  badge?: string;
}

const TIERS: SpeedTier[] = [
  {
    speed: 50,
    label: "Essential Home",
    tagline: "Great for single users, messaging, light streaming & daily browsing.",
    devices: "Up to 4 devices",
    streaming: "Full HD 1080p",
    gaming: "Casual online play",
    downloads: "5GB movie in ~13 mins",
  },
  {
    speed: 100,
    label: "Family & Work",
    tagline: "Ideal for remote work, multiple Zoom calls, and simultaneous 4K TVs.",
    devices: "5 to 10 devices",
    streaming: "Smooth 4K HDR",
    gaming: "Low-latency multiplayer",
    downloads: "5GB movie in ~6 mins",
    badge: "Most Popular",
  },
  {
    speed: 300,
    label: "Pro & Gaming",
    tagline: "For heavy downloaders, smart home automation, and content creators.",
    devices: "10 to 20 devices",
    streaming: "Multiple 4K streams",
    gaming: "Ultra-low jitter & ping",
    downloads: "5GB movie in ~2 mins",
    badge: "High Performance",
  },
  {
    speed: 1000,
    label: "Gigabit Ultra",
    tagline: "True optical gigabit. Zero buffer, enterprise-grade throughput.",
    devices: "30+ smart devices",
    streaming: "Simultaneous 8K / VR",
    gaming: "Esports grade < 10ms",
    downloads: "5GB movie in ~40 secs",
    badge: "Maximum Speed",
  },
];

export function SpeedCalculator() {
  const [selectedIdx, setSelectedIdx] = useState(1);
  const currentTier = TIERS[selectedIdx];

  return (
    <div className="speedCalcShell rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Icon3D name="broadband" size={18} animateFloat={false} />
            <span>Interactive Bandwidth Planner</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#070d1a]">
            What speed does your home need?
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-width-[50ch]">
            Select or drag to find the ideal broadband tier for your household in
            Angadical or Chandanappally.
          </p>
        </div>

        {/* Big Speed Readout */}
        <div className="flex items-baseline gap-2 bg-gradient-to-br from-sky-50 to-blue-50/50 border border-sky-100 rounded-2xl px-6 py-4 self-start md:self-auto">
          <motion.span
            key={currentTier.speed}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl sm:text-5xl font-black text-[#1d4ed8] tracking-tight"
          >
            {currentTier.speed}
          </motion.span>
          <span className="text-lg font-bold text-slate-700">Mbps</span>
        </div>
      </div>

      {/* Speed Slider / Tier Selector Buttons */}
      <div className="py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {TIERS.map((tier, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={tier.speed}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#070d1a] border-[#070d1a] text-white shadow-lg shadow-blue-900/20"
                    : "bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100/80"
                }`}
              >
                {tier.badge && (
                  <span
                    className={`absolute -top-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-[#06b6d4] text-[#070d1a]"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {tier.badge}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black">{tier.speed}</span>
                <span className="text-xs font-semibold opacity-80">Mbps</span>
                <span className="text-[11px] font-medium mt-1 truncate max-w-full">
                  {tier.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Range Slider for granular drag */}
        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          aria-label="Speed tier selector"
          className="w-full accent-[#1d4ed8] cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
      </div>

      {/* Dynamic Tier Specs with Smooth Motion Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTier.speed}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200/80"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-[#070d1a]">
                  {currentTier.label} Plan
                </h4>
                {currentTier.badge && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {currentTier.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-1">{currentTier.tagline}</p>
            </div>
            <Link
              href={`/new-connection?service=BROADBAND&speed=${currentTier.speed}&plan=${encodeURIComponent(
                `${currentTier.label} (${currentTier.speed} Mbps Plan)`
              )}`}
              className="button shrink-0"
              style={{ backgroundColor: "#1d4ed8", color: "#ffffff" }}
            >
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                Request {currentTier.speed} Mbps Plan →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Household Scale
              </span>
              <span className="text-sm font-bold text-[#070d1a]">
                {currentTier.devices}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Video Streaming
              </span>
              <span className="text-sm font-bold text-[#070d1a]">
                {currentTier.streaming}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Online Gaming
              </span>
              <span className="text-sm font-bold text-[#070d1a]">
                {currentTier.gaming}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Est. Download Rate
              </span>
              <span className="text-sm font-bold text-[#1d4ed8]">
                {currentTier.downloads}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
