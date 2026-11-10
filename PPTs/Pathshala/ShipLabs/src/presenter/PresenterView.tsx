import { useEffect, useRef, useState } from 'react';
import { Logo } from '../ui/Logo';
import { SLIDE_META } from '../slides/meta';
import { getStepNotes } from '../slides/notes';
import { PRESENTER_CHANNEL, type PresenterMessage } from '../engine/presenterSync';
import { Artboard, useFit } from '../scene/Stage';
import { ARTBOARD, PARTS } from '../config';

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { label: `${mm}:${ss}`, reset: () => setSeconds(0) };
}

/** Live mini copy of the projected slide, so the presenter can confirm both windows match. */
function Preview({ slide, step }: { slide: number; step: number }) {
  const box = useRef<HTMLDivElement>(null);
  const scale = useFit(box);
  return (
    <div ref={box} className="pv-preview" aria-hidden>
      <div className="stage-fit" style={{ transform: `translate(-50%, -50%) scale(${scale})`, width: ARTBOARD.w, height: ARTBOARD.h }}>
        <Artboard key={slide} slide={slide} step={step} />
      </div>
    </div>
  );
}

// Read-only: the presenter drives the deck from the projected window, this one only follows.
export default function PresenterView() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const timer = useTimer();

  useEffect(() => {
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
      if (e.data.type === 'state') {
        setSlideIndex(e.data.slideIndex);
        setStepIndex(e.data.stepIndex);
      }
    };
    channel.postMessage({ type: 'request' } satisfies PresenterMessage);
    return () => channel.close();
  }, []);

  const meta = SLIDE_META[slideIndex];
  const totalSteps = meta?.stepCount ?? 1;
  const isLastStep = stepIndex >= totalSteps - 1;
  const nextSlide = isLastStep ? slideIndex + 1 : slideIndex;
  const nextMeta = SLIDE_META[nextSlide];
  const nextPreview = nextMeta ? getStepNotes(nextSlide, isLastStep ? 0 : stepIndex + 1) : null;

  return (
    <div className="pv">
      <div className="pv-head">
        <Logo mark height={24} />
        <span className="kicker">Presenter view · not shown on the projector</span>
        <span className="pv-timer mono">{timer.label}</span>
        <button type="button" className="btn" data-variant="ghost" onClick={timer.reset}>
          reset
        </button>
      </div>

      <div className="pv-marks">
        {SLIDE_META.map((m, i) => (
          <span
            key={m.id}
            title={`${m.id}. ${m.title}`}
            data-on={i === slideIndex || undefined}
            style={{ background: i <= slideIndex ? PARTS[m.part].color : undefined, opacity: i === slideIndex ? 1 : i < slideIndex ? 0.6 : 0.3 }}
          />
        ))}
      </div>

      <Preview slide={slideIndex} step={stepIndex} />

      <div>
        <p className="pv-sub">
          Slide {meta?.id} / {SLIDE_META.length} · {PARTS[meta?.part ?? 'intro'].label} · ~{meta?.suggestedMinutes} min
        </p>
        <h1 className="pv-title">{meta?.title}</h1>
        <p className="pv-step">
          Step {stepIndex + 1} / {totalSteps}
        </p>
      </div>

      <div className="pv-card pv-now">
        <p className="kicker" style={{ color: 'var(--gold)' }}>Say this now</p>
        <p>{getStepNotes(slideIndex, stepIndex)}</p>
      </div>

      {nextPreview && (
        <div className="pv-card">
          <p className="kicker" style={{ color: 'var(--sky)' }}>Coming up {isLastStep ? `(slide ${nextMeta?.id})` : '(next step)'}</p>
          <p className="pv-next">{nextPreview}</p>
        </div>
      )}
    </div>
  );
}
