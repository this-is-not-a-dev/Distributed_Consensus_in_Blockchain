# ShipLabs: Major Project Presentation

> An animated, step-by-step presentation of **ShipLabs**, an AI tutor that teaches, checks and coaches, in the browser and inside VS Code. About 90 minutes.

**[▶ Play it live](https://this-is-not-a-dev.github.io/Distributed_Consensus_in_Blockchain/decks/Pathshala/ShipLabs/)** · [Presentation hub](https://this-is-not-a-dev.github.io/Distributed_Consensus_in_Blockchain/)

Built on the same engine as PPT 1 (one step per click, presenter window, deep links, resume), with a new look: every slide is an animated diagram drawn on a fixed 16:9 artboard, over a live 3D backdrop that drifts and re-tints between slides.

## Getting started

```bash
bun install      # or: npm install
bun run dev      # starts Vite on http://localhost:5173
```

## Presenting

| Action | Input |
| ------ | ----- |
| Next step | `→` `↓` `Space` `PageDown`, scroll down, swipe left/up |
| Previous step | `←` `↑` `PageUp`, scroll up, swipe right/down |
| Replay current slide | `R` |
| Restart whole deck | `Shift` + `R` |
| Open presenter window | `N` |
| Full screen | `F` |

Press **`N`** to open the presenter window on your laptop: a live mini preview of the slide, the script for the current step, the next step's script and a timer. It follows the main window through `BroadcastChannel`. The URL tracks your position (`#/slide/7/step/3`), and the deck offers to resume where you stopped. `prefers-reduced-motion` is honoured.

## Slide index

| # | Title | Part | Steps | ~Min |
|:-:|-------|:----:|:-----:|:----:|
| 1 | ShipLabs | Intro | 1 | 1 |
| 2 | The Road Map | Intro | 3 | 2 |
| 3 | The Problem | A | 4 | 3 |
| 4 | What the System Must Guarantee | A | 2 | 2 |
| 5 | Meet ShipLabs | A | 5 | 3 |
| 6 | Who It's For | A | 4 | 3 |
| 7 | System Architecture | A | 5 | 4 |
| 8 | Tech Stack | A | 2 | 2 |
| 9 | Data Model | A | 3 | 3 |
| 10 | Answers That Stream Live | B | 3 | 3 |
| 11 | Unboxing Control Blocks | B | 3 | 3 |
| 12 | Tutor: Getting to Know You | B | 3 | 3 |
| 13 | The Tutor State Machine | B | 2 | 3 |
| 14 | The Intent Gate | B | 4 | 3 |
| 15 | Points You Can't Farm | B | 3 | 3 |
| 16 | A Question That's Actually Right | B | 2 | 2 |
| 17 | Four Checkpoints of Truth | B | 4 | 4 |
| 18 | Draw It or Find It | B | 2 | 2 |
| 19 | Your Notes Become a Course | B | 3 | 3 |
| 20 | Beating the Forgetting Curve | B | 3 | 3 |
| 21 | Credits, XP and Ranks | B | 3 | 3 |
| 22 | Coach: One Sentence, Full Project | C | 3 | 3 |
| 23 | The Code Review | C | 3 | 3 |
| 24 | VS Code: Connect Once | C | 3 | 3 |
| 25 | Every 5 Seconds | C | 2 | 2 |
| 26 | The Pause That Triggers a Review | C | 3 | 3 |
| 27 | Comments, Never Code | C | 2 | 3 |
| 28 | Hands Off, I'll Run It | C | 3 | 3 |
| 29 | Everything on One Page | C | 2 | 2 |
| 30 | Three Engines, One Answer | C | 3 | 2 |
| 31 | Locks Everywhere | C | 2 | 3 |
| 32 | By the Numbers | C | 1 | 2 |
| 33 | How It Was Built | C | 2 | 2 |
| 34 | Thank You | C | 1 | 1 |

**Total:** 34 slides, 94 steps, about 90 minutes. Part A: the idea. Part B: teach and trust. Part C: build and ship.

## Architecture

```text
src/
├── main.tsx              Entry: <App/> or <PresenterView/> by URL hash
├── App.tsx               Projected window: backdrop, rail, stage, top bar, dock
├── config.ts             Motion timings, artboard size, colours, part labels
├── engine/               StepEngine (input lock, URL sync), GSAP step timelines, presenter sync
├── store/useStore.ts     Zustand position store
├── world/Backdrop.tsx    The one persistent 3D canvas (code dust + wireframe hull)
├── scene/
│   ├── Stage.tsx         Scales the 1280×720 artboard; "camera push" between slides
│   └── kit.tsx           Shapes (Card, Orb, Win, Code, Ring, Wire, Packet…) + GSAP helpers
├── ui/                   TopBar, StepRail, ControlDock, SlideNavigator, StepDots, Logo
├── presenter/            Presenter window
└── slides/
    ├── meta.ts           Titles, parts, step counts, timings
    ├── registry.ts       Auto-loads every SlideNN.tsx (file order = slide order)
    └── SlideNN.tsx       Scene + one rail card and one speaker script per step
```

**Design rule:** `StepEngine` is the only code that changes position. Each scene's GSAP timeline has one labelled segment per step, so Back plays the exact reverse and deep links land on the finished state.

## Scripts

| Command | Purpose |
| ------- | ------- |
| `bun run dev` | Dev server with HMR |
| `bun run build` | Type-check and build to `dist/` |
| `bun run preview` | Serve the production build |
| `bun run lint` | ESLint |

## Third-party notices

Built with React, Three.js, React Three Fiber, GSAP, Framer Motion, Zustand, Lucide icons and Fontsource fonts (Inter, JetBrains Mono, Instrument Serif). Each keeps its own license.
