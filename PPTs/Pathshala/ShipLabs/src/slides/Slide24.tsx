import { KeyRound, Link2, Scissors, Vault } from 'lucide-react';
import { Board, Card, Chip, Txt, Win, Wire, Wires, count, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.lab-a, .vsc', 0, 0.15);
    tl.to(q('.btn-c'), { scale: 0.92, duration: 0.15, yoyo: true, repeat: 1 }, 0.8);
    tl.fromTo(q('.ticket'), { autoAlpha: 0, y: -30, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.7 }, 1.1);
    count(tl, q, '.ttl', 300, 296, 1.8);
    pop(tl, q, '.hash-note', 2);
    next((at) => {
      tl.to(q('.ticket'), { x: 640, y: -40, rotate: 8, duration: 0.9, ease: 'power2.inOut' }, at);
      pop(tl, q, '.shred', at + 0.6);
      tl.to(q('.ticket'), { clipPath: 'inset(100% 0 0 0)', y: 40, duration: 0.6 }, at + 1);
      spring(tl, q, '.burned', at + 1.5);
      tl.fromTo(q('.key'), { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'bounce.out' }, at + 1.6);
      pop(tl, q, '.safe', at + 1.4);
    });
    next((at) => {
      tl.to(q('.hash-note, .shred, .burned'), { autoAlpha: 0.2 }, at);
      draw(tl, q, '.link-a', at);
      tl.to(q('.btn-c'), { autoAlpha: 0, duration: 0.2 }, at + 0.4);
      spring(tl, q, '.btn-ok', at + 0.5);
      pop(tl, q, '.lab-b', at + 1.1);
      spring(tl, q, '.track', at + 1.5);
      tl.to(q('.link-a'), { autoAlpha: 0.15 }, at + 1.9);
      draw(tl, q, '.link-b', at + 1.9);
      spring(tl, q, '.no-ticket', at + 2.4);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={50} w={440} h={260} title="/lab/rest-api-go" className="lab-a">
        <div style={{ fontSize: 18, fontWeight: 600 }}>REST API in Go</div>
        <div className="k-muted" style={{ fontSize: 14, marginTop: 4 }}>Step 3 / 8 · Validate the body</div>
        <div style={{ position: 'relative', marginTop: 22, height: 36 }}>
          <span className="btn-c k-chip" data-tone="gold" style={{ position: 'absolute', height: 36 }}><Link2 size={14} /> Connect to VS Code</span>
          <span className="btn-ok k-chip" data-tone="green" style={{ position: 'absolute', height: 36 }}>● Connected · tracking</span>
        </div>
      </Win>
      <div className="ticket" style={{ left: 120, top: 330, width: 260, padding: '14px 18px', borderRadius: 10, background: '#f3ead2', color: '#1b1609', boxShadow: '0 12px 30px rgba(0,0,0,0.5)', borderLeft: '6px dashed #c9b37a' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>Pairing code</div>
        <div className="mono" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '0.06em' }}>K7QM-3XPA</div>
        <div className="mono" style={{ fontSize: 12 }}>expires in <span className="ttl">300</span> s · single use</div>
      </div>
      <Txt x={120} y={470} w={360} className="hash-note k-muted" style={{ fontSize: 14 }}>
        Server stores only its <b style={{ color: 'var(--text)' }}>SHA-256 hash</b>. Alphabet has no 0/O/1/I, so it survives hand-typing.
      </Txt>

      <Win x={800} y={50} w={440} h={260} kind="vscode" title="ShipLabs · VS Code" className="vsc">
        <div className="mono k-muted" style={{ fontSize: 13, lineHeight: 1.7 }}>vscode://indiehub.shiplabs/connect<br />?code=K7QM-3XPA&amp;session=…</div>
      </Win>
      <span className="shred k-chip" data-tone="red" style={{ left: 900, top: 330, height: 36 }}><Scissors size={15} /> burn the code atomically</span>
      <span className="burned k-chip" data-tone="muted" style={{ left: 1110, top: 336, height: 26, fontSize: 12 }}>burned</span>
      <Card x={900} y={420} w={300} tone="violet" icon={Vault} title="SecretStorage" sub="never in settings, the repo or logs" className="safe" />
      <span className="key k-chip mono" data-tone="violet" style={{ left: 1100, top: 380, height: 34 }}><KeyRound size={15} /> slx_••••</span>

      <Win x={40} y={545} w={440} h={140} title="/lab/cli-in-python" className="lab-b">
        <div style={{ fontSize: 16, fontWeight: 600 }}>CLI in Python</div>
        <span className="track k-chip" data-tone="sky" style={{ marginTop: 12 }}>Track this lab</span>
      </Win>
      <Chip x={510} y={650} tone="sky" className="no-ticket">same token, no new code · followed within 15 s</Chip>

      <Wires>
        <Wire d="M 482 180 L 796 180" tone="green" className="link-a" arrow={false} />
        <Wire d="M 482 610 C 640 610 660 240 796 240" tone="green" className="link-b" arrow={false} />
      </Wires>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'A one-time code',
      caption: 'Clicking Connect to VS Code prints a pairing code that lives 5 minutes, is single use, and is stored only as a hash.',
      say: "Now ShipLabs inside VS Code. You connect once. On the lab page you click Connect to VS Code. The server prints a short code that lives for five minutes and works only once. The server keeps only a hash of it, not the code itself.",
      body: <p className="r-p"><code>POST /extension/pair</code> → <code>XXXX-XXXX</code>, 5-minute TTL, single use. The browser opens <code>vscode://indiehub.shiplabs/connect</code>. Fallback: <b>ShipLabs: Connect with code</b>.</p>,
    },
    {
      title: 'Code in, key out',
      caption: 'The extension trades the code for an slx_ token; the code is burned, older tokens revoked, and the token kept in SecretStorage.',
      say: "VS Code sends the code to the server. The server burns it, so it can never be used again, and revokes any older keys. It returns a new key starting with s-l-x underscore. VS Code keeps it in its secret storage, never in settings or in your repo.",
      body: <p className="r-p"><code>POST /extension/token</code>: burn the code atomically → revoke older tokens → return <code>slx_…</code>. Only its <b>SHA-256 hash</b> is stored server-side. One-time telemetry consent follows.</p>,
    },
    {
      title: 'One editor, any lab',
      caption: 'The editor is connected per account; Track this lab switches the active lab without pairing again.',
      say: "Now the browser and VS Code are connected. The key belongs to you, not to one lab. If you open a different lab and click track this lab, VS Code follows it within 15 seconds. No new code needed.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Not connected</td><td>Connect to VS Code</td></tr>
            <tr><td>Tracking this lab</td><td>Disconnect</td></tr>
            <tr><td>Tracking another lab</td><td>Track this lab</td></tr>
            <tr><td>Quiet 2+ min / revoked</td><td>Connect to VS Code</td></tr>
          </tbody>
        </table>
      ),
    },
  ],
};
