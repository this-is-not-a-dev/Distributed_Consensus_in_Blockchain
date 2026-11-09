import { Fragment } from 'react';
import { Board, Chip, Txt, Wire, Wires, draw, pop, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const ROWS = [
  ['Confidently wrong answers', 'Every risky fact, quiz key and link is checked before you see it', '§ Verification'],
  ['No feedback', 'Answers are graded, in code wherever possible, not by the model', '§ Grading'],
  ['Forgetting', 'Mastered sub-topics are scheduled for review with SM-2', '§ Reviews'],
  ['Passive coding', 'Hands-on labs with rubrics, plus a live instructor inside VS Code', '§ Coach + ShipLabs'],
  ['One size fits all', 'A learner profile drives the syllabus and the tone, School to PhD', '§ Onboarding'],
  ['Cheating the economy', 'Points and credits are idempotent and capped; the AI can never award them', '§ Economy'],
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.head', 0);
    const row = (i: number, at: number) => {
      pop(tl, q, `.pain-${i}`, at);
      draw(tl, q, `.ar-${i}`, at + 0.2);
      pop(tl, q, `.req-${i}`, at + 0.35);
    };
    [0, 1, 2].forEach((i) => row(i, 0.2 + i * 0.3));
    next((at) => [3, 4, 5].forEach((i) => row(i, at + (i - 3) * 0.3)));
  });

  return (
    <Board root={root} step={step}>
      <Txt x={40} y={40} className="head k-cap">Pain</Txt>
      <Txt x={460} y={40} className="head k-cap">What the system must guarantee</Txt>
      {ROWS.map(([pain, req, ref], i) => {
        const y = 80 + i * 103;
        return (
          <Fragment key={pain}>
            <div className={`pain-${i} k-card`} data-tone="red" style={{ position: 'absolute', left: 40, top: y, width: 340, height: 82, display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 600 }}>
              {pain}
            </div>
            <div className={`req-${i} k-card`} data-tone="green" style={{ position: 'absolute', left: 460, top: y, width: 780, height: 82, display: 'flex', alignItems: 'center', gap: 16, fontSize: 18 }}>
              <span style={{ flex: 1 }}>{req}</span>
              <Chip tone="green" className="mono">{ref}</Chip>
            </div>
          </Fragment>
        );
      })}
      <Wires>
        {ROWS.map((_, i) => (
          <Wire key={i} d={`M 386 ${121 + i * 103} L 452 ${121 + i * 103}`} tone="gold" className={`ar-${i}`} />
        ))}
      </Wires>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Trust and feedback',
      caption: 'Wrong answers, no feedback and forgetting become three hard requirements: verify, grade in code, schedule reviews.',
      say: "Each pain becomes a hard rule for the system. Wrong answers means every risky fact, quiz key and link must be checked first. No feedback means answers are graded, and graded by code wherever possible. Forgetting means every mastered topic gets a review date.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Verify</b> facts, answer keys and links before showing them.</li>
          <li className="r-li"><b>Grade in code</b>, not by the model, wherever possible.</li>
          <li className="r-li"><b>Schedule reviews</b> with the SM-2 algorithm.</li>
        </ul>
      ),
    },
    {
      title: 'Practice, fit and fairness',
      caption: 'Passive coding, one-size-fits-all and gaming the points become labs with a live instructor, a learner profile, and idempotent capped rewards.',
      say: "Passive coding means real labs, with a live instructor inside your own editor. One size fits all means a learner profile that shapes the syllabus and the tone. And one rule people forget: nobody should be able to farm points. So points are awarded once, capped, and the AI can never hand them out by itself.",
      body: (
        <>
          <ul className="r-list">
            <li className="r-li"><b>Labs + ShipLabs</b>: rubric checks and a reviewer in VS Code.</li>
            <li className="r-li"><b>Learner profile</b>: level, goal, exam, class and topic.</li>
            <li className="r-li"><b>Fair economy</b>: idempotent, capped, never AI-awarded.</li>
          </ul>
          <p className="r-note">Six pains, six guarantees. Every later slide maps back to one of these rows.</p>
        </>
      ),
    },
  ],
};
