# Eng-InAja — Pilot Fix Implementation Plan

Companion to `docs/PILOT_AUDIT.md`. This file lists the exact changes I am making in this session, grouped by area. Every change ties to a numbered finding in the audit's "Must fix BEFORE pilot" list.

## Principles

1. **Conversion over decoration.** Every landing-page fix must close the loop from arrival to signup to first action.
2. **Honesty over flash.** Remove every fake claim, replace with truthful pilot framing.
3. **No dead UI.** Every button must do something real, navigate somewhere meaningful, or be clearly disabled with "Coming soon" microcopy.
4. **Centralise plan definitions.** Single source of truth for plans across landing, modal, pricing page.
5. **Preserve working code.** The four practice modules, Auth, PaymentVerification approval flow, and admin user management work — leave their internals alone and improve only their UX edges.

## Implementation order

### Block A — Foundations
- `src/lib/plans.ts` — new single source of truth for plan definitions (price, features, billing notes, CTAs).
- `src/lib/contact.ts` — new module for support / WhatsApp / WA-deep-link helpers.

### Block B — Landing page honesty + conversion (audit findings 1.1, 1.2, 1.3, 1.4, 1.6, 1.11, 1.13)
- `Header.tsx` — primary CTA + Sign-up CTA, mobile menu CTA, rename "Get Me Started Now!".
- `HeroSection.tsx` — rewrite headline with plain-English+Indonesian value prop; remove dead "Watch Demo" button.
- `SocialProofBar.tsx` — replace fake institutional logos with honest "Built by IELTS 8.5+ scorers for Indonesian students" trust strip.
- `MissionBridge.tsx` — replace fabricated metrics with honest pilot framing.
- `FAQSection.tsx` — rewrite Q&A with truthful answers.
- `PricingMatrix.tsx` — add per-plan CTAs that route correctly.
- `Footer.tsx` — remove empty column, fix dead links, add contact, clean LinkedIn placeholder.

### Block C — Trust elements
- `WhatsAppButton.tsx` — already exists but unused; mount it on the landing page (replacing the broken AIChatbot trigger).
- New: a small "How payment works" section embedded in `PricingMatrix` so cold buyers know what to expect.

### Block D — Auth + onboarding (1.7)
- `Auth.tsx` — add brief "Why we ask for phone" microcopy, link to terms/privacy with consent line.
- `Dashboard.tsx` — first-action highlight (promote diagnostic ABOVE modules until taken), softer welcome state for free users.

### Block E — Pricing & payment (1.9, 1.10)
- `PricingSelection.tsx` — clarify operator info, IDR amount confirmation, link WhatsApp for help, IDR formatted amount, "what happens next" microcopy.
- `UpgradeModal.tsx` — use centralised plans, fix "for 2 months" inconsistency.

### Block F — Module polish (audit §6)
- `ReadingModule.tsx`, `ListeningModule.tsx`, `WritingModule.tsx`, `SpeakingModule.tsx` — minor empty-state copy, completion celebration toast wording, warning before submitting writing with low word count, browser-unsupported notice for Speaking, confirm before "Restart" in Writing.

### Block G — Elite Hub & Consultation (1.5)
- `ConsultationHub.tsx` — Replace fake consultants. Wire booking to WhatsApp with prefilled message. Add SLA copy.
- `EliteHubPage.tsx` — Replace fake consultants. Fix booking buttons. Mock-exam card → realistic copy ("Start practice — full mock coming soon").

### Block H — Admin polish
- `PaymentVerification.tsx` — Add confirm dialog on approve.
- `UserManagement.tsx` — Add confirm dialog on admin-role toggle, warn when extending a free user.
- `Admin*` cleanup — kill duplicate "Subscription Management" entry → clearer naming.

### Block I — Misc routing + cleanup (1.8, 1.11, 1.12, 1.13)
- `NotFound.tsx` — real 404 page.
- `App.tsx` — `/diagnostic-test` becomes admin-only.
- Delete `BankTransfer.tsx`, `Admin.tsx`, `PurchaseRegistrationModal.tsx`, `HumanPlusAILockScreen.tsx`.
- `AppSidebar.tsx` — add Materials link for Elite.

### Block J — Mobile + verification
- `Dashboard` — quick-access strip for mobile.
- Run `npm run typecheck`, `npm run lint`, `npm run test`.

## What I am explicitly NOT doing in this session

- Switching to a real payment gateway (Midtrans/Xendit). Out of scope; flagged for post-pilot.
- Building a real full-mock-exam runner. Flagged.
- Full Bahasa Indonesia localisation. Adding bilingual microcopy only on highest-leverage surfaces (hero, pricing CTA, WaitingRoom).
- Re-architecting the four practice modules.
- New backend functions (rejection email, etc.). I will leave a note for the owner.
