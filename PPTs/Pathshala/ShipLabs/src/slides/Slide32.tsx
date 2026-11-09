import { Board, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const NUMS = [
  ['1', 'credit per message, lab, edit, coach question or review'],
  ['65', 'points out of 100 to master a sub-topic'],
  ['20 / 10', 'points for a correct / partial answer'],
  ['3 · 3', 'claims and sources verified per turn'],
  ['24 h', 'verification cache, 500 entries'],
  ['1 → 180', 'days: SM-2 review interval range'],
  ['5 s', 'idle before ShipLabs reviews your code'],
  ['45 s · 10', 'review cooldown · reviews per hour per step'],
  ['40 × 240', 'comments per review × characters each'],
  ['20 s', 'auto-run hard timeout, 4 KB output tail'],
  ['5 min', 'pairing code lifetime, single use'],
  ['10 s', 'SSE heartbeat keeps the stream alive'],
];

// Full-screen overlay slide: the stage stays empty so nothing shows through the cards.
function Scene({ step }: { step: number }) {
  const root = useScene(step, () => {});
  return <Board root={root} step={step}>{null}</Board>;
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'By the numbers',
      caption: 'Key numbers: 1 credit per action, 65 to master, 3 claims checked per turn, 5 seconds idle before review, 20-second auto-run limit.',
      say: "Here are the key numbers on one screen. One credit per action. 65 points to master. Three claims and three sources checked per turn. Five seconds of idle before ShipLabs reviews your code. A 45 second cooldown. And a 20 second limit when it runs your code. Every one of these is a real default in the code, and most can be tuned without a redeploy.",
      overlay: true,
      body: (
        <div className="board-overlay">
          <h2>
            By the <em>numbers</em>
          </h2>
          <div className="num-grid">
            {NUMS.map(([n, l]) => (
              <div key={l} className="num-card">
                <b>{n}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ],
};
