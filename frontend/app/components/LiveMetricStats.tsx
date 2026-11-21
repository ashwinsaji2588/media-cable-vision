"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

interface StatItem {
  target: number;
  unit: string;
  label: string;
  decimals?: number;
}

const STATS: StatItem[] = [
  { target: 1000, unit: "Mbps", label: "Gigabit-Ready Fiber" },
  { target: 99.9, unit: "%", label: "Network Uptime Target", decimals: 1 },
  { target: 2, unit: "Hours", label: "Average Local Callback" },
  { target: 2, unit: "Towns", label: "Angadical & Chandanappally" },
];

/**
 * Animated metric counters powered by Anime.js.
 * Animates numerical values with smooth easing when scrolled into view.
 */
export function LiveMetricStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || animated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);

          STATS.forEach((stat, index) => {
            const targetEl = statRefs.current[index];
            if (!targetEl) return;

            const counterObj = { value: 0 };
            animate(counterObj, {
              value: stat.target,
              duration: 1800 + index * 200,
              ease: "outExpo",
              onRender: () => {
                if (targetEl) {
                  targetEl.textContent = stat.decimals
                    ? counterObj.value.toFixed(stat.decimals)
                    : Math.round(counterObj.value).toString();
                }
              },
            });
          });
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={containerRef}
      className="metricStatsBar wrap grid grid-cols-2 md:grid-cols-4 gap-4 py-8 my-6 border-y border-slate-200/80 bg-gradient-to-r from-sky-50/50 via-white to-sky-50/50 rounded-2xl shadow-xs"
    >
      {STATS.map((stat, i) => (
        <div key={stat.label} className="flex flex-col items-center text-center p-3">
          <div className="flex items-baseline gap-1 text-3xl lg:text-4xl font-extrabold text-[#0b2545] tracking-tight">
            <span
              ref={(el) => {
                statRefs.current[i] = el;
              }}
            >
              0
            </span>
            <span className="text-xl text-[#1769aa] font-bold">{stat.unit}</span>
          </div>
          <p className="text-xs lg:text-sm font-medium text-slate-500 mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
