# Eng-InAja — Pilot Fix Session Summary

Companion to `docs/PILOT_AUDIT.md` and `docs/IMPLEMENTATION_PLAN.md`. This document lists every change shipped in this session, grouped by the user problem it solves, plus the open product decisions still owed by the founder.

---

## What changed and why

### 1. Plan + contact single sources of truth (`src/lib/plans.ts`, `src/lib/contact.ts`)

**What changed**: Created two new modules. `plans.ts` defines Free / Pro / Elite once (display price, period, IDR amount, features, promo discount, plan key for `payment_verifications.plan_type`). `contact.ts` defines operator name, WhatsApp number, bank info and helpers (`buildWhatsAppLink`, `CONTACT_MESSAGES`).

**Why**: Pricing copy was contradictory across surfaces ("for 2 months" vs "per month"). Contact details were hardcoded in 6+ files. Centralising prevents drift and makes plan/price changes a one-line edit.

**User problem solved**: Buyers no longer see different prices in the upgrade modal vs. landing page. Everyone uses the same WhatsApp link, formatted identically.

---

### 2. Landing page — honest, conversion-ready, social-arrival friendly

#### `Header.tsx`
**Changed**: Renamed nav links (`How it works`, `Pricing`, `FAQ` instead of `Get Me Started Now!`). Added explicit `Log in` and `Start free` CTAs in the desktop header. Mobile menu now has both `Start free` (primary) and `Log in` buttons inline.
**Why**: A first-time visitor from social media now has a sign-up entry point in two visible places without scrolling.

#### `HeroSection.tsx`
**Changed**: Rewrote the headline ("Latihan IELTS lengkap. Feedback AI dalam detik.") with Bahasa + English value-prop bullets. Removed the dead `Watch Demo` button (no handler) and replaced with `See pricing` smooth-scroll. Added a subtitle clarifying what the product does in one sentence.
**Why**: The old hero ("The Intelligence to Simplify…") was a brand line, not an explanation. Cold visitors couldn't tell what the product was. The dead Watch Demo looked broken.

#### `SocialProofBar.tsx`
**Changed**: Removed the fake "Trusted by British Council, IDP, Cambridge, ETS, EF" logos and replaced with five honest pilot-stage trust pills ("Built by 8.5+ IELTS scorers", "Indonesia-based founding team", "WhatsApp support in Bahasa", etc.) and a disclaimer line.
**Why**: Misleading endorsement removed. Compliance risk in Indonesia + immediate-trust killer for anyone who Googles "is IELTSinaja affiliated with British Council".

#### `MissionBridge.tsx`
**Changed**: Removed fabricated stats ("50,000+ Students Trained", "8.2 Average Band Score", "97% Success Rate"). Replaced with three honest value pillars: AI for volume, humans for nuance, Indonesian first.
**Why**: A pilot product with 0 paying customers cannot honestly claim those numbers. Pilot-honest pillars convert better than fake stats once a savvy visitor catches them.

#### `FAQSection.tsx`
**Changed**: Rewrote all six FAQs with honest answers: what the product is, AI accuracy framing (no guarantees), how payment works, refund language ("case-by-case in the first 7 days"), team transparency, browser support. Added bilingual headline on Q1 and a "Chat on WhatsApp" link at the bottom.
**Why**: Old FAQ promised 94% AI accuracy, "former examiners with 100,000+ candidates", a 14-day refund guarantee, and score-improvement guarantee — all unverifiable. Honest FAQ retains trust when reality lands.

#### `PricingMatrix.tsx` ⭐ CRITICAL
**Changed**: Added per-plan CTAs that route logged-out users to `/auth?mode=signup&plan=<key>` and logged-in users to `/pricing-selection?plan=<key>`. Elite has a primary "Buy Elite" button + secondary "Talk on WhatsApp" link. Added a 3-card "How payment works" strip explaining BCA transfer + 24-hour SLA. Pulls plan data from the new `lib/plans.ts`.
**Why**: This was the #1 conversion blocker — the landing page told users to "Get Started" and scrolled them to pricing cards with no buy buttons. Now every plan has a path forward.

#### `Footer.tsx`
**Changed**: Removed dead `Help Center` and `LinkedIn` `href="#"` links. Removed the empty company column. Wired Product links to `/auth?mode=signup`. Added a real WhatsApp link, Instagram, and email contact icons. Replaced the "Designed for Excellence" line with operator info from `OPERATOR.name`.
**Why**: Dead links signal a half-finished product. Replaced with working contact channels.

---

### 3. Trust — WhatsApp support is now reachable

#### `WhatsAppButton.tsx`
**Changed**: Rewrote as a floating button with a peek-tooltip ("Need help? Chat with us…") using the centralised contact module. Mounted on the landing page via `Index.tsx`.

#### Removed: global `AIChatbot` mount in `App.tsx`
**Why**: The chatbot was globally mounted but the trigger button was a commented-out empty element — it could never be opened. Replaced with the working WhatsApp button on the landing page (where social-arrival traffic lands). The AIChatbot file is preserved; we can re-enable it later when we wire a real trigger.

---

### 4. Auth + onboarding nudges (`Auth.tsx`)

**Changed**:
- Honour `?plan=<key>` URL param: the user is sent to `/pricing-selection?plan=<key>` after signup or email confirmation, carrying their selected plan through.
- Added a microcopy line under phone field: "We use this for WhatsApp support and to confirm your payment."
- Added a small consent line on signup: "By creating an account you agree to our Terms and Privacy Policy."
- Replaced sentence-case button labels for consistency.

**Why**: Users picking a plan on the landing page no longer have to re-select it after signup. Phone field justification reduces friction. Consent on signup is basic privacy hygiene.

---

### 5. Dashboard — first-action highlight + Stats empty state

#### `Dashboard.tsx`
**Changed**: Added a prominent "Start with the diagnostic" callout above the modules for users who haven't taken it yet. Welcome message changes based on diagnostic state.

#### `ProgressOverview.tsx` empty state
**Changed**: Empty exam history is now actionable — three buttons (Diagnostic / Reading / Writing) instead of "No exam history yet. Start practicing!".

#### `AppSidebar.tsx`
**Changed**: Added a dedicated `Diagnostic` entry to the top-level nav. Added `Materials` link in the Elite group so Elite users can actually find that page (it was orphaned).

#### New: `MobileBottomNav.tsx`
**Changed**: Sticky bottom nav for mobile (Home + 4 modules). Hidden on desktop. Hooked into `DashboardLayout.tsx` with `pb-24` on the main area so content doesn't hide behind it.
**Why**: Indonesian mobile users (>70% of traffic) had to open the hamburger → group → click each time to switch modules. One-tap module switching unblocks mobile UX.

---

### 6. Pricing + payment — clear, IDR-honest, BCA-friendly (`PricingSelection.tsx`, `UpgradeModal.tsx`, `WaitingRoom.tsx`)

#### `PricingSelection.tsx`
**Changed**:
- Now pulls plan definitions from `lib/plans.ts` (single source of truth).
- Reads `?plan=<key>` query param and skips the picker, going straight into the transfer flow.
- Operator info banner ("Operated by Eng-InAja, run by Bagas Haryo Wicaksono") above the bank-details block.
- Added a "How payment works" info pill explaining the BCA pilot flow.
- Added a copy-amount button (in addition to the existing copy-account button) — Indonesian buyers can paste the exact rupiah amount into BCA mobile.
- Added a "Chat on WhatsApp" button in the transfer flow for buyers who need help.
- Added a "Notify us on WhatsApp" button on the post-submit confirmation screen.
- Friendlier confirmation copy ("Receipt received!" instead of "Payment Submitted!").

#### `UpgradeModal.tsx`
**Changed**: Rewritten to use the central `lib/plans.ts` so it shows the same `per month` / `one-time` periods as everywhere else. Replaced the broken "for 2 months" copy. Each plan card is now clickable and pre-selects that plan on the pricing page.

#### `WaitingRoom.tsx`
**Changed**: Honest pilot copy ("Verifying your transfer" instead of "Our team of examiners…"). Added a WhatsApp nudge button so buyers don't sit and wait silently. Bilingual touch ("Terima kasih!").

**User problem solved**: Buyers know they're transferring to a personal-name account because we say so plainly, they know it's a pilot, they have one-tap WhatsApp to chase, and the price they see is the same one they're charged.

---

### 7. Module polish

#### `WritingModule.tsx`
**Changed**:
- `Restart` button now opens a confirm dialog ("Your essay and feedback will be cleared — keep my work / yes, restart"). Previously one click wiped 250 words with no warning.
- `handleAnalyze()` now warns if the essay is below the IELTS minimum (150 words for Task 1, 250 for Task 2) and asks for explicit confirmation before submitting. Previously the only guard was a 50-char floor.

#### `SpeakingModule.tsx`
**Changed**: Replaced the destructive single-line "Speech recognition not supported. Please use Chrome or Edge." with a friendly amber-banner explaining the browser limitation, offering Chrome on iOS as a fix, and pointing Safari/Firefox users to WhatsApp for manual review.
**Why**: Indonesia is iPhone-heavy. Telling a paid Pro user "your browser doesn't work, sorry" without a path forward is a refund event waiting to happen.

---

### 8. Elite Hub + Consultation — no more fake consultants (`ConsultationHub.tsx`, `EliteHubPage.tsx`)

**Changed**:
- Removed fake consultants ("Dr. Sarah Mitchell", "Prof. James Crawford", "Ms. Emily Chen") and replaced with a single real coach card (founder Bagas, IELTS 8.5).
- "Confirm Booking" with no `onClick` is gone — booking is now a WhatsApp deep-link with a prefilled message that includes the student's name and the coach name.
- Added an honest pilot-stage banner explaining the 24-hour WhatsApp booking flow.
- Replaced the unrealistic "2h 45m full mock paper" cards (which all routed to `/dashboard/reading`) with four honest section practice cards routing to each real module, plus a clear note that the timed full-mock runner is coming after pilot.
- Removed the fake "Past Consultations" placeholder table.

**User problem solved**: An Elite buyer can now actually book a session. The headline feature of the IDR 2.5M plan is no longer a dead button.

---

### 9. Admin — confirmations on destructive actions

#### `PaymentVerification.tsx`
**Changed**: Approve now opens a confirmation dialog showing user / email / plan / amount before unlocking. Approving a wrong row is no longer a one-misclick event.

#### `AdminVerify.tsx`
**Changed**: Both approve and reject now require explicit confirmation in an `AlertDialog`. Reject dialog includes a note that automatic rejection emails are not yet wired (so the admin remembers to follow up on WhatsApp).

#### `UserManagement.tsx`
**Changed**:
- Toggling the `Admin` switch opens a confirmation dialog spelling out what's about to happen (`Grant admin privileges?` vs `Revoke admin privileges?`) with the affected user shown.
- "Extend subscription" dialog now warns when the target user is on the Free tier, explaining that extending just sets an end-date and doesn't upgrade them.

**User problem solved**: A small admin team can't accidentally grant admin to a random user or approve a fraudulent payment with a single mis-click.

---

### 10. Routing + cleanup

#### `NotFound.tsx`
**Changed**: Replaced the silent redirect to `/pricing-selection` with a real 404 page. Bilingual ("Halaman tidak ditemukan / Page not found"). Different primary action depending on whether the user is logged in (Back to home vs Go to dashboard). WhatsApp link if they're really stuck.

#### `App.tsx`
**Changed**:
- Removed the unused `AIChatbot` global mount.
- Removed the import of the orphaned `pages/Admin.tsx`.
- Moved `/diagnostic-test` to `/admin/diagnostic-test`.
- `DiagnosticTest.tsx` now guards itself behind an admin check and redirects non-admins to `/`.

#### Deleted dead files
- `src/pages/BankTransfer.tsx` (never routed; inconsistent bank details).
- `src/pages/Admin.tsx` (712-line monolith superseded by `/admin/*` sub-pages).
- `src/components/PurchaseRegistrationModal.tsx` (pointed at a `/payment` route that doesn't exist).

**Why**: Less attack surface, less drift risk, less confusion for the next engineer.

---

## What I deliberately did NOT do (and why)

These are launch-relevant but require a product decision or backend work outside this session.

1. **Real payment gateway (Midtrans / Xendit).** BCA-with-personal-account is fine for pilot; flagged for post-pilot.
2. **Rejection emails for payment-verifications.** No `send-rejection-email` Edge Function exists. Need backend work + email template approval from founder.
3. **Full Bahasa Indonesia localisation.** Added bilingual touches to highest-leverage surfaces (hero, FAQ Q1, WaitingRoom) but a full pass is post-pilot.
4. **A real full-mock-exam runner.** Currently Elite mock cards route to individual sections. Building the timed back-to-back runner is a 1-2 day task on its own.
5. **Server-side speech recognition for Safari/Firefox.** Added a friendly fallback message; building a real fallback (browser audio → Whisper) is a bigger task.
6. **Streak / gamification, PWA install banner, founder-recorded video walkthroughs.** Post-pilot polish.
7. **Persisted writing-module admin overrides.** Currently in-memory only. Needs a new column or table.
8. **Listening module audio bug.** The fall-back to `speechSynthesis` for missing audio URLs still exists; needs admin to upload real audio or a more graceful "audio coming soon" UX.

---

## Verification

- `npm run typecheck` — passes.
- `npm run lint` — passes (0 errors, only pre-existing `no-explicit-any` warnings in legacy modules that I did not touch).
- `npm run build` — succeeds (3399 modules, 1.96 MB bundle, 540 kB gzipped).

---

## Open product decisions still owed by the founder

Listed in priority for the pilot.

1. **Are we OK pricing Pro at IDR 500K / month and Elite at IDR 2.5M one-time?** I unified to those numbers everywhere. If the real intent is "IDR 500K for 2 months", change `PLANS[1].period` and `displayPrice` in `src/lib/plans.ts` once.
2. **Bank account: keep BCA personal, or switch to a PT account / virtual account before pilot?** I've added clear operator framing for the current personal account, but a PT account would be much more reassuring for Indonesian buyers transferring 500k–2.5M IDR.
3. **What's the WhatsApp SLA we want to commit to publicly?** I wrote "we usually reply within minutes during Jakarta hours" and "verify within 24 hours". Tell me if that's too tight or too loose.
4. **Refund policy.** I wrote "case-by-case in the first 7 days" in the FAQ. Confirm/replace.
5. **Are we OK with the "no affiliation with British Council/IDP/Cambridge" disclaimer being public?** Required for honesty; if you'd rather remove the entire mention (instead of disclaimer-ing it), I can drop the line.
6. **Email notifications.** Do you want me to draft a `send-payment-submitted` Edge Function that emails buyers immediately after they upload a receipt? It's ~30 min of work but needs you to approve the email copy.
7. **Listening audio**: Are you committing to upload real-accent audio files for each generated listening test? Or do you want a banner like "audio playback coming soon, read the transcript while we record real audio"? The current `speechSynthesis` fallback breaks the "real accents" promise.
8. **Diagnostic gating**: Should the Free plan require the diagnostic before unlocking practice? Right now it's optional. Forcing it improves data quality + first-week retention.
9. **What's your real LinkedIn URL / About page?** I removed dead social links; if you have them, send me the URLs and I'll wire them in.
10. **Mobile bottom nav**: I picked Home + 4 modules. If you'd prefer Diagnostic / Reading / Listening / Writing / Speaking (no home tab), or include Elite, tell me.

---

## Quick QA checklist before pilot launch

A 15-minute manual run for the founder.

- [ ] Landing page → "Start free" → signup flow → land in dashboard.
- [ ] Landing page → "Choose Pro" on pricing card → signup carries plan through → pricing-selection opens transfer flow → upload a dummy receipt → see WaitingRoom.
- [ ] As admin → `/admin/verify` → approve a payment with the confirmation dialog → user receives email and is unlocked.
- [ ] As admin → `/admin/users` → toggle admin on a test user → see confirmation dialog → confirm → user gains admin.
- [ ] As Elite user → `/dashboard/consultation` → WhatsApp button opens WA with prefilled message.
- [ ] On iPhone Safari → `/dashboard/speaking` → see friendly browser-support banner with WhatsApp escape hatch.
- [ ] On mobile → switch between modules using the bottom nav.
- [ ] 404 — visit `/some-fake-path` → see real 404 page, not a checkout redirect.
- [ ] Free user reaches paywall in Reading → upgrade modal shows the same IDR 500K / month as the rest of the app.

If anything in this list breaks, ping me and we'll fix before launch.
