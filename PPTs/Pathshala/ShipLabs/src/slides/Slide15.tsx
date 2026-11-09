import { CalendarCheck, ShieldCheck } from 'lucide-react';
import { Board, Card, Chip, Ring, Txt, count, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const RX = 420;
const RY = 330;
const PATH = ['Equations of motion', 'Projectile motion', 'Relative velocity'];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.k-ring, .rules, .path', 0, 0.12);
    // "+N" flies from the answer card into the ring
    const fly = (sel: string, at: number) => {
      tl.fromTo(q(sel), { autoAlpha: 0, x: 0, y: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at);
      tl.to(q(sel), { x: -360, y: 40, autoAlpha: 0, duration: 0.7, ease: 'power2.in' }, at + 0.35);
    };
    const fill = (from: number, to: number, at: number) => {
      // chained fills: only the first may paint its start state at build time
      tl.fromTo(q('.k-ring-arc'), { strokeDashoffset: 100 - from }, { strokeDashoffset: 100 - to, duration: 0.7, immediateRender: from === 0 }, at);
      count(tl, q, '.pts', from, to, at, '', from === 0);
    };
    pop(tl, q, '.ans-0', 0.5);
    fly('.plus-0', 0.9);
    fill(0, 20, 1.6);
    next((at) => {
      pop(tl, q, '.resend', at);
      tl.fromTo(q('.plus-r'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: -200, duration: 0.5, ease: 'power1.in' }, at + 0.3);
      spring(tl, q, '.shield', at + 0.7);
      tl.to(q('.plus-r'), { x: -60, y: -80, rotate: -30, autoAlpha: 0, duration: 0.6 }, at + 0.85);
    });
    next((at) => {
      tl.to(q('.resend, .shield'), { autoAlpha: 0.2 }, at);
      fly('.plus-1', at);
      fill(20, 40, at + 0.7);
      fly('.plus-2', at + 1.1);
      fill(40, 60, at + 1.8);
      fly('.plus-3', at + 2.2);
      fill(60, 70, at + 2.9);
      tl.to(q('.k-ring'), { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1 }, at + 3.5);
      spring(tl, q, '.mastered', at + 3.6);
      tl.to(q('.pi-0 .k-dot'), { backgroundColor: '#4cc77a' }, at + 3.7);
      tl.to(q('.pi-1'), { color: '#ece9e2', borderColor: '#e3b341' }, at + 3.8);
      tl.fromTo(q('.card-fly'), { autoAlpha: 0, x: -480, y: 60 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.8 }, at + 3.9);
    });
  });

  return (
    <Board root={root} step={step}>
      <Ring x={RX} y={RY} r={150} ticks={[40, 65]} tone="gold">
        <div>
          <div className="pts" style={{ font: '400 86px/1 var(--font-display)' }}>0</div>
          <div className="k-muted">points / 100</div>
        </div>
      </Ring>
      <Txt x={RX - 280} y={RY + 90} className="k-muted" style={{ fontSize: 13 }}>65 · mastered</Txt>
      <Txt x={RX + 150} y={RY + 120} className="k-muted" style={{ fontSize: 13 }}>40 · practicing</Txt>
      <span className="mastered k-chip" data-tone="green" style={{ left: RX - 70, top: RY + 190, height: 38, fontSize: 16 }}>✓ Mastered</span>

      <div className="ans-0 k-card" data-tone="green" style={{ left: 760, top: 300, width: 220 }}>Correct answer</div>
      {['+20', '+20', '+20', '+10'].map((p, i) => (
        <span key={i} className={`plus-${i === 0 ? 0 : i} k-chip`} data-tone={p === '+10' ? 'amber' : 'green'} style={{ left: 800, top: 260, fontSize: 18, height: 38 }}>{p}{p === '+10' ? ' partial' : ''}</span>
      ))}
      <div className="resend k-card" data-tone="amber" style={{ left: 760, top: 420, width: 220 }}>Resend the same answer</div>
      <span className="plus-r k-chip" data-tone="green" style={{ left: 800, top: 380, fontSize: 18, height: 38 }}>+20</span>
      <span className="shield k-chip" data-tone="amber" style={{ left: 600, top: 370, height: 40 }}><ShieldCheck size={18} /> already awarded</span>

      <Card x={1010} y={60} w={240} title="Pathway" className="path">
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {PATH.map((p, i) => (
            <div key={p} className={`pi-${i} k-row`} style={{ fontSize: 14, color: i === 0 ? 'var(--text)' : 'var(--muted)', border: '1px solid transparent', borderRadius: 8, padding: '4px 6px' }}>
              <span className="k-dot" data-tone={i === 0 ? 'gold' : 'muted'} /> {p}
            </div>
          ))}
        </div>
      </Card>
      <div className="card-fly k-card" data-tone="sky" style={{ left: 1010, top: 300, width: 240 }}>
        <div className="k-row"><CalendarCheck size={18} color="var(--sky)" /> Review tomorrow</div>
      </div>

      <div className="rules" style={{ left: 40, top: 610, display: 'flex', gap: 10 }}>
        <Chip tone="green">correct = 20</Chip>
        <Chip tone="amber">partial = 10</Chip>
        <Chip>wrong = 0</Chip>
        <Chip tone="gold">set by code, not the AI</Chip>
      </div>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Code sets the points',
      caption: 'A correct answer earns 20 points, set by code; the ring fills to 20.',
      say: "Grading is done by code first. If you pick an option, code checks it by its index, and the AI only explains the result. Points are also set by code: 20 for correct, 10 for partial, zero otherwise.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>MCQ picked</b> → <code>gradeMcqInCode</code> grades by index. The model is told the verdict and only explains it.</li>
          <li className="r-li"><b>Free text</b> → the model fills a strict JSON schema and must fact-check itself before marking wrong.</li>
          <li className="r-li">A non-answer can <b>never</b> be graded, whatever the model returns.</li>
        </ul>
      ),
    },
    {
      title: 'No double counting',
      caption: 'Resending the same answer earns nothing: each question key is awarded once.',
      say: "What if you resend the same answer, or reload the page? Nothing happens. Each question has a fingerprint, and points are given only once per question. You cannot farm points.",
      body: (
        <pre className="r-note mono" style={{ fontSize: 12.5, whiteSpace: 'pre-wrap', margin: 0 }}>
{`qKey = sha1(question stem)
if award > 0 and qKey not in awardedKeys:
    points += award; awardedKeys += qKey
points = clamp(points, 0, 100)`}
        </pre>
      ),
    },
    {
      title: '65 means mastered',
      caption: 'At 65 points the sub-topic is mastered; code moves the pathway forward and books a review.',
      say: "Two more correct answers and one partial take you to 70. That crosses 65, so the topic is mastered. The pathway moves to the next topic, and a review is booked for tomorrow. And if the AI claims we moved on when we didn't, the server corrects that text.",
      body: (
        <>
          <p className="r-p"><b>≥ 65</b> mastered → review scheduled → <code>subTopicIndex++</code>. <b>≥ 40</b> practicing. Below that, learning.</p>
          <p className="r-note">The model cannot move the pathway. If its text <i>claims</i> "let's move on" but the pointer didn't move, the server rewrites it with the true position.</p>
        </>
      ),
    },
  ],
};
