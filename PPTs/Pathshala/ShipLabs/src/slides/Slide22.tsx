import { ClipboardCheck } from 'lucide-react';
import { Board, Card, Chip, Orb, Txt, Wire, Wires, draw, pop, spring, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

const GATE: [string, string, Tone][] = [
  ['“hi”', 'friendly reply · free, no AI call', 'muted'],
  ['“teach me something”', 'ONE clarifying question · free', 'amber'],
  ['“Build a REST API in Go”', 'generate the lab · 1 credit', 'green'],
];
const FLOORS = ['5 · Deploy', '4 · Persist tasks', '3 · Validate the body', '2 · Define the Task model', '1 · Set up the project'];
const CHECKS: [string, boolean][] = [
  ['title ≥ 4 chars, not the raw goal', true],
  ['summary ≥ 40 chars', true],
  ['≥ 3 steps', true],
  ['≥ 80 % rich steps', false],
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    GATE.forEach((_, i) => {
      pop(tl, q, `.gm-${i}`, 0.1 + i * 0.35);
      draw(tl, q, `.gw-${i}`, 0.3 + i * 0.35);
      spring(tl, q, `.gr-${i}`, 0.5 + i * 0.35);
    });
    next((at) => {
      tl.to(q('.gm-0, .gm-1, .gr-0, .gr-1, .gw-0, .gw-1'), { opacity: 0.3 }, at);
      spring(tl, q, '.k-orb', at);
      q('.floor').forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, scaleX: 0.3, transformOrigin: 'left' }, { autoAlpha: 1, scaleX: 1, duration: 0.4 }, at + 0.3 + (4 - i) * 0.18));
      spring(tl, q, '.url', at + 1.1);
      pop(tl, q, '.insp', at + 1.3);
      q('.ck').forEach((el, i) => spring(tl, q, [el], at + 1.6 + i * 0.25, 0));
      spring(tl, q, '.thin', at + 2.6);
    });
    next((at) => {
      tl.to(q('.url'), { rotate: 50, y: 120, autoAlpha: 0, duration: 0.6, ease: 'power2.in' }, at);
      tl.to(q('.thin'), { autoAlpha: 0, duration: 0.2 }, at + 0.3);
      tl.fromTo(q('.f-2'), { height: 34 }, { height: 52, borderColor: '#4cc77a', duration: 0.5 }, at + 0.4);
      tl.to(q('.ck-3'), { color: '#4cc77a', duration: 0.2 }, at + 0.9);
      pop(tl, q, '.ck-3-ok', at + 0.9);
      spring(tl, q, '.approved', at + 1.3);
      pop(tl, q, '.lab', at + 1.8);
      pop(tl, q, '.li', at + 2, 0.1, 8);
    });
  });

  return (
    <Board root={root} step={step}>
      {GATE.map(([m, r, tone], i) => (
        <span key={m}>
          <Chip x={40} y={40 + i * 70} tone="sky" className={`gm-${i}`}>{m}</Chip>
          <Chip x={460} y={40 + i * 70} tone={tone} className={`gr-${i}`}>{r}</Chip>
        </span>
      ))}
      <Wires>
        {GATE.map((_, i) => (
          <Wire key={i} d={`M ${i === 2 ? 290 : i === 1 ? 250 : 110} ${56 + i * 70} L 450 ${56 + i * 70}`} tone="muted" className={`gw-${i}`} />
        ))}
      </Wires>

      <Txt x={60} y={260} className="k-cap floor">Blueprint</Txt>
      {FLOORS.map((f, i) => (
        <div key={f} className={`floor f-${4 - i} k-card`} data-tone="sky" style={{ left: 60 + i * 6, top: 296 + i * 64, width: 440 - i * 12, height: i === 2 ? 34 : 52, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 15, borderStyle: 'dashed' }}>
          <span className="mono">{f}</span>
        </div>
      ))}
      <span className="url k-chip mono" data-tone="red" style={{ left: 380, top: 432, height: 26, fontSize: 11, transform: 'rotate(-8deg)' }}>https://…</span>
      <span className="thin k-chip" data-tone="red" style={{ left: 330, top: 424, height: 26 }}>too thin</span>
      <Orb x={600} y={330} r={34} label="temp 0.45 · repair 0.25" />

      <Card x={680} y={290} w={300} tone="gold" icon={ClipboardCheck} title="Quality gate" className="insp">
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {CHECKS.map(([c, ok], i) => (
            <div key={c} className={`ck ck-${i} k-row`} style={{ fontSize: 14, color: ok ? 'var(--green)' : 'var(--red)' }}>
              {ok ? '✓' : <span>✗<span className={`ck-${i}-ok`} style={{ position: 'absolute', marginLeft: -10, color: 'var(--green)', background: '#18181d' }}>✓</span></span>} {c}
            </div>
          ))}
        </div>
      </Card>
      <span className="approved k-stamp" data-tone="green" style={{ left: 720, top: 520 }}>APPROVED</span>

      <Card x={1010} y={260} w={240} h={400} tone="green" title="Lab page" className="lab">
        <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
          {[...FLOORS].reverse().map((f, i) => (
            <div key={f} className="li k-row" style={{ fontSize: 13.5 }}>
              <span className="k-dot" data-tone={i === 0 ? 'gold' : 'muted'} /> {f.slice(4)}
            </div>
          ))}
        </div>
      </Card>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Free until it is real',
      caption: 'A deterministic coach gate: greetings and vague requests are answered free; a named skill generates a lab for one credit.',
      say: "Coach mode starts with a gate too. If you just say hi, you get a friendly reply, free, no AI call. If you say teach me something, it asks one clarifying question, also free. Only when you name a real skill does it build the lab, for one credit.",
      body: <p className="r-p">The coach intent gate runs in code <b>before any credit</b>. After one clarifying question, the next reply always generates. It never asks twice.</p>,
    },
    {
      title: 'One sentence becomes a project',
      caption: 'The model drafts a full project as steps; a quality gate checks title, summary, step count and step richness, and strips URLs.',
      say: "One sentence becomes a full project, like a building with floors. Then an inspector checks it. Is the title real? Is the summary long enough? Are there at least three steps? Are most steps detailed? Here one step is too thin. And any links are peeled off.",
      body: (
        <ul className="r-list">
          <li className="r-li">Attempt 1 at temperature 0.45, up to 65,536 tokens, 150 s timeout.</li>
          <li className="r-li">Rich step = goal ≥ 12 chars, instructions ≥ 120, rubric ≥ 40.</li>
          <li className="r-li">No URLs, one capstone project, the exact stack named. Go means Go.</li>
        </ul>
      ),
    },
    {
      title: 'Repaired, then approved',
      caption: 'A repair prompt at temperature 0.25 fixes the thin step; the approved lab appears as a step list.',
      say: "Instead of starting over, it repairs. The previous draft and the list of problems go back to the AI at a lower temperature. The thin step becomes detailed, the lab is approved, and it appears as a step list. After three failed attempts, your credit is refunded.",
      body: (
        <>
          <p className="r-p">Repair is cheaper than regenerating. Malformed JSON is repaired too, and a provider error retries the plain prompt.</p>
          <p className="r-note">3 attempts exhausted → <b>credit refunded</b>: "Send the goal again and I'll build it fresh."</p>
        </>
      ),
    },
  ],
};
