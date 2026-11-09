import { CheckCheck, CircleHelp, Compass, NotebookPen } from 'lucide-react';
import { Board, Card, Packet, Txt, Wire, Wires, draw, pop, spring, travel, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

// A switchyard: each learner message is a car, code throws the switch before any AI sees it.
const TRACKS: { y: number; tone: Tone; icon: typeof CheckCheck; name: string; note: string; msg: string }[] = [
  { y: 110, tone: 'green', icon: CheckCheck, name: 'Grade', note: 'answer → graded', msg: '"b"' },
  { y: 270, tone: 'sky', icon: NotebookPen, name: 'Request', note: 'fulfilled · question stays open', msg: '"make notes on this"' },
  { y: 430, tone: 'amber', icon: CircleHelp, name: 'Clarify', note: 'hint given · question stays open', msg: '"I\'m confused, hint?"' },
  { y: 590, tone: 'violet', icon: Compass, name: 'Navigate', note: 'pointer moves BEFORE teaching', msg: '"go to topic 3"' },
];
const track = (y: number) => `M 40 350 L 400 350 C 520 350 500 ${y + 40} 640 ${y + 40} L 960 ${y + 40}`;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.switch, .in-lbl', 0);
    draw(tl, q, '.trk', 0.2, 0.12);
    pop(tl, q, '.st', 0.6, 0.1);
    const run = (i: number, at: number) => {
      tl.to(q('.st'), { opacity: 0.35 }, at);
      tl.to(q('.lever'), { rotate: i * 28 - 42, duration: 0.4 }, at);
      travel(tl, q, `.car-${i}`, `.trk-${i}`, at + 0.2, 1.8, true);
      tl.to(q(`.st-${i}`), { opacity: 1 }, at + 1.6);
      spring(tl, q, `.note-${i}`, at + 1.8);
    };
    run(0, 1);
    next((at) => run(1, at));
    next((at) => run(2, at));
    next((at) => {
      run(3, at);
      tl.fromTo(q('.ptr'), { y: 0 }, { y: 56, duration: 0.5, ease: 'back.out(2)' }, at + 2.2);
    });
  });

  return (
    <Board root={root} step={step}>
      <Txt x={40} y={300} className="in-lbl k-cap">Learner message</Txt>
      <div className="switch" style={{ left: 380, top: 310, width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--gold)', background: 'rgba(227,179,65,0.08)', display: 'grid', placeItems: 'center' }}>
        <span className="lever" style={{ width: 34, height: 4, borderRadius: 2, background: 'var(--gold)', transformOrigin: '0 50%', marginLeft: 34, transform: 'rotate(-42deg)' }} />
        <span className="k-cap" style={{ position: 'absolute', top: 88, fontSize: 11, whiteSpace: 'nowrap', color: 'var(--gold)' }}>code, not AI</span>
      </div>
      {TRACKS.map((t, i) => (
        <Card key={t.name} x={970} y={t.y} w={270} h={84} tone={t.tone} icon={t.icon} title={t.name} className={`st st-${i}`}>
          <span className={`note-${i} k-chip`} data-tone={t.tone} style={{ position: 'absolute', left: 0, top: 92, height: 26, fontSize: 12.5 }}>{t.note}</span>
        </Card>
      ))}
      <div className="st st-3" style={{ left: 60, top: 470, width: 260, display: 'grid', gap: 4, fontSize: 13 }}>
        {['1 Motion in a line', '2 Motion in a plane', '3 Projectile motion'].map((p) => (
          <div key={p} className="k-muted" style={{ height: 26, paddingLeft: 26 }}>{p}</div>
        ))}
        <span className="ptr" style={{ position: 'absolute', left: 0, top: 0, color: 'var(--violet)', fontWeight: 700 }}>▶</span>
      </div>
      <Wires>
        {TRACKS.map((t, i) => (
          <Wire key={i} d={track(t.y)} tone={t.tone} arrow className={`trk trk-${i}`} />
        ))}
        {TRACKS.map((t, i) => (
          <Packet key={i} label={t.msg} tone={t.tone} className={`car-${i}`} />
        ))}
      </Wires>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'A real answer gets graded',
      caption: 'An open MCQ and the message "b": the switch sends it to the Grade track.',
      say: "Here is a big problem with AI tutors. Before any AI sees your message, our code decides what kind of message it is. If a question is open and you type b, that matches an option. So it goes to the grade track.",
      body: <p className="r-p">A pending MCQ and a message that matches an option (exact text, letter, number, a unique phrase or option id) → <b>answer</b> → graded.</p>,
    },
    {
      title: 'A request is never graded',
      caption: '"Make notes on this" while a question is open is a request: fulfilled, and the question stays open.',
      say: "Now you type: make notes on this. A normal AI tutor would mark that as a wrong answer. We don't. It's a request. You get your notes, and the question stays open for later. Uploading a file is also always a request.",
      body: <p className="r-p">Commands like <i>make notes, summarize, explain</i>, and any message sent <b>with a file upload</b>, are requests: fulfilled, <b>never graded</b>.</p>,
    },
    {
      title: 'Confusion gets help',
      caption: '"I\'m confused, hint?" is a clarification: help is given and the question stays open.',
      say: "You type: I'm confused, can I get a hint? That is a clarification. You get help, and the question is still open. No marks are lost.",
      body: <p className="r-p">Meta remarks like <i>hint, I'm confused, repeat, simpler</i> → <b>clarification</b>. Help is given; the question stays open.</p>,
    },
    {
      title: 'Navigation moves first',
      caption: '"Go to topic 3" is navigation: the pathway pointer jumps to 3 before the tutor speaks.',
      say: "And if you say go to topic 3, the pointer moves to topic 3 first, before the tutor speaks. So the lesson always matches where you are. Only a real answer is ever graded. Everything else is handled fairly.",
      body: (
        <>
          <p className="r-p">Explicit navigation (<i>go to topic 2, next lesson, can we move on</i>) moves the pathway pointer <b>before</b> teaching.</p>
          <p className="r-note">Order of checks in <code>classifyLearnerMessage</code>: MCQ match → navigation → upload → clarification → command → pending question → none.</p>
        </>
      ),
    },
  ],
};
