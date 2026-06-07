# VELOXA

Business Owner Lead Network

## Core Flow

```
NFC Card
→ Activation
→ Owner Account
→ Sponsor Teaser
→ Lead Capture
→ CRM
→ Public Profile
```

## Current Modules

- Landing Page
- NFC Cards
- Owner Profiles
- Activation System
- Login System
- Sponsors
- CRM Contacts
- Lead Management
- Admin Dashboard

## Stack

- **Monorepo:** pnpm workspaces, Node.js 24, TypeScript 5.9
- **API:** Express 5, PostgreSQL + Drizzle ORM
- **Frontend:** React + Vite, Tailwind CSS v4, Framer Motion
- **Auth:** Session-based (connect-pg-simple), bcrypt password hashing
- **Validation:** Zod, react-hook-form
- **API Codegen:** Orval (from OpenAPI spec)

## Project Structure

```
artifacts/
  api-server/     # Express 5 REST API (port 8080)
  veloxa/         # React + Vite frontend (port 18117)
lib/
  db/             # Drizzle ORM schema + migrations
  api-spec/       # OpenAPI spec + Orval codegen
  api-client-react/ # Generated React Query hooks
  api-zod/        # Generated Zod schemas
```

## Setup

```bash
pnpm install
pnpm --filter @workspace/db run push     # Run DB migrations
pnpm --filter @workspace/api-spec run codegen  # Regenerate API client
pnpm --filter @workspace/scripts run create-admin admin@example.com your-password
```

Admin routes require a user with `role: "admin"`. Use the `create-admin` script above to create or promote an admin account, then sign in at `/login`.

NFC card statuses are `blank`, `active`, `lost`, or `suspended`. If legacy `inactive` values exist in the database, run:

```bash
pnpm --filter @workspace/scripts run migrate-card-status
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Express session secret |
| `PORT` | Server port (set by workflow) |

## NFC Token Format

Cards use the format `VX-XXXXXXX` (e.g. `VX-DEMO001`).

## Public Routes

| Route | Description |
|-------|-------------|
| `/u/:token` | Public NFC profile (Sponsor Teaser → Lead Form → Owner Profile) |
| `/activate/:token` | NFC card activation & owner account creation |
| `/login` | Owner login |

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/leads` | Lead management |
| `/admin/owners` | Owner management |
| `/admin/cards` | NFC card management |
| `/admin/sponsors` | Sponsor management |
| `/admin/crm` | CRM contacts from NFC activations |
| `/profile/settings` | Authenticated owner profile editor |
