"use client";

import React from "react";
import Image from "next/image";

interface PartnerItem {
  name: string;
  category: "isp" | "ott" | "broadcast";
  badge?: string;
  logo?: string;
  icon?: string;
}

const PARTNERS: PartnerItem[] = [
  { name: "Asianet Broadband", category: "isp", logo: "/providers/asianet.png", badge: "Core Hub" },
  { name: "Kerala Vision", category: "isp", logo: "/providers/kerala-vision.png", badge: "Core Hub" },
  { name: "BSNL Bharat Fiber", category: "isp", logo: "/providers/bsnl.png" },
  { name: "KFON Optical", category: "isp", logo: "/providers/kfon.svg", badge: "Govt Grid" },
  { name: "Extranet Fiber", category: "isp", logo: "/providers/extranet.svg" },
  { name: "Disney+ Hotstar", category: "ott", icon: "🎬", badge: "OTT Partner" },
  { name: "SonyLIV HD", category: "ott", icon: "🍿", badge: "OTT Partner" },
  { name: "Zee5 Premium", category: "ott", icon: "✨", badge: "OTT Partner" },
  { name: "Star Sports 1 HD", category: "broadcast", icon: "🏏", badge: "Live Cricket" },
  { name: "Sony Sports Ten HD", category: "broadcast", icon: "⚽", badge: "Football" },
  { name: "Asianet HD", category: "broadcast", icon: "📺", badge: "Malayalam" },
  { name: "Flowers TV HD", category: "broadcast", icon: "🌺" },
];

/**
 * Magic UI & Aceternity UI inspired Infinite Marquee.
 * Smooth, hardware-accelerated ticker showcasing network carriers and entertainment partners.
 */
export function InfiniteMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 border-y border-slate-200/70">
      <div className="wrap mb-6 text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#1d4ed8] block">
          Authorized Multi-Carrier Network &amp; Broadcast Hub
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#070d1a] mt-1">
          Supported Optical Providers &amp; Premium Entertainment
        </h3>
      </div>

      {/* Infinite Scrolling Ribbon */}
      <div className="flex w-full overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex shrink-0 items-center gap-4 py-2 animate-marquee hover:[animation-play-state:paused]">
          {PARTNERS.map((partner, i) => (
            <div
              key={`p1-${i}-${partner.name}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#1d4ed8]/50 hover:shadow-md transition-all shrink-0"
            >
              {partner.logo ? (
                <div className="h-7 w-20 relative flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={80}
                    height={28}
                    className="max-h-7 w-auto object-contain"
                  />
                </div>
              ) : (
                <span className="text-xl shrink-0" aria-hidden="true">
                  {partner.icon}
                </span>
              )}
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold text-[#070d1a] whitespace-nowrap">
                  {partner.name}
                </span>
                {partner.badge && (
                  <span className="text-[10px] font-bold text-sky-700 leading-none mt-0.5">
                    {partner.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Duplicated track for seamless infinite loop */}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-4 py-2 animate-marquee hover:[animation-play-state:paused]"
        >
          {PARTNERS.map((partner, i) => (
            <div
              key={`p2-${i}-${partner.name}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#1d4ed8]/50 hover:shadow-md transition-all shrink-0"
            >
              {partner.logo ? (
                <div className="h-7 w-20 relative flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={80}
                    height={28}
                    className="max-h-7 w-auto object-contain"
                  />
                </div>
              ) : (
                <span className="text-xl shrink-0" aria-hidden="true">
                  {partner.icon}
                </span>
              )}
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-extrabold text-[#070d1a] whitespace-nowrap">
                  {partner.name}
                </span>
                {partner.badge && (
                  <span className="text-[10px] font-bold text-sky-700 leading-none mt-0.5">
                    {partner.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
