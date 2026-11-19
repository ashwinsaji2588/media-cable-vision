import { Intro } from "../ui";
import { LookupForm } from "./lookup-form";

export const metadata = { title: "Track Request" };

export default function TrackRequest() {
  return (
    <>
      <Intro title="Track your request">
        Enter the mobile number you used to submit a connection request or issue
        report.
      </Intro>
      <section className="wrap section">
        <LookupForm />
      </section>
    </>
  );
}
