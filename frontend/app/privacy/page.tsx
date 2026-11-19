import Link from "next/link";
import { Intro } from "../ui";
export const metadata = { title: "Privacy Policy" };
export default function Privacy() {
  return (
    <>
      <Intro title="Privacy Policy">
        How Media Cable Vision uses information submitted through this website.
      </Intro>
      <section className="wrap section">
        <div className="proseColumn">
          <h2>Information you share</h2>
          <p>
            Our forms collect your name, phone number, locality, service
            selection and details you provide about your connection or issue.
          </p>
          <h2>How we use it</h2>
          <p>
            We store this information to respond to your request, check
            availability and arrange service where needed. We use notification
            providers to alert our team that a request was received.
          </p>
          <h2>Request lookup</h2>
          <p>
            Anyone who knows the mobile number used for a request can see its
            reference, type, received date and receipt status through Track
            Request.
          </p>
          <h2>Contact us</h2>
          <p>
            For questions about information you submitted, reach us through the{" "}
            <Link className="textLink" href="/contact">
              Contact page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
