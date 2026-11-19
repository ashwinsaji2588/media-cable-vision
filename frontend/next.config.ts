import type { NextConfig } from "next";
export default {
  output: "standalone",
  poweredByHeader: false,
  devIndicators: false,
  agentRules: false,
} satisfies NextConfig;
