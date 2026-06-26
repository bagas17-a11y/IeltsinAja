# Eng-InAja Ads — Project Memory

## What this project is
Remotion (React) video ad project for Eng-InAja — an AI-powered IELTS prep platform
targeting Indonesian students. Two video formats exist:

- 9:16 vertical (1080×1920) — social media promo, 4 scenes done
- 16:9 horizontal (1920×1080) — SaaS product showcase, Scene 1 done

---

## Folder structure

```
src/
  constants/colors.ts           — shared color tokens (import as COLORS)
  motion-graphics/
    compositions/               — 9:16 promo scenes (Scene1–4)
    components/                 — ErrorSquiggle, PhoneMockup
  saas/
    compositions/               — 16:9 SaaS scenes
    components/                 — OrbitalRing, GlassCard
  talking-head/                 — future face-cam editing
  templates/                    — shared transitions, captions, overlays
public/
  footage/                      — drop raw .mp4/.mov clips here
  assets/                       — logos, music, sfx
out/
  motion-graphics/
  talking-head/
```

---

## Color palette — always import from src/constants/colors.ts

```ts
COLORS.deepNavy    = '#0B0F1C'   // darkest bg
COLORS.navy        = '#131928'
COLORS.cardSurface = '#192030'
COLORS.secondary   = '#1E2840'
COLORS.cyanAccent  = '#6ECEF5'   // PRIMARY brand accent — used on all key UI
COLORS.warmGlow    = '#F5803A'
COLORS.eliteGold   = '#F0B92A'   // achievement, scores, premium
COLORS.pearl       = '#F8FAFC'   // main white text
COLORS.pearlMuted  = '#D1D8E0'
COLORS.mutedText   = '#7A9BBF'
COLORS.border      = '#253147'
COLORS.destructive = '#E5534B'   // errors, red squiggles
```

SaaS scene additional (defined inline in scene files):
```ts
SCENE_BG  = '#050810'           // near-black, darker than deepNavy
CHIP_BLUE = 'rgba(99,120,220,0.85)'  // accent chip color
cardBg    = 'rgba(19,25,40,0.85)'
cardBorder= 'rgba(110,206,245,0.18)'
```

---

## LOGO RULE — never break this

Never render "Eng-InAja" as a single string. Always two sibling spans:
```tsx
<span style={{ fontWeight: 400, color: COLORS.pearl }}>IELTS</span>
<span style={{ fontWeight: 700, color: COLORS.cyanAccent }}>inAja</span>
```

---

## Animation style rules

- NO CSS transitions or CSS animation classes — Remotion only renders via useCurrentFrame()
- All animations use interpolate() or spring() from 'remotion'
- Speed factor: all 9:16 scenes use `const frame = useCurrentFrame() * 0.8` (20% slower)
- Easing: Easing.bezier(0.65, 0, 0.35, 1) for camera moves, Easing.out(Easing.cubic) for entries
- Springs: damping 8-14, stiffness 130-220 depending on snappiness needed
- Fonts: Arial for body/UI text, 'Inter, sans-serif' for SaaS logo letters
- Letter spacing: -2px on large headlines, 0.5-3px on small caps/labels

### Entry animation patterns
- Elements slide up from +60-120px with spring + opacity fade
- Stagger: 3-8 frames between sibling elements
- Scene transitions: radial glow wipe (warm orange or cyan) frames 0-15
- Bloom out: radial white/cyan glow in last 20-25 frames before scene end

### Camera system (used in Scene 3 and SaaS scenes)
```tsx
const camFocusX = interpolate(frame, [keyframes...], [xPositions...], { easing: camEase });
const camTX = 540 - camFocusX * camScale;  // keeps focus point at screen centre
// Apply: transform: `translate(${camTX}px, ${camTY}px) scale(${camScale})`
// transformOrigin: '0 0'
```

---

## 9:16 Promo video — 4 scenes complete

### Scene 1: Writing Struggle (150 frames → 188 at 0.8x)
Student's essay appears word by word (typing animation using flex word layout).
At frame 60 error squiggles appear under 4 wrong words, badges pop in,
then a band score card "5.0" slams in with screen shake and red flash.
File: src/motion-graphics/compositions/Scene1_WritingStruggle.tsx

### Scene 2: Product Reveal (180 frames → 225 at 0.8x)
Cyan wipe transition → phone mockup drops in → sentence correction animation
(strikethrough + cyan correction types in) → AI feedback card slides up with
score counting 5.0→7.5 and progress bar → module pills (Reading/Listening/Writing/Speaking).
File: src/motion-graphics/compositions/Scene2_ProductReveal.tsx

### Scene 3: Social Proof (180 frames → 225 at 0.8x)
Camera system: starts zoomed 2.2x at red node, travels to gold, then cyan node
(camera arrives exactly when each node springs to life), then zooms out to reveal
arc + stat cards. Nodes: 5.0 (red), 6.5 (gold), 7.5 (cyan). Three stat cards
with SVG icon draw-on. Bottom gold pill: "Naik Band dalam < 2 Bulan ✦"
File: src/motion-graphics/compositions/Scene3_SocialProof.tsx

### Scene 4: CTA (150 frames → 188 at 0.8x)
Logo letters stagger in (10 letters, 3-frame stagger, spring from -60px).
Tagline, divider, price badge (spring overshoot), CTA button with shimmer sweep,
free note, URL. Floating particles (8 dots) oscillate throughout.
File: src/motion-graphics/compositions/Scene4_CTA.tsx

### Full stitched video
Composition id: Eng-InAjaPromoFull — 826 frames via Series
File: src/Root.tsx

---

## 16:9 SaaS video — Scene 1 complete

### SaaS Scene 1: Hero (120 frames)
Glass Health-inspired UI. Near-black bg (#050810) with blue-purple ambient glow.
Components: OrbitalRing (spinning SVG rings with dot nodes), GlassCard (glassmorphism).

Layout (1920×1080):
- Logo + announcement badge: top 72px
- Main glassmorphism card: top 385px
- Feature chips (3D stacked): top 700px
- Stats bar: top 878px

Key animations:
- Scene fade-in frames 0-10
- Card rises from +100px, frames 0-18
- Card border shimmer sweep frames 18-55
- Ask AI button glow intensifies frames 70-110
- Typewriter response frames 18-90
- 3D chip stack (front/middle/back with rotateX, scale, blur)
- Bloom transition to Scene 2 frames 95-119

Camera zoom: scale 1.0→2.8, transformOrigin '72% 40%' (anchored to Ask AI button)
File: src/saas/compositions/SaaS_Scene1_Hero.tsx

---

## Reusable components

### OrbitalRing (saas/components/OrbitalRing.tsx)
Props: size, frame, opacity?, spinMultiplier?, style?
3 concentric SVG rings with 4 dot nodes on outer ring. All rotate at different speeds.
Pulse: scale oscillates ±2.5% via Math.sin(frame * 0.08).

### GlassCard (saas/components/GlassCard.tsx)
Props: width?, height?, children, glowIntensity?, tiltX?, tiltY?, style?
Glassmorphism: rgba(19,25,40,0.85) bg, backdrop-filter blur(16px), cyan glow boxShadow.
3D perspective wrapper with rotateX tilt.

### ErrorSquiggle (motion-graphics/components/ErrorSquiggle.tsx)
Props: width, startFrame, color
SVG squiggly underline, animates via strokeDashoffset.

### PhoneMockup (motion-graphics/components/PhoneMockup.tsx)
Renders a 580×1060 phone frame shell with notch, top bar (logo + "Writing ✦"),
and content area. Uses COLORS.navy/deepNavy/cardSurface.

---

## Tools & skills installed

- Remotion (primary rendering engine)
- HyperFrames skills (15 skills: GSAP, Lottie, Three.js, CSS animations, etc.)
- video-use at ~/Developer/video-use (for talking-head editing — needs ffmpeg + ElevenLabs key)
- lucide-react installed

## Dependencies needed for talking-head editing
- ffmpeg: NOT YET INSTALLED (needs `brew install ffmpeg`)
- ElevenLabs API key: save to ~/Developer/video-use/.env

---

## Render commands

```bash
cd /Users/bhw/Eng-InAja/ads-video

# Preview
npx remotion studio

# Render individual scenes
npx remotion render Scene1WritingStruggle out/motion-graphics/scene1.mp4 --concurrency=4
npx remotion render SaaSScene1Hero       out/saas/scene1.mp4 --concurrency=4

# Render full promo
npx remotion render Eng-InAjaPromoFull  out/motion-graphics/full.mp4 --concurrency=4
```

---

## Design philosophy / style notes

- Dark, premium aesthetic — never bright white backgrounds
- Cyan (#6ECEF5) is the brand accent — used sparingly for key UI elements only
- Gold (#F0B92A) = achievement, scores, premium features
- Warm orange (#F5803A) = energy, transition wipes
- Red (#E5534B) = errors, problems (used in Scene 1 to show grammar mistakes)
- Glassmorphism for SaaS: blurred cards with cyan glow borders
- Always show progress/improvement — the narrative is 5.0 → 7.5
- Indonesian audience: some copy in Bahasa Indonesia (e.g. "Sekarang", "dalam 2 bulan")
- Font stack: Arial for body, Inter for SaaS display text
- Never use CSS animations — everything through Remotion's frame system
