import { Board, Code, Txt, Win, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const LINES = [
  'func validateTask(t Task) error {',
  '    if strings.TrimSpace(t.Title) == "" {',
  '        return errors.New("title is required")',
  '    }',
  '    return nil',
  '}',
  '',
  'func createTask(w ResponseWriter, r *Request) {',
  '    if err := validateTask(t); err != nil {',
  { t: '        w.WriteHeader(500)', c: 'bad' },
  '    }',
  '    w.WriteHeader(201)',
];
const LINE_Y = (n: number) => 88 + (n - 0.5) * 26.25;
const RUBRIC: [string, number, boolean][] = [
  ['validateTask exists', 1, true],
  ['empty title → error', 2, true],
  ['POST /tasks → 400 with {error}', 10, false],
  ['valid payload → 201', 12, true],
];
const STATES = [
  ['draft', 60, 'muted'],
  ['in_progress', 330, 'gold'],
  ['stopped', 620, 'amber'],
  ['completed', 900, 'green'],
] as const;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.code-w', 0);
    q('.rb').forEach((el, i) => {
      pop(tl, q, [el], 0.4 + i * 0.35, 0, 10);
      draw(tl, q, `.rl-${i}`, 0.5 + i * 0.35);
      spring(tl, q, `.mk-${i}`, 0.6 + i * 0.35);
    });
    spring(tl, q, '.v-work', 2);
    next((at) => {
      tl.to(q('.bad'), { backgroundColor: 'rgba(76,199,122,0.15)', duration: 0.3 }, at);
      tl.to(q('.bad .k-ln-t'), { opacity: 0, duration: 0.2 }, at);
      pop(tl, q, '.fixed-ln', at + 0.25, 0, 0);
      tl.to(q('.mk-2'), { autoAlpha: 0, duration: 0.2 }, at + 0.5);
      spring(tl, q, '.mk-2-ok', at + 0.7);
      tl.to(q('.v-work'), { autoAlpha: 0, duration: 0.2 }, at + 0.9);
      spring(tl, q, '.v-pass', at + 1);
    });
    next((at) => {
      tl.to(q('.code-w, .rb, .rl, .mk, .v-pass, .mk-2-ok'), { opacity: 0.25 }, at);
      pop(tl, q, '.st', at + 0.2, 0.15);
      draw(tl, q, '.sw', at + 0.6, 0.12);
      pop(tl, q, '.sl', at + 0.9, 0.08, 6);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={40} w={600} h={380} kind="vscode" title="handlers/task.go" className="code-w">
        <Code lines={LINES} />
        <span className="fixed-ln mono" style={{ position: 'absolute', left: 52, top: 14 + 9 * 26.25, fontSize: 15, lineHeight: '26.25px', color: 'var(--green)' }}>{'        w.WriteHeader(400) + JSON {error}'}</span>
      </Win>
      {RUBRIC.map(([r, ln, ok], i) => (
        <div key={r} className="rb k-card" data-tone="muted" style={{ left: 730, top: 50 + i * 72, width: 510, height: 58, display: 'flex', alignItems: 'center', gap: 12, fontSize: 16 }}>
          <span style={{ position: 'relative', width: 24 }}>
            <b className={`mk mk-${i}`} style={{ color: ok ? 'var(--green)' : 'var(--red)', fontSize: 20 }}>{ok ? '✓' : '✗'}</b>
            {!ok && <b className={`mk-${i}-ok`} style={{ position: 'absolute', left: 0, color: 'var(--green)', fontSize: 20 }}>✓</b>}
          </span>
          {r}
          <span className="mono k-muted" style={{ marginLeft: 'auto', fontSize: 12 }}>line {ln}</span>
        </div>
      ))}
      <Wires>
        {RUBRIC.map(([, ln, ok], i) => (
          <Wire key={i} d={`M 726 ${79 + i * 72} C 690 ${79 + i * 72} 680 ${LINE_Y(ln)} 644 ${LINE_Y(ln)}`} tone={ok ? 'green' : 'red'} className={`rl rl-${i}`} />
        ))}
        {STATES.slice(0, 3).map(([, x], i) => (
          <Wire key={i} d={`M ${x + 230} 540 L ${STATES[i + 1][1] - 6} 540`} tone="muted" className="sw" />
        ))}
        <Wire d="M 620 600 C 560 650 450 650 420 584" tone="gold" className="sw" />
        <Wire d="M 1010 586 C 960 700 520 700 470 590" tone="violet" className="sw" dashed />
      </Wires>
      <span className="v-work k-stamp" data-tone="amber" style={{ left: 760, top: 350 }}>NEEDS WORK · 3/4</span>
      <span className="v-pass k-stamp" data-tone="green" style={{ left: 780, top: 350 }}>PASSED · 4/4 → next step</span>

      {STATES.map(([s, x, tone]) => (
        <div key={s} className="st k-card" data-tone={tone} style={{ left: x, top: 500, width: 230, height: 80, display: 'grid', placeItems: 'center', font: `600 17px var(--font-mono)`, color: `var(--${tone})` }}>{s}</div>
      ))}
      <Txt x={292} y={505} className="sl k-muted" style={{ fontSize: 11 }}>start</Txt>
      <Txt x={566} y={505} className="sl k-muted" style={{ fontSize: 11 }}>stop</Txt>
      <Txt x={852} y={505} className="sl k-muted" style={{ fontSize: 11 }}>all done</Txt>
      <Txt x={640} y={596} className="sl" style={{ fontSize: 13, color: 'var(--gold)' }}>start again: timer resumes</Txt>
      <Txt x={700} y={684} className="sl" style={{ fontSize: 13, color: 'var(--violet)' }}>unskip or restart (confirmed)</Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'A rubric, checked line by line',
      caption: 'The judge checks every rubric requirement and points each note at the exact line of the learner’s code; 3 of 4 met means needs work.',
      say: "Now the code review. Every step has a rubric, usually two to six requirements. The judge checks each one, and every note points at the exact line in your code. Here, three of four pass. Line 10 returns 500 instead of 400. So the verdict is needs work.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Pass</b> only if <b>every</b> requirement is met.</li>
          <li className="r-li">Each note names the file, function or line.</li>
          <li className="r-li">Fail: say plainly why. <b>Never</b> hand over the full solution.</li>
        </ul>
      ),
    },
    {
      title: 'Fixed, passed, advanced',
      caption: 'After the fix all four requirements pass; the step is marked done and the pointer moves to the next step.',
      say: "The learner fixes the line. Now all four requirements pass. The step turns green, and the lab moves to the next step. On a pass, the review starts with specific praise for what works.",
      body: <p className="r-p">The judge returns <code>{'{verdict, feedback, checklist[{requirement, met, note}], comments?, next?, readyToRun?}'}</code>. Code applies it: done and advance, or failed and stay. A judge error refunds the credit.</p>,
    },
    {
      title: 'The lab lifecycle',
      caption: 'Draft, in progress, stopped and completed: start and stop control a timer, and unskip or restart reopen a finished lab.',
      say: "The whole lab also has a simple life cycle. It starts as a draft, which you can still edit. Start the lab and a timer runs. Stop it and the timer pauses. When no steps are left, it's completed. You can unskip a step or restart if you want.",
      body: <p className="r-p">Step statuses: <code>pending → done | failed | skipped</code>. <code>advanceCoachLab()</code> moves to the next step still to do. Web Submit and VS Code share the same judge: <code>runCoachStepCheck()</code>.</p>,
    },
  ],
};
