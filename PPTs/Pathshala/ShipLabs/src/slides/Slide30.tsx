import { Timer } from 'lucide-react';
import { Board, Card, Chip, Orb, Packet, Txt, Wire, Wires, draw, pop, spring, travel, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

// Three takes of one request: MADHAVA answers; MADHAVA times out; both fail and the fallback answers.
function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.req, .o0, .o1, .o2, .rules', 0, 0.1);
    draw(tl, q, '.w', 0.4, 0.1);
    travel(tl, q, '.p0', '.r0', 0.9, 0.9, true);
    spring(tl, q, '.ok0', 1.8);
    next((at) => {
      tl.to(q('.ok0'), { autoAlpha: 0, duration: 0.2 }, at);
      travel(tl, q, '.p1', '.r1', at + 0.1, 1.8, true);
      spring(tl, q, '.to0', at + 0.6);
      tl.to(q('.o0'), { opacity: 0.25, duration: 0.3 }, at + 0.8);
      spring(tl, q, '.ok1', at + 1.9);
    });
    next((at) => {
      tl.to(q('.ok1, .to0'), { autoAlpha: 0, duration: 0.2 }, at);
      tl.to(q('.o1'), { opacity: 0.25 }, at + 1.1);
      spring(tl, q, '.to1', at + 1.1);
      travel(tl, q, '.p2', '.r2', at + 0.1, 2.4, true);
      spring(tl, q, '.ok2', at + 2.5);
      pop(tl, q, '.allfail', at + 3);
    });
  });

  return (
    <Board root={root} step={step}>
      <Card x={40} y={100} w={220} tone="sky" title="Any AI call" sub="chat · tutor · judge · labs" className="req" />
      <Orb x={560} y={130} r={44} className="o0" />
      <Orb x={560} y={340} r={38} tone="sky" className="o1" />
      <Orb x={560} y={550} r={38} tone="violet" className="o2" />
      {[
        [196, 'MADHAVA', 'in-house · 60 s', 'o0'],
        [396, 'Secondary LLM', 'strict JSON · 60 s', 'o1'],
        [606, 'Terminal fallback', 'always kept last · 120 s', 'o2'],
      ].map(([y, t, s2, c]) => (
        <Txt key={t} x={330} y={y as number} w={180} className={c as string} style={{ textAlign: 'right' }}>
          <b style={{ fontSize: 15 }}>{t}</b>
          <div className="k-muted" style={{ fontSize: 12 }}>{s2}</div>
        </Txt>
      ))}
      <div className="o2" style={{ left: 510, top: 500, width: 100, height: 100, borderRadius: '50%', border: '2px solid var(--violet)', opacity: 0.6 }} />

      <Wires>
        <Wire d="M 262 140 L 510 132" tone="gold" className="w" />
        <Wire d="M 560 180 L 560 296" tone="sky" className="w" dashed />
        <Wire d="M 560 384 L 560 506" tone="violet" className="w" dashed />
        <path className="r0" d="M 262 140 L 520 132" fill="none" stroke="none" />
        <path className="r1" d="M 262 140 L 520 132 L 560 200 L 560 300" fill="none" stroke="none" />
        <path className="r2" d="M 262 140 L 520 132 L 560 200 L 560 330 L 560 510" fill="none" stroke="none" />
        <Packet label="request" tone="gold" className="p0" />
        <Packet label="request" tone="gold" className="p1" />
        <Packet label="request" tone="gold" className="p2" />
      </Wires>

      <Chip x={630} y={110} tone="green" className="ok0">✓ answered</Chip>
      <Chip x={630} y={150} tone="red" className="to0"><Timer size={14} /> timeout</Chip>
      <Chip x={630} y={320} tone="green" className="ok1">✓ answered</Chip>
      <Chip x={630} y={360} tone="red" className="to1">✗ failed</Chip>
      <Chip x={630} y={530} tone="green" className="ok2">✓ answered</Chip>
      <Txt x={40} y={560} w={380} className="allfail">
        <span className="k-chip" data-tone="amber">All three fail? → credit refunded · “Please try again”</span>
      </Txt>

      <Card x={860} y={60} w={380} h={600} tone="gold" title="Resilience rules" className="rules">
        <ul style={{ margin: '14px 0 0', padding: '0 0 0 18px', display: 'grid', gap: 12, fontSize: 15, lineHeight: 1.45 }}>
          <li>Unconfigured providers are skipped automatically.</li>
          <li><b>Strict JSON is never streamed</b>: partial JSON would break parsing. Only teaching prose streams.</li>
          <li>Cut-off response? The retry goes straight to the output ceiling.</li>
          <li>Tolerant JSON parsing: strips fences, matches braces, forgives trailing commas.</li>
          <li>Titles and checks use lighter models with tight deadlines.</li>
          <li>Verification, images, sources and titles are <b>fail-soft</b>.</li>
          <li>Browser closes the stream → generation stops sending.</li>
        </ul>
      </Card>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'MADHAVA first',
      caption: 'Every AI call goes to the in-house MADHAVA model first.',
      say: "What if the AI is down? Every AI call first goes to our in-house model, MADHAVA. Usually it answers, and we're done.",
      body: <p className="r-p">Order is configurable with <code>PATHSHALA_PROVIDER_ORDER</code>. MADHAVA is used only when its URL and key are configured, with a 60 s timeout.</p>,
    },
    {
      title: 'Timeout? Next engine',
      caption: 'If MADHAVA fails or times out, the request moves to the secondary hosted model.',
      say: "If MADHAVA fails or takes more than 60 seconds, the same request moves to the second model, and that one answers. The learner doesn't even notice.",
      body: <p className="r-p">The secondary is an OpenAI-compatible hosted LLM with <b>strict JSON schema mode</b>, also with a 60 s timeout.</p>,
    },
    {
      title: 'The last line',
      caption: 'If both fail, the terminal fallback answers; if every engine fails the credit is refunded.',
      say: "If both fail, the last engine answers. It is always kept at the end of the chain, with its own key. And if everything fails, the learner gets the credit back and a friendly message to try again. Three engines, one answer.",
      body: <p className="r-p">The terminal fallback uses a <b>dedicated key</b>, not the platform's, with a fast-to-strong model queue and a 120 s timeout. All failed → credit refunded.</p>,
    },
  ],
};
