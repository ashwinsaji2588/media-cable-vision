import Image from "next/image";
import Link from "next/link";
import { areas, businessPhone, maps, providers, services } from "./site";
import { Button, ContactLinks } from "./ui";

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
      <section className="hero">
        <div className="wrap heroGrid">
          <div>
            <p className="eyebrow locality">
              Serving Angadical &amp; Chandanappally
            </p>
            <h1>
              Reliable connections.
              <br />
              <span>Local support.</span>
            </h1>
            <p className="heroLead">
              Cable TV and broadband for your home in Angadical and
              Chandanappally. Get help setting up a connection or with a service
              you already use.
            </p>
            <div className="actions">
              <Button href="/new-connection">Get Connected</Button>
              <Button href="/report-issue" secondary>
                Report an Issue
              </Button>
            </div>
          </div>
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
      </section>
      <section className="wrap section">
        <p className="eyebrow">Our services</p>
        <h2>Stay connected at home</h2>
        <div className="serviceGrid">
          {Object.entries(services).map(([slug, service]) => (
            <Link className="card serviceCard" key={slug} href={`/${slug}`}>
              <span className="iconTile" aria-hidden="true">
                {service.icon}
              </span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <span className="textLink">Explore {service.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="providerBand">
        <div className="wrap providerRow">
          <div>
            <h2>Supported providers</h2>
            <p>Availability depends on your address and service.</p>
          </div>
          <ul>
            {providers.map(({ name, logo }) => (
              <li key={name}>
                <Image src={logo} alt="" width={86} height={40} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="wrap section">
        <h2>How it works</h2>
        <ol className="steps">
          {[
            [
              "Send a request",
              "Choose a service and share your contact and locality details.",
            ],
            [
              "Hear from our team",
              "We’ll call to confirm availability or learn more about your issue.",
            ],
            [
              "Arrange a visit",
              "We’ll work with you to arrange a connection or service visit when needed.",
            ],
          ].map(([title, detail], i) => (
            <li className="card" key={title}>
              <span className="iconTile" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="wrap homePanel">
        <div className="coverage">
          <div>
            <p className="eyebrow">Service areas</p>
            <h2>Angadical &amp; Chandanappally</h2>
            <p>
              Check availability at your address or ask about a nearby locality.
            </p>
            <a className="textLink" href={maps}>
              Google Maps directions
            </a>
          </div>
          <Button href="/service-areas" secondary>
            View Service Areas
          </Button>
        </div>
      </section>
      <section className="wrap homePanel">
        <div className="support">
          <div>
            <p className="eyebrow">Need assistance?</p>
            <h2>Experiencing a connection issue?</h2>
            <p>Share your service details and we’ll follow up by phone.</p>
            <div className="contactInline">
              <ContactLinks directions={false} />
            </div>
          </div>
          <Button href="/report-issue">Report an Issue</Button>
        </div>
      </section>
    </>
  );
}
