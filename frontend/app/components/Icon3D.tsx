import React from "react";

export type Icon3DType =
  | "broadband"
  | "cable-tv"
  | "location"
  | "support"
  | "request"
  | "phone"
  | "calendar"
  | "track";

interface Icon3DProps {
  name: Icon3DType;
  size?: number;
  className?: string;
  animateFloat?: boolean;
}

/**
 * 3D Icon suite inspired by 3dicons.co design system.
 * Built with rich layered gradients, ambient depth occlusion, specular highlights,
 * and tactile clay/glass morphism.
 */
export function Icon3D({
  name,
  size = 64,
  className = "",
  animateFloat = true,
}: Icon3DProps) {
  const floatStyle = animateFloat
    ? {
        animation: "float3d 4s ease-in-out infinite",
        filter: "drop-shadow(0 14px 20px rgba(11, 37, 69, 0.18))",
      }
    : {
        filter: "drop-shadow(0 8px 14px rgba(11, 37, 69, 0.12))",
      };

  return (
    <div
      className={`icon3d-wrapper inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, ...floatStyle }}
      aria-hidden="true"
    >
      {renderIcon(name, size)}
    </div>
  );
}

function renderIcon(name: Icon3DType, s: number) {
  switch (name) {
    case "broadband":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bb-chassis" x1="16" y1="52" x2="80" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.5" stopColor="#1D4ED8" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="bb-top" x1="18" y1="48" x2="78" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="0.6" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="bb-ant" x1="28" y1="14" x2="36" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="bb-wave1" x1="32" y1="12" x2="64" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
            <filter id="bb-glow" x="20" y="4" width="56" height="40" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wi-Fi Waves */}
          <g filter="url(#bb-glow)">
            <path
              d="M34 26C42 20 54 20 62 26"
              stroke="url(#bb-wave1)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M26 18C39 8 57 8 70 18"
              stroke="url(#bb-wave1)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
          </g>

          {/* Antennas */}
          <path
            d="M30 48L32 20C32 17.8 33.8 16 36 16C38.2 16 40 17.8 40 20L38 48"
            fill="url(#bb-ant)"
          />
          <path
            d="M58 48L56 20C56 17.8 57.8 16 60 16C62.2 16 64 17.8 64 20L66 48"
            fill="url(#bb-ant)"
          />

          {/* Router Base / 3D Bevel */}
          <rect x="14" y="56" width="68" height="26" rx="8" fill="url(#bb-chassis)" />
          {/* Router Top Face */}
          <rect x="14" y="48" width="68" height="18" rx="7" fill="url(#bb-top)" />

          {/* High-gloss edge highlight */}
          <path
            d="M18 50C22 50 74 50 78 50"
            stroke="#BAE6FD"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Front Panel Indicator Lights */}
          <circle cx="28" cy="69" r="3.2" fill="#4ADE80" />
          <circle cx="38" cy="69" r="3.2" fill="#38BDF8" />
          <circle cx="48" cy="69" r="3.2" fill="#38BDF8" />
          <circle cx="58" cy="69" r="3.2" fill="#FBBF24" />
        </svg>
      );

    case "cable-tv":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="tv-frame" x1="12" y1="18" x2="84" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#334155" />
              <stop offset="0.6" stopColor="#1E293B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="tv-screen" x1="20" y1="24" x2="76" y2="62" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E3A8A" />
              <stop offset="0.4" stopColor="#2563EB" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="tv-stand" x1="38" y1="68" x2="58" y2="84" gradientUnits="userSpaceOnUse">
              <stop stopColor="#94A3B8" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
          </defs>

          {/* 3D TV Frame */}
          <rect x="12" y="16" width="72" height="52" rx="10" fill="url(#tv-frame)" />
          {/* Inner Screen */}
          <rect x="17" y="21" width="62" height="42" rx="6" fill="url(#tv-screen)" />

          {/* Test Pattern / Vibrant TV Spectrum Bars */}
          <g opacity="0.9">
            <rect x="22" y="27" width="9" height="30" rx="3" fill="#F43F5E" />
            <rect x="33" y="27" width="9" height="30" rx="3" fill="#F59E0B" />
            <rect x="44" y="27" width="9" height="30" rx="3" fill="#10B981" />
            <rect x="55" y="27" width="9" height="30" rx="3" fill="#06B6D4" />
            <rect x="66" y="27" width="8" height="30" rx="3" fill="#A855F7" />
          </g>

          {/* Glass Gloss Sheen */}
          <path
            d="M17 21L45 21L25 63L17 63L17 21Z"
            fill="white"
            fillOpacity="0.18"
          />

          {/* Stand Neck & Base */}
          <rect x="44" y="68" width="8" height="9" fill="url(#tv-stand)" />
          <ellipse cx="48" cy="80" rx="20" ry="5" fill="url(#tv-stand)" />
        </svg>
      );

    case "location":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="loc-pin" x1="28" y1="12" x2="68" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="0.6" stopColor="#E11D48" />
              <stop offset="1" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="loc-inner" x1="38" y1="26" x2="58" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE4E6" />
              <stop offset="1" stopColor="#FDA4AF" />
            </linearGradient>
            <linearGradient id="loc-pulse" x1="24" y1="76" x2="72" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="1" stopColor="#1D4ED8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Ground Radar Ripples */}
          <ellipse cx="48" cy="80" rx="28" ry="8" fill="url(#loc-pulse)" />
          <ellipse cx="48" cy="80" rx="16" ry="4.5" fill="#38BDF8" fillOpacity="0.45" />

          {/* 3D Pin Head */}
          <path
            d="M48 74C48 74 24 50 24 34C24 20.7 34.7 10 48 10C61.3 10 72 20.7 72 34C72 50 48 74 48 74Z"
            fill="url(#loc-pin)"
          />
          {/* Inner Core */}
          <circle cx="48" cy="34" r="12" fill="url(#loc-inner)" />
          <circle cx="48" cy="34" r="6" fill="#BE123C" />

          {/* Specular Highlight */}
          <ellipse cx="40" cy="22" rx="6" ry="3.5" transform="rotate(-30 40 22)" fill="white" fillOpacity="0.6" />
        </svg>
      );

    case "support":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sup-band" x1="20" y1="12" x2="76" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="sup-ear" x1="14" y1="36" x2="30" y2="68" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>

          {/* Headband */}
          <path
            d="M24 46C24 26 34.7 14 48 14C61.3 14 72 26 72 46"
            stroke="url(#sup-band)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Left Earpad */}
          <rect x="16" y="42" width="14" height="24" rx="7" fill="url(#sup-ear)" />
          {/* Right Earpad */}
          <rect x="66" y="42" width="14" height="24" rx="7" fill="url(#sup-ear)" />

          {/* Microphone Arm */}
          <path
            d="M26 62C26 74 38 82 52 80"
            stroke="#94A3B8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Mic Capsule */}
          <rect x="52" y="75" width="12" height="9" rx="4.5" fill="#38BDF8" />
          <circle cx="58" cy="79.5" r="2" fill="#4ADE80" />
        </svg>
      );

    case "request":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="req-paper" x1="22" y1="14" x2="74" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#F1F5F9" />
              <stop offset="1" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="req-badge" x1="52" y1="52" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22C55E" />
              <stop offset="1" stopColor="#15803D" />
            </linearGradient>
          </defs>

          {/* Paper Sheet */}
          <rect x="22" y="14" width="52" height="66" rx="8" fill="url(#req-paper)" />
          {/* Lines */}
          <rect x="30" y="26" width="28" height="4" rx="2" fill="#94A3B8" />
          <rect x="30" y="36" width="36" height="4" rx="2" fill="#CBD5E1" />
          <rect x="30" y="46" width="26" height="4" rx="2" fill="#CBD5E1" />

          {/* 3D Check Badge */}
          <circle cx="66" cy="66" r="16" fill="url(#req-badge)" />
          <path
            d="M59 66L64 71L74 61"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "phone":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ph-body" x1="24" y1="18" x2="72" y2="78" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="36" fill="#DBEAFE" />
          <path
            d="M37 28C35.3 28 33.7 28.7 32.5 29.9L28.9 33.5C26.5 35.9 25.5 39.4 26.6 42.6C30.2 53.6 38.4 61.8 49.4 65.4C52.6 66.5 56.1 65.5 58.5 63.1L62.1 59.5C64.5 57.1 64.5 53.3 62.1 50.9L57.2 46C54.8 43.6 51 43.6 48.6 46L46.8 47.8C42.8 45.4 39.6 42.2 37.2 38.2L39 36.4C41.4 34 41.4 30.2 39 27.8L37 28Z"
            fill="url(#ph-body)"
          />
          {/* Waves */}
          <path d="M60 28C66 34 66 42 60 48" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 20C78 30 78 48 68 58" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case "calendar":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cal-header" x1="18" y1="20" x2="78" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284C7" />
              <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="cal-body" x1="18" y1="40" x2="78" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#F1F5F9" />
            </linearGradient>
          </defs>
          <rect x="18" y="24" width="60" height="58" rx="10" fill="url(#cal-body)" />
          <path d="M18 34C18 28.5 22.5 24 28 24H68C73.5 24 78 28.5 78 34V40H18V34Z" fill="url(#cal-header)" />
          <rect x="30" y="16" width="6" height="14" rx="3" fill="#38BDF8" />
          <rect x="60" y="16" width="6" height="14" rx="3" fill="#38BDF8" />
          {/* Dates grid dots */}
          <circle cx="32" cy="52" r="3" fill="#94A3B8" />
          <circle cx="48" cy="52" r="3" fill="#94A3B8" />
          <circle cx="64" cy="52" r="3" fill="#94A3B8" />
          <circle cx="32" cy="66" r="3" fill="#94A3B8" />
          <circle cx="48" cy="66" r="4.5" fill="#0284C7" />
          <circle cx="64" cy="66" r="3" fill="#94A3B8" />
        </svg>
      );

    case "track":
      return (
        <svg
          width={s}
          height={s}
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="trk-glass" x1="20" y1="20" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="1" stopColor="#0284C7" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="trk-rim" x1="16" y1="16" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#1E40AF" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="42" r="26" stroke="url(#trk-rim)" strokeWidth="7" fill="url(#trk-glass)" />
          <rect
            x="58"
            y="54"
            width="12"
            height="28"
            rx="6"
            transform="rotate(-45 58 54)"
            fill="#1E293B"
          />
          <path
            d="M32 36C34 32 38 30 44 30"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
