import { DoorOpen } from 'lucide-react';
import { Board, Card, Chip, focus, pop, spring, useScene, type Tone } from '../scene/kit';
import type { SlideDef } from './registry';

const TIERS: { t: string; s: string; tone: Tone }[] = [
  { t: 'Tier 0 · Risk scan', s: 'free regex: numbers, units, dates, laws, formulas', tone: 'amber' },
  { t: 'Tier 1 · Self-consistency', s: 'one cheap call re-derives each claim', tone: 'sky' },
  { t: 'Tier 2 · Chain-of-Verification', s: 'sub-questions → reconcile (optional)', tone: 'violet' },
  { t: 'Tier 3 · Entailment', s: 'does the cited page say it?', tone: 'green' },
];
const LINKS = [
  { d: 'ncert.nic.in/physics', r: '✓ supports → shown', tone: 'green' as Tone },
  { d: 'old-notes.example/404', r: '✗ dead link → dropped', tone: 'red' as Tone },
  { d: 'cooking-blog.example', r: '✗ off-topic → dropped', tone: 'red' as Tone },
];

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.tier', 0, 0.1);
    pop(tl, q, '.para', 0.4);
    focus(tl, q, '.tier', '.tier-0', 0.8);
    tl.fromTo(q('.beam'), { autoAlpha: 0, x: 0 }, { autoAlpha: 1, x: 700, duration: 1.4, ease: 'sine.inOut' }, 0.9);
    tl.to(q('.beam'), { autoAlpha: 0, duration: 0.2 }, 2.3);
    tl.to(q('.plain'), { opacity: 0.35 }, 1.6);
    q('.ph').forEach((el, i) => tl.fromTo(el, { backgroundColor: 'rgba(245,165,36,0)' }, { backgroundColor: 'rgba(245,165,36,0.28)', duration: 0.3 }, 1.2 + i * 0.4));
    next((at) => {
      focus(tl, q, '.tier', '.tier-1', at);
      pop(tl, q, '.t1', at + 0.2, 0.25);
    });
    next((at) => {
      focus(tl, q, '.tier', '.tier-2', at);
      tl.to(q('.ph-2 .old'), { textDecoration: 'line-through', color: '#ef5350', duration: 0.2 }, at + 0.3);
      tl.fromTo(q('.ph-2 .new'), { autoAlpha: 0, width: 0 }, { autoAlpha: 1, width: 'auto', duration: 0.5 }, at + 0.6);
      spring(tl, q, '.fix', at + 0.9);
    });
    next((at) => {
      focus(tl, q, '.tier', '.tier-3', at);
      pop(tl, q, '.door', at);
      q('.lnk').forEach((el, i) => {
        tl.fromTo(el, { autoAlpha: 0, x: 0 }, { autoAlpha: 1, duration: 0.2 }, at + 0.3 + i * 0.4);
        tl.to(el, { x: 330, duration: 0.6 }, at + 0.5 + i * 0.4);
      });
      q('.res').forEach((el, i) => spring(tl, q, [el], at + 1.2 + i * 0.4, 0));
      tl.to(q('.lnk-1, .lnk-2'), { autoAlpha: 0.2, y: 30, duration: 0.5 }, at + 2.4);
    });
  });

  return (
    <Board root={root} step={step}>
      {TIERS.map((t, i) => (
        <Card key={t.t} x={40 + i * 304} y={30} w={286} h={112} tone={t.tone} title={t.t} sub={t.s} className={`tier tier-${i}`} />
      ))}
      <div className="para k-card" data-tone="muted" style={{ left: 40, top: 180, width: 760, fontSize: 19, lineHeight: 1.75, overflow: 'hidden' }}>
        <span className="plain">Suppose Priya drops a ball from a roof. It speeds up because gravity pulls at </span>
        <span className="ph ph-0">9.8 m/s²</span>
        <span className="plain">. Fun fact: India's first war of independence was in </span>
        <span className="ph ph-1">1857</span>
        <span className="plain">. And light travels at about </span>
        <span className="ph ph-2"><span className="old">3 × 10⁶ m/s</span> <span className="new" style={{ display: 'inline-block', color: 'var(--green)', whiteSpace: 'nowrap', overflow: 'hidden', verticalAlign: 'bottom' }}>3 × 10⁸ m/s</span></span>
        <span className="plain">.</span>
        <span className="beam" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: 'var(--amber)', boxShadow: '0 0 24px var(--amber)' }} />
      </div>
      <span className="fix k-chip" data-tone="green" style={{ left: 560, top: 340 }}>corrected</span>

      {[['9.8 m/s²', '✓ agrees', 'green'], ['1857', '✓ agrees', 'green'], ['3 × 10⁶ m/s', '≠ 3 × 10⁸ · disagree', 'amber']].map(([a, b, tone], i) => (
        <div key={a} className="t1 k-card" data-tone={tone} style={{ left: 840, top: 180 + i * 72, width: 400, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="mono">{a}</span>
          <span style={{ color: `var(--${tone})`, fontWeight: 600 }}>{b}</span>
        </div>
      ))}

      {LINKS.map((l, i) => (
        <span key={l.d} className={`lnk lnk-${i} k-chip mono`} data-tone="sky" style={{ left: 40, top: 470 + i * 64, height: 38 }}>{l.d}</span>
      ))}
      <Card x={600} y={450} w={220} h={200} tone="green" icon={DoorOpen} title="Does this page say that?" className="door">
        <div className="k-card-sub">fetch the page · 3.5 s timeout</div>
      </Card>
      {LINKS.map((l, i) => (
        <Chip key={l.d} x={850} y={474 + i * 64} tone={l.tone} className="res">{l.r}</Chip>
      ))}
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Tier 0 · Find the risky claims',
      caption: 'A free regex scan finds high-stakes claims such as precise numbers, units and dates, and skips analogies.',
      say: "Before you see a fact, it is checked. Cheaply for normal text, carefully for risky claims. Tier zero is a free scan. It finds things that are easy to get wrong: numbers with units, dates, laws, formulas. It skips stories like suppose Priya drops a ball.",
      body: <p className="r-p">Units, dates, precise numbers, formulas, law sections, superlatives and attributions are flagged. Hypotheticals like <i>"suppose Priya…"</i> are skipped. At most <b>3 claims</b> per turn go further.</p>,
    },
    {
      title: 'Tier 1 · Re-derive independently',
      caption: 'One batched cheap call re-derives each flagged claim; two agree, one does not.',
      say: "Tier one: one cheap AI call works out each risky claim again, on its own. Here, 9.8 and 1857 agree. But the speed of light does not match. That one is flagged.",
      body: <p className="r-p">One batched call re-derives each claim. MCQ keys are re-solved blind. Agreement → <b>verified</b>. Disagreement → next tier.</p>,
    },
    {
      title: 'Tier 2 · Correct or flag',
      caption: 'Contradicted claims are replaced with the correction; unsettled ones get an uncertainty note.',
      say: "Tier two digs deeper on the disputed claim and fixes it. 3 times 10 to the 6 becomes 3 times 10 to the 8. If it is still unclear, the lesson adds a note saying worth double-checking, instead of bluffing.",
      body: <p className="r-p">Contradicted → <b>replaced with the correction</b>. Unsettled → an explicit "worth double-checking in NCERT" note. Statuses: <code>verified</code>, <code>uncertain</code>, <code>contradicted</code>, <code>unchecked</code>.</p>,
    },
    {
      title: 'Tier 3 · Links must prove it',
      caption: 'Each cited page is fetched and must actually support the taught claim; dead or off-topic links are dropped.',
      say: "Tier three is for links. Every source must be alive, trusted, and must actually say what we taught. A dead link is dropped. An off-topic page is dropped. And if the checker itself breaks, the lesson still continues. A check can never block learning.",
      body: (
        <>
          <p className="r-p">Allowlist (gov.in, NCERT, Wikipedia, journals, official docs) or a live HEAD check, then entailment. Max <b>3 sources</b>, 3.5 s fetch timeout.</p>
          <p className="r-note">Verdicts are <b>cached for 24 h</b> by claim hash, and everything is <b>fail-soft</b>: if a checker fails, the content passes as <code>unchecked</code>.</p>
        </>
      ),
    },
  ],
};
