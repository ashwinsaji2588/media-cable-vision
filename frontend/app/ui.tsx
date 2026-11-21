import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { businessPhone, maps } from "./site";

export function Brand() {
  return (
    <Link href="/" className="brand">
      <Image src="/logo.svg" width={44} height={44} alt="" />
      <span>
        Media Cable Vision<small>CABLE TV &amp; BROADBAND</small>
      </span>
    </Link>
  );
}

export function NavLinks() {
  return [
    ["/", "Home"],
    ["/plans", "Plans"],
    ["/broadband", "Broadband"],
    ["/cable-tv", "Cable TV"],
    ["/service-areas", "Service Areas"],
    ["/contact", "Contact"],
    ["/track-request", "Track Request"],
  ].map(([href, label]) => (
    <Link key={href} href={href}>
      {label}
    </Link>
  ));
}

export function ContactLinks({ directions = true }: { directions?: boolean }) {
  const phone = businessPhone();
  return (
    <>
      {phone && (
        <>
          <a href={`tel:${phone}`}>Call {phone}</a>
          <a href={`https://wa.me/${phone.slice(1)}`}>WhatsApp</a>
        </>
      )}
      {directions && <a href={maps}>Google Maps directions</a>}
    </>
  );
}

export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button${secondary ? " secondary" : ""}`} href={href}>
      {children}
    </Link>
  );
}

export function Intro({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="intro">
      <div className="wrap">
        <h1>{title}</h1>
        <p>{children}</p>
      </div>
    </section>
  );
}
