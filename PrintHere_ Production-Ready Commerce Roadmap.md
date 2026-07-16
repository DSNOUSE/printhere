# Goal
Transform PrintHere from a polished marketing site with an MVP order flow into a production-ready commerce platform that can safely take real orders and payments in Nigeria, with a real catalog, accounts, fulfilment operations, SEO, and observability.
# Current State (from full-code analysis)
Stack: Next.js 15 App Router + TypeScript + Tailwind; Supabase (orders), Stripe (checkout/webhook), UploadThing (files), Resend (email). The marketing pages, component system, and the order happy-path work. Key blockers to production:
* Checkout trusts a client-supplied price (`app/order/page.tsx:93` -> `app/api/checkout/route.ts:72`).
* Payments: migrating off Stripe (not viable for NGN/Nigeria) to Paystack (NGN-native).
* Category navigation 404s: `app/products/[id]/page.tsx` shadows single-segment `app/products/[...slug]/page.tsx`.
* Two disconnected catalogs: Supabase `products` vs hardcoded `lib/product-categories.ts` (placeholder "coming soon" pages).
* No post-payment confirmation (only `cancelled` handled in `app/order/page.tsx`).
* Broken assets in prod (`public/images/icons/*` untracked) and committed secrets (`.env.local`).
* Mock auth (`components/layout/LoginModal.tsx`); no accounts, admin, or order status.
* Gaps: SEO/metadata, `next.config.js` empty, no tests/monitoring/analytics, no rate limiting.
# Definition of Done (production-ready)
* Payments settle in NGN via a supported provider; amounts are computed and verified server-side.
* One DB-driven catalog powers browse, configure, and order; no dead links.
* Customers get a confirmation/order-status experience; staff can manage orders.
* Auth, delivery, SEO, security headers, analytics, monitoring, and a baseline test suite are in place.
# Phase 0 - Stabilize and de-risk (P0, must-fix before real traffic)
**0.1 Server-side pricing (S).** Stop trusting client price; look up unit price from Supabase by `productId` in `app/api/checkout/route.ts`, recompute totals, validate quantity bounds. Done when a tampered `unitPrice` cannot change the charge.
**0.2 Payment provider = Paystack (M, in progress).** Replace Stripe with Paystack (initialize -> redirect -> signature-verified webhook -> email), computing amounts server-side and using the order id as the Paystack transaction reference (no schema migration needed). Done when a live NGN test payment marks an order `paid` and emails the customer.
**0.3 Fix routing + unify catalog (M).** Resolve the `[id]` vs `[...slug]` conflict and make categories/products DB-driven; retire `lib/product-categories.ts` as the source of truth. Done when every header/footer/`CategoryGrid` link resolves (no 404s) and browse == orderable catalog.
**0.4 Order confirmation & status (S/M).** Handle the post-payment return and add an order-status/receipt view (e.g. `/order/[id]`). Done when a paid user sees a receipt and can revisit status.
**0.5 Asset & secret hygiene (S).** Commit referenced images (`public/images/icons/*`, category images), rename space/paren filenames; untrack `.env.local` after moving vars to Vercel env, and rotate exposed keys. Done when a clean Vercel build shows no broken images and no secrets in the repo.
**0.6 Fix small correctness bugs (S).** Stray `;` in `components/layout/Header.tsx:44`, off-brand top-bar colour, remove dead `components/products/CategoryPage.tsx`.
# Phase 1 - Core commerce capabilities
**1.1 Pricing model = simple per-unit (S for launch).** Decision: keep per-unit x quantity now (no option matrix); price lives on the `products` row. A full size/stock/finish configurator is deferred post-launch.
**1.2 File preflight & proof approval (M/L).** Server-side validation of type/size and print checks (DPI, dimensions, bleed, colour space); add a proof-approval step before production. Secure uploads (auth in `lib/uploadthing.ts`) and link files to orders; replace the fake progress in `components/order/FileUploader.tsx`.
**1.3 Auth = guest checkout only (S for launch).** Decision: no customer accounts at launch. Remove or hide the mock `LoginModal` so nothing non-functional is shown; defer Supabase Auth + order history/reorder to post-launch.
**1.4 Admin dashboard & order lifecycle (M/L).** Staff views to list/manage orders and update status (wire the existing `sendOrderStatusUpdate` in `lib/email.ts`); add webhook idempotency in `app/api/webhook/route.ts`.
# Phase 2 - Conversion, logistics, and trust
**2.1 Fulfilment = in-house (M).** Decision: staff manage production and dispatch in-house. Capture a delivery address at checkout and let staff update status/tracking manually; third-party courier integrations deferred.
**2.2 Trust & conversion (M).** Reviews/testimonials, sample packs, WhatsApp/live chat, FAQ, and guarantees.
**2.3 Real product imagery (S/M).** Replace placeholder SVG icons with photography/mockups; wire `next/image` remote config as needed.
# Phase 3 - Growth and reliability
**3.1 SEO (M).** Per-page metadata + OpenGraph, `sitemap.xml`, `robots.txt`, canonical URLs, and `Product` JSON-LD (base is only `app/layout.tsx`).
**3.2 Security & hardening (S/M).** Security headers and `images` config in `next.config.js`; rate limiting + captcha on `app/api/contact` and checkout; wire the no-op `components/home/Newsletter.tsx` to a real list.
**3.3 Analytics & monitoring (S).** Product/analytics + conversion tracking and error monitoring (e.g. Sentry).
**3.4 Testing & CI (M).** Unit tests for pricing/webhooks, an e2e test for the order flow, and lint/type/test gates in CI.
# Sequencing & Dependencies
Phase 0 is strictly first and mostly independent, except 0.4 (confirmation) depends on 0.2 (provider) for the real return/webhook. Phase 1 depends on the unified catalog (0.3): 1.1 builds on the new schema, and 1.2/1.4 assume orders reference files and a status model. Phase 2 depends on accounts+admin (1.3/1.4) for tracking. Phase 3 can proceed in parallel once Phase 0 lands, but tests (3.4) are most valuable after 0.1/0.2 stabilise pricing and payments.
# Decisions (locked)
* Payment provider: Paystack (initialize + verify webhook).
* Pricing: simple per-unit x quantity for launch; option matrix deferred.
* Auth: guest checkout only; customer accounts deferred.
* Fulfilment: all in-house (staff-managed production, dispatch, status updates).
