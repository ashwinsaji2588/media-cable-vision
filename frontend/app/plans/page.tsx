import { Intro } from "../ui";
import { ProviderPlans } from "../components/ProviderPlans";
import { ScrollReveal } from "../components/MotionWrappers";

export const metadata = {
  title: "Available Plans & Tariffs — Asianet, Kerala Vision, BSNL",
  description:
    "Compare official broadband and digital cable TV plans from Asianet, Kerala Vision, and BSNL in Angadical and Chandanappally.",
};

export default function PlansPage() {
  return (
    <>
      <Intro title="Available Plans &amp; Tariffs">
        Browse and compare home internet and digital cable TV plans across
        Asianet, Kerala Vision, and BSNL.
      </Intro>

      <section className="wrap section">
        <ScrollReveal>
          <ProviderPlans />
        </ScrollReveal>
      </section>
    </>
  );
}
