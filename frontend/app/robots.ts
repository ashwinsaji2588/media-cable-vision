import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL;
  return site
    ? {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: new URL("/sitemap.xml", site).href,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
