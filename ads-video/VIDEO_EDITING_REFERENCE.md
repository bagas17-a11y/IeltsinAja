# Eng-InAja Video Editing Reference

## What's Set Up

Three complementary tools are installed and ready:

| Tool | Best For | Where |
|------|----------|-------|
| Remotion | Pure motion graphics / React animations | src/motion-graphics/ |
| HyperFrames | HTML/CSS/GSAP animations, website captures | via skill (hyperframes) |
| video-use | Talking-head editing: cuts, captions, grading | ~/Developer/video-use |

---

## Video Type Guide

### Type 1 — Motion Graphics
Pure animated scenes with no footage. What Scenes 1–4 are.
- Tool: Remotion (primary) or HyperFrames
- Files go in: src/motion-graphics/compositions/
- Render with: npx remotion render <id> out/motion-graphics/<name>.mp4

### Type 2 — Talking Head / Face-Cam
You appear on camera talking. Claude edits the raw footage.
- Tool: video-use
- Drop raw clips in: public/footage/
- Outputs land in: public/footage/edit/final.mp4
- Needs: ffmpeg + ElevenLabs API key (see setup below)
- Workflow: transcript → strategy approval → cut → grade → captions → render

### Type 3 — Hybrid (talking head + motion graphics overlay)
Your face talking, with animated callouts, captions, or scenes overlaid.
- Tool: video-use handles the footage edit; Remotion/HyperFrames generates overlay animations
- Overlay animations export from Remotion as transparent WebM or mp4, then composited by video-use

---

## Required Setup (One-Time)

### Install ffmpeg (REQUIRED for video-use and HyperFrames)
ffmpeg is not yet installed. Run this in Terminal:
```bash
# Install Homebrew first if not installed:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install ffmpeg:
brew install ffmpeg
```

### ElevenLabs API Key (REQUIRED for video-use transcription)
1. Get a key from: https://elevenlabs.io/app/settings/api-keys
2. Save it:
```bash
printf 'ELEVENLABS_API_KEY=your_key_here\n' > ~/Developer/video-use/.env
chmod 600 ~/Developer/video-use/.env
```

---

## Skills Installed (available in every Claude Code session)

From heygen-com/hyperframes:
- hyperframes         — build HTML/CSS video compositions
- hyperframes-cli     — preview + render commands
- hyperframes-media   — TTS, transcribe, background removal
- hyperframes-registry — install catalog blocks (captions, transitions, VFX)
- gsap                — GSAP animation patterns
- animejs             — Anime.js patterns
- css-animations      — CSS keyframe patterns
- lottie              — Lottie animation patterns
- three               — Three.js (3D) patterns
- waapi               — Web Animations API patterns
- remotion-to-hyperframes — convert Remotion → HyperFrames
- website-to-hyperframes  — capture websites as video

From browser-use/video-use (linked at ~/.claude/skills/video-use):
- video-use           — full talking-head editing workflow

From remotion-dev/skills:
- remotion-best-practices — Remotion patterns

---

## video-use Workflow (Talking Head)

1. Drop your raw .mp4 files into public/footage/
2. Start a session: describe what you want ("edit my IELTS intro video")
3. Claude will:
   - Transcribe all takes (ElevenLabs word-level)
   - Show you a strategy in plain English — YOU approve it
   - Cut on word boundaries, remove dead air and filler words
   - Apply color grade (warm_cinematic for talking heads)
   - Burn captions (2-word chunks, uppercase)
   - Composite any motion graphic overlays
   - Self-check every cut boundary
4. Final output: public/footage/edit/final.mp4

### Key Rules (non-negotiable for quality)
- 30ms audio fades at every cut (no pops)
- Subtitles applied LAST (never before overlays)
- Word-boundary snapping for all cuts
- Strategy must be confirmed before any editing starts
- Per-segment extraction + lossless concat (no double encoding)

---

## HyperFrames Quick Start

Alternative to Remotion for HTML/CSS/GSAP animations:
```bash
npx hyperframes init my-animation
cd my-animation
npx hyperframes preview      # live preview in browser
npx hyperframes render       # export MP4
```

Composition format (HTML with data attributes):
```html
<div id="stage" data-composition-id="scene1" data-start="0" 
     data-width="1080" data-height="1920">
  
  <video class="clip" data-start="0" data-duration="5"
         data-track-index="0" src="footage.mp4" muted playsinline></video>
  
  <h1 class="clip" data-start="1" data-duration="3"
      data-track-index="1">Your text here</h1>
  
  <audio data-start="0" data-duration="5" data-track-index="2"
         data-volume="0.4" src="music.mp3"></audio>
</div>
```
Supports: GSAP, CSS animations, Lottie, Three.js, Anime.js, WAAPI

---

## video-use EDL Format Reference

```json
{
  "version": 1,
  "sources": {"take1": "/abs/path/take1.mp4"},
  "ranges": [
    {
      "source": "take1", "start": 2.42, "end": 6.85,
      "beat": "HOOK", "quote": "your words here", "reason": "strong opener"
    }
  ],
  "grade": "warm_cinematic",
  "overlays": [
    {"file": "edit/animations/slot_1/render.mp4",
     "start_in_output": 0.0, "duration": 5.0}
  ],
  "subtitles": "edit/master.srt",
  "total_duration_s": 87.4
}
```

## Color Grades Available
- warm_cinematic — teal/orange split, desaturated (best for talking heads)
- neutral_punch  — minimal corrective with contrast bump and S-curve

---

## Directory Structure

```
ads-video/
  src/
    constants/          # shared colors, tokens
    motion-graphics/    # Remotion animations (Scenes 1–4)
    talking-head/       # face-cam compositions (future)
    templates/          # shared transitions, captions, overlays
  public/
    footage/            # drop raw .mp4/.mov here
    assets/             # logos, music, sfx
  out/
    motion-graphics/    # rendered Remotion outputs
    talking-head/       # rendered talking-head outputs

~/Developer/video-use/  # video-use toolkit (transcribe, cut, grade, render)
```
