# Packhouse

**Fulfilment infrastructure for growing online businesses.**

Packhouse helps small online sellers store, pack, dispatch, track and process returns without building their own fulfilment operation.

## Live product

**Live MVP:** https://packhouse-zeta.vercel.app/

The production application includes authenticated access, a hosted Supabase database and the core fulfilment workflows.

## Problem

Small online businesses can make sales without having the infrastructure or operational capacity to fulfil them reliably. Packhouse provides the operating layer between a seller receiving an order and the customer receiving it.

Instead of building their own storage, picking, packing, dispatch and returns operation, growing sellers can use Packhouse as their fulfilment partner.

## Pitch

> Small online businesses can make sales without the infrastructure to fulfil them reliably. Packhouse provides the operational layer between a seller receiving an order and the customer receiving it: inventory intake, packing, dispatch, delivery status and returns.

### Core workflow

**Seller → Packhouse → Pick & Pack → Dispatch → Customer → Returns**

## Primary users

### Small online seller / business owner
The seller is the commercial customer and payer. They rely on Packhouse to fulfil orders, manage stock and handle dispatch and returns.

### Packhouse fulfilment operator / staff
The fulfilment operator is the daily user of the application. They process orders, pick and pack items, monitor inventory, record dispatches and handle returns.

The end customer is an indirect user in the MVP: they receive the fulfilled order but do not use the internal Packhouse application.

## Day-one MVP — Must features

1. **Orders** — view incoming orders and fulfilment status.
2. **Inventory** — see stock received, available and allocated.
3. **Pick & Pack** — turn an order into a fulfilment task with a packing checklist.
4. **Dispatch** — record carrier/driver handoff and delivery status.
5. **Returns** — register returned parcels and inspect their condition.

The order workflow supports persistent status progression through the fulfilment operation, including **New → Picking → Packed → Dispatched**.

## Technology

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Supabase** for authentication and PostgreSQL database
- **Supabase Row Level Security (RLS)** for database access control
- **Vercel** for production deployment
- **GitHub Actions** for continuous integration

## Security

The Supabase operational tables use Row Level Security policies. Authentication is handled through Supabase Auth, and protected application routes require an authenticated user.

## Validation and CI

Every push to `main` and pull request targeting `main` runs the Packhouse GitHub Actions workflow.

The CI workflow:
1. Installs dependencies with `npm ci`.
2. Runs the production TypeScript/Next.js build with `npm run build`.

The latest production commit has a successful CI build check.

## Business model

Packhouse charges growing sellers through a combination of:

- fulfilment fees per order;
- storage fees;
- optional delivery services;
- optional returns services.

## Design

The editable MVP design is available in Figma:

**[Packhouse MVP Design — Figma](https://www.figma.com/design/BqjLW1ECakCMKcu3kTUX3Z)**

The exported design screens are also stored in `docs/designs/`:

- Overview
- Orders / Pick & Pack
- Inventory
- Dispatch
- Returns

## Repository documentation

- Business case: [BUSINESS.md](BUSINESS.md)
- Product requirements: [docs/PRD.md](docs/PRD.md)
- Implementation plan: [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)
- Design direction: [docs/designs/README.md](docs/designs/README.md)

## Local development

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with the Supabase project URL and publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Status

**MVP live and operational for the November 2026 project checkpoint.**

The current MVP demonstrates the core fulfilment operation from authenticated access through orders, inventory, pick & pack, dispatch and returns.
