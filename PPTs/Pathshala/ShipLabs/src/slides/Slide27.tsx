import { MessageSquareText, ShieldCheck } from 'lucide-react';
import { Board, Card, Chip, Code, Win, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const LINES = [
  { t: '# ShipLabs: total(xs) must sum a list. Loop OK; empty list missing.', c: 'sl cmt cmt-a' },
  { t: 'def total(xs):' },
  { t: '    s = 0' },
  { t: '    # ShipLabs: Loop visits every item, good. What if xs is empty?', c: 'sl cmt cmt-b' },
  { t: '    for x in xs:' },
  { t: '        s += x' },
  { t: '    return s' },
  { t: '' },
  { t: '# ShipLabs: average() divides by len(xs). What happens at 0?', c: 'sl cmt cmt-c' },
  { t: 'def average(xs):' },
  { t: '    return total(xs) / len(xs)' },
];
const PROTOCOL = [
  'Wait until the learner is idle 5 s (up to 2 min)',
  'File changed since the review? Drop it: stale',
  "Delete old 'ShipLabs:' lines only",
  'Insert new lines above their targets, same indent',
  'Do NOT save: Cmd/Ctrl+Z undoes it all',
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.ed', 0);
    q('.cmt').forEach((el, i) => tl.fromTo(el, { height: 0, autoAlpha: 0 }, { height: 26.25, autoAlpha: 1, backgroundColor: 'rgba(227,179,65,0.12)', duration: 0.5 }, 0.8 + i * 0.5));
    spring(tl, q, '.glass', 2.4);
    pop(tl, q, '.toast-a', 2.6);
    next((at) => {
      pop(tl, q, '.proto', at);
      pop(tl, q, '.pi', at + 0.2, 0.15, 8);
      tl.to(q('.cmt-c'), { height: 0, autoAlpha: 0, duration: 0.4 }, at + 1.2);
      tl.to(q('.cmt-b'), { backgroundColor: 'rgba(76,182,232,0.14)', duration: 0.3 }, at + 1.4);
      tl.to(q('.toast-a'), { autoAlpha: 0, duration: 0.2 }, at + 1.4);
      pop(tl, q, '.toast-b', at + 1.6);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={40} w={760} h={420} kind="vscode" title="app.py · ShipLabs" className="ed">
        <Code lines={LINES} />
      </Win>
      <span className="glass k-chip" data-tone="green" style={{ left: 560, top: 400 }}><ShieldCheck size={14} /> your code: untouched</span>

      <div className="toast-a k-toast" style={{ left: 40, top: 490, width: 760 }}>
        <MessageSquareText size={16} style={{ verticalAlign: -3, color: 'var(--gold)' }} /> ShipLabs added <b>3 comments</b> to app.py, at lines 1, 4, 9 ·{' '}
        <span style={{ color: 'var(--sky)' }}>Go to first</span> · <span style={{ color: 'var(--sky)' }}>List all</span>
      </div>
      <div className="toast-b k-toast" style={{ left: 40, top: 490, width: 760 }}>
        <MessageSquareText size={16} style={{ verticalAlign: -3, color: 'var(--sky)' }} /> ShipLabs updated its comments in app.py: <b>2 now</b> (was 3)
      </div>
      <div style={{ left: 40, top: 570, display: 'flex', gap: 8, flexWrap: 'wrap', width: 760 }}>
        {['≤ 40 comments', '≤ 240 chars each', 'hints, never replacement code', '// # -- <!-- --> /* */'].map((t) => (
          <Chip key={t} tone="gold" className="glass">{t}</Chip>
        ))}
      </div>

      <Card x={840} y={40} w={400} h={520} tone="sky" title="Write protocol" className="proto">
        <ol style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'grid', gap: 14 }}>
          {PROTOCOL.map((p, i) => (
            <li key={p} className="pi k-row" style={{ alignItems: 'flex-start', fontSize: 15, lineHeight: 1.4 }}>
              <span className="mono" style={{ color: 'var(--sky)', fontSize: 13, paddingTop: 2 }}>{i + 1}</span> {p}
            </li>
          ))}
        </ol>
        <div className="pi k-muted" style={{ position: 'absolute', left: 16, right: 16, bottom: 16, fontSize: 13 }}>
          ShipLabs' own edits are muted in the tracker: they never count as activity or re-trigger a review.
        </div>
      </Card>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Hints above your lines',
      caption: 'The review comes back as short ShipLabs comment lines written above the code they refer to, top to bottom; the learner’s code is never changed.',
      say: "This is the most important rule of ShipLabs. It comments, it never codes. After a review, it writes short hint lines into your file, in the file's own comment style, top to bottom. A header on line one, then notes above each function, loop and condition. Your own lines are never touched.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Line 1</b>: what this file must do for the step, and where it stands.</li>
          <li className="r-li">Then each function, loop and condition: what it does and what's missing.</li>
          <li className="r-li"><b>Hints, never replacement code.</b> Trivial lines are skipped.</li>
        </ul>
      ),
    },
    {
      title: 'A careful write',
      caption: 'Comments are written only when the learner is idle and the file has not changed, are never saved, and are replaced on the next review.',
      say: "Writing into someone's file needs care. ShipLabs waits until you are idle. If the file changed since the review, it drops the comments. It removes only its own old lines, adds the new ones, and does not save the file, so one undo removes them all. On the next review, the old hints are replaced.",
      body: <p className="r-p">The only thing ShipLabs ever writes is its own <code>ShipLabs:</code> lines. It never saves, because format-on-save could touch the learner's code. Learners must write their own code, or the lab loses its purpose.</p>,
    },
  ],
};
