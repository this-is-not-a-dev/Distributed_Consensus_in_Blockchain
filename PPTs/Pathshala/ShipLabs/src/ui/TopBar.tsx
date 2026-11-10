import { useStore } from '../store/useStore';
import { SLIDE_META } from '../slides/meta';
import { PARTS } from '../config';
import { openPresenter } from '../engine/presenterSync';
import { SlideNavigator } from './SlideNavigator';
import { StepDots } from './StepDots';
import { Button } from './Button';
import { Logo } from './Logo';

export function TopBar() {
  const slideIndex = useStore((s) => s.slideIndex);
  const meta = SLIDE_META[slideIndex];
  const progress = (slideIndex + 1) / SLIDE_META.length;

  return (
    <header className="topbar">
      <div className="topbar-title">
        <Logo height={38} />
        <span className="topbar-divider" aria-hidden />
        <div className="topbar-meta">
          <span className="kicker">{PARTS[meta?.part ?? 'intro'].label}</span>
          <span className="topbar-slide">{meta?.title}</span>
        </div>
      </div>

      {/* ≥768: slide tiles. <768: "13 / 34" + progress bar. */}
      <div className="topbar-nav">
        <SlideNavigator />
      </div>
      <div className="topbar-compact" aria-label={`Slide ${slideIndex + 1} of ${SLIDE_META.length}`}>
        <span className="mono">
          {slideIndex + 1} / {SLIDE_META.length}
        </span>
        <span className="topbar-bar">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>

      <div className="topbar-actions">
        <StepDots />
        <Button onClick={openPresenter} title="Opens in a separate window: put it on your laptop screen, not the projector (N)">
          Notes
        </Button>
      </div>
    </header>
  );
}
