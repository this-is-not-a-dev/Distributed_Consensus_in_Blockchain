import { BarChart3, FileText, GraduationCap, Link2, MessageSquare, Repeat, ScanEye, Star, Target } from 'lucide-react';
import { Board, Card, Chip, Orb, Txt, Wire, Wires, draw, focus, pop, spring, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

const MODES: { icon: typeof MessageSquare; tone: Tone; title: string; sub: string; feels: string }[] = [
  { icon: MessageSquare, tone: 'sky', title: 'Chat', sub: 'Ask anything. Clear, illustrated, sourced answers.', feels: 'A brilliant friend' },
  { icon: GraduationCap, tone: 'gold', title: 'Tutor', sub: 'A full course: teach → ask → grade → advance.', feels: 'A private tutor' },
  { icon: Target, tone: 'green', title: 'Coach', sub: 'A hands-on project lab with code reviews.', feels: 'A senior engineer' },
  { icon: ScanEye, tone: 'violet', title: 'ShipLabs for VS Code', sub: 'Watches, reviews, comments and runs your code.', feels: 'A lab instructor' },
];
const SATS = [
  { icon: Repeat, label: 'Reviews' },
  { icon: Star, label: 'XP & ranks' },
  { icon: FileText, label: 'Documents' },
  { icon: Link2, label: 'Share' },
  { icon: BarChart3, label: 'Lab reports' },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    spring(tl, q, '.k-orb', 0);
    const show = (i: number, at: number) => {
      draw(tl, q, `.wire-${i}`, at);
      tl.fromTo(q(`.mode-${i}`), { autoAlpha: 0, rotateY: -80, transformPerspective: 800 }, { autoAlpha: 1, rotateY: 0 }, at + 0.25);
      focus(tl, q, '.mode', `.mode-${i}`, at + 0.25, 0.45);
    };
    show(0, 0.4);
    next((at) => show(1, at));
    next((at) => show(2, at));
    next((at) => show(3, at));
    next((at) => {
      focus(tl, q, '.mode', null, at);
      spring(tl, q, '.sat', at, 0.1);
      pop(tl, q, '.tagline', at + 0.6);
    });
  });

  return (
    <Board root={root} step={step}>
      <Orb x={640} y={120} r={52} label="One tutor, four ways to learn" />
      <Wires>
        {MODES.map((_, i) => {
          const x = 175 + i * 310;
          return <Wire key={i} d={`M 640 172 C 640 250 ${x} 230 ${x} 302`} tone={MODES[i].tone} className={`wire-${i}`} />;
        })}
      </Wires>
      {MODES.map((m, i) => (
        <Card key={m.title} x={40 + i * 310} y={310} w={270} h={200} tone={m.tone} icon={m.icon} title={m.title} sub={m.sub} className={`mode mode-${i}`}>
          <div style={{ position: 'absolute', left: 16, bottom: 14, fontSize: 14, color: `var(--${m.tone})` }}>Feels like: {m.feels}</div>
        </Card>
      ))}
      <div style={{ left: 40, top: 545, width: 1200, display: 'flex', justifyContent: 'center', gap: 14 }}>
        {SATS.map(({ icon: Icon, label }) => (
          <Chip key={label} className="sat">
            <Icon size={15} /> {label}
          </Chip>
        ))}
      </div>
      <Txt x={40} y={610} w={1200} className="tagline k-center">
        <span className="k-h" style={{ fontSize: 50 }}>
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
      title: 'Chat',
      caption: 'Chat mode: ask anything and get clear, illustrated answers with checked sources.',
      say: "ShipLabs is one tutor with four ways to learn. The first is Chat. You ask anything, and you get a clear answer, with diagrams, real photos and source links that were checked to actually exist.",
      body: <p className="r-p">Ask anything. Answers stream in live, with <b>clickable options</b>, <b>drawn diagrams</b>, <b>real photos</b> with credits, and <b>verified sources</b>.</p>,
    },
    {
      title: 'Tutor',
      caption: 'Tutor mode: a structured course on any topic with a syllabus and a report card.',
      say: "The second is Tutor. This is a full course on one topic. It teaches, asks a question, grades your answer and gives points. When you score 65, you have mastered that part and it moves you forward.",
      body: <p className="r-p">A course on any topic: <b>teach → ask → grade → advance</b>. A syllabus on the right, progress out of 100, mastery at <b>65</b>.</p>,
    },
    {
      title: 'Coach',
      caption: 'Coach mode: one sentence becomes a step-by-step project lab with code reviews.',
      say: "The third is Coach. You say what you want to build, for example a REST API in Go. It designs a full project, split into steps, each with clear instructions and a rubric. You write the code, and it reviews it like a senior engineer.",
      body: <p className="r-p">Say what you want to build. You get <b>one coherent project</b>, step by step, each with a goal, instructions, starter code and a <b>rubric</b>.</p>,
    },
    {
      title: 'ShipLabs for VS Code',
      caption: 'The superpower: the Coach lab inside your own VS Code, reviewing your code as you write it.',
      say: "And the fourth is the superpower, the ShipLabs extension for VS Code. It brings the lab into your own editor. It watches your work, reviews it a few seconds after you pause, writes hint comments in your file, and can even run your code. But it never writes your code for you.",
      body: <p className="r-p">The lab inside <b>your own editor</b>. It reviews when you pause, leaves <code>ShipLabs:</code> hint comments, and runs your code. It <b>never edits your code</b>.</p>,
    },
    {
      title: 'One rule behind it all',
      caption: 'The AI writes; the code decides. Grading, points, progress, credits and every file write are controlled by server code.',
      say: "Around these sit reviews, XP and ranks, documents, sharing and lab reports. And one rule runs through the whole project. The AI writes, the code decides. The AI writes explanations and questions. But grading, points, moving forward, credits and every write to your files are decided by normal, testable code.",
      body: (
        <>
          <p className="r-quote">The AI writes. <em>The code decides.</em></p>
          <p className="r-note">The model generates explanations, questions and reviews. <b>Grading, points, advancing, credits, verification and file writes</b> are deterministic server code.</p>
        </>
      ),
    },
  ],
};
