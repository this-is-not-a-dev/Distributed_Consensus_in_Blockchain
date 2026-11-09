import { FilePlus2, Mail, Pencil, Play, Save, Server } from 'lucide-react';
import { Board, Card, Chip, Code, Ring, Win, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const EVENTS = [
  { icon: Pencil, label: 'edit', tone: 'muted' },
  { icon: Save, label: 'save', tone: 'muted' },
  { icon: FilePlus2, label: 'file', tone: 'sky' },
  { icon: Play, label: 'run', tone: 'green' },
] as const;
const ROWS = [
  ['muted', 'Edited src/app.py', '3 changes · 120 chars'],
  ['muted', 'Saved src/app.py', ''],
  ['sky', 'Created folder src/utils', ''],
  ['green', 'ShipLabs ran python3 app.py', 'exit 0'],
] as const;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.vsc, .bag, .api, .web', 0, 0.12);
    q('.ev').forEach((el, i) => {
      tl.fromTo(el, { autoAlpha: 0, x: 0, y: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, 0.6 + i * 0.3);
      tl.to(el, { x: 560 - (80 + i * 100), y: 200 - 300, scale: 0.4, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0.9 + i * 0.3);
    });
    tl.fromTo(q('.k-ring-arc'), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 1.8, ease: 'none' }, 0.6);
    tl.to(q('.bagi'), { x: 210, scale: 0.7, duration: 0.5, ease: 'power2.in' }, 2.5);
    tl.to(q('.bagi'), { autoAlpha: 0, duration: 0.1 }, 3);
    tl.to(q('.api'), { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 }, 3);
    q('.row').forEach((el, i) => pop(tl, q, [el], 3.2 + i * 0.25, 0, 10));
    next((at) => {
      q('.no').forEach((el, i) => {
        tl.fromTo(el, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.25 }, at + i * 0.3);
        tl.to(el, { y: 70, autoAlpha: 0.25, rotate: i % 2 ? 10 : -10, duration: 0.6, ease: 'power2.in' }, at + 0.5 + i * 0.3);
      });
      spring(tl, q, '.ok-chip', at + 1.6, 0.12);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={60} w={460} h={300} kind="vscode" title="src/app.py" className="vsc">
        <Code lines={['import sys', '', 'def total(xs):', '    s = 0', '    for x in xs:', '        s += x']} />
        <span className="k-caret" style={{ position: 'absolute', left: 205, top: 148 }} />
      </Win>
      {EVENTS.map(({ icon: Icon, label, tone }, i) => (
        <span key={label} className="ev k-chip" data-tone={tone} style={{ left: 80 + i * 100, top: 300 }}><Icon size={14} /> {label}</span>
      ))}

      <div className="bag" style={{ left: 540, top: 150, width: 120, height: 120 }}>
        <Ring x={60} y={60} r={50} tone="sky">
          <span className="bagi" style={{ display: 'grid', placeItems: 'center', color: 'var(--sky)' }}><Mail size={34} /></span>
        </Ring>
        <span className="k-cap" style={{ position: 'absolute', top: 130, width: 160, left: -20, textAlign: 'center', fontSize: 11 }}>flush every 5 s</span>
      </div>
      <Card x={740} y={150} w={230} tone="gold" icon={Server} title="API" sub="sanitize → store" className="api" />

      <Win x={740} y={330} w={500} h={340} title="Lab page · Live activity" className="web">
        <div style={{ display: 'grid', gap: 10 }}>
          {ROWS.map(([tone, a, b]) => (
            <div key={a} className="row k-row" style={{ padding: '8px 10px', borderRadius: 8, background: '#18181d' }}>
              <span className="k-dot" data-tone={tone} />
              <span style={{ flex: 1 }}>{a}</span>
              <span className="k-muted" style={{ fontSize: 13 }}>{b}</span>
            </div>
          ))}
        </div>
      </Win>

      {['keystrokes', 'file contents', '../../etc/passwd', 'unknown field'].map((t, i) => (
        <span key={t} className="no k-chip mono" data-tone="red" style={{ left: 60 + (i % 2) * 230, top: 420 + Math.floor(i / 2) * 60, height: 36 }}>✗ {t}</span>
      ))}
      <div style={{ left: 40, top: 600, display: 'flex', gap: 8, flexWrap: 'wrap', width: 660 }}>
        {['only after consent', 'only while connected', 'only files in the repo', 'paths relative, no ..'].map((t) => (
          <Chip key={t} tone="green" className="ok-chip">✓ {t}</Chip>
        ))}
      </div>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Batched every 5 seconds',
      caption: 'Edits, saves, new files and runs are batched in VS Code and flushed every 5 seconds to the live activity feed.',
      say: "While you work, ShipLabs notes what happens. You edited a file, saved it, created a folder, ran the code. These small events go into a bag, and every five seconds the bag is sent to the server. On the web lab page, they show up live as simple sentences.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td><code>edit</code> · <code>save</code></td><td>counts per file per flush</td></tr>
            <tr><td><code>run</code></td><td>command, exit code, output tail ≤ 4 KB</td></tr>
            <tr><td><code>active</code></td><td>ms of real focused work, sampled every 5 s</td></tr>
            <tr><td><code>paste</code> · <code>file</code></td><td>large paste signal · create / delete</td></tr>
            <tr><td><code>session</code> · <code>check</code></td><td>start / stop · each review</td></tr>
          </tbody>
        </table>
      ),
    },
    {
      title: 'Private by design',
      caption: 'No keystrokes or file contents are sent; the server drops unknown fields, caps sizes and rejects unsafe paths.',
      say: "And it is private by design. It never sends keystrokes, and never sends file contents in this activity feed. The server checks every event again: unknown fields are dropped, sizes are capped, and paths like dot dot slash are rejected. The lab timer counts real active minutes, not just clock time.",
      body: (
        <>
          <p className="r-p">Flush every 5 s or at 50 events, retried on failure, 60 s heartbeat. <code>sanitizeTelemetry</code> drops unknown types, clamps future timestamps, and rejects absolute paths and drive letters.</p>
          <p className="r-note">Lab timer = <b>real work</b>: <code>active</code> ms is added to the lab's elapsed time.</p>
        </>
      ),
    },
  ],
};
