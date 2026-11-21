import { notFound } from "next/navigation";
import { providers, services } from "../site";
import { Button, Intro } from "../ui";
import { Icon3D } from "../components/Icon3D";
import { ScrollReveal, Tilt3DCard } from "../components/MotionWrappers";

type Props = { params: Promise<{ service: string }> };

async function getService(params: Props["params"]) {
  const { service } = await params;
  if (!Object.hasOwn(services, service)) notFound();
  return services[service as keyof typeof services];
}

export async function generateMetadata({ params }: Props) {
  const service = await getService(params);
  return {
    title: `${service.title} in Angadical & Chandanappally`,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params);
  const isBroadband = service.code === "BROADBAND";

  return (
    <>
      <Intro title={`${service.title} in Angadical & Chandanappally`}>
        {service.summary}
      </Intro>
      <section className="wrap section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="proseColumn lg:col-span-8">
            <ScrollReveal>
              <h2>Get a home connection</h2>
              <p>{service.details}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="mt-8">Provider availability</h2>
              <p>
                Ask about {providers.map(({ name }) => name).join(", ")} or other
                supported providers. Options depend on your location and the service you
                need.
              </p>
              <div className="actions mt-6">
                <Button href={`/new-connection?service=${service.code}`}>
                  Request {service.title}
                </Button>
                <Button href={`/report-issue?service=${service.code}`} secondary>
                  Report an Issue
                </Button>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4">
            <ScrollReveal delay={0.2}>
              <Tilt3DCard className="card p-8 flex flex-col items-center text-center bg-gradient-to-b from-sky-50/60 to-white">
                <Icon3D
                  name={isBroadband ? "broadband" : "cable-tv"}
                  size={100}
                  className="mb-4"
                />
                <h3 className="text-xl font-bold text-[#0b2545]">
                  {isBroadband ? "High-Speed Fiber" : "Digital Cable Network"}
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  {isBroadband
                    ? "Up to Gigabit speeds, unlimited data, low latency for gaming and streaming."
                    : "Hundreds of crystal-clear HD channels with local community broadcasts."}
                </p>
              </Tilt3DCard>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
