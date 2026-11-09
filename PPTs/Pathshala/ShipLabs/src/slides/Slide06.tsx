import { FileText } from 'lucide-react';
import { Board, Card, Chip, Code, Orb, Wire, Wires, draw, focus, pop, spring, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

const P: { name: string; who: string; uses: string; tone: Tone; x: number; y: number; ask: string }[] = [
  { name: 'Riya', who: 'Class 9 · CBSE · Hindi medium', uses: 'Chat + Tutor', tone: 'sky', x: 40, y: 30, ask: '“Explain photosynthesis with a diagram”' },
  { name: 'Arjun', who: 'JEE aspirant', uses: 'Tutor with exam syllabus', tone: 'gold', x: 690, y: 30, ask: '“Prepare me for JEE Main kinematics”' },
  { name: 'Meera', who: 'B.Com student', uses: 'Tutor + Documents', tone: 'green', x: 40, y: 380, ask: 'Uploads her accounting notes PDF' },
  { name: 'Kabir', who: 'Self-taught developer', uses: 'Coach + ShipLabs', tone: 'violet', x: 690, y: 380, ask: '“Build a REST API in Go”' },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    spring(tl, q, '.k-orb', 0);
    pop(tl, q, '.q', 0.2, 0.1);
    draw(tl, q, '.link', 0.4, 0.05);
    const light = (i: number, at: number) => focus(tl, q, '.q', `.q-${i}`, at, 0.3);
    light(0, 0.6);
    draw(tl, q, '.flow', 0.9, 0.25);
    pop(tl, q, '.fnode', 0.8, 0.2);
    next((at) => {
      light(1, at);
      pop(tl, q, '.syl', at + 0.2, 0.15, 10);
    });
    next((at) => {
      light(2, at);
      tl.fromTo(q('.scan'), { top: 0, autoAlpha: 1 }, { top: 96, duration: 1.2, ease: 'none' }, at + 0.2);
      tl.to(q('.scan'), { autoAlpha: 0, duration: 0.2 }, at + 1.4);
      spring(tl, q, '.ready', at + 1.4);
    });
    next((at) => {
      light(3, at);
      tl.fromTo(q('.q-3 .sl'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0 }, at + 0.3);
    });
  });

  return (
    <Board root={root} step={step}>
      <Wires>
        {P.map((p, i) => (
          <Wire key={i} d={`M 640 360 L ${p.x < 600 ? 600 : 690} ${p.y < 300 ? 300 : 400}`} arrow={false} tone={p.tone} className="link" dashed />
        ))}
      </Wires>
      {P.map((p, i) => (
        <Card key={p.name} x={p.x} y={p.y} w={550} h={310} tone={p.tone} title={p.name} className={`q q-${i}`}>
          <div style={{ position: 'absolute', right: 16, top: 16 }}><Chip tone={p.tone}>{p.uses}</Chip></div>
          <div className="k-card-sub" style={{ marginTop: 2 }}>{p.who}</div>
          <div style={{ marginTop: 10, fontSize: 16, fontStyle: 'italic' }}>{p.ask}</div>
          <div style={{ position: 'absolute', left: 16, right: 16, top: 130, bottom: 16 }}>
            {i === 0 && (
              <>
                {['Sunlight', 'Chlorophyll', 'Glucose + O₂'].map((t, k) => (
                  <span key={t} className="fnode k-chip" data-tone="sky" style={{ position: 'absolute', left: k * 175, top: 50 }}>{t}</span>
                ))}
                <svg width="520" height="160" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  <path className="k-wire flow" data-tone="sky" pathLength={1} d="M 110 66 L 168 66" markerEnd="url(#arrow-sky)" />
                  <path className="k-wire flow" data-tone="sky" pathLength={1} d="M 296 66 L 345 66" markerEnd="url(#arrow-sky)" />
                </svg>
              </>
            )}
            {i === 1 &&
              ['1  Motion in a straight line', '2  Motion in a plane', '3  Projectile motion', '4  Relative velocity'].map((t, k) => (
                <div key={t} className="syl k-row" style={{ position: 'absolute', top: k * 36, fontSize: 15, color: k === 0 ? 'var(--gold)' : 'var(--muted)' }}>
                  <span className="k-dot" data-tone={k === 0 ? 'gold' : 'muted'} /> {t}
                </div>
              ))}
            {i === 2 && (
              <div style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 130, borderRadius: 10, border: '1px solid var(--line-2)', background: '#1c1c22', overflow: 'hidden', padding: 12 }}>
                <div className="k-row" style={{ fontSize: 14 }}><FileText size={18} color="var(--green)" /> accounts_notes.pdf</div>
                {[0, 1, 2, 3].map((k) => <div key={k} style={{ height: 6, margin: '10px 0', width: `${90 - k * 12}%`, background: '#2c2c35', borderRadius: 3 }} />)}
                <span className="scan" style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'var(--green)', boxShadow: '0 0 16px var(--green)' }} />
                <span className="ready k-chip" data-tone="green" style={{ position: 'absolute', right: 8, bottom: 8, height: 26 }}>Ready</span>
              </div>
            )}
            {i === 3 && (
              <Code
                lines={[
                  { t: '// ShipLabs: return 400 when title is empty', c: 'sl cm' },
                  { t: 'func validateTask(t Task) error {' },
                  { t: '    return nil' },
                  { t: '}' },
                ]}
              />
            )}
          </div>
        </Card>
      ))}
      <Orb x={640} y={360} r={34} />
    </Board>
  );
}

const S = (title: string, caption: string, say: string, body: string) => ({
  title,
  caption,
  say,
  body: <p className="r-p">{body}</p>,
});

export const slide: SlideDef = {
  Scene,
  steps: [
    S('Riya · Class 9, CBSE', 'Riya, Class 9 CBSE, asks in Hindi and gets a drawn diagram.', "Let me show four learners. Riya is in Class 9, CBSE, Hindi medium. She asks: explain photosynthesis with a diagram. ShipLabs draws the diagram for her, in code, at her level.", 'Chat + Tutor in Hindi. Diagrams are drawn in code, at school level, with everyday Indian examples.'),
    S('Arjun · JEE aspirant', 'Arjun prepares for JEE Main with the current official syllabus.', "Arjun is preparing for JEE Main. ShipLabs searches for the current official syllabus, checks the sources, and builds his course from it. Not from old memory.", 'Tutor with a verified exam syllabus: speed tricks, typical traps and JEE-level problems.'),
    S('Meera · B.Com', 'Meera uploads her accounting notes and gets a course built from them.', "Meera studies commerce. She uploads her own notes as a PDF. ShipLabs reads every page, even scanned ones, and turns her notes into a course.", 'Tutor + Documents: the syllabus follows her PDF, page by page. Commerce mode uses double-entry, GST and INR examples.'),
    {
      title: 'Kabir · developer',
      caption: 'Kabir builds a REST API in Go with ShipLabs reviewing his code in VS Code.',
      say: "And Kabir is a self-taught developer. He says: build a REST API in Go. He gets a full project, and ShipLabs reviews his code right inside VS Code. One teacher, adapted to the level, the goal and the language of each learner.",
      body: (
        <>
          <p className="r-p">Coach + ShipLabs: a real project, reviewed line by line inside VS Code.</p>
          <table className="r-kv" style={{ marginTop: 10 }}>
            <tbody>
              <tr><td>Levels</td><td>School (Class 1–12, CBSE / ICSE / State), Diploma, UG, PG, PhD</td></tr>
              <tr><td>Languages</td><td>English, Hindi, Punjabi</td></tr>
              <tr><td>CBSE data</td><td>Classes 1–12 chapters and topics, built in</td></tr>
            </tbody>
          </table>
        </>
      ),
    },
  ],
};
