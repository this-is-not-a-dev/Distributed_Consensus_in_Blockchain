// Every tunable for motion, input and colour lives here.

/** Step choreography duration (s). */
export const STEP_S = 0.8;
/** Slide change: the "camera push" crossfade and the input lock (s). */
export const SLIDE_S = 1.1;
/** Reduced-motion crossfade (s). */
export const REDUCED_FADE_S = 0.3;

/** Wheel: accumulated |deltaY| px that counts as one deliberate gesture. */
export const WHEEL_THRESHOLD = 60;
/** Wheel: lockout after a step fires (ms). Extended while inertia events keep arriving. */
export const WHEEL_COOLDOWN_MS = 700;
/** Wheel: quiet gap that ends a trackpad gesture (ms). */
export const WHEEL_GESTURE_GAP_MS = 160;
/** Touch: min swipe distance (px). */
export const SWIPE_PX = 50;

/** Every scene is drawn on this fixed artboard and scaled to fit the stage column. */
export const ARTBOARD = { w: 1280, h: 720 } as const;

/** Semantic colours, mirrored as CSS variables in index.css. */
export const COLORS = {
  ink: '#0b0b0d',
  panel: '#141417',
  line: '#2a2a31',
  text: '#ece9e2',
  muted: '#9a9aa4',
  gold: '#e3b341',
  red: '#ef5350',
  green: '#4cc77a',
  amber: '#f5a524',
  sky: '#4cb6e8',
  violet: '#a38bff',
  code: '#3b82f6',
} as const;

export type Part = 'intro' | 'A' | 'B' | 'C';

export const PARTS: Record<Part, { label: string; color: string }> = {
  intro: { label: 'Introduction', color: COLORS.muted },
  A: { label: 'Part A · The Idea', color: COLORS.gold },
  B: { label: 'Part B · Teach & Trust', color: COLORS.sky },
  C: { label: 'Part C · Build & Ship', color: COLORS.violet },
};
