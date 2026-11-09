import { Activity, CalendarClock, Folder, GraduationCap, KeyRound, MessageSquare, Target } from 'lucide-react';
import { Board, Card, Chip, Ring, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const PATH = [
  ['Equations of motion', 'mastered'],
  ['Projectile motion', 'active'],
  ['Relative velocity', 'upcoming'],
];
const STEPS = [
  ['Set up the project', 'green'],
  ['Define the Task model', 'green'],
  ['Validate the body', 'amber'],
  ['Persist tasks', 'muted'],
  ['Deploy', 'muted'],
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.session', 0);
    draw(tl, q, '.w-chat', 0.3, 0.1);
    pop(tl, q, '.chat', 0.45, 0.12);
    next((at) => {
      tl.to(q('.c-tutor'), { borderColor: '#e3b341' }, at);
      draw(tl, q, '.w-tutor', at);
      pop(tl, q, '.tutor-d', at + 0.2);
      tl.fromTo(q('.k-ring-arc'), { strokeDashoffset: 100 }, { strokeDashoffset: 30, duration: 1.2 }, at + 0.5);
      pop(tl, q, '.path-i', at + 0.6, 0.12, 8);
    });
    next((at) => {
      tl.to(q('.c-coach'), { borderColor: '#4cc77a' }, at);
      draw(tl, q, '.w-coach', at);
      pop(tl, q, '.coach-d', at + 0.2);
      pop(tl, q, '.step-i', at + 0.4, 0.1, 8);
      draw(tl, q, '.w-shelf', at + 0.8, 0.1);
      spring(tl, q, '.shelf', at + 0.9, 0.12);
    });
  });

  return (
    <Board root={root} step={step}>
      <Card x={60} y={30} w={300} tone="gold" icon={Folder} title="LearnSession" sub="A folder in the history sidebar" className="session" />
      <Card x={60} y={190} w={260} tone="sky" icon={MessageSquare} title="Chat" sub="mode: chat" className="chat" />
      <Card x={350} y={190} w={260} tone="gold" icon={GraduationCap} title="Tutor" sub="mode: tutor" className="chat c-tutor" />
      <Card x={640} y={190} w={260} tone="green" icon={Target} title="Coach" sub="mode: coach" className="chat c-coach" />

      <Card x={60} y={350} w={560} h={330} tone="gold" title="Tutor state" className="tutor-d">
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <Chip tone="gold">level: entrance_exam</Chip>
          <Chip tone="gold">exam: JEE</Chip>
          <Chip tone="gold">topic: kinematics</Chip>
        </div>
        <Ring x={110} y={200} r={56} ticks={[65]}>
          <div><b style={{ fontSize: 24 }}>70</b><div className="k-muted" style={{ fontSize: 12 }}>/ 100</div></div>
        </Ring>
        <div style={{ position: 'absolute', left: 230, top: 120, display: 'grid', gap: 14 }}>
          {PATH.map(([t, s]) => (
            <div key={t} className="path-i k-row">
              <span className="k-dot" data-tone={s === 'mastered' ? 'green' : s === 'active' ? 'gold' : 'muted'} />
              <span style={{ color: s === 'upcoming' ? 'var(--muted)' : 'var(--text)' }}>{t}</span>
              <span className="mono k-muted" style={{ fontSize: 12 }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card x={650} y={350} w={300} h={330} tone="green" title="Coach lab · steps" className="coach-d">
        <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
          {STEPS.map(([t, c], i) => (
            <div key={t} className="step-i k-row">
              <span className="k-dot" data-tone={c} />
              <span className="mono k-muted" style={{ fontSize: 12 }}>{i + 1}</span> {t}
            </div>
          ))}
        </div>
      </Card>

      {[
        [CalendarClock, 'ReviewItem', 'spaced-repetition cards', 'sky'],
        [Activity, 'LabTelemetryEvent', 'everything done in VS Code', 'amber'],
        [KeyRound, 'ExtensionToken', 'the one live editor key', 'violet'],
      ].map(([Icon, t, s, tone], i) => (
        <Card key={t as string} x={990} y={190 + i * 170} w={260} tone={tone as 'sky'} icon={Icon as typeof Folder} title={t as string} sub={s as string} className="shelf" />
      ))}

      <Wires>
        <Wire d="M 200 116 L 190 184" tone="gold" className="w-chat" />
        <Wire d="M 260 116 C 300 150 470 140 480 184" tone="gold" className="w-chat" />
        <Wire d="M 320 100 C 600 100 770 120 770 184" tone="gold" className="w-chat" />
        <Wire d="M 480 290 L 380 344" tone="gold" className="w-tutor" />
        <Wire d="M 770 290 L 790 344" tone="green" className="w-coach" />
        {[0, 1, 2].map((i) => (
          <Wire key={i} d={`M 952 ${450 + i * 40} C 970 ${450 + i * 40} 960 ${240 + i * 170} 984 ${240 + i * 170}`} tone="muted" className="w-shelf" dashed />
        ))}
      </Wires>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Sessions hold chats',
      caption: 'A session is a folder; each chat inside it has a mode: chat, tutor or coach.',
      say: "Now the data. A session is just a folder in the sidebar. Inside it are chats, and every chat has a mode: chat, tutor or coach.",
      body: <p className="r-p"><code>LearnSession</code> → many <code>LearnConversation</code>s. Each chat stores its messages, attachments (up to 12), title, summary, tags and share token.</p>,
    },
    {
      title: 'Tutor chats carry state',
      caption: 'A tutor chat also stores the learner profile, points out of 100, the pathway and the open question.',
      say: "A tutor chat also remembers who you are, your profile. It keeps your points out of 100, the pathway of sub-topics, and the question being asked right now.",
      body: <p className="r-p"><code>learnerProfile</code> (level, goal, exam, class, topic) · <code>tutorState</code> (phase, subTopics, index, activeQuestion) · <code>progress</code> · <code>awardedKeys</code> so no answer is paid twice.</p>,
    },
    {
      title: 'Labs, reviews and the editor',
      caption: 'A coach chat holds a lab with up to 300 steps; review cards, editor events and the VS Code token live in their own collections.',
      say: "A coach chat holds a lab with its steps, and each step has a status. Separately, we store review cards for spaced repetition, every event from VS Code, and the single key for your connected editor.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>CoachLab</b>: title, language, status, up to 300 steps, each with a rubric.</li>
          <li className="r-li"><b>ReviewItem</b>: ease factor, interval, repetitions, due date.</li>
          <li className="r-li"><b>ExtensionToken</b>: only a SHA-256 hash, one per user.</li>
        </ul>
      ),
    },
  ],
};
