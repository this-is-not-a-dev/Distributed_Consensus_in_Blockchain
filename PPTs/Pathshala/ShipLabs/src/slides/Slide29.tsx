import { Board, Chip, Win, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const LOG = [
  ['sky', 'VS Code connected · tracking started', ''],
  ['muted', 'Edited handlers/task.go', '3 changes'],
  ['muted', 'Saved handlers/task.go', ''],
  ['sky', 'Created folder internal/store', ''],
  ['amber', 'Review: needs work (2/3) · task.go', 'Next: return 400'],
  ['green', 'ShipLabs ran go run .', 'exit 0'],
  ['green', 'Review: passed (3/3) · after running the code', ''],
] as const;
const TILES = [
  ['1 h 42 m', 'time on lab'],
  ['6 / 8', 'reviews passed'],
  ['14', 'VS Code reviews'],
  ['9 · 1 failed', 'runs'],
];
const SESS = [
  ['1', '10:02', '38 m', '31 m', '142', '4'],
  ['2', '14:15', '51 m', '44 m', '210', '7'],
  ['3', '19:30', '13 m', '11 m', '57', '3'],
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.live', 0);
    q('.lg').forEach((el, i) => pop(tl, q, [el], 0.4 + i * 0.28, 0, 12));
    spring(tl, q, '.poll', 2.4, 0.12);
    next((at) => {
      q('.lg').forEach((el, i) => tl.to(el, { x: 640, autoAlpha: 0, scale: 0.7, duration: 0.5, ease: 'power2.in' }, at + i * 0.08));
      pop(tl, q, '.rep', at + 0.4);
      pop(tl, q, '.tile', at + 0.8, 0.1);
      pop(tl, q, '.srow', at + 1.2, 0.12, 8);
      tl.fromTo(q('.prog i'), { scaleX: 0 }, { scaleX: 0.75, duration: 0.8 }, at + 0.8);
      pop(tl, q, '.hist', at + 1.6, 0.1, 8);
      tl.to(q('.live'), { opacity: 0.35 }, at + 0.6);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={40} w={560} h={440} title="Lab page · Live activity" className="live">
        <div style={{ display: 'grid', gap: 8 }}>
          {LOG.map(([tone, a, b]) => (
            <div key={a} className="lg k-row" style={{ padding: '7px 10px', borderRadius: 8, background: '#18181d', fontSize: 14 }}>
              <span className="k-dot" data-tone={tone} />
              <span style={{ flex: 1 }}>{a}</span>
              <span className="k-muted" style={{ fontSize: 12 }}>{b}</span>
            </div>
          ))}
        </div>
      </Win>
      <div style={{ left: 40, top: 510, width: 560, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Chip tone="sky" className="poll mono">GET /activity?since=… · every 5 s</Chip>
        <Chip tone="gold" className="poll">labKey changed → refetch the session</Chip>
        <Chip className="poll">≤ 200 rows per poll · 300 on screen</Chip>
      </div>

      <Win x={640} y={40} w={600} h={640} title="/dashboard/labs · REST API in Go" className="rep">
        <div className="k-row" style={{ justifyContent: 'space-between' }}>
          <b style={{ fontSize: 17 }}>REST API in Go</b>
          <Chip tone="gold">in progress</Chip>
        </div>
        <div className="k-bar prog" data-tone="gold" style={{ marginTop: 10 }}><i /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
          {TILES.map(([v, l]) => (
            <div key={l} className="tile" style={{ padding: '10px 12px', borderRadius: 10, background: '#18181d', border: '1px solid var(--line)' }}>
              <div style={{ font: '400 24px var(--font-display)', color: 'var(--gold)' }}>{v}</div>
              <div className="k-muted" style={{ fontSize: 12 }}>{l}</div>
            </div>
          ))}
        </div>
        <div className="k-cap" style={{ marginTop: 18, fontSize: 11 }}>VS Code sessions</div>
        <div className="mono" style={{ fontSize: 13, marginTop: 6 }}>
          <div className="k-muted" style={{ display: 'grid', gridTemplateColumns: '30px 70px 70px 70px 70px 1fr', padding: '4px 0' }}>
            <span>#</span><span>start</span><span>length</span><span>active</span><span>edits</span><span>reviews</span>
          </div>
          {SESS.map((r) => (
            <div key={r[0]} className="srow" style={{ display: 'grid', gridTemplateColumns: '30px 70px 70px 70px 70px 1fr', padding: '6px 0', borderTop: '1px solid var(--line)' }}>
              {r.map((c, i) => <span key={i}>{c}</span>)}
            </div>
          ))}
        </div>
        <div className="k-cap" style={{ marginTop: 16, fontSize: 11 }}>Lab history · newest first</div>
        <div style={{ display: 'grid', gap: 6, marginTop: 8, fontSize: 13 }}>
          {['Review: passed (3/3) · task.go', 'ShipLabs ran go run . · exit 0', 'Edited task.go ×14 (merged)'].map((h) => (
            <div key={h} className="hist k-muted">{h}</div>
          ))}
        </div>
      </Win>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'The lab, live on the web',
      caption: 'One 5-second poll returns the connection state, a labKey fingerprint and new events, rendered as plain sentences.',
      say: "Everything you do in VS Code shows up live on the web lab page. One small request every five seconds brings new events, written as plain sentences. It also brings a fingerprint of the lab. Only when that fingerprint changes does the page reload the full lab. So it feels live, without heavy traffic.",
      body: <p className="r-p">One poll drives everything: <code>extension</code> (connection state), <code>labKey</code> (fingerprint of step, statuses and message count) and <code>events</code>. <code>describeEvent()</code> turns rows into sentences with coloured dots.</p>,
    },
    {
      title: 'Everything on one page',
      caption: 'The lab report shows totals, VS Code sessions split on 2-minute gaps, per-step stats and the full history.',
      say: "And it all becomes a lab report. Total time, reviews passed, runs. Every VS Code session, split whenever there is a gap of two minutes. Stats for each step. And the full history, with repeated edits merged into one line. A teacher, or you, can read exactly how the work was done.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Sessions</b>: split on a start event or a 2-minute gap.</li>
          <li className="r-li"><b>Per step</b>: reviews, which attempt passed, active time, edits, runs.</li>
          <li className="r-li"><b>History</b>: edits within 2 min merged, last 2,000 rows, 100 at a time.</li>
        </ul>
      ),
    },
  ],
};
