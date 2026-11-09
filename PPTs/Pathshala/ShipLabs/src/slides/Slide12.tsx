import { FileText, Globe, Lock, Search, Sparkles, Wand2 } from 'lucide-react';
import { Board, Card, Chip, Txt, Win, Wire, Wires, draw, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const FIELDS = [
  ['Level', 'Entrance exam'],
  ['Goal', 'Crack JEE Main'],
  ['Exam', 'JEE'],
  ['Topic', 'Kinematics'],
];
const SOURCES = [
  { icon: FileText, t: '1 · Document attached', s: 'sub-topics from the file, in its order' },
  { icon: Globe, t: '2 · Named exam', s: 'search the CURRENT official syllabus' },
  { icon: Wand2, t: '3 · Planner', s: 'JSON sub-topics, temp 0.2' },
  { icon: Sparkles, t: '4 · Fallback', s: 'core · applications · advanced' },
];
const PAGES = [['jeemain.nta.nic.in', true], ['nta.ac.in', true], ['ncert.nic.in', true], ['random-blog.xyz', false]] as const;
const PATHWAY = ['Motion in a straight line', 'Motion in a plane', 'Projectile motion', 'Relative velocity', 'Circular motion', 'Graphs of motion'];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.chat, .profile', 0, 0.15);
    spring(tl, q, '.lvl', 0.4, 0.08);
    tl.to(q('.lvl-pick'), { backgroundColor: 'rgba(227,179,65,0.35)', scale: 1.06, duration: 0.3 }, 1);
    q('.fv').forEach((el, i) => tl.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'none' }, 1.2 + i * 0.35));
    spring(tl, q, '.lock', 2.7);
    next((at) => {
      pop(tl, q, '.src', at, 0.15);
      draw(tl, q, '.w-src', at + 0.4, 0.15);
    });
    next((at) => {
      tl.to(q('.src'), { opacity: 0.3 }, at);
      tl.to(q('.src-1'), { opacity: 1 }, at);
      pop(tl, q, '.page', at, 0.1, 10);
      tl.fromTo(q('.mag'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: 520, duration: 1.6, ease: 'sine.inOut' }, at + 0.3);
      q('.stamp').forEach((el, i) => spring(tl, q, [el], at + 0.6 + i * 0.35, 0));
      tl.to(q('.page-bad'), { y: 60, autoAlpha: 0.15, rotate: 12, duration: 0.6 }, at + 2.1);
      pop(tl, q, '.pw', at + 1.8, 0.1, 10);
    });
  });

  return (
    <Board root={root} step={step}>
      <Win x={40} y={30} w={560} h={330} title="Tutor · onboarding" className="chat">
        <div style={{ background: '#18181d', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 14px', fontSize: 16, width: 'fit-content' }}>
          Nice to meet you! What's your level?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {['School', 'College', 'Entrance exam', 'Professional'].map((c) => (
            <Chip key={c} tone="gold" className={`lvl ${c === 'Entrance exam' ? 'lvl-pick' : ''}`}>{c}</Chip>
          ))}
        </div>
        <div className="k-muted" style={{ marginTop: 22, fontSize: 14, lineHeight: 1.6 }}>
          One tap per answer. The reply carries a sealed <span className="mono" style={{ color: 'var(--gold)' }}>meraki:profile</span> block.
        </div>
      </Win>

      <Card x={630} y={30} w={320} h={330} tone="gold" title="Learner profile" className="profile">
        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          {FIELDS.map(([k, v]) => (
            <div key={k} className="k-row" style={{ justifyContent: 'space-between' }}>
              <span className="k-muted">{k}</span>
              <span className="fv mono" style={{ color: 'var(--text)' }}>{v} ✓</span>
            </div>
          ))}
        </div>
        <span className="lock k-chip" data-tone="green" style={{ position: 'absolute', left: 16, bottom: 16 }}><Lock size={14} /> established</span>
      </Card>

      {SOURCES.map(({ icon, t, s }, i) => (
        <Card key={t} x={40 + i * 232} y={400} w={212} h={120} tone={i === 1 ? 'gold' : 'muted'} icon={icon} title={t} sub={s} className={`src src-${i}`} />
      ))}
      <Wires>
        {[0, 1, 2].map((i) => <Wire key={i} d={`M ${254 + i * 232} 460 L ${270 + i * 232} 460`} className="w-src" />)}
      </Wires>

      {PAGES.map(([d, ok], i) => (
        <div key={d} className={`page ${ok ? '' : 'page-bad'} k-card`} data-tone={ok ? 'green' : 'red'} style={{ left: 40 + i * 225, top: 560, width: 205, height: 100, fontSize: 13 }}>
          <span className="mono k-muted">{d}</span>
          {[0, 1, 2].map((k) => <div key={k} style={{ height: 5, margin: '9px 0', width: `${85 - k * 15}%`, background: '#2c2c35', borderRadius: 3 }} />)}
          <span className="stamp k-chip" data-tone={ok ? 'green' : 'red'} style={{ position: 'absolute', right: 10, bottom: 10, height: 26 }}>{ok ? '✓ trusted' : '✗ dropped'}</span>
        </div>
      ))}
      <span className="mag" style={{ left: 120, top: 520, color: 'var(--gold)' }}><Search size={64} strokeWidth={1.5} /></span>

      <Txt x={990} y={30} className="k-cap pw">Pathway</Txt>
      {PATHWAY.map((p, i) => (
        <div key={p} className="pw k-card" data-tone={i === 0 ? 'gold' : 'muted'} style={{ left: 990, top: 66 + i * 76, width: 250, height: 62, display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: i === 0 ? 'var(--text)' : 'var(--muted)', borderColor: i === 0 ? 'var(--gold)' : undefined }}>
          <span className="mono" style={{ fontSize: 12, color: i === 0 ? 'var(--gold)' : 'var(--dim)' }}>{i + 1}</span> {p}
        </div>
      ))}
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'A profile in a few taps',
      caption: 'Tutor onboarding asks for level, goal, exam and topic with one-tap chips, then locks the learner profile.',
      say: "Tutor mode starts by getting to know you. It asks only what it needs: your level, your goal, the exam if any, and the topic. You answer with one tap. Then the profile is locked. And if the AI forgets the topic, the server recovers it from your first message, so you never get a generic course.",
      body: (
        <>
          <p className="r-p">Onboarding runs until <code>learnerProfile.established</code> is true. The whole reply is buffered, then cleaned, because it carries the <code>meraki:profile</code> block.</p>
          <p className="r-note">Topic missing? The server <b>recovers it from the learner's first message</b> (12+ characters), so a generic course is never taught.</p>
        </>
      ),
    },
    {
      title: 'Three syllabus sources, in order',
      caption: 'The syllabus comes from the attached document first, then a verified official exam syllabus, then a planner, then a safe fallback.',
      say: "Next, the syllabus. There is a strict order. If you attached a document, the course follows your document. If you named an exam, it searches for the current official syllabus. Otherwise a planner writes the sub-topics. And if even that fails, there is a safe fallback.",
      body: (
        <ul className="r-list">
          <li className="r-li"><b>Document</b>: sub-topics strictly from the file, keeping its order.</li>
          <li className="r-li"><b>Exam</b> (GATE, NEET, JEE, UPSC, CA, CUET…): web-grounded search.</li>
          <li className="r-li"><b>Planner</b>: temperature 0.2, 300 tokens, strict JSON.</li>
          <li className="r-li"><b>Fallback</b>: core principles, applications, advanced problems.</li>
        </ul>
      ),
    },
    {
      title: 'A syllabus you can trust',
      caption: 'Exam syllabi change every year, so the official one is searched and at least one cited source must verify before it is used.',
      say: "Exam syllabi change every year, so we never trust the AI's memory for them. We search the web, and at least one source must be a trusted, reachable page. Bad sources are dropped. The result fills the pathway on the right, with the first topic active.",
      body: (
        <>
          <p className="r-p">At least <b>one cited source</b> must be on a trusted domain or reachable. Then up to <b>12 sub-topics</b> are used, and the sources go to the Resources sidebar.</p>
          <p className="r-note">Cached for <b>6 hours</b> per exam, so repeated onboardings cost one search.</p>
        </>
      ),
    },
  ],
};
