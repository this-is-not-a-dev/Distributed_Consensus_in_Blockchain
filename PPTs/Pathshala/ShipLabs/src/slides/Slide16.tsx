import { BadgeCheck, EyeOff, RefreshCw } from 'lucide-react';
import { Board, Card, Orb, Txt, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const OPTS = ['a) 10 m', 'b) 25 m', 'c) 50 m', 'd) 20 m'];

function Mcq({ x, y, keyAt, cls }: { x: number; y: number; keyAt: number; cls: string }) {
  return (
    <Card x={x} y={y} w={440} tone="gold" title="Question-Master · MCQ" className={cls}>
      <p style={{ margin: '12px 0', fontSize: 16, lineHeight: 1.5 }}>A car starts from rest at 2 m/s² for 5 s. How far does it go?</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, position: 'relative' }}>
        {OPTS.map((o) => <span key={o} className="k-chip" style={{ height: 36 }}>{o}</span>)}
        <span className="keymark" style={{ position: 'absolute', left: keyAt % 2 ? 216 : 0, top: keyAt > 1 ? 44 : 0, width: 120, height: 36, borderRadius: 999, border: '2px solid var(--gold)', pointerEvents: 'none' }} />
      </div>
      <div className="k-muted" style={{ marginTop: 10, fontSize: 13 }}>answer key: <span className="mono keytxt" style={{ color: 'var(--gold)' }}>{OPTS[keyAt]}</span>
        {keyAt === 2 && <span className="mono keyfix" style={{ color: 'var(--green)' }}> → {OPTS[1]}</span>}
      </div>
    </Card>
  );
}

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.mcq-a', 0);
    spring(tl, q, '.k-orb', 0.5);
    draw(tl, q, '.w-blind', 0.7);
    pop(tl, q, '.solve', 1.1);
    spring(tl, q, '.seal', 1.8);
    next((at) => {
      tl.to(q('.mcq-a, .solve, .seal, .w-blind, .k-orb'), { opacity: 0.25 }, at);
      pop(tl, q, '.mcq-b', at + 0.2);
      pop(tl, q, '.conflict', at + 0.7);
      tl.to(q('.mcq-b .keymark'), { x: 216, y: -44, duration: 0.6, ease: 'back.out(1.6)' }, at + 1.3);
      spring(tl, q, '.fixed', at + 1.6);
      tl.to(q('.mcq-b .keytxt'), { textDecoration: 'line-through', opacity: 0.5, duration: 0.2 }, at + 1.6);
      pop(tl, q, '.keyfix', at + 1.7, 0, 0);
      pop(tl, q, '.regen', at + 2, 0.15);
    });
  });

  return (
    <Board root={root} step={step}>
      <Mcq x={40} y={40} keyAt={1} cls="mcq-a" />
      <Orb x={640} y={170} r={40} tone="sky" label="Independent solver" />
      <Wires>
        <Wire d="M 482 170 L 594 170" tone="sky" className="w-blind" dashed />
      </Wires>
      <Card x={720} y={100} w={300} tone="sky" icon={EyeOff} title="Solved blind" className="solve">
        <div className="mono" style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7, color: '#d6d3cc' }}>s = ½·a·t² = ½·2·25<br />s = 25 m → b</div>
      </Card>
      <span className="seal k-stamp" data-tone="green" style={{ left: 1050, top: 140 }}><BadgeCheck size={20} style={{ verticalAlign: -4 }} /> MATCH</span>

      <Mcq x={40} y={370} keyAt={2} cls="mcq-b" />
      <Card x={520} y={380} w={300} tone="red" title="Conflict" sub="Key says c) 50 m, solver says b) 25 m" className="conflict" />
      <span className="fixed k-chip" data-tone="green" style={{ left: 520, top: 520, height: 36 }}>key corrected → b) 25 m</span>
      <Card x={860} y={380} w={380} tone="amber" icon={RefreshCw} title="Not confirmed?" className="regen">
        <div className="k-card-sub">Regenerate once. Still unsure → ask a <b style={{ color: 'var(--text)' }}>short-answer</b> question instead.</div>
      </Card>
      <Txt x={860} y={560} w={380} className="regen k-muted" style={{ fontSize: 14 }}>
        Never grade against a key we could not confirm.
      </Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Every key is re-solved blind',
      caption: 'A second, independent solver works out the MCQ without seeing the key; matching answers get a verified seal.',
      say: "A quiz is only fair if its answer key is right. So for maths and science, a second solver works the question out without seeing the key. If both agree, the question gets a green seal and is shown.",
      body: <p className="r-p">The <b>Question-Master</b> must solve its own question before setting the key. Then <code>verifyMcqAnswerKey</code> re-derives it independently, without the key.</p>,
    },
    {
      title: 'Wrong keys get fixed',
      caption: 'On a conflict the key is corrected; if it cannot be confirmed the question is regenerated or becomes a short-answer question.',
      say: "If they disagree, the key is corrected. If we still can't confirm it, we regenerate the question once. And if we are still unsure, we ask a short-answer question instead. We never grade you against a key we could not confirm.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Bad MCQ shape</td><td>needs ≥ 2 options and a valid key, else short question</td></tr>
            <tr><td>"Which of the following…"</td><td>reworded when there are no options</td></tr>
            <tr><td>Answer revealed</td><td>never asked again</td></tr>
            <tr><td>After advancing</td><td>no old sub-topic questions</td></tr>
          </tbody>
        </table>
      ),
    },
  ],
};
