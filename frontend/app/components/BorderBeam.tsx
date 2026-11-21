"use client";

import React from "react";
import Link from "next/link";

interface BorderBeamProps {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

/**
 * OriginKit-inspired animated Border Beam.
 * Generates an electric beam of light tracing the perimeter of any button or card.
 */
export function BorderBeam({
  className = "",
  duration = 3.5,
  colorFrom = "#38bdf8",
  colorTo = "#1d4ed8",
}: BorderBeamProps) {
  return (
    <div className={`pointer-events-none absolute -inset-[1.5px] rounded-[inherit] overflow-hidden -z-0 ${className}`}>
      <div
        className="absolute inset-[-200%] animate-[spin_4s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 310deg, ${colorFrom} 335deg, ${colorTo} 360deg)`,
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
}

/**
 * Premium CTA button featuring an animated OriginKit border beam.
 */
export function ShimmerButton({
  href,
  children,
  className = "",
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      className={`relative inline-flex items-center justify-center p-[1.5px] overflow-hidden rounded-xl font-bold transition-all duration-200 active:scale-95 hover:scale-[1.02] shadow-lg shadow-blue-600/25 group ${className}`}
    >
      <BorderBeam duration={3} colorFrom="#38bdf8" colorTo="#2563eb" />
      <span
        className="relative z-10 px-6 py-3 rounded-[10.5px] bg-[#070d1a] group-hover:bg-[#0c1830] text-white flex items-center justify-center gap-2 transition-colors w-full h-full font-bold"
        style={{ color: "#ffffff", ...style }}
      >
        {children}
      </span>
    </Link>
  );
}
