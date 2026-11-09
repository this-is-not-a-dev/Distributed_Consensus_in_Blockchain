import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { StepEngine, parseURL, bindInputs } from './engine/StepEngine';
import { Backdrop } from './world/Backdrop';
import { Stage } from './scene/Stage';
import { TopBar } from './ui/TopBar';
import { ControlDock } from './ui/ControlDock';
import { StepRail } from './ui/StepRail';
import { Button } from './ui/Button';
import { PRESENTER_CHANNEL, openPresenter, type PresenterMessage } from './engine/presenterSync';
import { getSlideEntry } from './slides/registry';
import { SLIDE_META } from './slides/meta';
import { PARTS } from './config';

const PROGRESS_KEY = 'shiplabs-progress';

function readSaved(): { slide: number; step: number } | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function App() {
  const slideIndex = useStore((s) => s.slideIndex);
  const stepIndex = useStore((s) => s.stepIndex);
  const [continuePrompt, setContinuePrompt] = useState(() => {
    const fromURL = parseURL();
    if (fromURL.slide > 0 || fromURL.step > 0) return false;
    return (readSaved()?.slide ?? 0) > 0;
  });

  // Restore from URL once.
  useEffect(() => {
    const fromURL = parseURL();
    if (fromURL.slide > 0 || fromURL.step > 0) StepEngine.goTo(fromURL.slide, fromURL.step);
  }, []);

  // Persist progress + mirror slide/step to the presenter popup.
  useEffect(() => {
    const channel = new BroadcastChannel(PRESENTER_CHANNEL);
    const sendState = () => {
      const s = useStore.getState();
      channel.postMessage({ type: 'state', slideIndex: s.slideIndex, stepIndex: s.stepIndex } satisfies PresenterMessage);
    };
    channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
      if (e.data.type === 'request') sendState();
    };
    const unsubscribe = useStore.subscribe((s, prev) => {
      if (s.slideIndex === prev.slideIndex && s.stepIndex === prev.stepIndex) return;
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify({ slide: s.slideIndex, step: s.stepIndex }));
      } catch {
        /* storage blocked: progress just isn't remembered */
      }
      sendState();
    });
    return () => {
      unsubscribe();
      channel.close();
    };
  }, []);

  // Keyboard / wheel / touch → engine. App-level shortcuts handled first.
  useEffect(
    () =>
      bindInputs((e) => {
        switch (e.key.toLowerCase()) {
          case 'r':
            if (e.shiftKey) StepEngine.resetAll();
            else StepEngine.resetSlide();
            return true;
          case 'n':
            openPresenter();
            return true;
          case 'f':
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen?.().catch(() => {});
            return true;
        }
        return false;
      }),
    [],
  );

  const resumeProgress = () => {
    const saved = readSaved();
    if (saved) StepEngine.goTo(saved.slide, saved.step);
    setContinuePrompt(false);
  };

  const steps = getSlideEntry(slideIndex).steps;
  const step = steps[stepIndex];
  const part = SLIDE_META[slideIndex]?.part ?? 'intro';

  return (
    <div className="app" data-rail={!step?.overlay || undefined} style={{ ['--part' as string]: PARTS[part].color }}>
      <Backdrop />
      <div className="vignette" aria-hidden />

      <div className="shell">
        <TopBar />
        {!step?.overlay && <StepRail steps={steps} />}
        <Stage />
      </div>

      {step?.overlay && (
        <section key={`${slideIndex}-${stepIndex}`} className="overlay-panel" aria-label={step.title} data-own-scroll>
          {step.body}
        </section>
      )}

      <ControlDock />

      {/* Screen readers hear every step change. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {step?.caption ?? ''}
      </p>

      {continuePrompt && (
        <div className="resume" role="dialog" aria-label="Resume">
          <span>Continue where you left off?</span>
          <Button variant="primary" onClick={resumeProgress}>
            Continue
          </Button>
          <Button onClick={() => setContinuePrompt(false)}>Start over</Button>
        </div>
      )}
    </div>
  );
}

export default App;
