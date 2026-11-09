import { useStore } from '../store/useStore';
import { SLIDE_META } from '../slides/meta';

export function StepDots() {
  const slideIndex = useStore((s) => s.slideIndex);
  const stepIndex = useStore((s) => s.stepIndex);
  const total = SLIDE_META[slideIndex]?.stepCount ?? 1;
  return (
    <div className="dots" aria-label={`Step ${stepIndex + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} data-state={i === stepIndex ? 'on' : i < stepIndex ? 'done' : undefined} />
      ))}
      <span className="dots-count mono">
        {stepIndex + 1}/{total}
      </span>
    </div>
  );
}
