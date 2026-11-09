import { Hammer, Lightbulb, ShieldCheck } from 'lucide-react';
import { Board, Card, focus, pop, useScene, type Tone } from '../scene/kit';
import { StepEngine } from '../engine/StepEngine';
import type { SlideDef } from './registry';

const PARTS: { label: string; name: string; tone: Tone; icon: typeof Lightbulb; slides: string[]; first: number }[] = [
  {
    label: 'Part A',
    name: 'The Idea',
    tone: 'gold',
    icon: Lightbulb,
    first: 3,
    slides: ['The problem', 'What it must guarantee', 'Meet ShipLabs', "Who it's for", 'Architecture', 'Tech stack', 'Data model'],
  },
  {
    label: 'Part B',
    name: 'Teach & Trust',
    tone: 'sky',
    icon: ShieldCheck,
    first: 10,
    slides: ['Live streaming', 'Control blocks', 'Tutor onboarding', 'State machine', 'Intent gate', 'Points', 'Question integrity', 'Verification', 'Visuals', 'Documents', 'Spaced repetition', 'Credits & XP'],
  },
  {
    label: 'Part C',
    name: 'Build & Ship',
    tone: 'violet',
    icon: Hammer,
    first: 22,
    slides: ['Coach labs', 'Code review', 'Connect VS Code', 'Telemetry', 'Auto-check', 'Comments only', 'Auto-run', 'Lab report', 'Resilience', 'Security', 'Numbers', 'Timeline'],
  },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.part', 0, 0.12, 30);
    focus(tl, q, '.part', '.part-0', 0.4);
    next((at) => focus(tl, q, '.part', '.part-1', at));
    next((at) => focus(tl, q, '.part', '.part-2', at));
  });

  return (
    <Board root={root} step={step}>
      {PARTS.map((p, i) => (
        <Card key={p.label} x={40 + i * 410} y={60} w={380} h={600} tone={p.tone} icon={p.icon} title={`${p.label} · ${p.name}`} className={`part part-${i}`}>
          <ol style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'grid', gap: 9 }}>
            {p.slides.map((s, k) => (
              <li key={s} className="k-row" style={{ fontSize: 17 }}>
                <span className="mono" style={{ color: 'var(--dim)', fontSize: 13, width: 22 }}>{String(p.first + k).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      ))}
    </Board>
  );
}

const BODY = [
  'Why students need teaching, not just content, and the shape of the system that answers it: architecture, stack and data.',
  'How ShipLabs teaches and why you can trust it: live streaming, a tutor driven by a state machine, grading in code, and four layers of fact checking.',
  'Hands-on project labs, and the VS Code extension that reviews your code as you write it, plus resilience, security and how it was built.',
];

export const slide: SlideDef = {
  Scene,
  steps: PARTS.map((p, i) => ({
    title: `${p.label} · ${p.name}`,
    caption: `${p.label}, ${p.name}: ${BODY[i]}`,
    say: [
      "Here is the plan for today. Part A is the idea. What problem we are solving, who it is for, and how the whole system is put together.",
      "Part B is about teaching and trust. How the tutor teaches step by step, how answers are graded by code and not by the AI, and how every fact is checked before you see it.",
      "Part C is where we build and ship. Project labs, and the VS Code extension that watches your work and reviews it like a lab instructor. Then security, resilience and the build timeline.",
    ][i],
    body: (
      <div style={{ display: 'grid', gap: 12 }}>
        <p className="r-p">{BODY[i]}</p>
        <button type="button" className="btn" data-variant="ghost" style={{ justifySelf: 'start', color: `var(--${p.tone})`, padding: 0 }} onClick={() => StepEngine.goTo(p.first - 1)}>
          Jump to {p.label} →
        </button>
      </div>
    ),
  })),
};
