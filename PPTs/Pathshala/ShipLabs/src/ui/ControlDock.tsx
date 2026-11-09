import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StepEngine } from '../engine/StepEngine';
import { SLIDE_META } from '../slides/meta';
import { Button } from './Button';

export function ControlDock() {
  const slideIndex = useStore((s) => s.slideIndex);
  const stepIndex = useStore((s) => s.stepIndex);

  const totalSteps = SLIDE_META[slideIndex]?.stepCount ?? 1;
  const isLastStep = stepIndex >= totalSteps - 1;
  const isLastSlide = slideIndex >= SLIDE_META.length - 1;
  const isFirst = slideIndex === 0 && stepIndex === 0;
  const atEnd = isLastSlide && isLastStep;

  return (
    <nav className="dock" aria-label="Step controls">
      <Button disabled={isFirst} onClick={() => StepEngine.prev()}>
        <ArrowLeft size={16} /> Back
      </Button>
      <Button variant="primary" disabled={atEnd} onClick={() => StepEngine.next()}>
        {atEnd ? 'Done' : 'Next'}
        <span className="dock-wide">{atEnd ? '' : isLastStep ? ' slide' : ' step'}</span>
        {atEnd ? <Check size={16} /> : <ArrowRight size={16} />}
      </Button>
      <Button variant="ghost" onClick={() => StepEngine.resetSlide()} title="Replay this slide (R)">
        <RotateCcw size={16} />
        <span className="dock-wide">Replay</span>
      </Button>
    </nav>
  );
}
