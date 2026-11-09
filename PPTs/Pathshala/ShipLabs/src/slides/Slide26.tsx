import { Camera, Hourglass, Scale } from 'lucide-react';
import { Board, Card, Chip, Orb, Txt, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const GATES = ['touched?', 'changed?', '45 s cooldown', '≤ 10 / hour / step', 'lab active?'];
const CHECK = [
  ['validateTask exists', true],
  ['empty title → error', true],
  ['POST /tasks → 400', false],
] as const;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.idle', 0);
    tl.fromTo(q('.idle .k-bar i'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'none' }, 0.4);
    pop(tl, q, '.snap', 2);
    tl.fromTo(q('.flash'), { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.5 }, 2);
    draw(tl, q, '.w-cmp', 2.4, 0.15);
    pop(tl, q, '.same', 2.6);
    pop(tl, q, '.diff', 2.8);
    next((at) => {
      tl.to(q('.same'), { opacity: 0.3 }, at);
      draw(tl, q, '.w-srv', at);
      q('.gate').forEach((el, i) => spring(tl, q, [el], at + 0.3 + i * 0.2, 0));
      tl.fromTo(q('.coin'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: 120, duration: 0.6 }, at + 1.5);
      tl.to(q('.coin'), { autoAlpha: 0, duration: 0.2 }, at + 2.1);
      spring(tl, q, '.k-orb', at + 1.6);
    });
    next((at) => {
      pop(tl, q, '.panel, .bar', at, 0.15);
      tl.to(q('.st-a'), { autoAlpha: 0, duration: 0.2 }, at + 0.9);
      tl.fromTo(q('.st-b'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, at + 1);
      pop(tl, q, '.ci', at + 0.5, 0.15, 6);
      pop(tl, q, '.hg', at + 1.4);
    });
  });

  return (
    <Board root={root} step={step}>
      <Card x={40} y={40} w={280} tone="sky" title="Learner pauses" className="idle">
        <div className="k-row" style={{ marginTop: 10, fontSize: 13 }}>
          <span className="k-bar" data-tone="sky" style={{ flex: 1 }}><i /></span>
          <span className="mono">5 s idle</span>
        </div>
        <div className="k-muted" style={{ fontSize: 13, marginTop: 8 }}>or a terminal run in the repo ends</div>
      </Card>
      <Card x={370} y={40} w={340} tone="gold" icon={Camera} title="Snapshot" className="snap">
        <div className="k-card-sub" style={{ fontSize: 13 }}>files (≤ 20) · ShipLabs comments stripped</div>
        <div className="mono" style={{ marginTop: 6, color: 'var(--gold)', fontSize: 14 }}>hash 9f3a…c71e</div>
        <span className="flash" style={{ position: 'absolute', inset: 0, borderRadius: 14, background: '#fff' }} />
      </Card>
      <Chip x={770} y={44} tone="muted" className="same">same hash as last check → skip, no request</Chip>
      <Chip x={770} y={104} tone="gold" className="diff">changed → send it</Chip>

      <Txt x={40} y={250} className="k-cap gate">Server guards (free)</Txt>
      {GATES.map((g, i) => (
        <Chip key={g} x={40 + i * 180} y={284} tone="green" className="gate">✓ {g}</Chip>
      ))}
      <span className="coin" style={{ left: 930, top: 290, width: 24, height: 24, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff1c2, #e3b341 60%, #8a6414)', boxShadow: '0 0 12px #e3b341' }} />
      <Orb x={1150} y={300} r={44} label="Judge · 1 credit" />

      <Wires>
        <Wire d="M 712 80 L 764 60" tone="muted" className="w-cmp" />
        <Wire d="M 712 100 L 764 120" tone="gold" className="w-cmp" />
        <Wire d="M 900 136 C 980 180 1100 180 1140 250" tone="gold" className="w-srv" />
      </Wires>

      <div className="bar" style={{ left: 40, top: 640, width: 700, borderRadius: 6, overflow: 'hidden' }}>
        <div className="k-status">
          <span>ShipLabs · Step 3/8</span>
          <span style={{ position: 'relative', width: 120 }}>
            <span className="st-a" style={{ position: 'absolute', top: -9 }}>⟳ Checking…</span>
            <span className="st-b" style={{ position: 'absolute', top: -9, color: '#ffd27a' }}>⚠ Needs work</span>
          </span>
        </div>
      </div>
      <Card x={40} y={390} w={460} h={220} tone="amber" icon={Scale} title="Panel · checklist 2 / 3" className="panel">
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {CHECK.map(([c, ok]) => (
            <div key={c} className="ci k-row" style={{ fontSize: 15 }}>
              <b style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>{ok ? '✓' : '✗'}</b> {c}
            </div>
          ))}
          <div className="ci" style={{ fontSize: 14, color: 'var(--amber)' }}>Next: return 400 on an empty title</div>
        </div>
      </Card>
      <Card x={540} y={390} w={420} tone="sky" icon={Hourglass} title="Typed during the cooldown?" className="hg">
        <div className="k-card-sub">A retry is scheduled for when the cooldown ends. A change is never dropped.</div>
      </Card>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Pause, snapshot, compare',
      caption: 'After 5 seconds idle (or a terminal run) ShipLabs snapshots the files, hashes them, and skips if nothing changed.',
      say: "There is no submit button in VS Code. When you stop typing for five seconds, ShipLabs takes a snapshot of your files and makes a fingerprint, a hash. If the fingerprint is the same as last time, nothing is sent. No request, no cost.",
      body: <p className="r-p">The review reads the <b>open file</b> (line-numbered, unsaved text included) plus up to 20 repo files as context. ShipLabs' own comment lines are stripped before hashing. Skipped: <code>node_modules</code>, <code>.git</code>, <code>dist</code>, binaries, files &gt; 32 KB.</p>,
    },
    {
      title: 'Free guards, then one credit',
      caption: 'The server re-checks touched, changed, a 45-second cooldown, a 10-per-hour cap and an active lab before charging one credit.',
      say: "If it changed, the server checks again for free. Did you touch the code? Did it change? Has it been 45 seconds since the last check? Under 10 checks this hour for this step? Is the lab active? Only then does it spend one credit and call the judge.",
      body: <p className="r-p"><code>POST /steps/:stepId/auto-check</code> with ≤ 20 files, ≤ 64 KB. Any failed guard returns <code>{'{skipped: reason}'}</code> for free. Otherwise a ledger row is claimed, 1 credit is charged, and the judge runs.</p>,
    },
    {
      title: 'Feedback where you work',
      caption: 'The status bar flips from Checking to Needs work, and the side panel shows the checklist and the next thing to do.',
      say: "Back in VS Code, the status bar flips from checking to needs work. The side panel shows the checklist, two of three, and the next thing to do. And if you keep typing during the cooldown, the review simply waits and runs when the cooldown ends.",
      body: <p className="r-p">Status bar: <code>Tracking · Checking… · Passed · Needs work · Paused · Lab complete</code>. Pass → a toast names the next step. Fail → panel feedback and an info marker at the top of the file.</p>,
    },
  ],
};
