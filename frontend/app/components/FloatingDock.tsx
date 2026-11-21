"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { businessPhone } from "../site";

interface DockItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: string;
}

const DOCK_ITEMS: DockItem[] = [
  {
    href: "/",
    label: "Home",
    shortLabel: "Home",
    icon: "🏠",
  },
  {
    href: "/new-connection",
    label: "New Connection",
    shortLabel: "Connection",
    icon: "⚡",
  },
  {
    href: "/report-issue",
    label: "Report Issue",
    shortLabel: "Report",
    icon: "🛠️",
  },
  {
    href: "/track-request",
    label: "Track Request",
    shortLabel: "Track",
    icon: "🔍",
  },
  {
    href: "/plans",
    label: "Browse Plans",
    shortLabel: "Plans",
    icon: "📡",
  },
];

/**
 * Modern floating glassmorphic dock pinned to bottom viewport.
 * Dynamically highlights whichever page the user is currently visiting.
 */
export function FloatingDock() {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let lastY = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Only auto-hide when deep inside footer on tall scrollable pages
      if (docHeight > winHeight + 350 && currentY + winHeight > docHeight - 140) {
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
          className="fixed bottom-4 sm:bottom-5 inset-x-0 mx-auto w-fit max-w-[calc(100%-20px)] z-50 select-none"
          aria-label="Quick site navigation"
        >
          <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-full bg-[#070d1a]/95 backdrop-blur-xl border border-sky-400/25 shadow-2xl shadow-black/50 text-white text-xs sm:text-sm font-semibold">
            {DOCK_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-full transition-all duration-200 min-h-[40px] ${
                    isActive
                      ? "shadow-sm active:scale-95 ring-1 ring-sky-300/40"
                      : "hover:bg-white/10 active:scale-95"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: "#1d4ed8", color: "#ffffff" }
                      : { color: "#cbd5e1" }
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-sm shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span
                    className={`${
                      isActive ? "inline" : "hidden sm:inline"
                    } text-xs sm:text-sm whitespace-nowrap`}
                    style={
                      isActive
                        ? { color: "#ffffff", fontWeight: 700 }
                        : { color: "inherit" }
                    }
                  >
                    {item.shortLabel}
                  </span>
                </Link>
              );
            })}

            <span className="h-5 w-px bg-slate-700/80 mx-0.5 shrink-0" aria-hidden="true" />

            {/* Direct Call Operator Quick Action */}
            <a
              href={`tel:${businessPhone()}`}
              className="flex items-center justify-center gap-1 px-2.5 py-2 sm:px-3 sm:py-2 rounded-full transition-all hover:bg-emerald-950/40 min-h-[40px]"
              style={{ color: "#6ee7b7" }}
              title="Call Local Operator"
              aria-label="Call Local Operator"
            >
              <span className="text-sm shrink-0" aria-hidden="true">
                📞
              </span>
              <span className="hidden md:inline text-xs font-bold" style={{ color: "#6ee7b7" }}>
                Call
              </span>
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
