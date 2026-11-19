import { areas, maps } from "../site";
import { Button, Intro } from "../ui";
export const metadata = { title: "Service Areas" };
export default function Areas() {
  return (
    <>
      <Intro title="Service areas">
        Local cable TV and broadband assistance in Pathanamthitta, Kerala.
      </Intro>
      <section className="wrap section">
        <div className="serviceGrid">
          {areas.map((area) => (
            <article className="card" key={area}>
              <h2>{area}</h2>
              <p>
                Request a connection or get help with an existing service.
                Availability depends on your address.
              </p>
            </article>
          ))}
        </div>
        <div className="actions">
          <Button href="/new-connection">Check Availability</Button>
          <a className="button secondary" href={maps}>
            Google Maps Directions
          </a>
        </div>
        <p>
          For a nearby locality, select Other nearby area on the connection
          form.
        </p>
      </section>
    </>
  );
}
