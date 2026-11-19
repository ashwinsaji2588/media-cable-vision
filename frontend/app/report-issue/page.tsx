import { RequestForm } from "../request-form";
import { Intro } from "../ui";
export const metadata = { title: "Report an Issue" };
export default async function Issue({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <>
      <Intro title="Report a service issue">
        Share what happened with your broadband or cable TV connection so our
        team can follow up.
      </Intro>
      <section className="wrap section">
        <RequestForm
          kind="issues"
          initialService={
            ["BROADBAND", "CABLE_TV"].includes(service ?? "")
              ? service
              : undefined
          }
        />
      </section>
    </>
  );
}
