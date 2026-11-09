import { Lock, ScanLine, Trash2 } from 'lucide-react';
import { Board, Chip, Txt, Win, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

// A conveyor carries raw model output: prose passes the stream gate, sealed control blocks
// are held back and unboxed into UI, and leaked JSON is cut out by the sanitizer.
function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    // fade in and ride the belt; both fromTos apply their hidden start state at build time
    const ride = (el: Element[], x: number, at: number) => {
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, at);
      tl.fromTo(el, { x: 0 }, { x, duration: 1, ease: 'power1.inOut' }, at);
    };
    pop(tl, q, '.belt, .gate, .browser, .lbl', 0, 0.08);
    tl.fromTo(q('.it-text'), { x: 0, autoAlpha: 1 }, { x: 640, duration: 1.6, ease: 'power1.inOut' }, 0.6);
    tl.to(q('.it-text'), { autoAlpha: 0, duration: 0.2 }, 2.1);
    pop(tl, q, '.b-text', 2.1);
    next((at) => {
      ride(q('.it-box'), 330, at);
      tl.fromTo(q('.arm'), { rotate: -75 }, { rotate: 0, duration: 0.4, ease: 'back.out(2)' }, at + 0.7);
      spring(tl, q, '.hold', at + 0.9);
      tl.fromTo(q('.scan'), { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 30, duration: 0.6, yoyo: true, repeat: 1 }, at + 1.1);
      tl.to(q('.it-box'), { autoAlpha: 0, scale: 0.6, duration: 0.3 }, at + 2.2);
      pop(tl, q, '.json', at + 2.2);
      spring(tl, q, '.b-chip', at + 2.8, 0.15);
    });
    next((at) => {
      tl.to(q('.json, .hold'), { autoAlpha: 0.25 }, at);
      ride(q('.it-blob'), 520, at);
      tl.fromTo(q('.laser'), { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.25 }, at + 0.9);
      tl.to(q('.it-blob'), { y: 220, rotate: 40, autoAlpha: 0.2, duration: 0.8, ease: 'power2.in' }, at + 1.2);
      tl.to(q('.laser'), { autoAlpha: 0, duration: 0.3 }, at + 1.5);
      spring(tl, q, '.bin', at + 1.1);
      spring(tl, q, '.clean', at + 2);
    });
  });

  return (
    <Board root={root} step={step}>
      <Txt x={40} y={232} className="lbl k-cap">Model output →</Txt>
      <div className="belt" style={{ left: 40, top: 330, width: 780 }} />

      <div className="gate" style={{ left: 470, top: 220, width: 120, height: 160, border: '2px solid var(--line-2)', borderBottom: 'none', borderRadius: '12px 12px 0 0' }}>
        <span className="k-cap" style={{ position: 'absolute', top: -24, left: 0, width: '100%', textAlign: 'center', fontSize: 11 }}>Stream gate</span>
        <span className="arm" style={{ position: 'absolute', left: -8, top: 46, width: 136, height: 8, borderRadius: 4, background: 'var(--red)', transformOrigin: '4px 4px' }} />
        <span className="scan" style={{ position: 'absolute', left: 20, top: 10, color: 'var(--gold)' }}><ScanLine size={80} strokeWidth={1.2} /></span>
      </div>
      <Chip x={460} y={392} tone="red" className="hold">⏸ hold back</Chip>

      <span className="it-text k-chip" data-tone="sky" style={{ left: 40, top: 290, height: 36 }}>"Light energy is…"</span>
      <span className="it-box k-chip mono" data-tone="gold" style={{ left: 40, top: 290, height: 36 }}><Lock size={14} /> ```meraki:choices</span>
      <span className="it-blob k-chip mono" data-tone="red" style={{ left: 40, top: 290, height: 36 }}>{'{"award":25,…}'}</span>

      <div className="json k-card" data-tone="gold" style={{ left: 330, top: 450, width: 400, fontFamily: 'var(--font-mono)', fontSize: 13.5, lineHeight: 1.6, color: '#d6d3cc' }}>
        {'{ "prompt": "What next?",'}<br />{'  "options": ["Show the diagram",'}<br />{'              "Quiz me", "Go deeper"] }'}
      </div>

      <div className="laser" style={{ left: 680, top: 230, height: 160, transformOrigin: 'top' }} />
      <span className="k-cap" style={{ left: 640, top: 196, fontSize: 11, color: 'var(--red)' }}>Sanitizer</span>
      <div className="bin" style={{ left: 640, top: 560, width: 120, height: 90, display: 'grid', placeItems: 'center', border: '2px dashed var(--line-2)', borderRadius: 12, color: 'var(--muted)' }}>
        <Trash2 size={30} />
      </div>

      <Win x={860} y={120} w={380} h={420} title="What the learner sees" className="browser">
        <p className="b-text" style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>
          Light energy is captured by chlorophyll and stored as glucose…
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
          {['Show the diagram', 'Quiz me', 'Go deeper'].map((c) => <Chip key={c} tone="gold" className="b-chip">{c}</Chip>)}
        </div>
        <span className="clean k-chip" data-tone="green" style={{ position: 'absolute', left: 16, bottom: 16 }}>✓ clean text + chips, no raw data</span>
      </Win>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Prose streams straight through',
      caption: 'Normal teaching text passes the stream gate and appears in the chat right away.',
      say: "How does the AI send buttons and diagrams without breaking the text? Think of a conveyor belt. Normal text passes straight through a gate and shows up in the chat right away.",
      body: <p className="r-p">The model writes plain markdown for the learner. Everything before the earliest control marker is safe to send, so it streams immediately.</p>,
    },
    {
      title: 'Sealed boxes are held and unboxed',
      caption: 'A fenced meraki:choices block is held back, parsed, and turned into clickable chips.',
      say: "When the AI wants to attach something structured, it puts it in a sealed box with a special tag, like meraki choices. The gate drops and holds it. Even a half-written box is held, until the next chunk proves what it is. Then the server unboxes it and turns it into buttons.",
      body: (
        <>
          <p className="r-p">The stream holds back any tail that <i>might</i> start a marker, like <code>```</code> or <code>```mer</code>, until the next chunk proves what it is.</p>
          <table className="r-kv" style={{ marginTop: 10 }}>
            <tbody>
              <tr><td><code>choices</code></td><td>2–6 clickable chips</td></tr>
              <tr><td><code>progress</code></td><td>tutor points, clamped 0–25</td></tr>
              <tr><td><code>profile</code></td><td>learner profile, once</td></tr>
              <tr><td><code>visual</code> · <code>images</code> · <code>sources</code></td><td>diagram, real photos, citations</td></tr>
            </tbody>
          </table>
        </>
      ),
    },
    {
      title: 'Leaked JSON is cut out',
      caption: 'Raw JSON that leaks into the prose is caught and removed by the sanitizer before the learner sees it.',
      say: "Sometimes the AI leaks raw data into the text. The sanitizer catches it and cuts it out. It also removes repeated sentences. So the learner only ever sees clean text and buttons, never raw code noise.",
      body: <p className="r-p"><code>sanitizeAssistantMarkdown</code> strips every control block and stray JSON, and removes duplicated sentences, so the learner never sees raw data.</p>,
    },
  ],
};
