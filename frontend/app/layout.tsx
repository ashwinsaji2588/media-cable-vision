import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "./style.css";
import { Brand, Button, ContactLinks, NavLinks } from "./ui";
import { MobileMenu } from "./mobile-menu";
import { FloatingDock } from "./components/FloatingDock";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const url = process.env.SITE_URL;
  return {
    title: {
      default: "Media Cable Vision — Cable TV & Broadband in Angadical",
      template: "%s | Media Cable Vision",
    },
    description:
      "Request cable TV and broadband connections in Angadical and Chandanappally. Contact Media Cable Vision for local service assistance.",
    metadataBase: url ? new URL(url) : undefined,
    icons: { icon: "/logo.svg" },
  };
}

export default async function Layout({ children }: { children: ReactNode }) {
  await connection();
  return (
    <html lang="en-IN">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header>
          <div className="wrap headerRow">
            <Brand />
            <nav className="desktopNav" aria-label="Main navigation">
              <NavLinks />
            </nav>
            <div className="desktopAction">
              <Button href="/new-connection">New Connection</Button>
            </div>
            <MobileMenu>
              <NavLinks />
              <Button href="/new-connection">New Connection</Button>
            </MobileMenu>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer>
          <div className="wrap">
            <div className="footerGrid">
              <div>
                <Brand />
                <p>Local cable TV and broadband assistance.</p>
              </div>
              <div>
                <h2>Services</h2>
                <Link href="/broadband">Broadband</Link>
                <Link href="/cable-tv">Cable TV</Link>
              </div>
              <div>
                <h2>Service areas</h2>
                <Link href="/service-areas">Angadical</Link>
                <Link href="/service-areas">Chandanappally</Link>
              </div>
              <div>
                <h2>Get in touch</h2>
                <Link href="/report-issue">Report an Issue</Link>
                <Link href="/track-request">Track a Request</Link>
                <ContactLinks />
              </div>
            </div>
            <div className="footerEnd">
              <span>© {new Date().getFullYear()} Media Cable Vision</span>
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </footer>
        <FloatingDock />
      </body>
    </html>
  );
}
