import { ArrowRight, GraduationCap } from 'lucide-react';
import { Board, Chip, Code, Orb, Txt, Win, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import { StepEngine } from '../engine/StepEngine';
import { Button } from '../ui/Button';
import type { SlideDef } from './registry';

const CODE = [
  { t: '# ShipLabs: sums a list. Empty-list case missing.', c: 'sl cm-in' },
  { t: 'def total(xs):' },
  { t: '    s = 0' },
  { t: '    # ShipLabs: What if xs is empty?', c: 'sl cm-in' },
  { t: '    for x in xs:' },
  { t: '        s += x' },
  { t: '    return s' },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, _next, q) => {
    pop(tl, q, '.w-browser', 0);
    pop(tl, q, '.w-code', 0.15);
    spring(tl, q, '.k-orb', 0.35);
    draw(tl, q, '.k-wire', 0.6);
    pop(tl, q, '.msg', 0.8, 0.15);
    tl.fromTo(q('.cm-in'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, stagger: 0.35 }, 1.1);
    pop(tl, q, '.tag', 1.6);
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={110} w={470} h={300} title="shiplabs.app/learn" className="w-browser">
        <div className="msg" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
          <Chip tone="sky"><GraduationCap size={14} /> Tutor</Chip>
          <span className="k-muted" style={{ fontSize: 14 }}>Kinematics · JEE Main</span>
        </div>
        <div className="msg" style={{ background: '#1f1f25', borderRadius: 12, padding: '12px 14px', fontSize: 15, lineHeight: 1.5, marginBottom: 12 }}>
          A ball is thrown up at <b>20 m/s</b>. How long until it stops rising?
        </div>
        <div className="msg" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip>a) 1 s</Chip>
          <Chip tone="green">b) ≈ 2 s ✓</Chip>
          <Chip>c) 4 s</Chip>
        </div>
        <div className="msg" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
          <span className="k-muted">Mastery</span>
          <span className="k-bar" data-tone="gold" style={{ flex: 1 }}><i style={{ transform: 'scaleX(0.7)' }} /></span>
          <span className="mono" style={{ color: 'var(--gold)' }}>70/100</span>
        </div>
      </Win>

      <Win x={690} y={200} w={560} h={300} kind="vscode" title="app.py — ShipLabs" className="w-code">
        <Code lines={CODE} />
      </Win>

      <Orb x={600} y={150} r={40} label="AI tutor" />
      <Wires>
        <Wire d="M 510 190 C 545 170 550 160 560 155" tone="gold" />
        <Wire d="M 640 160 C 690 165 700 190 720 205" tone="gold" />
      </Wires>

      <Txt x={40} y={600} w={1200} className="tag">
        <span className="k-h" style={{ fontSize: 46 }}>
          The AI writes. <em>The code decides.</em>
        </span>
      </Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Welcome',
      caption: 'ShipLabs: an AI tutor that teaches, checks and coaches, in the browser and inside VS Code. Presented by team Indie Hub: Mantej Singh Arora, Gagandeep, Dhruv Pandey and Divyansh Sharma.',
      say: "Good morning everyone. We are team Indie Hub, and our major project is called ShipLabs. It is an AI tutor that does three things. It teaches you, it checks your answers, and it coaches you while you build real projects, even inside your own code editor. Let's begin.",
      body: (
        <div className="title-card">
          <p className="kicker">Major Project</p>
          <h1 className="title-hero">
            Ship<em>Labs</em>
          </h1>
          <p className="title-lead">An AI tutor that teaches, checks and coaches, in your browser and inside VS Code.</p>
          <div className="title-author">
            <p className="title-name">Team Indie Hub</p>
            <p className="title-members">Mantej Singh Arora · Gagandeep · Dhruv Pandey · Divyansh Sharma</p>
            <p className="title-course">B.Tech CSE · 7th Semester</p>
            <p className="title-course">IKGPTU Mohali Campus</p>
          </div>
          <div>
            <Button variant="primary" onClick={() => StepEngine.next()}>
              Begin <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      ),
    },
  ],
};
