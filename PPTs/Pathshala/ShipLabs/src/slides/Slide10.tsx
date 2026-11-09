import { Coins, Heart, Server } from 'lucide-react';
import { Board, Card, Chip, Txt, Win, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const WORDS = 'Plants turn light energy into chemical energy. Chlorophyll in the leaf captures sunlight, and the plant uses it to join water and carbon dioxide into glucose, releasing oxygen.'.split(' ');
const EVENTS = [
  ['heartbeat', 'keeps the pipe open', 1],
  ['token', 'appends text', 1],
  ['choices', 'chip row', 2],
  ['visual · sources', 'diagram, citations', 2],
  ['title → done', 'rename, stop spinner', 2],
] as const;

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.api, .wallet, .browser', 0, 0.12);
    pop(tl, q, '.u-msg', 0.5);
    tl.fromTo(q('.coin'), { x: 0, y: 0, autoAlpha: 1 }, { x: 52, y: 120, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 0.9);
    spring(tl, q, '.minus', 1.6);
    next((at) => {
      draw(tl, q, '.pipe', at);
      pop(tl, q, '.ev-1', at + 0.2, 0.15, 8);
      pop(tl, q, '.a-head', at + 0.3);
      tl.fromTo(q('.w'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, stagger: 0.06, ease: 'none' }, at + 0.5);
    });
    next((at) => {
      spring(tl, q, '.chip-o', at, 0.12);
      pop(tl, q, '.src', at + 0.5);
      pop(tl, q, '.ev-2', at + 0.2, 0.15, 8);
      spring(tl, q, '.done', at + 1);
    });
  });

  return (
    <Board root={root} step={step}>
      <Card x={70} y={40} w={250} tone="gold" icon={Coins} title="Credits" className="wallet">
        <div className="k-row" style={{ marginTop: 8 }}>
          <span className="mono" style={{ fontSize: 22 }}>12</span>
          <span className="minus k-chip" data-tone="amber" style={{ height: 24 }}>−1</span>
        </div>
        <span className="coin" style={{ position: 'absolute', right: 30, top: 50, width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff1c2, #e3b341 60%, #8a6414)', boxShadow: '0 0 12px #e3b341' }} />
      </Card>
      <Card x={70} y={220} w={250} h={130} tone="gold" icon={Server} title="POST /messages" sub="check credit → stream" className="api" />

      <Txt x={70} y={384} className="k-cap">SSE events</Txt>
      {EVENTS.map(([t, d, s], i) => (
        <div key={t} className={`ev-${s} k-row`} style={{ left: 70, top: 416 + i * 46, width: 250 }}>
          <span className="k-chip mono" data-tone={s === 1 ? 'sky' : 'green'} style={{ height: 26, fontSize: 12.5 }}>{t}</span>
          <span className="k-muted" style={{ fontSize: 13 }}>{d}</span>
        </div>
      ))}

      <Wires>
        <Wire d="M 322 285 C 420 285 440 330 556 330" tone="sky" className="pipe" arrow={false} />
        <path id="pipe-route" d="M 322 285 C 420 285 440 330 556 330" fill="none" stroke="none" />
        <g className="beads">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} r="5" className="bead">
              <animateMotion dur="1.4s" begin={`${i * 0.28}s`} repeatCount="indefinite">
                <mpath href="#pipe-route" />
              </animateMotion>
            </circle>
          ))}
        </g>
      </Wires>
      <span className="beat" style={{ left: 420, top: 252, color: 'var(--red)' }}><Heart size={16} fill="currentColor" /></span>

      <Win x={560} y={40} w={680} h={640} title="shiplabs.app/learn · Chat" className="browser">
        <div className="u-msg" style={{ marginLeft: 'auto', width: 'fit-content', background: '#2a2a33', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', fontSize: 16 }}>
          How does photosynthesis work?
        </div>
        <div style={{ marginTop: 18, background: '#18181d', border: '1px solid var(--line)', borderRadius: '14px 14px 14px 4px', padding: '14px 16px' }}>
          <div className="a-head" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Photosynthesis</div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: '#d9d6cf' }}>
            {WORDS.map((w, i) => (
              <span key={i} className="w">{(i === 6 || i === 21) ? <b style={{ color: 'var(--text)' }}>{w}</b> : w} </span>
            ))}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {['Show the diagram', 'Quiz me', 'Go deeper'].map((c) => <Chip key={c} tone="gold" className="chip-o">{c}</Chip>)}
        </div>
        <div className="src k-muted" style={{ marginTop: 16, fontSize: 13 }}>
          Sources · <span style={{ color: 'var(--sky)' }}>ncert.nic.in</span> · <span style={{ color: 'var(--sky)' }}>en.wikipedia.org</span> ✓ verified
        </div>
        <span className="done k-chip mono" data-tone="green" style={{ position: 'absolute', right: 16, bottom: 16 }}>done</span>
      </Win>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'One question, one credit',
      caption: 'The learner asks a question; the server checks and deducts one credit before any AI call.',
      say: "Let's follow one question. The learner asks: how does photosynthesis work? Before anything else, the server checks the learner's credits and takes one. If there are not enough, it stops right there.",
      body: <p className="r-p">The server loads the chat (scoped to this user), validates attachments, builds the prompt with the learner profile, and calls <code>checkAndDeductCredit</code>. No credit → <code>402</code>.</p>,
    },
    {
      title: 'Words arrive live',
      caption: 'The answer streams word by word over Server-Sent Events, with a heartbeat every 10 seconds.',
      say: "Then a pipe opens. The answer arrives word by word, already formatted, with headings and bold words. Every 10 seconds a small heartbeat keeps the connection alive, even through proxies.",
      body: <p className="r-p">The model streams with the last <b>12 messages</b> as history. Each chunk becomes a <code>token</code> event. A <code>heartbeat</code> every 10 s keeps the connection open; proxy buffering is off.</p>,
    },
    {
      title: 'Extras, then done',
      caption: 'Choices, a drawn visual, verified sources and a title arrive as separate events, then done.',
      say: "When the text ends, the extras arrive as separate events: clickable options, a diagram, checked sources and a title for the chat. Then a done event stops the spinner. And if anything fails along the way, the credit is refunded automatically.",
      body: (
        <>
          <p className="r-p">After the text: <code>choices</code>, <code>visual</code>, <code>sources</code>, <code>images</code>, <code>progress</code>, then <code>title</code> and <code>done</code>.</p>
          <p className="r-note">Any failure → the credit is <b>refunded</b> and a friendly <code>error</code> event is sent.</p>
        </>
      ),
    },
  ],
};
