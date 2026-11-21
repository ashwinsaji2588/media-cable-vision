"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderColor?: string;
}

/**
 * OriginKit-inspired Spotlight Card.
 * Tracks mouse position and renders a subtle radial illumination sheen
 * and glowing border sheen right under the cursor.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(56, 189, 248, 0.08)",
  borderColor = "rgba(56, 189, 248, 0.45)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      {/* Ambient Radial Spotlight Sheen */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 -z-0"
        style={{
          opacity,
          background: `radial-gradient(380px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Radial Border Glow Accent */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-opacity duration-300 -z-0"
        style={{
          opacity,
          background: `radial-gradient(220px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 80%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1.5px",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
