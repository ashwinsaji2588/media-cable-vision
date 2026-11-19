# Media Cable Vision

Public website and request intake for Cable TV and Broadband in Angadical and Chandanappally. The application uses Next.js with TypeScript and Tailwind CSS, Java 21 with Spring Boot, and PostgreSQL with Liquibase migrations.

- **New Connection** and **Report an Issue** return short references such as `MCV-100001`.
- **Track Request** lets customers recover recent references using their mobile number.
- Mock WhatsApp and SMS alerts work locally. Live alerts use WhatsApp Cloud API and Twilio.

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
The image forces mock notifications, and Render's free database expires after
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

Mock mode is the default. To enable live alerts, set `NOTIFICATION_MODE=live` and configure all listed provider settings in `.env`. `NOTIFICATION_RECIPIENT` is the private operator number in E.164 format. It can differ from the public contact number.

- **WhatsApp Cloud API** requires the Graph API version, sender phone number ID, access token, and approved template name and language. Use a body template with five positional text parameters in this order: request type, reference, service, locality, callback number. Configure the operator as an eligible recipient. [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- **SMS** uses Twilio Messaging. Supply the account SID, auth token, and approved sender or Messaging Service SID. Confirm the account and sender can deliver to the operator’s Indian number. [Twilio Messages API](https://www.twilio.com/docs/messaging/api/message-resource)

Recreate the backend after updating its environment. Use a separate database for production so synthetic requests and mock delivery records stay in development. For public deployment, provide HTTPS at the ingress, set intake rate limits there, use a strong database password, and restrict database access. This repository includes build and smoke-test automation. Deployment is independent of CI.

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
