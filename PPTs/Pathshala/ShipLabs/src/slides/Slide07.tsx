import { Cloud, Gauge, KeyRound, Route, Server } from 'lucide-react';
import { Board, Card, Chip, Cyl, Orb, Packet, Win, Wire, Wires, draw, pop, spring, travel, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const SERVICES = ['grading', 'verification', 'documents', 'images', 'syllabus', 'titles', 'spaced repetition', 'lab reports'];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.w-browser, .w-vscode', 0, 0.15);
    pop(tl, q, '.cf', 0.3);
    pop(tl, q, '.api', 0.5);
    draw(tl, q, '.w-in', 0.7, 0.1);
    next((at) => {
      travel(tl, q, '.p-jwt', '.r-jwt', at, 1.2, true);
      travel(tl, q, '.p-slx', '.r-slx', at + 0.3, 1.2, true);
    });
    next((at) => {
      ['.g-auth', '.g-rate', '.g-route'].forEach((g, i) =>
        tl.fromTo(q(g), { opacity: 0.3, scale: 0.9 }, { opacity: 1, scale: 1, ease: 'back.out(3)' }, at + i * 0.35),
      );
      pop(tl, q, '.svc', at + 1.1, 0.04, 8);
    });
    next((at) => {
      spring(tl, q, '.orb-0', at, 0);
      pop(tl, q, '.orb-1, .orb-2', at + 0.2, 0.15, 0);
      tl.to(q('.orb-1, .orb-2'), { opacity: 0.35 }, at + 0.6);
      draw(tl, q, '.w-ai', at + 0.3);
      travel(tl, q, '.p-ai', '.w-ai', at + 0.8, 0.8, true);
    });
    next((at) => {
      pop(tl, q, '.db', at);
      draw(tl, q, '.w-db', at + 0.2);
      tl.fromTo(q('.k-cyl-fill'), { height: '0%' }, { height: '45%', duration: 1.2 }, at + 0.5);
      draw(tl, q, '.r-back', at + 0.3);
      travel(tl, q, '.p-ok', '.r-back', at + 0.4, 1.3);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={30} y={80} w={250} h={160} title="Browser · Next.js" className="w-browser">
        <div className="k-muted" style={{ fontSize: 13, lineHeight: 1.7 }}>/learn · /lab/:id<br />/dashboard/labs</div>
      </Win>
      <Win x={30} y={440} w={250} h={160} kind="vscode" title="VS Code · ShipLabs" className="w-vscode">
        <div className="k-muted" style={{ fontSize: 13 }}>extension on the learner's machine</div>
      </Win>
      <Card x={330} y={250} w={180} h={200} tone="amber" icon={Cloud} title="Cloudflare" className="cf">
        <div className="k-card-sub">Pages: static frontend<br />Tunnel: one HTTPS door to the API</div>
      </Card>

      <Card x={560} y={60} w={390} h={560} tone="gold" icon={Server} title="Express API · Node 22" className="api">
        <div className="k-card-sub mono" style={{ fontSize: 12 }}>/api/v1/learn/* · /api/v1/learner/*</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Chip tone="green" className="g-auth"><KeyRound size={14} /> auth</Chip>
          <Chip tone="amber" className="g-rate"><Gauge size={14} /> rate limit</Chip>
          <Chip tone="sky" className="g-route"><Route size={14} /> route</Chip>
        </div>
        <div className="k-cap" style={{ marginTop: 22, fontSize: 11 }}>Services</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {SERVICES.map((s) => <Chip key={s} className="svc">{s}</Chip>)}
        </div>
        <div className="k-cap" style={{ marginTop: 22, fontSize: 11 }}>Provider chain</div>
        <div className="mono" style={{ marginTop: 8, fontSize: 14, color: 'var(--gold)' }}>MADHAVA → secondary LLM → fallback</div>
      </Card>

      <Orb x={1170} y={110} r={34} label="MADHAVA (in-house)" className="orb-0" />
      <Orb x={1170} y={250} r={28} tone="sky" label="Secondary LLM" className="orb-1" />
      <Orb x={1170} y={380} r={28} tone="violet" label="Fallback LLM" className="orb-2" />
      <Cyl x={1050} y={520} w={200} h={130} label="MongoDB 8" sub="chats · labs · reviews · telemetry" className="db" />

      <Wires>
        <Wire d="M 282 160 C 310 160 300 320 328 320" tone="sky" className="w-in" />
        <Wire d="M 282 520 C 310 520 300 380 328 380" tone="violet" className="w-in" />
        <Wire d="M 512 350 L 556 350" tone="amber" className="w-in" />
        <Wire d="M 952 130 C 1040 130 1060 110 1128 110" tone="gold" className="w-ai" />
        <Wire d="M 952 585 L 1046 585" tone="green" className="w-db" />
        <Wire d="M 556 120 C 450 100 380 120 284 140" tone="green" className="r-back" dashed />
        <path className="r-jwt" d="M 282 160 C 310 160 300 320 328 320 L 600 320" fill="none" stroke="none" />
        <path className="r-slx" d="M 282 520 C 310 520 300 380 328 380 L 600 380" fill="none" stroke="none" />
        <Packet label="JWT" tone="sky" className="p-jwt" />
        <Packet label="slx_" tone="violet" className="p-slx" />
        <Packet label="prompt" tone="gold" className="p-ai" />
        <Packet label="200 · saved" tone="green" className="p-ok" />
      </Wires>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Three places code runs',
      caption: 'The website on Cloudflare Pages, the Express API behind a Cloudflare Tunnel, and the VS Code extension on the learner’s machine.',
      say: "Here is the whole system on one screen. Code runs in three places. The website, built with Next.js and served from Cloudflare Pages. The API server, built with Node and Express, on our own server behind a Cloudflare Tunnel. And the VS Code extension, on the learner's own laptop.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Website</b>: Next.js static export on Cloudflare Pages.</li>
          <li className="r-li"><b>API</b>: Node 22 + Express, self-hosted (systemd) behind a Cloudflare Tunnel.</li>
          <li className="r-li"><b>Extension</b>: ShipLabs, running inside the learner's VS Code.</li>
        </ul>
      ),
    },
    {
      title: 'Two kinds of key',
      caption: 'The browser sends a Clerk JWT; VS Code sends an slx_ token. Both enter through the same tunnel.',
      say: "Both clients talk to one API. The browser sends a login token from Clerk, called a JWT. VS Code sends its own key that starts with s-l-x underscore. Same account, but the editor key only works for lab routes.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Browser</td><td>HTTPS + <code>Clerk JWT</code>, JSON and SSE</td></tr>
            <tr><td>VS Code</td><td>HTTPS + <code>slx_</code> token, lab routes only</td></tr>
          </tbody>
        </table>
      ),
    },
    {
      title: 'Gates before any AI',
      caption: 'Every request passes authentication, a rate limiter and routing before any service or AI call runs.',
      say: "Inside the API, every request passes three gates. First, who are you. Second, the rate limit. Third, the route. Only then do the services run: grading, verification, documents, images, syllabus, reviews and reports.",
      body: <p className="r-p"><b>auth</b> (<code>authRequired</code> for Clerk, <code>coachAuth</code> for Clerk or slx_) → <b>rate limit</b> per user and per token → <b>route</b> to one of the ShipLabs services.</p>,
    },
    {
      title: 'A dedicated AI chain',
      caption: 'AI calls go through a dedicated provider chain: the in-house MADHAVA model first, with two fallbacks on standby.',
      say: "When the AI is needed, the API calls our own provider chain. First our in-house model, called MADHAVA. If that fails, a second hosted model. And a final fallback that is always on. More on this later.",
      body: <p className="r-p">A separate chain just for learning: <b>MADHAVA</b> first, then a <b>secondary</b> hosted LLM, then a <b>terminal fallback</b> with vision. The other two wait on standby.</p>,
    },
    {
      title: 'Saved, then answered',
      caption: 'Results are saved to MongoDB and streamed back to the browser.',
      say: "Finally the answer goes back to the learner, and everything is saved in MongoDB: chats, labs, reviews and editor activity.",
      body: <p className="r-p"><b>MongoDB 8</b> holds <code>LearnSession</code>, <code>LearnConversation</code>, <code>ReviewItem</code>, <code>LabTelemetryEvent</code>, <code>ExtensionToken</code> and <code>UserProfile</code>.</p>,
    },
  ],
};
