import { RequestForm } from "../request-form";
import { Intro } from "../ui";

export const metadata = { title: "New Connection" };

export default async function Connection({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string;
    plan?: string;
    speed?: string;
    locality?: string;
    landmark?: string;
    pincode?: string;
    otherLocality?: string;
  }>;
}) {
  const {
    service,
    plan,
    speed,
    locality,
    landmark,
    pincode,
    otherLocality,
  } = await searchParams;

  // Normalize service code
  let normalizedService = service?.toUpperCase();
  if (!["BROADBAND", "CABLE_TV", "BOTH"].includes(normalizedService ?? "")) {
    if (plan?.toLowerCase().includes("tv") && !plan?.toLowerCase().includes("broadband")) {
      normalizedService = "CABLE_TV";
    } else if (plan?.toLowerCase().includes("combo") || plan?.toLowerCase().includes("all-in-one")) {
      normalizedService = "BOTH";
    } else if (speed || plan) {
      normalizedService = "BROADBAND";
    } else {
      normalizedService = undefined;
    }
  }

  // Normalize locality
  let normalizedLocality = locality;
  if (locality?.toUpperCase() === "ANGADICAL" || pincode === "691555") {
    normalizedLocality = "Angadical";
  } else if (locality?.toUpperCase() === "CHANDANAPPALLY" || pincode === "689648") {
    normalizedLocality = "Chandanappally";
  } else if (locality?.toUpperCase() === "OTHER" || (pincode && pincode !== "689648" && pincode !== "691555")) {
    normalizedLocality = "OTHER";
  }

  return (
    <>
      <Intro title="Request a new connection">
        {plan
          ? `You have selected: ${plan}. Share your contact details to arrange installation.`
          : pincode
          ? `Checking feasibility for PIN ${pincode}. Share your contact details to confirm installation.`
          : "Tell us where you live and which service you’re interested in. We’ll follow up to confirm availability."}
      </Intro>
      <section className="wrap section">
        <RequestForm
          kind="connections"
          initialService={normalizedService}
          initialPlan={plan}
          initialSpeed={speed}
          initialLocality={normalizedLocality}
          initialLandmark={landmark}
          initialPincode={pincode}
          initialOtherLocality={otherLocality || (pincode ? `PIN Code ${pincode}` : undefined)}
        />
      </section>
    </>
  );
}
