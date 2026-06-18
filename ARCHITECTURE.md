# AegisLore Architecture

## Project Goal

AegisLore is scaffolded as a production-ready Next.js application foundation for a security startup. The initial scope is intentionally small: public entry point, authentication, protected dashboard shell, database wiring, shared UI primitives, theming, validation, and documented extension boundaries.

The project avoids speculative product features until the domain model is clear.

## Core Stack Decisions

### Next.js 15 App Router

The app uses the `src/app` directory and App Router because it gives us server components, route handlers, layouts, metadata, and streaming-friendly route boundaries by default.

Important routes:

- `src/app/(marketing)/page.tsx`: public landing route for `/`.
- `src/app/sign-in/page.tsx`: authentication entry point.
- `src/app/dashboard/page.tsx`: authenticated application shell.
- `src/app/api/auth/[...nextauth]/route.ts`: Auth.js route handlers.

The `(marketing)` route group keeps the public surface separate from authenticated application routes without changing the URL.

### TypeScript Strict Mode

`strict` TypeScript is enabled in `tsconfig.json`. This is non-negotiable for a production codebase because it keeps domain boundaries, auth session shape, and database usage explicit.

Path aliasing uses `@/* -> src/*` to avoid brittle relative imports.

### Clean Folder Structure

The structure separates framework routes, shared UI, product features, server infrastructure, and cross-cutting utilities:

```text
src/
  app/                 Next.js route tree, layouts, route handlers, providers
  components/          Reusable cross-feature components
    ui/                shadcn/ui-compatible primitives
    brand/             Brand-level reusable UI
    layout/            Shared layout components
    motion/            Framer Motion wrappers
    theme/             Theme controls
  features/            Product/domain feature modules
    auth/              Auth-specific actions and components
  hooks/               Shared React hooks when needed
  lib/                 Client/server-safe utilities and validation helpers
  server/              Server-only infrastructure
    auth/              Auth.js configuration and exports
    db/                Prisma client
  types/               Global type augmentation
prisma/
  schema.prisma        Database schema
```

Decision: product behavior should live in `src/features/<feature-name>` instead of being scattered across routes. Routes compose features; features own behavior.

Decision: marketing-only page composition can remain route-local in `src/app/(marketing)` when it does not need to be reused elsewhere. Reusable visual primitives still belong in `src/components/ui`.

Decision: dashboard composition can remain route-local while the product domain is still forming. Its cards use reusable design-system primitives, and future live data should enter through feature modules instead of being embedded directly in route components.

### Server and Client Boundary

The default is server components. Client components are used only where browser state or client libraries require them:

- `src/app/providers.tsx`: React Query, Auth.js session provider, and theme provider.
- `src/components/theme/theme-toggle.tsx`: reads and changes browser theme state.
- `src/components/motion/reveal.tsx`: Framer Motion requires a client boundary.
- shadcn/ui primitives that use Radix client behavior.

Decision: keep data access and auth checks on the server unless a user interaction explicitly requires the browser.

## Authentication

Auth.js is configured in two layers:

- `src/server/auth/config.ts`: provider, page, callback, and session policy.
- `src/server/auth/index.ts`: Auth.js instance with Prisma adapter.

The app uses database-backed sessions with Prisma because it gives the application server-side session revocation and a durable session store.

The supported providers are Google OAuth and email magic links. Each provider is enabled only when its required environment variables are present. This keeps local setup predictable and avoids fake credential flows.

Decision: email authentication uses short-lived magic links instead of passwords. This avoids password storage, password reset flows, and credential stuffing risk in the application.

Decision: Google account linking is intentionally conservative. Automatic dangerous email account linking is disabled so provider identity is not silently merged across unrelated OAuth accounts.

Decision: Auth.js owns callback and token verification. Application code should call server actions such as `signInWithGoogle`, `signInWithEmail`, and `signOutCurrentUser` instead of manually constructing provider URLs.

### Route Protection

`src/middleware.ts` performs only a lightweight session-cookie presence check for fast redirects. It does not import Prisma or the full Auth.js adapter because middleware runs in an edge-like environment and should stay database-free.

The authoritative session check happens through `requireUser()` in `src/server/auth/session.ts`, which calls `auth()` on the server. This protects the route even if middleware is bypassed.

Decision: middleware improves navigation ergonomics; server-side page checks enforce security.

Protected routes currently include:

- `/dashboard`
- `/notifications`
- `/profile`
- `/settings`

### Account Surfaces

The app provides separate `signup` and `signin` pages over the same secure authentication mechanisms. Email magic links create the user when needed, so signup does not introduce a separate password credential model.

Profile and settings pages are protected server-rendered routes. Profile displays Auth.js session identity data. Settings communicates current session and provider configuration without adding speculative account-management features.

Decision: account settings are currently a professional UI shell with explicit future integration points. Destructive operations such as account deletion and data export are not wired to backend mutations until persistence, confirmation, re-authentication, and audit requirements are defined.

## Database

Prisma is the database ORM, targeting PostgreSQL through `DATABASE_URL`.

The initial schema contains only Auth.js-required models:

- `User`
- `Account`
- `Session`
- `VerificationToken`

Decision: no product tables are added yet. AegisLore-specific models should be created when workflows and ownership rules are defined.

The Prisma client is centralized in `src/server/db/client.ts` and cached during development to avoid exhausting database connections during hot reloads.

## Environment Validation

`src/lib/env.ts` uses Zod to validate required environment variables at runtime.

Decision: fail fast on invalid infrastructure configuration rather than allowing the app to boot into an unknown state.

Current required variables:

- `DATABASE_URL`
- `AUTH_SECRET`

Optional variables:

- `AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

## UI System

The project includes shadcn/ui-compatible primitives under `src/components/ui`:

- `Button`
- `Card`
- `Badge`
- `Alert`
- `Skeleton`
- `Input`
- `Textarea`
- `Field`
- `Label`
- `Separator`
- `Switch`

These components are local source, not an external design-system package, which matches shadcn/ui's ownership model. They use:

- Tailwind CSS for styling.
- CSS variables for theme tokens.
- Radix primitives where accessibility behavior matters.
- `class-variance-authority`, `clsx`, and `tailwind-merge` for safe class composition.

Decision: shared UI primitives should stay small, accessible, and composable. Product-specific UI should not be added to `components/ui`.

### Design System Direction

The AegisLore design system is intentionally minimal, calm, and trustworthy. It should feel polished without relying on fear-based cybersecurity tropes.

Decisions:

- Typography uses neutral, high-legibility sans-serif tokens with no negative letter spacing.
- Color uses only the AegisLore palette: dark `#090B10`, dark surface `#121318`, light `#F5F2EE`, light surface `#FFFFFF`, primary `#651B36`, secondary `#7A1D3A`, accent `#A93D61`, text, and muted neutrals.
- Status treatments reuse the AegisLore palette instead of introducing additional semantic colors.
- Cards use subtle borders and soft elevation instead of heavy shadows or decorative effects.
- Buttons include small motion and focus states, but no flashy animation.
- Loading skeletons use a soft shimmer to communicate progress without visual noise.
- Framer Motion is wrapped in reusable motion components so animation remains consistent and opt-in.

Design-system components must remain reusable primitives. Domain-specific components belong in `src/features`.

## Theme System

Dark and light mode are implemented with `next-themes` and CSS variables in `src/app/globals.css`.

Decision: tokenized theme variables keep Tailwind classes stable while allowing brand colors and contrast tuning in one place.

## Data Fetching

React Query is configured in `src/app/providers.tsx`.

Decision: server components should be preferred for initial server data. React Query is available for client-side async state such as polling, mutations, optimistic updates, and interactive dashboards once product APIs exist.

Default query behavior:

- `staleTime: 60_000`
- `refetchOnWindowFocus: false`
- `retry: 1`

These defaults reduce noisy network behavior while still supporting production client-side data workflows.

## Validation

Zod is included and used for environment validation.

Decision: future API route inputs, form payloads, and server actions should validate at the boundary before reaching domain logic or database calls.

## Digital Health Scoring

The digital health scoring engine lives in `src/features/digital-health/scoring`.

Decision: scoring is modeled as a registry of independent factors rather than one large conditional function. Each factor owns its score, weight, confidence, severity, and recommended actions. The engine validates input, runs the registered factors, combines weighted results, and returns a normalized score.

Current factors:

- Password reuse
- Known breach exposure
- Multi-factor authentication
- Password strength
- Email exposure
- Device security placeholder

Decision: device security is represented as a placeholder factor with `secure`, `needs_review`, and `unknown` states. This keeps the public contract stable while allowing real device telemetry to replace the placeholder later.

Decision: future factors should be added by implementing the `ScoringFactor` interface and registering the factor. The engine should not be rewritten when adding a new signal.

### Fix Planner

The Fix Planner is derived from structured scoring recommendations. Each recommendation includes priority, estimated completion time, security impact score, difficulty, and effort.

Decision: recommendations are sorted by `securityImpactScore / effort` so users see the highest security gain for least effort first.

Decision: recommendations are data from the scoring engine, not text-only UI copy. This keeps future scoring factors able to add planner actions without rewriting planner components.

### Source Attribution

Every scoring factor returns finding evidence with source, detection method, confidence score, and last checked timestamp.

Decision: source attribution belongs in scoring data, not only in UI text. This ensures every security finding can explain where it came from regardless of where it is displayed.

Decision: `SourceAttributionCard` and `FindingEvidencePanel` are reusable display components for any future finding source, including OAuth audits, user-provided checks, database-backed scans, or realtime alerts.

## Security Journey

The security journey system lives in `src/features/security-journey`.

Decision: journey data is modeled separately from the scoring engine. Scoring explains the current digital health state; the journey system explains progress over time through score history, fixed issues, milestones, account improvements, reports, streaks, and achievement badges.

Decision: dashboard UI consumes one typed `SecurityJourneySnapshot`. This keeps the current implementation easy to replace with database-backed history later without rewriting `SecurityTimeline`, `ProgressChart`, or `AchievementSystem`.

Decision: weekly and monthly reports are structured summaries instead of freeform dashboard copy. This keeps report rendering reusable and makes future generated or scheduled reports easier to validate before display.

## Scam Check

Scam Check lives in `src/features/scam-check` with a protected route at `/scam-check` and an authenticated API route at `/api/scam-check`.

Decision: scam detection is implemented as a modular scanner service that returns user-facing risk, confidence, indicators, explanation, and recommended action. The UI does not expose internal scoring or reasoning steps, which keeps the product calm and understandable for non-technical users.

Decision: previous scans are stored in PostgreSQL through the `ScamScan` model. Scan records are user-owned and cascade when the owning user is deleted.

Decision: stored scan history is separated from the scanner itself. This keeps future detection providers, OCR pipelines, and realtime safety checks replaceable without rewriting the page or history UI.

## AI Assistant

The AI assistant UI lives in `src/features/ai-assistant`, while provider integration lives behind the server-side `AiAssistantService` interface in `src/server/ai`.

Decision: UI components and API routes do not import provider SDKs or contain provider-specific logic. The dashboard chat posts to `/api/assistant`, and the route calls `getAiAssistantService()`.

Decision: the assistant behaves as a Security Coach, not a generic chatbot. The API builds a structured coaching context with the current score, active findings, completed fixes, and ranked next actions before calling the provider-neutral service.

Decision: action priority is derived from the same improvement-per-effort model used by the Fix Planner. This keeps coach advice consistent with the dashboard and prevents separate recommendation logic from drifting.

Decision: the default service is a provider-free local coach that returns deterministic guidance from structured security context. A production provider can be added later by implementing `AiAssistantService` and registering it with `setAiAssistantService()` without changing the chat UI.

Decision: assistant requests are authenticated, input-limited, and validated with Zod before reaching the service layer.

## Notifications

Notifications live in `src/features/notifications` with a protected route at `/notifications`.

Decision: notification rendering is separate from notification retrieval. The route calls `getNotificationService()` and passes typed data to UI components. This keeps the current in-memory implementation replaceable by database, queue, websocket, server-sent events, or push-backed implementations later.

Decision: filtering is URL-based instead of local-only state. This makes filtered views shareable, server-renderable, and compatible with future realtime refresh behavior.

Decision: notification records include severity, timestamp, read state, title, and description. Future persistence should preserve this contract and add delivery metadata without changing the UI components.

## Animation

Framer Motion is isolated behind `src/components/motion/reveal.tsx`.

Decision: animation should be reusable and opt-in. Components should not import Framer Motion directly unless they own a unique interaction.

## Accessibility

The scaffold includes:

- Semantic landmarks: `header`, `main`, `section`, `nav`.
- Keyboard-focus-visible states in shared controls.
- Accessible button/link composition through Radix Slot.
- Labeled theme switch.
- Decorative icons marked with `aria-hidden`.

Decision: accessibility belongs in primitives first so every feature benefits by default.

## Responsiveness

The UI uses mobile-first Tailwind classes and stable layout constraints:

- Container padding is centralized in Tailwind config.
- Hero content stacks on mobile and becomes two-column on larger screens.
- Dashboard metrics use a responsive grid.

Decision: every route should be usable at mobile width before feature-specific desktop optimizations are added.

## What Is Deliberately Not Included

The scaffold does not include:

- Multi-tenant organizations.
- Role-based authorization.
- Billing.
- Email magic links.
- Product breach/exposure models.
- Background jobs.
- Analytics.
- Test framework setup.

These are real architectural decisions that should be made with product requirements in hand, not guessed during scaffolding.

## Extension Rules

When adding new functionality:

1. Put route files in `src/app`.
2. Put domain behavior in `src/features/<feature>`.
3. Put reusable visual primitives in `src/components/ui` only if they are generic.
4. Put server-only integrations in `src/server`.
5. Validate external inputs with Zod at the boundary.
6. Add Prisma models only when the product workflow is defined.
7. Document new architectural decisions here before or with the implementation.
