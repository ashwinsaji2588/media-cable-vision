import { Intro } from "../ui";
import { LookupForm } from "./lookup-form";
import { Icon3D } from "../components/Icon3D";
import { ScrollReveal } from "../components/MotionWrappers";

export const metadata = { title: "Track Request" };

export default function TrackRequest() {
  return (
    <>
      <Intro title="Track your request">
        Enter the mobile number you used to submit a connection request or issue
        report.
      </Intro>
      <section className="wrap section">
        <ScrollReveal>
          <div className="flex items-center justify-center mb-6">
            <Icon3D name="track" size={72} />
          </div>
          <LookupForm />
        </ScrollReveal>
      </section>
    </>
  );
}
