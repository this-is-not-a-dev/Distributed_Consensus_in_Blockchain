import { Board, Packet, Txt, Wire, Wires, draw, pop, spring, travel, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

const NODES: { id: string; label: string; x: number; y: number; tone: Tone }[] = [
  { id: 'on', label: 'ONBOARDING', x: 40, y: 300, tone: 'muted' },
  { id: 'te', label: 'TEACHING', x: 290, y: 300, tone: 'sky' },
  { id: 'qo', label: 'QUESTION_OPEN', x: 540, y: 300, tone: 'gold' },
  { id: 'gr', label: 'GRADING', x: 790, y: 300, tone: 'amber' },
  { id: 'ma', label: 'MASTERED', x: 1040, y: 300, tone: 'green' },
  { id: 'co', label: 'COMPLETED', x: 1040, y: 540, tone: 'violet' },
];
const LOOPS = [
  { d: 'M 580 298 C 560 200 650 200 640 298', tone: 'sky' as Tone, lx: 470, ly: 160, t: 'clarify / request: question stays open' },
  { d: 'M 880 298 C 860 220 740 220 700 298', tone: 'amber' as Tone, lx: 790, ly: 220, t: 'points < 65: feedback, reteach deeper' },
  { d: 'M 600 390 C 570 460 440 460 410 392', tone: 'violet' as Tone, lx: 380, ly: 462, t: 'navigation: move pointer first' },
  { d: 'M 1100 390 C 1040 640 420 640 380 392', tone: 'green' as Tone, lx: 560, ly: 600, t: 'index++ and schedule an SM-2 review' },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.node', 0, 0.12);
    draw(tl, q, '.main', 0.6, 0.15);
    pop(tl, q, '.mlbl', 1.2, 0.1, 6);
    next((at) => {
      q('.loop').forEach((el, i) => {
        draw(tl, q, [el], at + i * 0.3);
        pop(tl, q, `.llbl-${i}`, at + 0.2 + i * 0.3, 0, 6);
      });
      travel(tl, q, '.tok', '.route', at + 1.4, 2.2, true);
      spring(tl, q, '.ma-glow', at + 3.4);
    });
  });

  return (
    <Board root={root} step={step}>
      {NODES.map((n) => (
        <div key={n.id} className={`node k-card ${n.id === 'ma' ? 'ma' : ''}`} data-tone={n.tone} style={{ left: n.x, top: n.y, width: 200, height: 86, display: 'grid', placeItems: 'center', font: '600 15px var(--font-mono)', color: `var(--${n.tone})` }}>
          {n.label}
        </div>
      ))}
      <div className="ma-glow" style={{ left: 1036, top: 296, width: 208, height: 94, borderRadius: 16, boxShadow: '0 0 0 2px var(--green), 0 0 50px rgba(76,199,122,0.5)' }} />
      <Txt x={250} y={262} className="mlbl k-muted" style={{ fontSize: 12 }}>profile</Txt>
      <Txt x={490} y={262} className="mlbl k-muted" style={{ fontSize: 12 }}>teach + ask</Txt>
      <Txt x={744} y={358} className="mlbl k-muted" style={{ fontSize: 12 }}>answer</Txt>
      <Txt x={1000} y={358} className="mlbl k-muted" style={{ fontSize: 12 }}>≥ 65</Txt>
      <Txt x={1150} y={440} className="mlbl k-muted" style={{ fontSize: 12 }}>last one</Txt>
      {LOOPS.map((l, i) => (
        <Txt key={i} x={l.lx} y={l.ly} className={`llbl-${i}`} style={{ fontSize: 14, color: `var(--${l.tone})` }}>{l.t}</Txt>
      ))}
      <Wires>
        <Wire d="M 242 343 L 286 343" className="main" />
        <Wire d="M 492 343 L 536 343" className="main" />
        <Wire d="M 742 343 L 786 343" className="main" />
        <Wire d="M 992 343 L 1036 343" className="main" />
        <Wire d="M 1140 388 L 1140 536" className="main" />
        {LOOPS.map((l, i) => <Wire key={i} d={l.d} tone={l.tone} className="loop" />)}
        <path className="route" d="M 140 343 L 1140 343" fill="none" stroke="none" />
        <Packet label="you" tone="gold" className="tok" />
      </Wires>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'One path through a course',
      caption: 'Onboarding, teaching, an open question, grading, mastery and completion: the tutor is a state machine.',
      say: "The tutor is not a free-form chat. It is a state machine. Onboarding, then teaching, then a question is open, then grading, then mastered, and finally completed. Code decides which state you are in, not the AI.",
      body: <p className="r-p">Each tutor chat stores <code>tutorState = {'{'}phase, subTopics, subTopicIndex, activeQuestion{'}'}</code>. The phase only changes through server code.</p>,
    },
    {
      title: 'Loops that keep it honest',
      caption: 'Clarifications keep the question open, low scores reteach deeper, navigation moves the pointer first, and mastery schedules a review.',
      say: "Now the loops. If you ask for a hint, the question stays open. If you score below 65, you get feedback and a deeper reteach. If you say go to topic 3, the pointer moves first. And when you master a topic, the next one starts and a review is booked for later.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>clarification / request</b> → help, question stays open</li>
          <li className="r-li"><b>points &lt; 65</b> → feedback, next question, reteach deeper</li>
          <li className="r-li"><b>navigation</b> → move the pathway pointer before teaching</li>
          <li className="r-li"><b>points ≥ 65</b> → mastered, <code>subTopicIndex++</code>, SM-2 review</li>
        </ul>
      ),
    },
  ],
};
