import { Archive, FileText } from 'lucide-react';
import { Board, Card, Chip, Orb, Txt, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const CHECKS = ['extension', 'MIME matches', 'magic bytes', '≤ 5 MB'];
const PAGES = ['Page 1', 'Page 2', 'Page 3 · scanned', 'Page 4'];
const PATH = ['Journal entries', 'Ledgers and trial balance', 'Depreciation', 'Final accounts'];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.drop', 0);
    tl.fromTo(q('.pdf'), { autoAlpha: 0, x: -40, y: 40 }, { autoAlpha: 1, x: 0, y: 0 }, 0.2);
    tl.to(q('.pdf'), { x: 290, y: 0, duration: 0.8, ease: 'power2.inOut' }, 0.9);
    q('.chk').forEach((el, i) => spring(tl, q, [el], 1.7 + i * 0.2, 0));
    next((at) => {
      pop(tl, q, '.page', at, 0.12);
      tl.fromTo(q('.ocr'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: 150, duration: 0.9, ease: 'none' }, at + 0.7);
      tl.to(q('.ocr'), { autoAlpha: 0, duration: 0.2 }, at + 1.6);
      tl.to(q('.hand'), { filter: 'blur(0px)', fontFamily: 'Inter', duration: 0.3 }, at + 1.4);
      pop(tl, q, '.cab', at + 1.2);
      q('.page').forEach((el, i) => tl.to(el, { x: 700 - i * 160, y: -190 + i * 58, scale: 0.4, autoAlpha: 0, duration: 0.6 }, at + 1.9 + i * 0.12));
      pop(tl, q, '.drawer', at + 2.1, 0.1, 6);
      tl.to(q('.pdf'), { autoAlpha: 0, filter: 'blur(8px)', scale: 1.2, duration: 0.7 }, at + 2.3);
      spring(tl, q, '.gone', at + 2.6);
    });
    next((at) => {
      spring(tl, q, '.ask', at);
      tl.to(q('.drawer-3'), { x: 24, borderColor: '#e3b341', duration: 0.4 }, at + 0.4);
      pop(tl, q, '.glass', at + 0.6);
      tl.fromTo(q('.strip'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: 250, duration: 0.8 }, at + 0.8);
      spring(tl, q, '.course', at + 1.8);
      pop(tl, q, '.pw', at + 2.1, 0.1, 8);
    });
  });

  return (
    <Board root={root} step={step}>
      <div className="drop" style={{ left: 330, top: 50, width: 300, height: 150, border: '2px dashed var(--line-2)', borderRadius: 14, display: 'grid', placeItems: 'center', color: 'var(--muted)', fontSize: 14 }}>
        <span style={{ marginTop: 96 }}>Drop notes here</span>
      </div>
      <Card x={60} y={60} w={240} tone="green" icon={FileText} title="accounts_notes.pdf" sub="12 pages · 2.1 MB" className="pdf" />
      <span className="gone k-chip" data-tone="muted" style={{ left: 370, top: 216 }}>original file never stored</span>
      {CHECKS.map((c, i) => (
        <Chip key={c} x={60 + i * 150} y={262} tone="green" className="chk">✓ {c}</Chip>
      ))}

      {PAGES.map((p, i) => (
        <div key={p} className="page k-card" data-tone={i === 2 ? 'amber' : 'muted'} style={{ left: 60 + i * 160, top: 330, width: 145, height: 190, fontSize: 12 }}>
          <span className="k-muted">{p}</span>
          {i === 2 ? (
            <div className="hand" style={{ marginTop: 10, fontFamily: 'Instrument Serif', fontStyle: 'italic', fontSize: 15, lineHeight: 1.3, filter: 'blur(1.6px)' }}>Dr. Cash 5,000<br />Cr. Capital 5,000</div>
          ) : (
            [0, 1, 2, 3, 4].map((k) => <div key={k} style={{ height: 5, margin: '10px 0', width: `${90 - ((k * 13) % 40)}%`, background: '#2c2c35', borderRadius: 3 }} />)
          )}
        </div>
      ))}
      <span className="ocr" style={{ left: 380, top: 330, width: 4, height: 190, background: 'var(--amber)', boxShadow: '0 0 20px var(--amber)' }} />

      <Card x={720} y={50} w={260} h={330} tone="gold" icon={Archive} title="Inside the chat" className="cab">
        <div className="k-card-sub" style={{ fontSize: 13 }}>sections · page numbers · text only</div>
      </Card>
      {['Page 1', 'Page 2', 'Page 3', 'Page 4'].map((p, i) => (
        <div key={p} className={`drawer drawer-${i} k-card`} data-tone="muted" style={{ left: 740, top: 140 + i * 58, width: 220, height: 48, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 14 }}>
          <span className="mono">{p}</span>
        </div>
      ))}

      <Chip x={720} y={410} tone="sky" className="ask">“Explain page 4”</Chip>
      <span className="strip k-chip mono" data-tone="gold" style={{ left: 800, top: 316, height: 30, fontSize: 12 }}>p.4 text</span>
      <div className="glass" style={{ left: 1050, top: 200, width: 190, height: 220, borderRadius: 18, border: '1px solid rgba(76,182,232,0.5)', background: 'rgba(76,182,232,0.06)', backdropFilter: 'blur(4px)' }}>
        <Orb x={95} y={110} r={38} />
        <span className="k-cap" style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontSize: 10, color: 'var(--sky)' }}>untrusted material</span>
      </div>

      <Chip x={720} y={470} tone="gold" className="course">“Make this a course”</Chip>
      {PATH.map((p, i) => (
        <div key={p} className="pw k-row" style={{ left: 720, top: 520 + i * 38, fontSize: 15, color: i === 0 ? 'var(--gold)' : 'var(--muted)' }}>
          <span className="k-dot" data-tone={i === 0 ? 'gold' : 'muted'} /> {i + 1}. {p}
        </div>
      ))}
      <Txt x={60} y={560} w={600} className="pw k-muted" style={{ fontSize: 14 }}>
        Sub-topics follow the document's own order and sections. The tutor stays inside the document unless asked to broaden.
      </Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Checked at the door',
      caption: 'Up to three files of 5 MB each; extension, MIME type, magic-byte signature and size are all checked.',
      say: "You can learn from your own notes. Drop a PDF, a photo of the blackboard or a Word file into the chat. First, every file is checked at the door: the type, the real file signature and the size.",
      body: <p className="r-p">Up to <b>3 files</b>, 5 MB each, uploaded to <b>memory</b> (multer), rate-limited to 10 per minute. <code>validateLearnFile</code> checks the extension, MIME, magic bytes and that text looks like text.</p>,
    },
    {
      title: 'Read, even when scanned',
      caption: 'PDFs are parsed page by page; scanned pages go through a vision model for OCR; only the text is kept.',
      say: "Then it is read page by page. If a page is a scan or handwriting, a vision model reads it. The text is saved inside the chat, with page numbers. And the original file is thrown away. It is never stored.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>PDF</b>: pdf-parse; empty pages → up to 25 rendered for OCR.</li>
          <li className="r-li"><b>Image</b>: OCR text plus a visual description.</li>
          <li className="r-li"><b>DOCX</b>: mammoth. <b>MD/TXT</b>: headings become sections.</li>
          <li className="r-li">Long files are chunked (12k chars) and summarized. Max 150k chars stored.</li>
        </ul>
      ),
    },
    {
      title: 'Ask it, or make it a course',
      caption: 'Asking about page 4 pulls just that page into the prompt as untrusted material; the document can also become a full course.',
      say: "Now ask: explain page 4. Only page 4 is sent to the AI, inside a glass box marked untrusted. So if the document says ignore your rules, the AI won't follow it. Or tap make this a course, and your notes become the syllabus.",
      body: (
        <>
          <p className="r-p">"page 4" → that page; otherwise the top 4 sections by relevance, capped at 30k chars. Follow-up questions remember the document.</p>
          <p className="r-note"><b>Prompt-injection guard:</b> document text is wrapped as untrusted reference material, and the model is told never to follow instructions inside it.</p>
        </>
      ),
    },
  ],
};
