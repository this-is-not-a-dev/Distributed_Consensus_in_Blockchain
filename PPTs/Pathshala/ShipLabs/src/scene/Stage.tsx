import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getSlideEntry } from '../slides/registry';
import { ARTBOARD, SLIDE_S } from '../config';

/** Scales the fixed 1280×720 artboard to fit its box, centred. */
export function useFit(ref: React.RefObject<HTMLElement | null>) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / ARTBOARD.w, el.clientHeight / ARTBOARD.h));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

/** One slide's scene on the artboard. Shared by the stage and the presenter preview. */
export function Artboard({ slide, step }: { slide: number; step: number }) {
  const { Scene } = getSlideEntry(slide);
  return (
    <div className="artboard" style={{ width: ARTBOARD.w, height: ARTBOARD.h }}>
      <Scene step={step} />
    </div>
  );
}

/**
 * The stage column. Slide changes are a "camera push": the old scene zooms past and fades
 * while the new one settles in from slightly behind.
 */
export function Stage() {
  const slideIndex = useStore((s) => s.slideIndex);
  const stepIndex = useStore((s) => s.stepIndex);
  const slot = useRef<HTMLDivElement>(null);
  const scale = useFit(slot);
  const overlay = !!getSlideEntry(slideIndex).steps[stepIndex]?.overlay;

  return (
    <div ref={slot} className="stage-slot" data-overlay={overlay || undefined} aria-hidden>
      <div className="stage-fit" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={slideIndex}
            className="stage-layer"
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
            transition={{ duration: SLIDE_S * 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Artboard slide={slideIndex} step={stepIndex} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
