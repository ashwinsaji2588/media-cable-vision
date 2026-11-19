import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.SITE_URL;
  if (!site) return [];
  return [
    "/",
    "/broadband",
    "/cable-tv",
    "/service-areas",
    "/contact",
    "/new-connection",
    "/report-issue",
    "/privacy",
  ].map((path) => ({ url: new URL(path, site).href }));
}
