"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  PROVIDER_PLANS,
  LAST_SYNCED,
  PlanCategory,
  ProviderName,
  Plan,
} from "../plans-data";
import { Icon3D } from "./Icon3D";

export function ProviderPlans() {
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredPlans = PROVIDER_PLANS.filter((plan) => {
    const matchesProvider =
      selectedProvider === "ALL" || plan.provider === selectedProvider;
    const matchesCategory =
      selectedCategory === "ALL" || plan.category === selectedCategory;
    return matchesProvider && matchesCategory;
  });

  return (
    <div className="providerPlansSection">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Icon3D name="request" size={16} animateFloat={false} />
            <span>Weekly Verified Tariffs • Auto-Synced</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#070d1a] tracking-tight">
            Compare Available Plans by Provider
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-[60ch]">
            Official tariffs for Asianet, Kerala Vision, and BSNL in Angadical &amp;
            Chandanappally. Transparent local pricing with no hidden equipment fees.
          </p>
        </div>

        {/* Quick Filter: Service Category */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 self-start md:self-auto">
          {[
            { id: "ALL", label: "All Plans" },
            { id: "broadband", label: "Broadband" },
            { id: "cable-tv", label: "Cable TV" },
            { id: "combo", label: "Combos" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-white text-[#070d1a] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Provider Tabs with Animated Motion Pill */}
      <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-200">
        {[
          { id: "ALL", label: "All Networks" },
          { id: "Asianet", label: "Asianet" },
          { id: "Kerala Vision", label: "Kerala Vision" },
          { id: "KFON", label: "KFON" },
          { id: "Extranet", label: "Extranet" },
          { id: "BSNL", label: "BSNL" },
        ].map((prov) => {
          const isActive = selectedProvider === prov.id;
          return (
            <button
              key={prov.id}
              type="button"
              onClick={() => setSelectedProvider(prov.id)}
              className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="providerTab"
                  className="absolute inset-0 rounded-xl bg-[#070d1a] shadow-md shadow-slate-950/20"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{prov.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Plans */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        <AnimatePresence>
          {filteredPlans.map((plan) => {
            const isBroadband = plan.category === "broadband";
            const isCombo = plan.category === "combo";

            return (
              <motion.article
                layout
                key={plan.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular
                    ? "bg-gradient-to-b from-blue-50/50 via-white to-white border-[#1d4ed8] shadow-lg shadow-blue-500/10 ring-2 ring-[#1d4ed8]/20"
                    : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                {/* Popular / Special Badge */}
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-6 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs ${
                      plan.popular
                        ? "bg-[#1d4ed8] text-white"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div>
                  {/* Provider Header with Logo */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 mt-1">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={plan.providerLogo}
                        alt={plan.provider}
                        width={64}
                        height={28}
                        className="h-7 w-auto object-contain"
                      />
                      <span className="text-xs font-bold text-slate-500">
                        {plan.provider}
                      </span>
                    </div>

                    <Icon3D
                      name={
                        isBroadband ? "broadband" : isCombo ? "request" : "cable-tv"
                      }
                      size={36}
                      animateFloat={false}
                    />
                  </div>

                  {/* Plan Name & Main Specs */}
                  <div className="pt-4">
                    <h3 className="text-xl font-extrabold text-[#070d1a] leading-snug">
                      {plan.name}
                    </h3>

                    {/* Speed or Channels Highlight */}
                    {plan.speed && (
                      <div className="flex items-baseline gap-1 text-2xl sm:text-3xl font-black text-[#1d4ed8] mt-2">
                        <span>{plan.speed}</span>
                        {plan.data && (
                          <span className="text-xs font-semibold text-slate-500 ml-2">
                            • {plan.data}
                          </span>
                        )}
                      </div>
                    )}
                    {plan.channels && (
                      <div className="text-lg font-black text-indigo-700 mt-2">
                        📺 {plan.channels}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1 mt-3 pb-4 border-b border-slate-100">
                      <span className="text-3xl font-black text-[#070d1a]">
                        ₹{plan.price}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        / month (+ GST)
                      </span>
                    </div>

                    {/* OTT Apps if included */}
                    {plan.ottApps && plan.ottApps.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-sky-50/70 border border-sky-100">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-sky-800 mb-1.5">
                          🎁 OTT Included
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.ottApps.map((ott) => (
                            <span
                              key={ott}
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-sky-200 text-slate-700"
                            >
                              {ott}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feature list */}
                    <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-slate-600">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold shrink-0">
                            ✓
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="mt-7 pt-4 border-t border-slate-100">
                  <Link
                    href={`/new-connection?service=${plan.serviceCode}&plan=${encodeURIComponent(
                      `${plan.provider} - ${plan.name} (₹${plan.price}/mo)`
                    )}`}
                    className="w-full button shrink-0"
                    style={{
                      backgroundColor: plan.popular ? "#1d4ed8" : "#070d1a",
                      color: "#ffffff",
                      border: plan.popular
                        ? "1px solid #1d4ed8"
                        : "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <span style={{ color: "#ffffff", fontWeight: 700 }}>
                      Request This Plan →
                    </span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Helpful Guarantee Note */}
      <div className="mt-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-2xl mx-auto text-xs sm:text-sm text-slate-600">
        <span className="font-bold text-[#070d1a]">
          Not sure which provider has the best wire near your home?
        </span>{" "}
        Our technicians check the nearest distribution box for both Asianet and
        Kerala Vision at your address and confirm exact speeds before activation.
      </div>
    </div>
  );
}
