import Image from "next/image";
import Link from "next/link";
import { areas, businessPhone, maps, services } from "./site";
import { Button, ContactLinks } from "./ui";
import { HeroThreeCanvas } from "./components/HeroThreeCanvas";
import { Icon3D } from "./components/Icon3D";
import {
  HeroReveal,
  LivePulsePill,
  ScrollReveal,
  Tilt3DCard,
} from "./components/MotionWrappers";
import { FiberTrailAnime } from "./components/FiberTrailAnime";
import { LiveMetricStats } from "./components/LiveMetricStats";
import { ProviderPlans } from "./components/ProviderPlans";
import { SpeedCalculator } from "./components/SpeedCalculator";
import { TvChannelExplorer } from "./components/TvChannelExplorer";
import { CoverageChecker } from "./components/CoverageChecker";
import { FaqAccordion } from "./components/FaqAccordion";
import { InstallationTimeline } from "./components/InstallationTimeline";
import { InfiniteMarquee } from "./components/InfiniteMarquee";
import { CustomerTrustBento } from "./components/CustomerTrustBento";
import { PreFooterCta } from "./components/PreFooterCta";

export function generateMetadata() {
  return process.env.SITE_URL ? { alternates: { canonical: "/" } } : {};
}

export default function Home() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Media Cable Vision",
    url: process.env.SITE_URL,
    telephone: businessPhone(),
    hasMap: maps,
    areaServed: areas,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero Section with Three.js 3D Interactive Canvas & Motion Stagger */}
      <section className="hero">
        <HeroThreeCanvas />
        <div className="wrap heroGrid">
          <HeroReveal>
            <LivePulsePill text="Fiber Broadband & Cable Network Active" />
            <h1>
              Broadband and Cable TV, <span>close to home.</span>
            </h1>
            <p className="heroLead">
              Serving Angadical and Chandanappally. We’ll help you check what’s
              available at your address and arrange a connection.
            </p>
            <div className="actions heroActions">
              <Button href="/new-connection">Request a connection</Button>
              <div className="heroSupportLinks">
                <Link href="/report-issue">Report an issue</Link>
                <Link href="/track-request">Track a request</Link>
              </div>
            </div>
          </HeroReveal>

          <div className="heroImageFrame">
            <div className="floatingHeroBadge floatingHeroBadge--top">
              <Icon3D name="broadband" size={26} animateFloat={false} />
              <span>Gigabit Fiber</span>
            </div>
            <div className="heroImageWrapper">
              <Image
                className="heroImage"
                src="/connected-home.jpg"
                alt="A living room with a television and Wi-Fi router"
                width={1536}
                height={1024}
                sizes="(max-width: 760px) 100vw, 55vw"
                priority
              />
            </div>
            <div className="floatingHeroBadge floatingHeroBadge--bottom">
              <Icon3D name="cable-tv" size={26} animateFloat={false} />
              <span>Crystal HD Cable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Anime.js Kinetic Metrics & Credibility Bar */}
      <LiveMetricStats />

      {/* Services with 3D Tilt Cards & 3dicons */}
      <section className="wrap section">
        <ScrollReveal>
          <h2>Find the right service for your home</h2>
        </ScrollReveal>
        <div className="serviceGrid">
          {Object.entries(services).map(([slug, service], index) => {
            const isBroadband = slug === "broadband";
            return (
              <ScrollReveal key={slug} delay={index * 0.15}>
                <Tilt3DCard className={`serviceCard serviceCard--${slug} h-full`}>
                  <div className="serviceCardHeader">
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.summary}</p>
                    </div>
                    <Icon3D
                      name={isBroadband ? "broadband" : "cable-tv"}
                      size={60}
                      className="shrink-0"
                    />
                  </div>
                  <Link className="textLink" href={`/${slug}`}>
                    {isBroadband
                      ? "Explore home broadband →"
                      : "Explore Cable TV options →"}
                  </Link>
                </Tilt3DCard>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Customer Trust Bento Grid (Linear & Aceternity UI inspired) */}
      <CustomerTrustBento />

      {/* Authorized Providers & Entertainment Infinite Marquee */}
      <InfiniteMarquee />

      {/* Compare Provider Plans (Asianet, Kerala Vision, BSNL) */}
      <section className="wrap section">
        <ScrollReveal>
          <ProviderPlans />
        </ScrollReveal>
      </section>

      {/* Interactive Bandwidth & Speed Calculator */}
      <section className="wrap section">
        <ScrollReveal>
          <SpeedCalculator />
        </ScrollReveal>
      </section>

      {/* Interactive Digital Cable TV Channel Explorer */}
      <section className="wrap section">
        <ScrollReveal>
          <TvChannelExplorer />
        </ScrollReveal>
      </section>

      {/* Instant Ward / Landmark Coverage Checker */}
      {/* Interactive PIN Code & Coverage Checker */}
      <section className="wrap section" id="coverage">
        <ScrollReveal>
          <CoverageChecker />
        </ScrollReveal>
      </section>

      {/* How it Works with daisyUI Connected Timeline & OriginKit Motion */}
      <section className="wrap section">
        <ScrollReveal>
          <h2>How installation works</h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            From online feasibility check to active fiber optic drop at your premises.
          </p>
        </ScrollReveal>

        <InstallationTimeline />
      </section>

      {/* Coverage Panel with 3D Location Pin */}
      <section className="wrap homePanel">
        <ScrollReveal>
          <div className="coverage panelGridWith3D">
            <div>
              <p className="eyebrow">Service areas</p>
              <h2>Angadical &amp; Chandanappally</h2>
              <p>
                Check availability at your address or ask about a nearby locality.
              </p>
              <a className="textLink" href={maps}>
                Google Maps directions →
              </a>
              <div className="mt-4">
                <Button href="/service-areas" secondary>
                  View Service Areas
                </Button>
              </div>
            </div>
            <Icon3D name="location" size={80} className="shrink-0" />
          </div>
        </ScrollReveal>
      </section>

      {/* Support Panel with 3D Support Headset */}
      <section className="wrap homePanel">
        <ScrollReveal>
          <div className="support panelGridWith3D">
            <div>
              <p className="eyebrow">Need assistance?</p>
              <h2>Experiencing a connection issue?</h2>
              <p>Share your service details and we’ll follow up by phone.</p>
              <div className="contactInline mt-3">
                <ContactLinks directions={false} />
              </div>
              <div className="mt-5">
                <Button href="/report-issue">Report an Issue</Button>
              </div>
            </div>
            <Icon3D name="support" size={84} className="shrink-0" />
          </div>
        </ScrollReveal>
      </section>

      {/* High-Converting Pre-Footer CTA */}
      <PreFooterCta />

      {/* Frequently Asked Questions with Spring Accordion */}
      <section className="wrap section">
        <ScrollReveal>
          <div className="text-center max-w-xl mx-auto mb-8">
            <p className="eyebrow">Clear Answers</p>
            <h2>Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm mt-1">
              Everything you need to know about connections, providers, and support.
            </p>
          </div>
          <FaqAccordion />
        </ScrollReveal>
      </section>
    </>
  );
}
