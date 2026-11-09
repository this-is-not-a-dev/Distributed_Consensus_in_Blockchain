import { BookOpenText, BrainCircuit, CircleHelp, ClipboardX, MonitorPlay, Users, UserRound } from 'lucide-react';
import { Board, Card, Txt, count, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

// Six pains orbit one student; each step adds two, the last step closes them in.
const PAINS = [
  { x: 60, y: 40, icon: BookOpenText, title: 'Wall of text', sub: 'Answers, but no teaching' },
  { x: 900, y: 40, icon: CircleHelp, title: 'Is this even right?', sub: 'Confidently wrong facts' },
  { x: 40, y: 290, icon: ClipboardX, title: 'Nobody checks me', sub: 'No marks, no feedback' },
  { x: 920, y: 290, icon: BrainCircuit, title: 'Forgot it already', sub: 'Gone within a week' },
  { x: 60, y: 540, icon: MonitorPlay, title: 'Watching ≠ doing', sub: 'Tutorials show finished code' },
  { x: 900, y: 540, icon: Users, title: 'One size fits all', sub: 'Class 8 ≠ JEE ≠ developer' },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    spring(tl, q, '.student', 0);
    pop(tl, q, '.wall', 0.3);
    pop(tl, q, '.pain-0, .pain-1', 0.6, 0.2);
    spring(tl, q, '.wrong', 1.1);
    next((at) => {
      pop(tl, q, '.pain-2, .pain-3', at, 0.2);
      pop(tl, q, '.mem', at + 0.3);
      tl.to(q('.mem-bar i'), { scaleX: 0.2, duration: 1.6, ease: 'power1.in' }, at + 0.5);
      count(tl, q, '.mem-num', 100, 20, at + 0.5, '%');
      tl.to(q('.mem-num'), { color: '#ef5350', duration: 1.6 }, at + 0.5);
    });
    next((at) => pop(tl, q, '.pain-4, .pain-5', at, 0.2));
    next((at) => {
      PAINS.forEach((p, i) =>
        tl.to(q(`.pain-${i}`), { x: (640 - 130 - p.x) * 0.22, y: (330 - p.y) * 0.22, opacity: 0.35, filter: 'grayscale(1)' }, at),
      );
      tl.to(q('.wall, .mem, .wrong'), { opacity: 0.15 }, at);
      pop(tl, q, '.verdict', at + 0.4);
    });
  });

  return (
    <Board root={root} step={step}>
      <div className="student" style={{ left: 560, top: 250, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #34343d, #1a1a1f)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center' }}>
        <UserRound size={72} strokeWidth={1.2} color="#ece9e2" />
      </div>
      <Card x={380} y={70} w={300} tone="muted" className="wall" style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--dim)' }}>
        Photosynthesis is the process by which green plants, algae and some bacteria convert light energy into chemical energy that is stored in glucose. The light-dependent reactions occur in the thylakoid membranes, while the Calvin cycle…
      </Card>
      <span className="wrong k-chip k-abs" data-tone="red" style={{ left: 640, top: 160 }}>?</span>
      <Card x={540} y={440} w={200} className="mem" tone="red">
        <div className="k-row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
          <span className="k-muted">Memory · day 7</span>
          <b className="mem-num mono">100%</b>
        </div>
        <div className="k-bar mem-bar" data-tone="red" style={{ marginTop: 8 }}><i style={{ transform: 'scaleX(1)' }} /></div>
      </Card>
      {PAINS.map((p, i) => (
        <Card key={p.title} x={p.x} y={p.y} w={300} tone="red" icon={p.icon} title={p.title} sub={p.sub} className={`pain-${i}`} />
      ))}
      <Txt x={240} y={600} w={800} className="verdict k-center">
        <span className="k-h" style={{ fontSize: 50 }}>
          Content is everywhere. <em>Teaching isn't.</em>
        </span>
      </Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Answers without teaching',
      caption: 'Generic AI chatbots answer but do not teach: a wall of text, and sometimes a confidently wrong fact.',
      say: "Students today have more content than ever. But content is not teaching. A normal AI chatbot gives you a wall of text. It never checks if you understood. And sometimes it says something wrong, with full confidence.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Wall of text.</b> A chatbot dumps an answer and moves on.</li>
          <li className="r-li"><b>Is this even right?</b> It can be wrong and sound completely sure.</li>
        </ul>
      ),
    },
    {
      title: 'No feedback, and fast forgetting',
      caption: 'Videos and PDFs never mark your answer, and most of a topic is forgotten within a week.',
      say: "Second, there is no feedback loop. A video or a PDF can't tell you which part you got right and which part you got wrong. Third, forgetting. You learn a topic today, and in a week most of it is gone, because nothing brings it back at the right time.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Nobody checks me.</b> Nobody marks the answer, so nobody knows what is missing.</li>
          <li className="r-li"><b>Forgot it already.</b> Memory drops to about 20% in a week without review.</li>
        </ul>
      ),
    },
    {
      title: 'Watching is not doing',
      caption: 'Tutorials show finished code, and one style of teaching is forced on very different learners.',
      say: "Fourth, watching code is not the same as writing code. Real skill comes from getting stuck and having someone look over your shoulder. Bootcamps do that, but they are expensive. And fifth, one size fits all. A Class 8 student, a JEE student and a working developer need very different depth and language.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Watching ≠ doing.</b> Skill comes from writing code and getting reviewed.</li>
          <li className="r-li"><b>One size fits all.</b> Different levels, goals and languages: English, Hindi, Punjabi.</li>
        </ul>
      ),
    },
    {
      title: 'The gap',
      caption: 'Content is everywhere. Teaching is not.',
      say: "So here is the gap in one line. Content is everywhere. Teaching isn't. ShipLabs is built to close that gap.",
      body: <p className="r-quote">Content is everywhere. <em>Teaching isn't.</em></p>,
    },
  ],
};
