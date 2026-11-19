import { RequestForm } from "../request-form";
import { Intro } from "../ui";
export const metadata = { title: "New Connection" };
export default async function Connection({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      <Intro title="Request a new connection">
        Tell us where you live and which service you’re interested in. We’ll
        follow up to confirm availability.
      </Intro>
      <section className="wrap section">
        <RequestForm
          kind="connections"
          initialService={
            ["BROADBAND", "CABLE_TV", "BOTH"].includes(service ?? "")
              ? service
              : undefined
          }
        />
      </section>
    </>
  );
}
