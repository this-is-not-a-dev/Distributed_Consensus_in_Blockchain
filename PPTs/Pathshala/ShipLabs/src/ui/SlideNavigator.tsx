import { useStore } from '../store/useStore';
import { SLIDE_META } from '../slides/meta';
import { StepEngine } from '../engine/StepEngine';
import { PARTS } from '../config';

// One tile per slide, part colour on the bottom edge. Unvisited slides are dimmed.
export function SlideNavigator() {
  const slideIndex = useStore((s) => s.slideIndex);
  const visitedSlides = useStore((s) => s.visitedSlides);

  return (
    <div className="nav">
      {SLIDE_META.map((meta, si) => (
        <button
          key={si}
          type="button"
          className="nav-tile"
          title={`${si + 1}. ${meta.title}`}
          aria-label={`Slide ${si + 1}: ${meta.title}`}
          aria-current={si === slideIndex ? 'true' : undefined}
          data-visited={visitedSlides.has(si) || undefined}
          style={{ ['--tile' as string]: PARTS[meta.part].color }}
          onClick={() => StepEngine.goTo(si)}
        />
      ))}
    </div>
  );
}
