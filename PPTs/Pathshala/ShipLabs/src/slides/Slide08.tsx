import { Board, Chip, Txt, pop, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

// Bottom-up: each layer slides in from the side with its one-word reason.
const LAYERS: { name: string; tech: string; why: string; tone: Tone }[] = [
  { name: 'Data', tech: 'MongoDB 8 + Mongoose', why: 'flexible', tone: 'green' },
  { name: 'API', tech: 'Node.js 22 + Express', why: 'one API', tone: 'gold' },
  { name: 'AI', tech: 'Provider chain · MADHAVA first', why: 'reliable', tone: 'amber' },
  { name: 'Streaming', tech: 'Server-Sent Events · 10 s heartbeat', why: 'live', tone: 'sky' },
  { name: 'Web', tech: 'Next.js · React · TypeScript · Tailwind · shadcn/ui', why: 'fast', tone: 'red' },
  { name: 'Editor', tech: 'VS Code Extension API (TypeScript)', why: 'in your editor', tone: 'violet' },
];
const SIDE = [
  ['Auth', 'Clerk on the web · slx_ tokens in VS Code'],
  ['Hosting', 'Cloudflare Pages + Tunnel → self-hosted, systemd'],
  ['Uploads', 'multer (memory) · pdf-parse · mammoth'],
  ['Visuals', 'Recharts renderer · Prism syntax highlight'],
  ['Images', 'Unsplash → Openverse → Wikimedia'],
  ['Tests', 'Jest · supertest · Playwright'],
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    q('.layer').forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, x: i % 2 ? 80 : -80 }, { autoAlpha: 1, x: 0 }, 0.1 + i * 0.22));
    next((at) => pop(tl, q, '.side', at, 0.1));
  });

  return (
    <Board root={root} step={step}>
      <Txt x={60} y={40} className="k-cap">The stack, bottom up</Txt>
      {LAYERS.map((l, i) => (
        <div
          key={l.name}
          className="layer k-card"
          data-tone={l.tone}
          style={{ left: 60 + i * 12, top: 590 - i * 96, width: 740 - i * 24, height: 80, display: 'flex', alignItems: 'center', gap: 18 }}
        >
          <span className="mono" style={{ width: 92, fontSize: 13, color: `var(--${l.tone})`, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l.name}</span>
          <span style={{ flex: 1, fontSize: 19, fontWeight: 600 }}>{l.tech}</span>
          <Chip tone={l.tone}>{l.why}</Chip>
        </div>
      ))}
      <Txt x={860} y={40} className="k-cap side">Around it</Txt>
      {SIDE.map(([k, v], i) => (
        <div key={k} className="side k-card" data-tone="muted" style={{ left: 860, top: 80 + i * 98, width: 380, height: 84 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</div>
          <div style={{ fontSize: 16, marginTop: 6 }}>{v}</div>
        </div>
      ))}
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Six layers',
      caption: 'MongoDB, Express, the AI provider chain, Server-Sent Events, Next.js and the VS Code extension.',
      say: "Here is the tech stack from the bottom up. MongoDB for flexible documents. Node and Express for one API with all the logic. Our AI provider chain for reliability. Server-Sent Events so text streams live. Next.js and React for a fast website. And the VS Code extension API to live inside the editor.",
      body: (
        <table className="r-kv">
          <tbody>
            <tr><td>Data</td><td>MongoDB 8: chats, labs and tutor state are flexible documents</td></tr>
            <tr><td>API</td><td>Node 22 + Express: one place for prompts, grading, credits</td></tr>
            <tr><td>Streaming</td><td>SSE: one-way, proxy-friendly, heartbeat every 10 s</td></tr>
            <tr><td>Web</td><td>Next.js static export to Cloudflare Pages</td></tr>
          </tbody>
        </table>
      ),
    },
    {
      title: 'Around the core',
      caption: 'Clerk and slx_ auth, Cloudflare hosting, in-memory upload parsing, drawn charts, free image sources and Jest plus Playwright tests.',
      say: "Around the core: Clerk for login on the web, and our own tokens for VS Code. Cloudflare for hosting. Uploads are parsed in memory and never written to disk. Charts are drawn, not generated. Photos come from free licensed sources. And everything is tested with Jest and Playwright.",
      body: <p className="r-p">Low cost and full control: <b>Cloudflare Pages + Tunnel</b> in front of one self-hosted server. Uploads are parsed in memory, so <b>no binary ever touches the disk</b>.</p>,
    },
  ],
};
