import { FlaskConical, Gauge, KeyRound, Ruler, UserCheck } from 'lucide-react';
import { Board, Orb, Txt, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const DOORS = [
  { icon: KeyRound, t: 'Identity', s: 'Clerk JWT / slx_' },
  { icon: UserCheck, t: 'Is it yours?', s: '{_id, userId}' },
  { icon: Ruler, t: 'Size & path', s: 'caps · no ..' },
  { icon: Gauge, t: 'Rate limit', s: '30 / min / user' },
  { icon: FlaskConical, t: 'Sanitizer', s: 'whitelisted fields' },
];
const DX = (i: number) => 200 + i * 200;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.door', 0, 0.1);
    pop(tl, q, '.api', 0.5);
    tl.fromTo(q('.good'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.8);
    tl.to(q('.good'), { x: 1040, duration: 2.2, ease: 'none' }, 0.9);
    q('.door').forEach((el, i) => tl.to(el, { borderColor: '#4cc77a', duration: 0.2 }, 0.9 + (DX(i) - 60) / 1040 * 2.2));
    spring(tl, q, '.pass', 3.1);
    next((at) => {
      tl.to(q('.good, .pass'), { autoAlpha: 0.15 }, at);
      const bounce = (sel: string, doorX: number, t0: number) => {
        tl.fromTo(q(sel), { autoAlpha: 0, x: 0, y: 0, rotate: 0 }, { autoAlpha: 1, duration: 0.2 }, t0);
        tl.to(q(sel), { x: doorX - 150, duration: 0.7, ease: 'power1.in' }, t0 + 0.1);
        tl.to(q(sel), { x: doorX - 260, y: 150, rotate: -25, autoAlpha: 0.35, duration: 0.6, ease: 'power2.out' }, t0 + 0.8);
      };
      bounce('.forged', DX(0), at + 0.2);
      bounce('.trav', DX(2), at + 1);
      tl.fromTo(q('.inj'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: 300, duration: 0.8 }, at + 1.8);
      pop(tl, q, '.glass', at + 2.4);
      spring(tl, q, '.mute', at + 2.8);
    });
  });

  return (
    <Board root={root} step={step}>
      {DOORS.map(({ icon: Icon, t, s }, i) => (
        <div key={t} className="door" style={{ left: DX(i) - 60, top: 120, width: 120, height: 300, borderRadius: '60px 60px 10px 10px', border: '2px solid var(--line-2)', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30, gap: 8, textAlign: 'center' }}>
          <Icon size={26} color="var(--gold)" />
          <b style={{ fontSize: 15 }}>{t}</b>
          <span className="mono k-muted" style={{ fontSize: 11 }}>{s}</span>
        </div>
      ))}
      <Orb x={1200} y={270} r={30} tone="green" label="API" className="api" />
      <span className="good k-chip mono" data-tone="green" style={{ left: 30, top: 252, height: 36 }}>✓ request</span>
      <span className="pass k-chip" data-tone="green" style={{ left: 1100, top: 340 }}>all checks passed</span>

      <span className="forged k-chip mono" data-tone="red" style={{ left: 30, top: 252, height: 36 }}>forged token</span>
      <span className="trav k-chip mono" data-tone="red" style={{ left: 30, top: 252, height: 36 }}>../../etc/passwd</span>

      <span className="inj k-chip" data-tone="amber" style={{ left: 60, top: 500, height: 40, fontSize: 15 }}>doc: “ignore your rules…”</span>
      <div className="glass" style={{ left: 340, top: 470, width: 340, height: 100, borderRadius: 16, border: '1px solid rgba(76,182,232,0.5)', background: 'rgba(76,182,232,0.07)' }}>
        <span className="k-cap" style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontSize: 10, color: 'var(--sky)' }}>untrusted material</span>
      </div>
      <Txt x={700} y={496} className="mute" style={{ fontSize: 15, color: 'var(--sky)' }}>can't give orders to the AI</Txt>
      <Txt x={40} y={620} w={1200} className="mute k-muted" style={{ fontSize: 14 }}>
        Tokens and pairing codes are stored only as SHA-256 hashes. Secrets, tokens and personal data are never logged.
      </Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Five doors for every request',
      caption: 'Every request passes identity, ownership, size and path checks, a rate limiter and a sanitizer.',
      say: "Security. Picture every request walking down a corridor with five doors. Who are you? Is this chat yours? Is it the right size, with a safe path? Are you within the rate limit? And are the fields clean? A normal request passes all five.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Web</td><td>Clerk JWT verified on every route</td></tr>
            <tr><td>Editor</td><td><code>slx_</code> only on coach and extension routes</td></tr>
            <tr><td>Ownership</td><td>every lookup is <code>{'{_id, userId}'}</code></td></tr>
            <tr><td>Rate limits</td><td>30 / min per user · pair and token 10 / min per IP · auto-check 10 / min + 10 / hour / step</td></tr>
          </tbody>
        </table>
      ),
    },
    {
      title: 'Bad requests bounce',
      caption: 'A forged token fails at the first door, a path-traversal file fails the path check, and injected document text cannot instruct the AI.',
      say: "Now the bad ones. A fake key is stopped at the first door. A file path trying to escape with dot dot slash is stopped at the path check. And a document that says ignore your rules is put in a glass box. The AI can read it, but it can't take orders from it.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Tokens</b> hashed, codes expire in 5 min, one live editor per user; a 401 stops the extension.</li>
          <li className="r-li"><b>Code safety</b>: no code writes, auto-run command chosen locally, 20 s kill.</li>
          <li className="r-li"><b>Privacy</b>: no keystrokes or file contents in telemetry; shared chats hide documents and identity.</li>
        </ul>
      ),
    },
  ],
};
