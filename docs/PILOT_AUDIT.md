# Eng-InAja — Pilot Readiness Audit

> Date: May 22, 2026
> Scope: full learner + admin product walkthrough from the perspective of a senior product designer, UX auditor, QA engineer, and full-stack product engineer.
> Verdict: **Not pilot-ready out of the box.** Core flows work, but the public marketing surface contains false claims, dead CTAs, and conversion-blocking gaps. The dashboard modules are surprisingly mature, but onboarding, pricing, and trust are weak. About 1–2 days of focused work fixes the launch blockers.

---

## 0. Map of what exists today

### Public routes
- `/` — Landing (Hero, Social Proof, Feature Grid, Mission Bridge, Pricing, FAQ, Footer)
- `/auth` — Sign in / sign up (with Indonesian phone validation)
- `/verify-email` — OTP entry
- `/pricing-selection` — Plan picker + bank transfer + receipt upload
- `/waiting-room` — Post-payment waiting state, polls profile every 30 s
- `/privacy-policy`, `/terms-of-service`
- `/diagnostic-test` — **developer debug page exposed publicly** (security/UX bug)

### Learner dashboard
- `/dashboard` — Welcome + target band + Bridge to Success + Module cards
- `/dashboard/stats` — Performance stats (works, but only after data exists)
- `/dashboard/diagnostic` — 4 familiarity + 15 quiz questions
- `/dashboard/reading | listening | writing | speaking` — Practice modules
- `/dashboard/consultation` — Booking UI (Elite only; **fake consultants, dead "Confirm Booking"**)
- `/dashboard/elite` — Elite Hub landing tab
- `/dashboard/revision-notes`, `/dashboard/flashcards`, `/dashboard/flashcards/topic`
- `/dashboard/materials` — Detailed curriculum (Elite only) — **not linked in sidebar**

### Admin
- `/admin` → `AdminDashboard` (good)
- `/admin/payments` — old PaymentVerification (still wired, mostly redundant with `/admin/verify`)
- `/admin/verify` — PaymentVerification with tabs
- `/admin/content`, `/admin/content-manager` — Writing question manager
- `/admin/listening`, `/admin/listening-manager` — Listening test manager
- `/admin/users`, `/admin/subscriptions` — both go to `UserManagement` (decent)
- `/admin/dashboard` — same as `/admin`

### Orphan/dead code
- `src/pages/BankTransfer.tsx` — never routed; uses **different bank (CIMB Niaga, "PT IELTS Elite Indonesia")** than the live flow in `PricingSelection.tsx` (BCA, personal account)
- `src/pages/Admin.tsx` — 712-line monolith not used by router; superseded by `/admin/*` sub-pages
- `src/components/PurchaseRegistrationModal.tsx` — routes to non-existent `/payment?plan=…`
- `src/components/HumanPlusAILockScreen.tsx` — not imported anywhere
- `/diagnostic-test` page — dev tool, not customer-facing

---

## 1. Critical blockers (MUST fix before any pilot)

| # | Page / Component | Problem | Why it matters | Fix | Severity |
|---|---|---|---|---|---|
| 1.1 | `components/PricingMatrix.tsx` | The landing-page pricing cards have **no buy / sign-up button**. The only CTA on the public page is a header "Login". | The site explicitly invites traffic to `#pricing`, but a visitor cannot start a purchase from the marketing surface. Bounces 100% of cold traffic that does not already have an account. | Add a CTA per plan that routes to `/auth?mode=signup&plan=…` (or `/pricing-selection` if already logged in). | **Critical** |
| 1.2 | `components/SocialProofBar.tsx` | Claims **"Trusted by British Council, IDP, Cambridge, ETS, EF"** with logo placeholders. None of these are real partners. | False endorsement. In Indonesia this is a misleading-advertising risk and a credibility bomb the moment a real user notices. | Replace with honest social proof (e.g. founder credentials, beta tester quote, "Made by 8.5 scorers", "Indonesia-based") or remove the section entirely until real logos exist. | **Critical** |
| 1.3 | `components/MissionBridge.tsx` | "50,000+ Students Trained", "8.2 Average Band Score", "97% Success Rate" — fabricated metrics. | Same dishonesty problem; a sophisticated visitor will catch this and lose trust. | Replace with truthful framing ("Built for Indonesian IELTS candidates", "AI + alumni feedback in one app") or pilot-style stats once data exists. | **Critical** |
| 1.4 | `components/FAQSection.tsx` | Claims AI is validated within 0.5 bands in 94% of cases, examiners "have assessed 100,000 candidates", 14-day money-back guarantee, score-improvement guarantee. None can be substantiated. | Pilot phase = under-promise. Promising refunds you cannot honour is a refund-chargeback risk and erodes trust on first contact with a real refund request. | Rewrite FAQ with honest, pilot-appropriate answers. Explicitly position as a beta with founder support. | **Critical** |
| 1.5 | `pages/dashboard/ConsultationHub.tsx` & `EliteHubPage.tsx` | Hardcoded fake consultants (Dr. Sarah Mitchell, etc.) with star ratings & session counts; "Confirm Booking" button **has no `onClick`** — does nothing. | A paying Elite user cannot actually book a session — this is the headline feature of the IDR 2.5M plan. Trust killer + refund risk. | Either (a) wire booking to the founder's WhatsApp/Calendly with real names, or (b) show "Booking opens after onboarding — your consultant will reach out within 24 h" and disable the form. | **Critical** |
| 1.6 | `components/HeroSection.tsx` | "Watch Demo" button has no handler — a no-op. | Visible dead button next to the primary CTA. Looks broken. | Remove the button, or link it to a real Loom/YouTube/Instagram reel. | High |
| 1.7 | `components/AIChatbot.tsx` | The "Chat Button" trigger is commented-out empty markup. The chatbot is mounted globally but **can never be opened**. WhatsApp button is also missing. | The product mentions a chatbot in copy but provides no way to reach support. New users with questions cannot ask anyone. | Replace the broken trigger with a working floating support button. Combine with WhatsApp deep-link as the primary support channel. | High |
| 1.8 | `pages/NotFound.tsx` | A 404 silently redirects to `/pricing-selection`. | A wrong URL or stale link dumps the visitor into a checkout. Confusing, looks like a bait redirect. | Render a real 404 page with a "Back to home" and "Go to dashboard" button. | High |
| 1.9 | `components/UpgradeModal.tsx` vs `PricingMatrix.tsx` / `PricingSelection.tsx` | Pricing inconsistency: UpgradeModal says **"IDR 500K for 2 months"** while every other surface says **"per month"**. BankTransfer page (dead) says "2 months" too. | Different prices in different surfaces = guaranteed refund disputes. | Choose one. Centralise plan definitions in one module and import everywhere. | **Critical** |
| 1.10 | `pages/PricingSelection.tsx` | Bank account is a personal account ("Bagas Haryo Wicaksono") with no PT name, but copy in WaitingRoom says "Our team of examiners…" | Indonesian buyers will hesitate to transfer to a personal account without a clear company name or invoice/IDR amount confirmation page. | Either (a) show a clear "Operated by [legal entity / nama operator]" line + WA confirmation, or (b) upgrade to a real bank account / Midtrans/Xendit virtual account. Tighten copy. | **Critical** |
| 1.11 | `/diagnostic-test` route in `App.tsx` | Developer diagnostic page exposed publicly at `/diagnostic-test`. Calls edge functions on click. | Anyone can reach it and probe internal endpoints. Confusing for a user that lands there. | Move behind admin guard or delete for production. | High |
| 1.12 | `components/PurchaseRegistrationModal.tsx` | Navigates to `/payment?plan=…`, a route that does not exist. The 404 then redirects to `/pricing-selection`. | If this modal is ever invoked, signup loops oddly. | Either delete the component or update navigation to `/pricing-selection?plan=…`. | High |
| 1.13 | `pages/BankTransfer.tsx` | Dead code with a different bank (CIMB Niaga) and a different legal entity. | Inconsistency risk if any link ever points here. | Delete the file. | Medium |

---

## 2. Broken or missing buttons / CTAs

| Page | Element | Issue | Fix |
|---|---|---|---|
| `HeroSection.tsx` | "Watch Demo" | No `onClick`, no link. | Remove or wire to demo video. |
| `PricingMatrix.tsx` | Each plan card | No CTA at all. | Add "Get Started — Free", "Choose Pro", "Talk to Sales" (Elite → WhatsApp). |
| `Header.tsx` | Nav link "Get Me Started Now!" | Anchor to `#pricing`. Works, but for cold social-arrival traffic the term is ambiguous. | Rename to "Pricing" and add a separate top-right primary CTA "Start Free". |
| `Header.tsx` | Mobile nav | No "Sign up" CTA in the overlay, only "Login". | Add both. |
| `Footer.tsx` | "Help Center" link | `href="#"`. | Link to WhatsApp / mailto / FAQ anchor. |
| `Footer.tsx` | LinkedIn social link | `href="#"`. | Either provide real URL or remove the LinkedIn icon. |
| `Footer.tsx` | Empty company column | An empty `<div>` is rendered (column commented but kept). | Either remove or add About / Contact. |
| `ConsultationHub.tsx` | "Confirm Booking" | No `onClick`. | Wire to WhatsApp deep-link with auto-filled message (or backend insert + email to founder). |
| `EliteHubPage.tsx` | "Start Exam" on mock papers | Routes to `/dashboard/reading` — but the card claims a 2 h 45 m Academic full mock. Reading module is single-section. | Either build a full-mock flow or relabel as "Start a section" with disclaimer. |
| `EliteHubPage.tsx` | "Choose date & time" + "Book 1-on-1 Session" | Both route to Consultation Hub which is itself broken (above). | Fix Consultation Hub first. |
| `Dashboard.tsx` | "Edit target" pencil icon | Works, but no toast on confirm vs cancel. (Minor.) | Fine. |
| `MaterialsPage` | Not linked in sidebar | Elite users can't discover it. | Add to AppSidebar. |
| `AdminDashboard.tsx` quick action "Subscription Management" | Routes to `/admin/subscriptions` which renders `UserManagement` | Same page twice, no real subscription view. | Either remove the card or build a dedicated subscriptions view. |

---

## 3. Missing features required before pilot launch

| # | Area | What's missing | Why it's launch-blocking |
|---|---|---|---|
| 3.1 | Support channel | No working chat trigger, no WhatsApp floating button on landing, no clear "contact us" link. | Indonesian users from IG/TikTok expect WhatsApp support. Without it, conversion drops sharply. |
| 3.2 | Payment receipt confirmation | After upload, the user gets a toast and is sent to Waiting Room. No email confirmation. No "track my payment" link. | Buyers transferring IDR 500k+ need explicit confirmation. Loss of trust without it. |
| 3.3 | Localisation | All copy is in English, but the audience is Indonesian. Some bilingual exists in the AIChatbot only. | First-time conversion will be poor for non-fluent English speakers (ironic for an IELTS audience that ranges B1–C1). |
| 3.4 | Onboarding nudge after signup | After `/pricing-selection` → free plan → dashboard, the user lands on the dashboard with no clear "do this first" guide. The Bridge to Success card *does* say take the diagnostic, but module cards compete for attention. | Without a clear "Take the 5-minute diagnostic" highlight, free users will random-click and bounce. |
| 3.5 | Privacy & data handling for IELTS receipts | Receipts contain bank details and full names. The bucket is private, but there is no consent text on upload. | Privacy compliance + user comfort. |
| 3.6 | Refund / contact policy | No refund / contact page wired in. Currently only Privacy + Terms. | Indonesian buyers expect a contact / refund line. |
| 3.7 | Email notifications | Approval triggers `send-verification-email` (good), but payment submission / rejection do not. | Users wait blind on `/waiting-room` if not approved. |
| 3.8 | Demo / preview content | No visible demo of what AI feedback looks like — the cold visitor cannot judge product quality. | Conversion blocker. Even a static screenshot in the marketing page would help. |
| 3.9 | Mobile bottom-nav for dashboard | The sidebar collapses to a hamburger icon only; mobile usability is poor for module switching. | Indonesian users are >70% mobile. |
| 3.10 | "What is IELTS / What is this product" microcopy on landing | The hero says "The Intelligence to Simplify. The Guidance to Eng-InAja." It is a brand line — not an explanation. | First-time visitor from IG has no idea what product is. |

---

## 4. UX friction in the first-time user journey (IG/TikTok arrival)

Walked through the journey as a first-time user from Instagram (not signed in):

1. **Land on `/`.** Hero says "The Intelligence to Simplify. The Guidance to Eng-InAja." → No clear value prop. No clear action. "Get Started" smooth-scrolls to pricing — but pricing has no buy buttons.
2. **Scroll down.** Sees "Trusted by British Council, IDP, Cambridge…" → Either too good to be true or impressive; either way the savvy 7-band aspirant will know it's fake.
3. **Reach pricing.** Cannot do anything. Has to scroll back up to the header and find "Login" — but they have no account. They have to *infer* that clicking Login → "Don't have an account? Sign up" is the path.
4. **Sign up.** Asked for full name, Indonesian phone, email, password — good. Submits.
5. **OTP screen.** Email instructs 6-digit code. Form accepts 6–8 digits, which is confusing. Pressing back to home loses email.
6. **Pricing selection.** Now they see plans with CTAs (good). They choose Free → straight into Dashboard.
7. **Dashboard.** Shows target band = 7, Bridge to Success with "Take diagnostic", and 4 module cards. The diagnostic is not visually dominant; cards are equally weighted.
8. **Try Reading.** Free user gets ONE practice, then a paywall. No preview of what AI feedback looks like before the wall is hit.

### Friction summary
- **Value prop missing** in hero (severity High).
- **No buy CTA on landing** (severity Critical, see 1.1).
- **No "Sign up" link from header** (severity High).
- **Free-tier exhaust shows lock immediately**, not a sample first → no trust earned (severity Medium).
- **Indonesian language not first** (severity Medium).

---

## 5. UX friction in the returning student journey

1. Returning user logs in → `Auth.tsx` calls `resolveDestination`. Good — routes to dashboard or waiting room based on `is_verified`.
2. Dashboard shows the same module cards. **No "continue where you left off"** or "your last test scored 6.5 — try Reading hard next?"
3. Module pages restore prior session correctly (caches in `sessionStorage`). Good.
4. **Subscription banner**: shows for Pro only, never for Elite or Free. A free user with no progress sees no upgrade nudge inside the dashboard until they hit the wall.
5. **Stats page**: works, but if `progress` is empty it just shows "—". No CTA to start a test from this empty state.
6. **Logout flow**: works.

### Returning user friction
- No "continue where you left off" surfacing.
- No upgrade nudge in the dashboard until the wall.
- Stats page empty state has no action button.
- Pricing/upgrade page is hit from many places but always shows full plan picker rather than upsell to a specific tier.

---

## 6. Module-specific issues

### 6.1 Reading (`ReadingModule.tsx`)
- ✅ Solid: session caching, difficulty selector, timer, evidence highlight, paid-vs-free gating, AI-generated passage with explanations.
- ⚠️ Empty state (`!currentTest && !isGenerating && canAccess`) text is plain — could include "Tip: First test scored against your target band X."
- ⚠️ Submit button is disabled until *any* answer is provided. Good, but no warning if the user submits with most answers blank.
- ⚠️ After submit, there is **no completion celebration** (just a toast). For a 20-minute test, a richer summary screen would help retention.
- ⚠️ `Generate Test` button label says "Upgrade to Generate" when locked but the page also shows a centred "Free Practice Used" panel — confusing duplication. (Low severity.)
- ⚠️ `console.log` statements on session debugging still in code (low severity but should be removed for prod).

### 6.2 Listening (`ListeningModule.tsx`)
- ⚠️ **Audio falls back to `speechSynthesis`** when there's no `audio_url`. The product copy on the landing page says "Immersive practice with real accents—British, Australian, American". Web Speech TTS does not deliver that. **Trust gap.**
- ⚠️ The early "no tests + generate" branch and the "tests list + AI generate" branch are nested oddly. Code-review smell, but doesn't cause runtime bugs.
- ⚠️ Notes textarea is great, but is lost after submit — not persisted as a study artefact.
- ⚠️ When user hits Play, the timer starts immediately. Real IELTS has 10 minutes transfer time at the end; the product doesn't simulate this. Minor.

### 6.3 Writing (`WritingModule.tsx`)
- ✅ Strong: structural grade, scoring grid, vocabulary upgrades, Band 8 rewrites, revise & resubmit.
- ⚠️ The word-count counter on the textarea goes red below the minimum, but there is **no warning before submit** if the essay is short. Good UX would block-and-warn.
- ⚠️ "Restart" button erases the essay — no confirmation dialog. Users can lose 250 words of writing in one click.
- ⚠️ `Get AI Feedback` returns generic error in some edge cases ("Analysis failed") with no actionable next step (retry? contact support?).
- ⚠️ Admin override panel is helpful but shows only on the active session — overrides are not persisted to DB.
- ⚠️ Inline rubric: nice touch.

### 6.4 Speaking (`SpeakingModule.tsx`)
- ⚠️ Speech recognition is browser-only (Chrome/Edge). Safari + Firefox users get a destructive banner and dead buttons. No fallback to typing transcript or recorded audio + server-side transcribe. **Major usability gap for iOS Safari users (a huge slice of Indonesian users).**
- ⚠️ The microphone permission failure case is silent — user clicks Start Speaking, nothing happens.
- ⚠️ "New Question" generation regenerates `Part 1, 2, 3` all at once, then snaps the user back to Part 1, losing context.
- ⚠️ No timer for Part 2 prep / speak phases (real IELTS is 1 min prep + 1–2 min speaking).
- ⚠️ Audio playback works for the user's own recording (good), but the polished/improved transcript is read by the browser's built-in voices — quality varies wildly per OS.

### 6.5 Diagnostic Quiz (`DiagnosticQuiz.tsx`)
- ✅ 4 familiarity Qs + 15 graded Qs — fast and useful.
- ⚠️ After completion, the diagnostic writes a `user_progress` row with `exam_type='diagnostic'` which `BridgeToSuccess` reads. Good.
- ⚠️ But the diagnostic is buried inside `/dashboard/diagnostic` and only the BridgeToSuccess card surfaces it. The dashboard's module cards do not say "Start here". → see 4.

### 6.6 Cross-cutting
- All four modules use `useFeatureGating` correctly, but the "free practice used" gate counts entries since `sessionStorage.getItem('ielts-session-start')` — i.e. **the moment the user opens the tab**. Closing/reopening the tab resets free counters. That's lenient for users but also lenient for abuse. (Pilot OK; flag for later.)
- The four modules each generate AI tests but there's no central "library of past tests" so the user cannot revisit a passage they liked.

---

## 7. Admin portal issues

### 7.1 `AdminDashboard.tsx`
- ✅ Solid stats (users, pending, active subs, monthly revenue).
- ⚠️ `RefreshCw` button correctly re-fetches; activities derived from `admin_logs` + `profiles` + `payment_verifications` is decent.
- ⚠️ "Subscription Management" quick action goes to `/admin/subscriptions`, which renders the same User Management page — duplicate doorway. Either remove or build a real subscriptions view.

### 7.2 `PaymentVerification.tsx` (`/admin/verify`)
- ✅ View receipt → signed URL → modal preview. Approve / Reject buttons each call DB RPCs and log to `admin_logs`. Email is fired on approve.
- ⚠️ Approve does NOT confirm in a dialog. Hitting the checkmark accidentally approves a payment with no undo step. **Add a confirm dialog or "are you sure?".**
- ⚠️ Reject requires reason — good — but the rejection notification email is not sent (no `send-rejection-email` function call). Users get no feedback.
- ⚠️ No filter / search / sort on payments. With 100+ users this becomes painful.
- ⚠️ Old route `/admin/payments` still wired, identical functionality — keep one.

### 7.3 `UserManagement.tsx`
- ✅ Genuinely strong: search, filters, CSV export, sheet with payments + admin log, extend subscription, toggle admin role, verify user.
- ⚠️ "Toggle Admin" is a switch with no confirmation. Could accidentally grant admin to a user. **Add a confirm dialog.**
- ⚠️ Extending subscription has no warning if the user is `free` tier — extending changes nothing but is silently accepted.
- ⚠️ "Last Active" shows `updated_at` of the profile row — not actual login. Misleading column. Rename or compute from session.
- ⚠️ No bulk actions — fine for pilot but flag for soon-after.

### 7.4 `ContentManager.tsx` (Writing questions)
- (Read briefly) — appears functional for adding/editing/deleting Task 1 / Task 2 questions, including the AI-generation flow.
- ⚠️ Without inspecting the full file, the typical risks are: no draft state, no preview as student, no soft-delete (deletes are likely hard).

### 7.5 `ListeningManager.tsx`
- ⚠️ Manages audio uploads + transcripts + answer keys — non-trivial. Without a "preview as student" link, ops staff are flying blind when they finish a row.
- ⚠️ Audio file uploads in Indonesia from a 4G connection of ~5 MB will work; >20 MB likely fails. Need a progress indicator and resumable uploads (Tus).

### 7.6 Cross-cutting admin
- No global confirm-destructive-action pattern.
- No "this user has X open payments — approve all?" batch.
- Admin pages do not share the dashboard layout (no sidebar), so admins lose context. Could be intentional, but it would be friendlier with the sidebar plus an admin-mode banner.

---

## 8. Mobile responsiveness issues

| Page | Issue |
|---|---|
| `/` Hero | Stat block "50,000+ / 8.2 / 97%" forces three columns and looks cramped on 360 px screens. |
| `/` Header | Mobile menu shows nav links + Login only — no Sign-up. Logo + hamburger are fine. |
| `/dashboard` | Sidebar collapses to a hamburger trigger. There is **no mobile bottom-nav**, so module switching requires the hamburger → category → click. Real Indonesian mobile users will struggle. |
| `/dashboard/reading` | Two-column passage + questions becomes a single column on mobile (good), but timer + difficulty + generate button row is `flex-wrap` and overflows on iPhone SE. |
| `/dashboard/writing` | Practice view is OK; the editor textarea is height-fixed at 300px which is restrictive on mobile. |
| `/dashboard/speaking` | Waveform + Start button works; comparison panels overflow on small screens. |
| Admin pages | All admin tables overflow on mobile and require horizontal scroll. Acceptable, but the filter row above doesn't stack cleanly. |

---

## 9. Trust & credibility issues

- 🚨 Fake institutional logos and stats (see 1.2, 1.3).
- 🚨 Fake consultants with star ratings (1.5).
- 🚨 Fake FAQ claims of "94% accuracy validation", "former examiners", "money-back guarantee", "score-improvement guarantee" (1.4).
- 🚨 Personal-name bank account with no clear company entity (1.10).
- 🚨 LinkedIn + Help Center links go to `#`.
- 🚨 No "About us / Founders" page. Real Indonesian users from social media will Google this and find nothing.
- 🚨 Footer says "Designed for Excellence" but no team page exists.
- 🚨 No press / reviews / testimonials with names + photos + permission.
- ⚠️ Privacy policy and Terms exist, but they are not signposted at signup (no "I agree to…" checkbox).

The trust deficit alone will sink the pilot if not addressed.

---

## 10. Recommended fixes — sorted by priority

### 🔴 Must fix BEFORE pilot
Numbered for the implementation plan in `IMPLEMENTATION_PLAN.md`:
1. **Pricing CTAs on landing** — add buy buttons that route to auth/signup or pricing-selection.
2. **Remove fake social proof / stats / FAQ / consultants** — replace with honest pilot framing.
3. **Wire up "Watch Demo"** — either remove or link to a real asset.
4. **Add a real support trigger** — WhatsApp floating button on landing + dashboard.
5. **Fix or disable Consultation Hub booking** — wire to WhatsApp/Calendly or label "Coming soon" with a working contact path.
6. **Unify pricing copy** — single source of truth for plans across landing, modal, pricing-selection.
7. **Build a real 404** — replace silent redirect.
8. **Gate `/diagnostic-test`** — admin-only or delete.
9. **Bank transfer trust** — clear operator name, clear amount confirmation, IDR formatted, copy explaining 24-hour SLA, link to WA for help.
10. **Email notifications** — submission acknowledgement + rejection email.
11. **Hero copy** — explain what Eng-InAja is in plain English+Indonesian in two lines.
12. **Add sign-up route** — `/auth?mode=signup` directly from landing.
13. **Mobile nav for dashboard** — at minimum a quick-access strip for the four modules.
14. **Header sign-up CTA** + mobile sign-up entry.
15. **Dashboard first-action highlight** — promote diagnostic above module cards when not yet taken.
16. **Admin destructive-action confirmations** (approve / toggle admin / extend free user).
17. **Empty/loading/error states** — Stats page empty CTA; "no payments yet" CTAs; module-load errors with retry.
18. **Cleanup** — delete `BankTransfer.tsx`, `Admin.tsx`, `PurchaseRegistrationModal.tsx`, `HumanPlusAILockScreen.tsx`.
19. **Pricing-selection wording** — convert to a clean two-step (choose plan → confirm transfer) with operator info.
20. **Speaking module** — degrade gracefully on Safari/Firefox with a clear notice.

### 🟠 Should fix SOON AFTER pilot
- Localisation pass: Bahasa Indonesia as primary, English as secondary.
- Add "continue where you left off" on dashboard.
- Build a real "Subscription Management" admin page (transactions, MRR, refunds).
- Rejection email & receipt-pending email.
- Replace personal account with a Midtrans/Xendit virtual-account integration.
- Add a real Help Center / FAQ in Bahasa.
- Real founders / about page.
- Confirm dialog on Restart in Writing module.
- Server-side transcription fallback for Speaking on Safari.
- Build a real full-mock-exam runner (currently each card just sends user to Reading).
- Reduce reliance on `sessionStorage.getItem('ielts-session-start')` for free-tier gating — move to a daily/30-day budget instead.

### 🟢 Nice to have LATER
- Streak / gamification.
- Email digests with progress.
- Mobile app shell (PWA install banner).
- Founder-recorded video walkthroughs of the four modules embedded in the dashboard tour.
- Public landing page case studies with real student data.
- Multi-tenant white-label for IELTS schools.

---

## Specific product questions answered

> **What should a brand-new user do first after landing?**
> Right now: nothing actionable — they have to find Login in the header, sign up, choose a plan, then start a module. **It should be:** Click "Start Free" on the landing, sign up, take the 5-minute diagnostic, then receive a personalised "your starting band is 6.0 → here's your path" view.

> **Is there a clear diagnostic or first action?**
> The diagnostic exists at `/dashboard/diagnostic` and is good, but it's buried below module cards. After this audit it will be promoted.

> **Are module pages actually actionable or just navigational shells?**
> They are real practice modules with live AI generation. They are *not* shells. The problem is discoverability and trust on the way in, plus minor gaps in completion feedback.

> **Which buttons appear clickable but do not complete real tasks?**
> Watch Demo, Confirm Booking (Consultation Hub), Help Center, LinkedIn icon, the AIChatbot trigger (missing), pricing cards on landing.

> **Where do users get stuck?**
> Landing → pricing → "how do I buy?" Loop. Free user → first paywall → upgrade modal claims "for 2 months" while pricing says "per month". Elite user → Consultation Hub → "Confirm Booking" does nothing.

> **Which pages fail to create trust?**
> Landing (fake logos/stats/FAQ), Consultation Hub (fake consultants), Bank transfer (personal account, no operator name).

> **Which premium features are not explained well enough?**
> Elite: 5 hours 1-on-1 is mentioned but the booking flow doesn't deliver. Manual examiner essay reviews — what is the SLA? How are essays submitted? Bespoke study roadmap — generated when? By whom?

> **Which admin tools are too shallow for real operations?**
> Subscription Management (doesn't exist separately), Content Manager (no draft / preview-as-student), Listening Manager (no upload progress / preview), Payment Verification (no filter, no batch, no confirm).

> **What data or state feedback is missing after key actions?**
> Payment submission email; consultation booking confirmation; module-complete celebration; writing "your score improved by +0.5"; admin "payment approved + user notified".

---

## Appendix: pilot-honest pricing language (proposed)

- Free — Try one practice for each module. No card required.
- Pro — IDR 500K / month. Unlimited AI practice across Reading, Listening, Writing, Speaking + progress analytics.
- Elite — IDR 2.5M one-time. Everything in Pro + a personal study plan + 5 hours of live coaching with an 8.5+ scorer (booked over WhatsApp, scheduled within 24 hours).

This audit informs `docs/IMPLEMENTATION_PLAN.md` and the code changes that follow.
