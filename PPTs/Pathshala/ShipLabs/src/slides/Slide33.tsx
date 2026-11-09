import { Board, Txt, pop, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const MILES: [string, string][] = [
  ['May 1–3', 'Learning engine introduced'],
  ['Jun 24–25', 'Universal levels, School → PhD'],
  ['Jun 27', 'Tutor chat, XP, reviews, Hindi + Punjabi'],
  ['Jun 28–29', 'Streaming chat, sessions, Tutor mode'],
  ['Jul 1–3', 'State machine, intent gate, SM-2'],
  ['Jul 5–7', 'Tiered verification, exam syllabus'],
  ['Jul 13–16', 'Coach mode: project labs'],
  ['Oct 24', 'ShipLabs for VS Code (v1.6.0)'],
  ['Oct 25', 'Lab switching, repo choice, lab reports'],
  ['Nov 7', 'Comments-only, live lab, auto-run'],
];
const X = (i: number) => 90 + i * 122;
const Y = 360;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    tl.fromTo(q('.axis'), { scaleX: 0 }, { scaleX: 0.55, duration: 1.4, ease: 'none' }, 0);
    tl.fromTo(q('.head'), { x: 0 }, { x: X(6) - 90, duration: 2.4, ease: 'none' }, 0);
    q('.pin').forEach((el, i) => i < 7 && pop(tl, q, [el], 0.15 + i * 0.32, 0, i % 2 ? -14 : 14));
    next((at) => {
      tl.to(q('.axis'), { scaleX: 1, duration: 1.4, ease: 'none' }, at);
      tl.to(q('.head'), { x: X(9) - 90, duration: 1.4, ease: 'none' }, at);
      q('.pin').forEach((el, i) => i >= 7 && pop(tl, q, [el], at + 0.4 + (i - 7) * 0.35, 0, i % 2 ? -14 : 14));
      pop(tl, q, '.gap', at);
    });
  });

  return (
    <Board root={root} step={step}>
      <Txt x={90} y={60} className="k-cap">2026 · built step by step</Txt>
      <div className="axis" style={{ left: 90, top: Y, width: 1110, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, var(--gold), var(--sky) 55%, var(--violet))', transformOrigin: 'left' }} />
      <div className="head" style={{ left: 82, top: Y - 7, width: 17, height: 17, borderRadius: '50%', background: '#fff', boxShadow: '0 0 20px var(--gold)' }} />
      <Txt x={X(6) + 40} y={Y + 20} className="gap k-muted" style={{ fontSize: 12 }}>· · · · · ·</Txt>
      {MILES.map(([d, t], i) => {
        const up = i % 2 === 0;
        const c = i < 6 ? 'var(--gold)' : i < 7 ? 'var(--sky)' : 'var(--violet)';
        return (
          <div key={d} className="pin" style={{ left: X(i) - 70, top: up ? Y - 190 : Y + 26, width: 140, textAlign: 'center' }}>
            {!up && <div style={{ width: 2, height: 30, margin: '0 auto 8px', background: c }} />}
            <div className="mono" style={{ fontSize: 13, color: c }}>{d}</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.35, marginTop: 4 }}>{t}</div>
            {up && <div style={{ width: 2, height: 46, margin: '10px auto 0', background: c }} />}
          </div>
        );
      })}
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'May to July: the tutor',
      caption: 'From the first engine in May to streaming chat, Tutor mode, verification and Coach labs by mid-July.',
      say: "How was it built? Step by step, in public. In May, the learning engine. By the end of June, universal levels, the tutor chat, XP and reviews, and streaming. In early July, the state machine, the intent gate and fact checking. And by mid-July, Coach labs.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Markdown + control blocks</td><td>text is instant; extras stay machine-readable</td></tr>
            <tr><td>Code decides grading</td><td>models mis-grade and "move on" too early</td></tr>
            <tr><td>Tiered verification</td><td>free regex first, costly checks only when risky</td></tr>
            <tr><td>SM-2 computed on read</td><td>no cron jobs, correct IST day boundaries</td></tr>
          </tbody>
        </table>
      ),
    },
    {
      title: 'October to November: ShipLabs',
      caption: 'October brought the VS Code extension and lab reports; November brought comments-only reviews, the live lab and auto-run.',
      say: "Then the big one. In late October, the ShipLabs extension for VS Code, with pairing, telemetry and automatic checks. Then lab switching and lab reports. And in November, the rule that it only comments and never edits code, the live lab feed, and auto-run.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Comments-only</td><td>learners must write their own code; trust</td></tr>
            <tr><td>Local auto-run command</td><td>the server can't make a machine run anything</td></tr>
            <tr><td>One 5 s poll + labKey</td><td>live feel without hitting rate limits</td></tr>
            <tr><td>Quality gate + repair</td><td>repair is cheaper than regenerating</td></tr>
          </tbody>
        </table>
      ),
    },
  ],
};
