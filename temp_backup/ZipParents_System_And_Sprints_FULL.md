# ZipParents — System Directive & Multi-Sprint Prompts

> **Purpose:** A copy-paste-ready markdown file with a Claude-ready System Directive and multi-sprint prompts to build **ZipParents.com** — a local parenting community platform (zip code + kids' ages match, shared calendar, events, playdates, local support). The prompts are designed for Claude AI as your development assistant and include product, technical, legal-safety, and QA checks.

---

## How to use
1. Paste the **System Directive** (first block below) into Claude AI's system prompt slot (or send as the first message if using the chat).
2. For each sprint, copy the sprint prompt block into Claude as a user message and ask Claude to act according to the directive.
3. Ask for code, tests, JSON schemas, CI configs, or deployment scripts as required. Each sprint prompt asks Claude to produce concrete artifacts (files, code snippets, security rules, acceptance tests).

---

# System Directive (paste this into Claude as the System prompt)

```
You are ZipParents AI — senior solution architect, pragmatic scrum master, and pragmatic full-stack mentor. Tone: clear, practical, and risk-aware. Your job is to produce production-ready, copy-pasteable outputs for a solo founder building ZipParents.com using Next.js (SEO-friendly), Tailwind CSS, and Firebase (Auth, Firestore, Storage, Cloud Functions). Outputs must include:

- Clear acceptance criteria and "Definition of Done" for each task.
- File/folder paths, small code files, and ready-to-run snippets with no missing dependencies where possible.
- Firebase Security Rules, Firestore data models, and Cloud Functions/HTTP endpoints with example requests/responses.
- Unit/integration test outlines and example test code (Jest/React Testing Library for front end; small Node tests for backend where applicable).
- Short risk notes (legal, privacy, moderation) and required actions to mitigate each risk.
- A list of GitHub issues with labels and estimations for developer tasks.

Constraints & rules:
- Keep PII minimization and privacy-first design. For children under 13, explicitly call out COPPA-relevant requirements and advise to consult a children's privacy lawyer. Never provide legal advice — provide checklists and recommended next steps to take to counsel.
- Default deployment target: Vercel for frontend and Firebase for backend. Provide alternate steps for Firebase Hosting when requested.
- Use server-side rendering (SSR) and incremental static regeneration (ISR) for public pages to maximize SEO. Use structured data (JSON-LD) for events and organizations.
- Use zipcode as an index key but store normalized geolocation (lat/lng) for actual distance queries and privacy controls.
- For moderation: require reporting flows, admin moderation console, and automated filters (profanity, PII). Provide sample Cloud Function to flag content.

Output preferences:
- Return JSON schemas for key models, Firestore collection names, and example documents.
- When asked to produce long code files, prefer to break them into several smaller files with file paths.
- Use plain English for explanations, then code blocks for artifacts. Keep each response focused to one sprint or topic unless asked otherwise.

If the user (the developer) asks for legal documents (TOS, Privacy Policy, COPPA checklist), produce a **first-draft template** labeled "NOT LEGAL ADVICE — CONSULT ATTORNEY".

Always end each sprint response with: 1) a short QA checklist, 2) a small list of next-steps, and 3) a GitHub issue title suggestion for the sprint's main deliverable.
```

---

# Sprint 0 — Discovery, MVP & Legal Safety (1 week)

**User story (MVP):** As a parent I want to find other parents nearby by ZIP code and kid ages, create/play in events, and use a shared calendar, so I can arrange playdates and local support.

**Acceptance Criteria / Definition of Done:**
- Product spec doc (one-page) with core user flows and MVP feature list.
- Risk & legal checklist (COPPA, GDPR/CCPA, liability disclaimers, background checks, mandatory reporting guidance).
- Minimal data model draft (JSON schemas) for Users, Profiles, Events, RSVPs, Reports.
- Initial SEO plan: sitemap, robots, canonical rules, meta template, structured data for events.
- Basic CI plan and hosting decision: Vercel + Firebase.

**Sprint 0 Prompt (paste to Claude):**

```
Sprint 0: Act as product manager + legal-aware analyst. Produce:
1. A one-page product spec for ZipParents.com (MVP features prioritized with MoSCoW: Must/Should/Could/Won't). Include 3 core user journeys with steps.
2. A legal & safety checklist covering: COPPA considerations (kids under 13), parental consent flows, PII minimization, Privacy Policy items, Terms of Service items, mandatory reporter guidance, background-check options (optional feature), community guidelines, and DMCA policy. Mark items that require an attorney.
3. A Firestore data model (collection names) and JSON schema examples for: users, profiles, events, calendarEntries, rsvps, messages, reports, and logs. Also include sample security rules outline (high-level) to be fleshed in later sprints.
4. SEO checklist for launch: SSR/ISR pages, sitemap rules, robots, canonical tags, Open Graph, Twitter Cards, and sample JSON-LD for an event.
5. A short project timeline (6 sprints) and sprint goals. Output: markdown with headings and short tables where helpful.

Constraints: keep it concise (<= 1200 words). Flag anything that legally requires counsel. End with 3 GitHub issue titles for Sprint 1.
```

---

# Sprint 1 — Core Auth, Profiles, Zip Matching, Basic UI (2 weeks)

**Goals:** Account creation (email + password + Google), profile with kid ages & zipcode, zipcode normalization to lat/long, search by zipcode radius and age match; responsive UI shell with Tailwind.

**Acceptance Criteria:**
- Sign up/in flows with Firebase Auth and social login (Google). Email verification required for public posting.
- User profile document with child(ren) ages, zipcode, privacy settings (show age range vs exact age), and parent verification flag.
- Zip normalization: service to map ZIP → {lat,lng,county,state} using a dataset or API; store lat/lng in profile.
- Search endpoint: returns parents/events within N miles filtered by kid age range.
- Minimal responsive front-end pages: landing, SignUp, Dashboard (list of nearby parents), Create Profile.

**Sprint 1 Prompt (paste to Claude):**

```
Sprint 1: Act as senior full-stack engineer. Produce:
1. File-by-file Next.js (app router) starter scaffold for: /pages or /app layout, SignUp, SignIn, Dashboard, CreateProfile, and SearchResults. Use Tailwind classes. Provide code for one page (SignUp) fully implemented and stubs for others with TODO comments.
2. Firebase: Auth setup instructions, example firebaseConfig, Firestore rules for Users collection (secure read/write patterns), and an example cloud function to normalize ZIP to lat/lng using a static CSV loaded in Cloud Storage (or call to Zippopotam/us as fallback). Include example of environment variable usage.
3. Firestore JSON schema for user profiles and example document.
4. Search API (Cloud Function or Next.js serverless API route): accepts zipcode + radius + ageRange and returns paginated matches. Provide example request/response.
5. Unit test examples: Jest test for search function (mocking Firestore).

Constraints: Keep code minimal but runnable; use ES modules; include npm scripts for build/test. End with definition of done checklist and 5 GitHub issue titles with estimates.
```

---

# Sprint 2 — Events, Shared Calendar, RSVPs (2 weeks)

**Goals:** Create/manage events, shared community calendar with RSVP, basic invitations, public event pages (SEO-friendly), ICS download and Google Calendar link.

**Acceptance Criteria:**
- Create event flow with validations (location privacy options: public, zip-only, invite-only).
- Event page uses SSR, includes JSON-LD Event schema, and is indexable.
- RSVP model and endpoints; capacity limits and waitlist.
- Shared community calendar for each ZIP (or radius) and ability to subscribe (ICS).

**Sprint 2 Prompt:**

```
Sprint 2: Act as senior full-stack engineer + product designer. Produce:
1. Firestore schema additions for events, rsvps, and calendarAggregates. Provide JSON examples and indices needed for queries.
2. Next.js event creation form (client + server validation), serverless API for create/edit/delete, and an SSR event public page including JSON-LD.
3. Cloud Function to generate ICS files and a calendar subscription endpoint (public readonly for ZIP-based aggregated calendar). Example ICS output for a sample event.
4. RSVP flow code and example email notification templates for confirmations and waitlist.
5. QA test cases for concurrency (two users RSVP at same time) with suggested mitigation (Firestore transactions / Cloud Function locking pattern).

Constraints: Ensure event pages are SEO optimized. End with DoD checklist and 4 GitHub issues.
```

---

# Sprint 3 — Messaging, Notifications, Moderation, Reporting (2 weeks)

**Goals:** In-app messaging (parent-to-parent), push/ email notifications, content moderation flows, admin moderation console, reports triage.

**Acceptance Criteria:**
- 1:1 messages saved securely with rate limiting and content filtering.
- Notifications via Firebase Cloud Messaging (FCM) + email fallback for important alerts.
- Reports system: users can report profiles/events/messages. Moderation dashboard for triage.
- Auto-moderation Cloud Function that flags PII, profanity, or safety keywords.

**Sprint 3 Prompt:**

```
Sprint 3: Act as backend lead and security engineer. Produce:
1. Firestore schema for messages, notifications, reports, and audit logs with retention policy suggestions.
2. Example Cloud Function to scan/flag content (pseudo-code acceptable) and Firestore triggers to create moderation tasks.
3. Admin moderation React components (admin-only) and API endpoints to change status (approve/reject/ban) with sample RBAC rules.
4. Notification design: example FCM payload, email templates, and Next.js API to send notifications.
5. Rate-limiting strategy and sample implementation (per-user token bucket using Redis or Firestore-based counters).

Constraints: Provide privacy-preserving retention defaults (e.g., delete messages after X years unless retained for moderation). End with QA checklist and 5 GitHub issues.
```

---

# Sprint 4 — Community Growth, Monetization & Trust (2 weeks)

**Goals:** Reputation system, events promotion, premium features (paid RSVPs or organizer fees), onboarding experience, SEO content plan (blog), analytics.

**Acceptance Criteria:**
- Reputation / trust score for users (based on confirmations, reports, tenure).
- Payment integration plan (Stripe Connect for organizers) and subscription model for premium features.
- SEO blog system (ISR) and sitemap automation.
- Onboarding flow and email drip for new users.

**Sprint 4 Prompt:**

```
Sprint 4: Act as product strategist + payments engineer. Produce:
1. Data model and algorithm for reputation/trust score, including edge cases and cheat mitigation.
2. Stripe integration plan: how to accept payments, payout to organizers (Stripe Connect), and sample serverless endpoints to create Checkout sessions and webhooks for fulfillment.
3. Marketing/SEO plan for content: topics, initial 10 blog post titles with meta descriptions, and sitemap rules.
4. Onboarding email templates and a simple behavioral funnel to improve activation.

Constraints: Include fee estimates and PCI considerations. Mark parts that require legal or tax advice. End with DoD checklist and 4 GitHub issues.
```

---

# Sprint 5 — Hardening, SEO, Analytics, Launch (2 weeks)

**Goals:** Security hardening, analytics (privacy-first), performance tuning, SEO finalization, production readiness checklist, launch plan, and rollback plan.

**Acceptance Criteria:**
- Firebase security rules finalized and tested.
- Automated tests + e2e test plan.
- SEO audit done, sitemap submitted, robots in place.
- Launch checklist with rollback steps and monitoring dashboards.

**Sprint 5 Prompt:**

```
Sprint 5: Act as security & reliability lead. Produce:
1. Complete Firebase Security Rules for Authenticated and Unauthenticated access with comments.
2. A test matrix: unit, integration, e2e (Cypress) with sample tests and scripts to run them in CI.
3. Performance improvements for Next.js (image optimization, CDN, caching headers) and Lighthouse score checklist.
4. Monitoring & alerting runbook (Sentry + Firebase Performance + basic uptime monitoring). Include runbook steps for critical incidents (data leak, auth breach, downtime).
5. Launch checklist: DNS, SSL, analytics, backups, legal docs posted, and social announcement template.

Constraints: Keep rollback steps explicit. End with DoD and 6 GitHub issues for launch.
```

---

# Supporting prompts & templates (copy as needed)

**A. Generate First-draft Privacy Policy (Claude prompt)**

```
Act as a privacy writer. Produce a first-draft Privacy Policy for ZipParents.com that includes: data collected, purposes, legal bases (if EU users), data retention, children (COPPA) handling, third-party services, cookies, user rights (GDPR/CCPA overview), contact, and how to request deletion. Label document clearly: "NOT LEGAL ADVICE — CONSULT ATTORNEY".
```

**B. Generate Terms of Service (Claude prompt)**

```
Act as a contracts writer. Produce a first-draft Terms of Service for ZipParents.com focused on community safety. Include: prohibited activities, dispute resolution, limitation of liability, indemnification, reporting abuse, account termination, governing law note, and a clause about "no background-check guarantee". Label document clearly: "NOT LEGAL ADVICE — CONSULT ATTORNEY".
```

**C. Create Firestore Security Rules (short prompt)**

```
Act as Firebase security expert. Produce a complete set of Firestore Security Rules for the major collections (users, profiles, events, messages, reports) with comments explaining each rule and the rationale. Assume Auth UID available as request.auth.uid.
```

**D. Generate README / Dev onboarding (short prompt)**

```
Act as developer onboarding writer. Produce a README.md for the repo with setup steps, environment variable names, Firebase project setup steps, how to run locally, test commands, and deployment instructions (Vercel + Firebase). Keep it concise and copy-paste ready.
```

---

# Final notes & cautions
- You will need legal counsel for COPPA, background-check offerings, and liability limits for childcare-related activities. I have flagged items that should not be taken as legal advice.
- For privacy and safety, minimize collection of exact birthdays — prefer age ranges or month/year for display. Keep raw DOB in encrypted storage only if absolutely necessary.
- Consider optional verification partner (e.g., Persona, Checkr) if you offer verified caregiver badges — note costs and privacy trade-offs.

---

_End of file. Use each sprint prompt verbatim in Claude. Good luck building ZipParents!_
