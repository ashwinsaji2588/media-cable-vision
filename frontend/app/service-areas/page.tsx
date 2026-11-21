import { areas, maps } from "../site";
import { Button, Intro } from "../ui";
import { Icon3D } from "../components/Icon3D";
import { ScrollReveal, Tilt3DCard } from "../components/MotionWrappers";
import { CoverageChecker } from "../components/CoverageChecker";

export const metadata = { title: "Service Areas" };

export default function Areas() {
  return (
    <>
      <Intro title="Service areas">
        Local cable TV and broadband assistance in Pathanamthitta, Kerala.
      </Intro>
      <section className="wrap section">
        <div className="serviceGrid">
          {areas.map((area, index) => (
            <ScrollReveal key={area} delay={index * 0.15}>
              <Tilt3DCard className="card p-6 flex flex-col justify-between h-full bg-gradient-to-br from-white via-sky-50/30 to-sky-50/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0b2545]">{area}</h2>
                    <p className="mt-2 text-slate-600">
                      Request a connection or get help with an existing service.
                      Fiber coverage and cable lines actively maintained.
                    </p>
                  </div>
                  <Icon3D name="location" size={56} className="shrink-0" />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ● Active Coverage
                  </span>
                  <a className="textLink text-sm font-bold" href={maps}>
                    View on Map →
                  </a>
                </div>
              </Tilt3DCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Real-time PIN code and landmark coverage checker */}
        <div className="mt-12">
          <ScrollReveal delay={0.2}>
            <CoverageChecker />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.25} className="mt-8">
          <div className="actions">
            <Button href="/new-connection">Check Availability</Button>
            <a className="button secondary" href={maps}>
              Google Maps Directions
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            For a nearby locality, select <em>Other nearby area</em> on the connection form.
          </p>
        </ScrollReveal>
      </section>
    </>
  );
}
