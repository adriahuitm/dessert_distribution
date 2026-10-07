# Dessert Rescue

Dessert Rescue helps people find end-of-day bakery treats that are free or discounted. Bakery offers can be open to everyone or reserved for students.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Working MVP flows

- Browse, search, and filter offers by free or student eligibility.
- Publish a bakery offer with price, quantity, pickup window, area, and eligibility.
- Reserve a portion and receive a confirmation code. Reservations decrement the available quantity.
- Load licensing zones and business activity reference options through the Rebana sandbox integration when credentials are configured.

The starter offers are fictional sample data. Offers and reservations are stored in `.local-data/offers.json` on the machine running this local app. This file is created on the first write and is excluded from version control.

## Rebana sandbox setup

Copy `.env.example` to `.env.local` and configure the sandbox credentials supplied by the license app administrator. Keep `.env.local` private and out of version control. The token stays on the server behind the same-origin allowlisted `/api/sandbox/*` proxy.

API specification: [Rebana License sandbox](https://rebana.canang.com.my/rebana-license/v3/api-docs/sandbox).

The Rebana API provides licensing reference data used for bakery area/activity context. It does not provide bakery offers or reservations; those are handled by this app's local API routes.

## App structure

- `src/modules/offers/` - customer discovery and bakery publishing screens.
- `src/app/api/offers/` - local offer and reservation endpoints.
- `src/lib/offer-store.ts` - local JSON persistence and inventory updates.
- `src/shared/data/offers.ts` - fictional seed listings.
- `src/shared/services/` and `src/shared/models/` - Rebana reference data calls and types.
- `src/core/auth/` and `src/app/api/sandbox/` - server-side credential flow and allowlisted API proxy.

## Prototype limits

This is a single-machine prototype, not ready for public deployment. The JSON file store does not synchronize across server instances, and bakery accounts, ownership verification, notifications, payment, and customer identity are not implemented. Do not enter sensitive information.
