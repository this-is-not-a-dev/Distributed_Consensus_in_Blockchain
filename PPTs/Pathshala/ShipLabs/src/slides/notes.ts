import { getSlideEntry } from './registry';

/** The speaker script for one step (lives next to the step in its SlideNN.tsx). */
export const getStepNotes = (slide: number, step: number) => {
  const s = getSlideEntry(slide).steps[step];
  return s?.say ?? s?.caption ?? '';
};
