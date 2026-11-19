import { notFound } from "next/navigation";
import { providers, services } from "../site";
import { Button, Intro } from "../ui";

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
  return (
    <>
      <Intro title={`${service.title} in Angadical & Chandanappally`}>
        {service.summary}
      </Intro>
      <section className="wrap section">
        <div className="proseColumn">
          <h2>Get a home connection</h2>
          <p>{service.details}</p>
          <h2>Provider availability</h2>
          <p>
            Ask about {providers.map(({ name }) => name).join(", ")} or other
            supported providers.
            Options depend on your location and the service you need.
          </p>
          <div className="actions">
            <Button href={`/new-connection?service=${service.code}`}>
              Request {service.title}
            </Button>
            <Button href={`/report-issue?service=${service.code}`} secondary>
              Report an Issue
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
