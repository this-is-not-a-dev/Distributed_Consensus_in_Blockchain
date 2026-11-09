import { Board, Orb, useScene, spring } from '../scene/kit';
import type { SlideDef } from './registry';

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, _next, q) => spring(tl, q, '.k-orb', 0));
  return (
    <Board root={root} step={step}>
      <Orb x={640} y={360} r={120} />
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Thank you',
      caption: 'Thank you! Any questions?',
      say: "That's ShipLabs. A tutor that teaches, checks and coaches, in your browser and in your code editor. The AI writes, the code decides. Thank you. I'm happy to take any questions.",
      overlay: true,
      body: (
        <div className="thank-you-card">
          <p className="thank-you">Thank you!</p>
          <p className="thank-you-q">Any questions?</p>
          <p className="thank-you-tag">SHIPLABS · THE AI WRITES. THE CODE DECIDES.</p>
        </div>
      ),
    },
  ],
};
