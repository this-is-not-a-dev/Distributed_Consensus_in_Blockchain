import { CalendarClock } from 'lucide-react';
import { Board, Chip, Txt, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

// A real plot: x = days (0–45), y = how much you still remember (0–100 %).
const X0 = 90, X1 = 1200, Y0 = 470, Y1 = 70, DAYS = 45;
const px = (d: number) => X0 + (d / DAYS) * (X1 - X0);
const py = (r: number) => Y0 - (r / 100) * (Y0 - Y1);

function curve(from: number, to: number, f: (d: number) => number) {
  let s = '';
  for (let d = from; d <= to + 1e-9; d += 0.25) s += `${s ? 'L' : 'M'} ${px(d).toFixed(1)} ${py(f(d)).toFixed(1)} `;
  return s;
}

/** No reviews: memory falls to ~20 % in a week. */
const FORGET = curve(0, DAYS, (d) => 100 * Math.exp(-d / 4.35));
/** SM-2 days 1, 6, 15, 38: each review resets to 100 % and the next decay is slower. */
const REVIEWS = [0, 1, 6, 15, 38];
const STABILITY = [1.96, 9.8, 17.6, 45, 60];
// one continuous path: each segment's leading move becomes a vertical "snap back" line
const SR = REVIEWS.map((t, k) => curve(t, REVIEWS[k + 1] ?? DAYS, (d) => 100 * Math.exp(-(d - t) / STABILITY[k])).replace(/^M/, k ? 'L' : 'M')).join(' ');

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.axes, .lbl', 0, 0.05);
    draw(tl, q, '.forget', 0.4);
    spring(tl, q, '.p20', 1.4);
    next((at) => {
      tl.to(q('.forget'), { opacity: 0.3 }, at);
      draw(tl, q, '.sr', at + 0.2);
      q('.rv').forEach((el, i) => spring(tl, q, [el], at + 0.4 + i * 0.35, 0));
    });
    next((at) => {
      spring(tl, q, '.fail', at);
      draw(tl, q, '.fail-arc', at + 0.3);
      pop(tl, q, '.fail-note', at + 0.6);
      spring(tl, q, '.due', at + 1);
    });
  });

  return (
    <Board root={root} step={step}>
      <svg className="k-wires" viewBox="0 0 1280 720">
        <g className="axes" stroke="#3a3a43" strokeWidth="1">
          <line x1={X0} y1={Y0} x2={X1} y2={Y0} />
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} />
          {[25, 50, 75, 100].map((r) => <line key={r} x1={X0} y1={py(r)} x2={X1} y2={py(r)} strokeDasharray="3 6" opacity={0.6} />)}
        </g>
        <path className="k-wire forget" data-tone="red" pathLength={1} d={FORGET} style={{ strokeWidth: 3 }} />
        <path className="k-wire sr" data-tone="gold" pathLength={1} d={SR} style={{ strokeWidth: 3 }} />
        {REVIEWS.slice(1).map((d) => (
          <circle key={d} className="rv" cx={px(d)} cy={py(100)} r={8} fill="#e3b341" style={{ filter: 'drop-shadow(0 0 8px #e3b341)' }} />
        ))}
        <circle className="fail" cx={px(15)} cy={py(100)} r={11} fill="none" stroke="#f5a524" strokeWidth={3} />
        <path className="k-wire fail-arc" data-tone="amber" pathLength={1} d={`M ${px(15)} ${py(100) - 14} C ${px(15.5)} ${py(100) - 60} ${px(16)} ${py(100) - 60} ${px(16)} ${py(100) - 14}`} markerEnd="url(#arr-amber)" />
        <defs>
          <marker id="arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#f5a524" />
          </marker>
        </defs>
      </svg>
      <Txt x={X0 - 70} y={Y1 - 12} className="lbl k-muted" style={{ fontSize: 13 }}>100 %</Txt>
      <Txt x={X0 - 50} y={Y0 - 12} className="lbl k-muted" style={{ fontSize: 13 }}>0</Txt>
      {[0, 7, 15, 30, 45].map((d) => (
        <Txt key={d} x={px(d) - 20} y={Y0 + 12} className="lbl k-muted" style={{ fontSize: 13 }}>day {d}</Txt>
      ))}
      <span className="p20 k-chip" data-tone="red" style={{ left: px(7) - 10, top: py(20) - 50 }}>~20 % left after a week</span>
      {REVIEWS.slice(1).map((d) => (
        <Txt key={d} x={px(d) - 26} y={py(100) - 38} className="rv mono" style={{ fontSize: 12, color: 'var(--gold)' }}>day {d}</Txt>
      ))}
      <Chip x={px(15) + 30} y={py(100) + 10} tone="amber" className="fail-note">quality 2 → back to tomorrow</Chip>

      <div className="due k-card" data-tone="sky" style={{ left: 90, top: 560, width: 420, display: 'flex', alignItems: 'center', gap: 14 }}>
        <CalendarClock color="var(--sky)" />
        <span style={{ flex: 1 }}>Reviews</span>
        <span className="k-chip k-pulse" data-tone="sky">2 due today</span>
      </div>
      <Txt x={560} y={566} w={640} className="due k-muted" style={{ fontSize: 15 }}>
        A free 4-question refresher, graded in code. Due dates use IST day boundaries and are computed on read: no background jobs.
      </Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'The forgetting curve',
      caption: 'Without review, memory of a new topic falls to about 20 percent within a week.',
      say: "This red line is the forgetting curve. You learn something today, and without any review you remember only about 20 percent of it after a week.",
      body: <p className="r-p">When you <b>master</b> a sub-topic (65+ points), it goes onto a review calendar with <code>scheduleOnMastery</code>.</p>,
    },
    {
      title: 'Reviews right before you forget',
      caption: 'SM-2 schedules reviews at about 1, 6, 15 and 38 days; each review resets memory and slows the next decline.',
      say: "ShipLabs brings the topic back right before you would forget it. After one day, then six days, then about two weeks, then about five weeks. Each time, memory jumps back up and fades more slowly.",
      body: (
        <pre className="r-note mono" style={{ fontSize: 12.5, whiteSpace: 'pre-wrap', margin: 0 }}>
{`quality: ≥85% → 5, ≥65 → 4, ≥50 → 3, else 2
reps 1 → 1 day, reps 2 → 6 days
else interval = round(prev × EF), max 180
EF = max(1.3, EF + 0.1 − (5−q)(0.08 + (5−q)0.02))
EF starts at 2.5`}
        </pre>
      ),
    },
    {
      title: 'Struggle, and it comes back sooner',
      caption: 'A failed review resets the interval to one day; a "due today" badge shows what to revise.',
      say: "If you struggle in a review, it comes back tomorrow. You see a due today badge, and the review quiz is free, four questions, graded by code. A quiz can reschedule a topic only once, so it cannot be gamed.",
      body: <p className="r-p">Quality below 3 → repetitions reset, interval = <b>1 day</b>. Review quizzes: <b>4 MCQs</b> with verified keys, free, rate-limited, and <b>idempotent</b>. An unconfirmed key skips the question.</p>,
    },
  ],
};
