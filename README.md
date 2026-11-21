# Media Cable Vision

Public website and request intake for Cable TV and Broadband in Angadical and Chandanappally. The application uses Next.js with TypeScript and Tailwind CSS, Java 21 with Spring Boot, and PostgreSQL with Liquibase migrations.

- **New Connection** and **Report an Issue** return short references such as `MCV-100001`.
- **Track Request** lets customers recover recent references using their mobile number.
- Mock WhatsApp and SMS alerts work locally. Live alerts use WhatsApp Cloud API and either TextBee or Twilio for SMS.

## Run with Docker Compose

Install Docker with the Compose plugin and clone the repository.

```sh
git clone https://github.com/ashwinsaji2588/media-cable-vision.git
cd media-cable-vision
```

Copy `.env.example` to `.env` with `cp .env.example .env` on macOS/Linux or `Copy-Item .env.example .env` in PowerShell. Then start the stack:

```sh
docker compose up --build --wait
```

Open [localhost:3000](http://localhost:3000). Submit a test request, then use **Track Request** with the same mobile number to find its reference. Check mock alerts with `docker compose logs -f backend`.

```sh
docker compose down
```

The named database volume persists across restarts. Only the web frontend binds to the host by default. Set `WEB_PORT` if port 3000 is already occupied.

## Project layout

| Path | Purpose |
| --- | --- |
| `frontend/` | Next.js pages, forms, request lookup and API proxy |
| `backend/` | Spring Boot API, Liquibase migrations and notification worker |
| `compose.yaml` | Frontend, backend and PostgreSQL services |
| `scripts/smoke.mjs` | End-to-end checks for a running local stack |
| `.github/workflows/ci.yml` | Build, test and Compose smoke checks |

## Free staging on Render

In the Render Dashboard, create a Blueprint from this GitHub repository. Review
the plan before deploying. Both resources in `render.yaml` are set to Free.
The Docker image runs the public Next.js server and a loopback-only Spring Boot
API together. PostgreSQL is reachable through Render's private network.

Open the generated HTTPS address and sign in with username `staging` and the
generated `STAGING_PASSWORD` from the web service's environment settings.
The health check exposes only readiness. Use synthetic submissions in staging.
Both channels default to mock mode, and Render's free database expires after
30 days. Free services sleep when idle, so the first visit can take longer.

For a smoke test against staging, set `SMOKE_URL` to its HTTPS origin and
`STAGING_PASSWORD` to the generated password in your shell, then run
`node scripts/smoke.mjs`. Keep the password in the host's secret settings and
out of Git.

## Develop without building containers

Use Node.js 24, Java 21, Maven 3.9, and PostgreSQL 17. Start a local PostgreSQL database named `media_cable_vision` with user `mcv` and password `mcv_local`, or set `DATABASE_URL` (JDBC), `POSTGRES_USER`, and `POSTGRES_PASSWORD` in the backend environment. To run only the database in Docker, use `docker compose up -d db` with a temporary Compose override that maps port 5432 to loopback. Spring Boot applies Liquibase migrations on startup.

```sh
mvn -f backend/pom.xml spring-boot:run
```

In another terminal, copy `frontend/.env.example` to `frontend/.env.local` and run:

```sh
cd frontend
npm ci
npm run dev
```

Set `PUBLIC_PHONE` to the confirmed public business number in E.164 format to display Call and WhatsApp links. Set `SITE_URL` to the final HTTPS origin to publish canonical and sitemap URLs and allow indexing. Without it, robots.txt asks crawlers to stay out. The location link uses the Google Maps listing supplied in the design chat.

## Request and notification flow

1. The browser posts JSON to the same-origin Next.js endpoint, which forwards it to Spring Boot. The REST endpoints are `POST /api/requests/connections` and `POST /api/requests/issues`. Both accept `name`, `phone`, `service`, `locality`, `details`, and `otherLocality` when `locality` is `OTHER`.
2. The API validates the submission and commits the request with one outbox row per channel in a single PostgreSQL transaction. HTTP 201 returns the reference. A repeat with the same UUID in the `Idempotency-Key` header and the same normalized fields returns the original reference. Different data with that key returns HTTP 409.
3. A scheduled worker claims due outbox rows with PostgreSQL row locks. Each channel is attempted independently. Timeouts, HTTP 408, 429, and server errors retry up to five total attempts, with delays of 30, 60, 120, and 240 seconds. Other provider rejections are recorded as failed. A provider-accepted alert is recorded as `SENT`. An ambiguous timeout or a crash between provider acceptance and the database update can cause a duplicate alert. The reference identifies it.
4. Alerts include the request type, reference, service, locality, and callback number. Names and the free-text submission stay in PostgreSQL. An authorized database operator can look up the digits after `MCV-` in `service_request.reference_number`. Liquibase assigns numeric references to existing requests as well.
5. **Track Request** uses `POST /api/requests/lookup` with a JSON `phone` field. It returns up to 20 recent receipts with the reference, request type, received date and receipt status. Anyone who knows the mobile number can see those fields while OTP is deferred. Apply a rate limit to this endpoint at the public ingress.

### Enable live alerts

Use Docker Compose's local `.env` or the Render web service's **Environment**
tab. Keep credentials out of Git. Set `NOTIFICATION_RECIPIENT` to the private
operator's number in E.164 format (for example, `+91` followed by the mobile
number). The public website contact is configured independently.

**TextBee SMS**

1. Register an Android device with an active SMS-capable SIM in TextBee, leave
   incoming SMS forwarding off, and confirm the device is online. Use the
   TextBee dashboard to send a test SMS to the operator.
2. Copy the device ID from **Devices** and create an API key. Set
   `SMS_PROVIDER=textbee`, `TEXTBEE_DEVICE_ID`, and `TEXTBEE_API_KEY`.
3. Set `SMS_MODE=live` and leave `WHATSAPP_MODE=mock` while testing SMS.
   Look for the SMS on the operator's phone. The backend logs a TextBee batch
   ID for accepted sends so you can look them up in the TextBee dashboard.

[TextBee setup](https://textbee.dev/docs/getting-started) · [TextBee sending API](https://textbee.dev/docs/sending-sms/sending-sms)

**WhatsApp Cloud API**

For a local delivery test before template approval, use Meta's test sender and
temporary access token with `WHATSAPP_TEMPLATE=hello_world`,
`WHATSAPP_LANGUAGE=en_US`, `WHATSAPP_MODE=live`, and `SMS_MODE=mock`.
Set `NOTIFICATION_RECIPIENT` to your verified test number, then submit one
synthetic request locally. The app sends Meta's fixed greeting in this mode.
Set `WHATSAPP_MODE=mock` again after testing if you are done with live sends.

1. In Meta's WhatsApp API Setup, add the operator as an eligible test
   recipient and confirm a sample message reaches their phone. Register a
   business sender and set up an access token for ongoing delivery.
2. Create a template such as `mcv_request_alert` with five positional body
   fields in this order: request type, reference, service, locality, callback
   number. For example, `Media Cable Vision received a {{1}} request. Reference:
   {{2}}. Service: {{3}}. Locality: {{4}}. Callback: {{5}}.` Use synthetic
   examples when submitting the template for Meta review.
3. Once the template is available to the sender, set `WHATSAPP_GRAPH_VERSION`,
   `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_TEMPLATE` and
   `WHATSAPP_LANGUAGE` to the values from Meta. Set `WHATSAPP_MODE=live` to
   test a submission with the approved template.

[Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)

After changing settings, redeploy the Render service or recreate the Docker
Compose backend. Let mock jobs finish before enabling live alerts. Submit a new
synthetic request and check the operator's handset. Each channel set to `live`
sends an independent alert. Each channel set to `mock` logs locally. Provider
acceptance in the outbox indicates a queued send, and handset delivery must be
checked with the provider or on the phone. Render's free service can sleep when
idle, which pauses the outbox worker and can delay retries.

Existing deployments can still use `NOTIFICATION_MODE` as the default for both
channels and `SMS_PROVIDER=twilio` with the Twilio settings in `.env.example`.
Use a separate database for production. For public deployment, provide HTTPS at
the ingress, rate-limit intake and lookup, and restrict database access.

## Tests

```sh
cd frontend
npm ci
npm test
npm run build
cd ..
mvn -f backend/pom.xml verify
```

Run the PostgreSQL tests with `MCV_RUN_POSTGRES_TESTS=true` and the database environment configured for a dedicated test database. The test class applies Liquibase and rolls back its test data. In PowerShell use `$env:MCV_RUN_POSTGRES_TESTS = "true"`.

With the app running in mock mode, run `node scripts/smoke.mjs` from the root. It checks public pages, both form endpoints, validation, duplicate handling and mobile lookup. It creates two synthetic requests, so run it on a development database. GitHub Actions also builds the Compose stack and verifies four successful mock deliveries.

## Design assets

The homepage displays locally bundled versions of the [Asianet](https://www.asianet.co.in/images/logo-v2.png), [Kerala Vision](https://keralavisionisp.com/assets/logo-Dnpp9r7N.png), and [BSNL](https://commons.wikimedia.org/wiki/File:BSNL_Eng_Logo_n_png.png) logos.

`frontend/public/connected-home.jpg` was created with built-in ImageGen and converted to JPEG for use with Next.js image optimization.

> Photorealistic editorial website hero photograph, landscape 3:2. Bright modern Kerala home living room, television showing a peaceful blue-green backwater landscape, small unobtrusive white Wi-Fi router on the oak media console, soft linen seating, daylight and understated tropical greenery. Clean composition, navy and cool blue accents, realistic domestic scale. No people, lettering, logos, watermark or graphical overlays.
