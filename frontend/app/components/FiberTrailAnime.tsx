"use client";

import React, { useEffect, useRef } from "react";
import { animate } from "animejs";

/**
 * Animated SVG fiber-optic connection trail powered by Anime.js.
 * Connects the 3 process cards (Step 1 -> 2 -> 3) with an illuminated pulse.
 */
export function FiberTrailAnime() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const pulse = pulseRef.current;
    if (!path || !pulse) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    // Loop animation using Anime.js
    const lineAnim = animate(path, {
      strokeDashoffset: [pathLength, 0],
      duration: 2400,
      ease: "inOutSine",
      loop: true,
      alternate: true,
      onRender: (anim) => {
        // Move the pulse packet along the fiber path
        const progress = anim.progress;
        const currentLength = (progress || 0) * pathLength;
        const point = path.getPointAtLength(Math.max(0, Math.min(pathLength, currentLength)));
        if (pulse) {
          pulse.setAttribute("cx", `${point.x}`);
          pulse.setAttribute("cy", `${point.y}`);
        }
      },
    });

    return () => {
      lineAnim.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden md:block w-full overflow-visible my-3 select-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-8 overflow-visible"
        viewBox="0 0 900 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fiberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
          </linearGradient>
          <filter id="fiberGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient guide line */}
        <path
          d="M 50,16 C 250,16 350,16 450,16 C 550,16 650,16 850,16"
          stroke="#E2E8F0"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        {/* Dynamic illuminated fiber line */}
        <path
          ref={pathRef}
          d="M 50,16 C 250,16 350,16 450,16 C 550,16 650,16 850,16"
          stroke="url(#fiberGrad)"
          strokeWidth="3.5"
          filter="url(#fiberGlow)"
        />

        {/* Glowing data packet dot traveling along the fiber */}
        <circle
          ref={pulseRef}
          cx="50"
          cy="16"
          r="5"
          fill="#38BDF8"
          filter="url(#fiberGlow)"
        />
      </svg>
    </div>
  );
}
