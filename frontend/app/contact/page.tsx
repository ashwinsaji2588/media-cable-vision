import { Button, ContactLinks, Intro } from "../ui";
export const metadata = { title: "Contact" };
export default function Contact() {
  return (
    <>
      <Intro title="Contact Media Cable Vision">
        Serving Angadical and Chandanappally, Pathanamthitta, Kerala.
      </Intro>
      <section className="wrap section">
        <h2>How can we help?</h2>
        <div className="contactInline textLink">
          <ContactLinks />
        </div>
        <div className="actions">
          <Button href="/new-connection">New Connection</Button>
          <Button href="/report-issue" secondary>
            Report an Issue
          </Button>
        </div>
      </section>
    </>
  );
}
