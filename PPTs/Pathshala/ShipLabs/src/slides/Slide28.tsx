import { Lock, PartyPopper, Play } from 'lucide-react';
import { Board, Card, Chip, Code, Ring, Win, count, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const OUT = ['$ python3 app.py', 'total([1, 2, 3]) = 6', 'total([]) = 0', 'average([4, 6]) = 5.0', 'exit 0'];
const LANGS = ['python3', 'node', 'npx tsx', 'go run', 'ruby', 'php', 'bash', 'java'];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.ed', 0);
    spring(tl, q, '.flag', 0.5);
    pop(tl, q, '.modal', 1);
    tl.to(q('.allow'), { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1 }, 1.8);
    next((at) => {
      tl.to(q('.modal'), { autoAlpha: 0, duration: 0.2 }, at);
      tl.to(q('.ed .k-win-content'), { opacity: 0.35, filter: 'grayscale(1)' }, at + 0.1);
      spring(tl, q, '.pad', at + 0.3);
      pop(tl, q, '.banner', at + 0.4);
      pop(tl, q, '.term', at + 0.6);
      q('.o').forEach((el, i) => pop(tl, q, [el], at + 1 + i * 0.3, 0, 4));
      tl.fromTo(q('.timer .k-ring-arc'), { strokeDashoffset: 0 }, { strokeDashoffset: 75, duration: 2, ease: 'none' }, at + 0.6);
      count(tl, q, '.secs', 20, 15, at + 0.6, ' s');
    });
    next((at) => {
      tl.to(q('.pad, .banner'), { autoAlpha: 0, scale: 1.3, duration: 0.3 }, at);
      tl.to(q('.ed .k-win-content'), { opacity: 1, filter: 'grayscale(0)' }, at + 0.2);
      pop(tl, q, '.rev', at + 0.4);
      pop(tl, q, '.ri', at + 0.7, 0.2, 6);
      spring(tl, q, '.pass', at + 1.5);
      q('.conf').forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, x: 0, y: 0, rotate: 0 }, { autoAlpha: 1, x: Math.cos(i * 0.8) * 140, y: -60 - Math.sin(i * 1.3) * 80, rotate: i * 60, duration: 0.8, ease: 'power2.out' }, at + 1.5));
      tl.to(q('.conf'), { autoAlpha: 0, y: '+=60', duration: 0.6 }, at + 2.3);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={40} w={620} h={360} kind="vscode" title="app.py" className="ed">
        <Code lines={['def total(xs):', '    return sum(xs)', '', 'def average(xs):', '    return total(xs) / len(xs) if xs else 0', '', "print('total([1, 2, 3]) =', total([1, 2, 3]))"]} />
      </Win>
      <span className="flag k-chip" data-tone="green" style={{ left: 470, top: 50 }}><Play size={14} /> readyToRun</span>
      <div className="modal k-toast" style={{ left: 150, top: 150, width: 400, padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 17 }}>Allow ShipLabs to run your code?</div>
        <div className="k-muted" style={{ fontSize: 13.5, marginTop: 6 }}>Asked once. It runs the saved file to check it, like a lab instructor.</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <span className="allow k-chip" data-tone="gold">Allow</span>
          <span className="k-chip">Never</span>
        </div>
      </div>
      <div className="pad" style={{ left: 310, top: 160, width: 70, height: 70, borderRadius: 18, display: 'grid', placeItems: 'center', background: 'rgba(11,11,13,0.85)', border: '2px solid var(--gold)', color: 'var(--gold)' }}>
        <Lock size={32} />
      </div>
      <div className="banner k-toast" style={{ left: 40, top: 420, width: 620, display: 'flex', alignItems: 'center', gap: 14 }}>
        <span className="timer" style={{ position: 'relative', width: 56, height: 56 }}>
          <Ring x={28} y={28} r={20} tone="gold"><span className="secs mono" style={{ fontSize: 11 }}>20 s</span></Ring>
        </span>
        <span style={{ flex: 1, fontSize: 14.5 }}>ShipLabs is running <b className="mono">python3 app.py</b> to check your code. Editing is paused.</span>
        <span className="k-chip">Cancel</span>
      </div>

      <Win x={700} y={40} w={540} h={250} kind="terminal" title="ShipLabs · output" className="term">
        <div className="mono" style={{ fontSize: 14, lineHeight: 1.8 }}>
          {OUT.map((o, i) => (
            <div key={o} className="o" style={{ color: i === 0 ? 'var(--muted)' : i === OUT.length - 1 ? 'var(--green)' : '#d6d3cc' }}>{o}</div>
          ))}
        </div>
      </Win>
      <Card x={700} y={320} w={540} h={250} tone="green" title="Review · with the real output" className="rev">
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {['total(xs) sums a list', 'empty list returns 0', 'average handles []'].map((r) => (
            <div key={r} className="ri k-row"><b style={{ color: 'var(--green)' }}>✓</b> {r}</div>
          ))}
        </div>
        <span className="pass k-stamp" data-tone="green" style={{ position: 'absolute', right: 20, bottom: 20, fontSize: 16 }}>
          <PartyPopper size={16} style={{ verticalAlign: -2 }} /> PASSED · next: Persist tasks
        </span>
      </Card>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} className="conf" style={{ left: 980, top: 520, width: 8, height: 14, borderRadius: 2, background: ['#e3b341', '#4cc77a', '#4cb6e8', '#a38bff'][i % 4] }} />
      ))}
      <div style={{ left: 40, top: 610, display: 'flex', gap: 8, flexWrap: 'wrap', width: 1200, alignItems: 'center' }}>
        <span className="k-muted" style={{ fontSize: 13, marginRight: 4 }}>Command picked locally by language:</span>
        {LANGS.map((l) => <Chip key={l} tone="violet" className="mono">{l}</Chip>)}
      </div>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Ready to run',
      caption: 'When a review says the code is complete enough to prove itself, ShipLabs asks once for permission to run it.',
      say: "Sometimes reading code is not enough, you need to run it. When the review says your code is ready to run, ShipLabs asks you once: may I run your code? You can say allow, or never.",
      body: <p className="r-p">Triggered when the judge returns <code>readyToRun: true</code>, the step hasn't passed, and there is no output for this exact code yet. The file must be saved and match what was reviewed.</p>,
    },
    {
      title: 'Hands off for a moment',
      caption: 'The editor is set read-only, the extension runs the file with a 20-second hard limit, and the output is captured.',
      say: "Then, like a lab instructor, it says: hands off for a moment. Editing is paused, a banner shows the exact command, and you can cancel. The code runs with a hard 20 second limit. The output is captured.",
      body: <p className="r-p">The command is chosen <b>by the extension</b> from the file's language, never by the server. No stdin, cwd = the file's folder, 20 s hard timeout → kill. Each version runs at most once. Unknown languages never run.</p>,
    },
    {
      title: 'Reviewed with the real result',
      caption: 'Editing is restored and the output goes straight into a new review; with all checks met the step passes.',
      say: "Editing comes back, and the real output goes straight into a new review. Here everything passes, so the step is done and the next one opens. Because the server never chooses the command, a bad response can never make your computer run something harmful.",
      body: <p className="r-p">The run is logged as a <code>run</code> event with <code>auto: true</code> and output tail (≤ 4 KB), then an immediate auto-check runs <b>with</b> the output. Setting: <code>shiplabs.autoRun</code> (default on).</p>,
    },
  ],
};
