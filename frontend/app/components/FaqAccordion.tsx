"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How fast can you set up a connection in Angadical or Chandanappally?",
    answer:
      "Most residential connections are activated within 24 to 48 hours of booking. Our field technicians are based locally in the area, ensuring rapid on-site fiber laying, router configuration, and live speed testing.",
  },
  {
    question: "Which provider (Asianet, Kerala Vision, BSNL) is best for my house?",
    answer:
      "Because fiber lines from Asianet, Kerala Vision, and BSNL run through different junctions, our team checks the nearest distribution point (DP box) to your exact address. We'll recommend the network with the highest signal strength, shortest optical path, and lowest latency for your location.",
  },
  {
    question: "How resilient is the fiber line during monsoon season and heavy rains?",
    answer:
      "We utilize heavy-duty, UV-stabilized armored aerial fiber cables engineered for Kerala weather conditions. In the rare event of a tree branch strike or pole issue, our local response team is dispatched immediately to splice and restore service.",
  },
  {
    question: "Can I bundle Digital Cable TV and High-Speed Broadband together?",
    answer:
      "Yes! We offer unified installations providing crystal-clear HD Digital Cable TV alongside high-speed Wi-Fi broadband over optical fiber, simplifying your wiring and billing into one local point of contact.",
  },
  {
    question: "How does the request and tracking system work without an account?",
    answer:
      "When you submit a request, you immediately receive a unique reference code like MCV-100001. You can track your request status at any time simply using your mobile number without needing passwords or logins.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="faqShell max-w-3xl mx-auto divide-y divide-slate-200/80 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="transition-colors">
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <span className="text-base sm:text-lg font-bold text-[#070d1a]">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600 shrink-0 text-sm font-bold"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100/60 pt-2">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
