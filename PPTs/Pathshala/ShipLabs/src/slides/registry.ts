import type { ComponentType, ReactNode } from 'react';
import { SLIDE_META } from './meta';

export interface StepDef {
  /** One line: the aria-live announcement. */
  caption: string;
  /** Rail card heading. */
  title: string;
  /** Rail card body. */
  body?: ReactNode;
  /** Speaker script for the presenter window: plain words, meant to be read aloud. */
  say: string;
  /** Render `body` full-screen (no rail): for boards that must span the screen. */
  overlay?: boolean;
}

/** A slide: an artboard scene driven by `step`, plus one rail card per step. */
export interface SlideDef {
  Scene: ComponentType<{ step: number }>;
  steps: StepDef[];
}

// Every SlideNN.tsx exports `slide`; file order is slide order.
const modules = import.meta.glob<{ slide: SlideDef }>('./Slide*.tsx', { eager: true });
export const SLIDES: SlideDef[] = Object.keys(modules)
  .sort()
  .map((k) => modules[k].slide);

if (import.meta.env.DEV) {
  console.assert(SLIDES.length === SLIDE_META.length, `meta lists ${SLIDE_META.length} slides, found ${SLIDES.length}`);
  SLIDES.forEach((s, i) =>
    console.assert(s.steps.length === SLIDE_META[i]?.stepCount, `slide ${i + 1}: meta says ${SLIDE_META[i]?.stepCount} steps, has ${s.steps.length}`),
  );
}

export function getSlideEntry(slideIndex: number): SlideDef {
  return SLIDES[slideIndex] ?? SLIDES[0];
}
