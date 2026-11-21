"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon3D } from "./Icon3D";

interface ChannelCategory {
  id: string;
  label: string;
  channels: { name: string; hd?: boolean; badge?: string }[];
}

const CATEGORIES: ChannelCategory[] = [
  {
    id: "malayalam",
    label: "Malayalam",
    channels: [
      { name: "Asianet", hd: true, badge: "Popular" },
      { name: "Surya TV", hd: true },
      { name: "Mazhavil Manorama", hd: true },
      { name: "Flowers TV", hd: true },
      { name: "Kairali TV" },
      { name: "Amrita TV" },
      { name: "Media One" },
      { name: "Asianet News", hd: true, badge: "News Leader" },
      { name: "Manorama News", hd: true },
      { name: "Mathrubhumi News", hd: true },
      { name: "Local Angadical Community Feed", badge: "Exclusive" },
    ],
  },
  {
    id: "sports",
    label: "Sports HD",
    channels: [
      { name: "Star Sports 1 HD", hd: true, badge: "Cricket" },
      { name: "Star Sports Select HD", hd: true, badge: "PL / Football" },
      { name: "Sony Sports Ten 1 HD", hd: true },
      { name: "Sony Sports Ten 2 HD", hd: true },
      { name: "Sports18 1 HD", hd: true },
      { name: "EuroSport HD", hd: true },
    ],
  },
  {
    id: "news",
    label: "National & Regional News",
    channels: [
      { name: "NDTV 24x7", hd: true },
      { name: "CNN News18" },
      { name: "India Today", hd: true },
      { name: "BBC World News" },
      { name: "DD National" },
      { name: "Times Now" },
    ],
  },
  {
    id: "movies",
    label: "Movies & Infotainment",
    channels: [
      { name: "Asianet Movies", hd: true },
      { name: "Surya Movies" },
      { name: "Star Gold HD", hd: true },
      { name: "Sony MAX HD", hd: true },
      { name: "Discovery Channel HD", hd: true },
      { name: "National Geographic HD", hd: true },
      { name: "Animal Planet HD", hd: true },
    ],
  },
  {
    id: "kids",
    label: "Kids & Knowledge",
    channels: [
      { name: "Cartoon Network HD", hd: true },
      { name: "Pogo" },
      { name: "Disney Channel", hd: true },
      { name: "Nick HD+", hd: true },
      { name: "Sony YAY!" },
    ],
  },
];

export function TvChannelExplorer() {
  const [activeTab, setActiveTab] = useState("malayalam");
  const currentCategory =
    CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  return (
    <div className="channelExplorerShell rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Icon3D name="cable-tv" size={18} animateFloat={false} />
            <span>Digital HD Cable TV Lineup</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#070d1a]">
            Crystal Clear Cable Broadcasts
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Over 300+ digital channels with local Angadical & Chandanappally community coverage.
          </p>
        </div>

        <Icon3D name="cable-tv" size={64} className="self-start md:self-center" />
      </div>

      {/* Modern Sliding Pill Tabs (Powered by Motion layoutId) */}
      <div className="flex flex-wrap gap-2 pt-6 pb-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                isActive ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 rounded-xl bg-[#070d1a] shadow-md shadow-slate-900/15"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Animated Channels Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4"
        >
          {currentCategory.channels.map((ch) => (
            <div
              key={ch.name}
              className="flex items-center justify-between gap-2 p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-[#1d4ed8]/40 transition-all hover:shadow-xs"
            >
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-[#070d1a]">
                  {ch.name}
                </span>
                {ch.badge && (
                  <span className="text-[10px] font-bold text-sky-600">
                    {ch.badge}
                  </span>
                )}
              </div>
              {ch.hd && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                  HD
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center sm:text-left text-xs text-slate-500">
        Broadcasting over 300+ digital channels with crystal-clear audio and local community announcements.
      </div>
    </div>
  );
}
