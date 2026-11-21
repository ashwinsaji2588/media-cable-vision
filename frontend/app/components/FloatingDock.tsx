"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { businessPhone } from "../site";

/**
 * Modern floating glassmorphic dock pinned to bottom viewport.
 * Provides instant access to New Connection, Track, and Contact.
 */
export function FloatingDock() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Hide dock when near the very bottom footer to avoid overlapping form buttons
      if (currentY + winHeight > docHeight - 220) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-5 inset-x-0 mx-auto w-fit max-w-[calc(100%-32px)] z-40 select-none"
          aria-label="Floating quick actions"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#070d1a]/90 backdrop-blur-xl border border-sky-400/30 shadow-2xl shadow-black/40 text-white text-xs sm:text-sm font-semibold">
            {/* Quick Connection */}
            <Link
              href="/new-connection"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#1d4ed8", color: "#ffffff" }}
            >
              <span className="text-sm">⚡</span>
              <span style={{ color: "#ffffff" }}>New Connection</span>
            </Link>

            {/* Track Ticket */}
            <Link
              href="/track-request"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#e2e8f0" }}
            >
              <span>🔍</span>
              <span className="hidden sm:inline" style={{ color: "#e2e8f0" }}>Track</span>
            </Link>

            <span className="h-4 w-px bg-slate-700/80 mx-0.5" />

            {/* Report Issue */}
            <Link
              href="/report-issue"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all hover:bg-white/10"
              style={{ color: "#e2e8f0" }}
            >
              <span>🛠️</span>
              <span className="hidden sm:inline" style={{ color: "#e2e8f0" }}>Report</span>
            </Link>

            {/* Direct Call Tech */}
            <a
              href={`tel:${businessPhone()}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all hover:bg-emerald-950/40"
              style={{ color: "#6ee7b7" }}
              title="Call Local Operator"
            >
              <span>📞</span>
              <span className="hidden md:inline" style={{ color: "#6ee7b7" }}>Call Tech</span>
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
