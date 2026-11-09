import { Flame, Trophy } from 'lucide-react';
import { Board, Card, Chip, Txt, count, pop, spring, useScene } from '../scene/kit';
import type { SlideDef } from './registry';

const RANKS = [
  ['Shishya', 'Apprentice', '1–5'],
  ['Vidhyarthi', 'Learner', '6–15'],
  ['Pandit', 'Scholar', '16–30'],
  ['Acharya', 'Teacher', '31–50'],
  ['Vidwan', 'Sage', '51–75'],
  ['Gyani', 'Wise One', '76–100'],
];
const MEDALS = ['🎯', '🧠', '📚', '🔥', '⭐', '💯', '👑'];

function Jar({ x, label, sub, tone, slot, cls }: { x: number; label: string; sub: string; tone: string; slot?: boolean; cls: string }) {
  return (
    <div className={cls} style={{ left: x, top: 120, width: 230, height: 300 }}>
      <div style={{ position: 'absolute', inset: '30px 0 0', borderRadius: '24px 24px 40px 40px', border: `2px solid ${tone}`, background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
        <div className="fill" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', background: `linear-gradient(0deg, ${tone}66, ${tone}11)` }} />
      </div>
      <div style={{ position: 'absolute', left: 50, right: 50, top: 14, height: 22, borderRadius: 6, border: `2px solid ${tone}`, background: '#141417' }}>
        {slot && <span style={{ position: 'absolute', left: '35%', right: '35%', top: 8, height: 3, background: tone }} />}
      </div>
      <div style={{ position: 'absolute', bottom: -66, width: '100%', textAlign: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: tone }}>{label}</div>
        <div className="k-muted" style={{ fontSize: 13 }}>{sub}</div>
      </div>
    </div>
  );
}

function Scene({ step }: { step: number }) {
  const root = useScene(step, (tl, next, q) => {
    pop(tl, q, '.jar-c, .jar-x', 0, 0.15);
    pop(tl, q, '.lesson', 0.4);
    tl.fromTo(q('.coin'), { autoAlpha: 0, x: 0, y: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.8);
    tl.to(q('.coin'), { x: 530, y: 20, duration: 0.8, ease: 'power2.inOut' }, 1);
    spring(tl, q, '.fail', 1.9);
    tl.to(q('.coin'), { x: 0, y: 0, duration: 0.8, ease: 'power2.inOut' }, 2.2);
    spring(tl, q, '.refund', 2.9);
    next((at) => {
      tl.to(q('.lesson, .fail, .refund'), { autoAlpha: 0.2 }, at);
      q('.drop').forEach((el, i) => tl.fromTo(el, { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 120, duration: 0.5, ease: 'power2.in' }, at + i * 0.15));
      tl.to(q('.drop'), { autoAlpha: 0, duration: 0.2 }, at + 1.1);
      tl.fromTo(q('.jar-x .fill'), { height: '20%' }, { height: '70%', duration: 1 }, at + 0.4);
      pop(tl, q, '.lvl', at + 0.3);
      tl.fromTo(q('.lvl .k-bar i'), { scaleX: 0.2 }, { scaleX: 1, duration: 1.2 }, at + 0.5);
      count(tl, q, '.lvl-n', 4, 6, at + 0.5);
      tl.to(q('.rank-a'), { autoAlpha: 0, y: -16, duration: 0.3 }, at + 1.7);
      tl.fromTo(q('.rank-b'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 1.9);
    });
    next((at) => {
      pop(tl, q, '.ladder', at, 0.08, 10);
      tl.to(q('.ladder-1'), { borderColor: '#e3b341' }, at + 0.6);
      spring(tl, q, '.medal', at + 0.6, 0.08);
      pop(tl, q, '.streak', at + 0.9);
      count(tl, q, '.streak-n', 1, 5, at + 1);
      spring(tl, q, '.consistent', at + 1.9);
    });
  });

  return (
    <Board root={root} step={step}>
      <Jar x={60} label="Credits" sub="spendable · own ShipLabs bucket" tone="#e3b341" slot cls="jar-c" />
      <Jar x={330} label="XP" sub="reputation · never spendable" tone="#4cb6e8" cls="jar-x" />
      <span className="coin" style={{ left: 160, top: 100, width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff1c2, #e3b341 60%, #8a6414)', boxShadow: '0 0 14px #e3b341' }} />
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="drop" style={{ left: 420 + i * 18, top: 90, width: 12, height: 16, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#4cb6e8', boxShadow: '0 0 10px #4cb6e8' }} />
      ))}

      <Card x={660} y={100} w={260} tone="gold" title="One lesson" sub="1 credit per message, lab, review" className="lesson" />
      <Chip x={940} y={120} tone="red" className="fail">generation failed</Chip>
      <Chip x={940} y={170} tone="green" className="refund">↩ credit refunded</Chip>

      <Card x={660} y={260} w={580} tone="sky" className="lvl">
        <div className="k-row" style={{ justifyContent: 'space-between' }}>
          <span>Level <b className="lvl-n mono" style={{ fontSize: 22 }}>4</b></span>
          <span style={{ position: 'relative', width: 160, height: 30 }}>
            <span className="rank-a k-chip" data-tone="muted" style={{ position: 'absolute', right: 0 }}>Shishya</span>
            <span className="rank-b k-chip" data-tone="gold" style={{ position: 'absolute', right: 0 }}>Vidhyarthi ✨</span>
          </span>
        </div>
        <div className="k-bar" data-tone="sky" style={{ marginTop: 12 }}><i /></div>
        <div className="k-muted mono" style={{ marginTop: 8, fontSize: 12 }}>xpForLevel(L) = 50 × L × (L − 1)</div>
      </Card>

      {RANKS.map(([r, m, l], i) => (
        <div key={r} className={`ladder ladder-${i} k-card`} data-tone={i <= 1 ? 'gold' : 'muted'} style={{ left: 660 + (i % 3) * 196, top: 410 + Math.floor(i / 3) * 74, width: 186, height: 64, padding: '8px 12px' }}>
          <div style={{ fontWeight: 700 }}>{r}</div>
          <div className="k-muted" style={{ fontSize: 12 }}>{m} · L{l}</div>
        </div>
      ))}
      <div style={{ left: 60, top: 520, display: 'flex', gap: 8 }}>
        {MEDALS.map((m) => (
          <span key={m} className="medal" style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 22, background: '#1d1d23', border: '1px solid var(--line-2)' }}>{m}</span>
        ))}
      </div>
      <div className="streak k-card" data-tone="amber" style={{ left: 60, top: 590, width: 300, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Flame color="var(--amber)" /> <b className="streak-n mono" style={{ fontSize: 22 }}>1</b> day streak
      </div>
      <Chip x={380} y={604} tone="amber" className="consistent"><Trophy size={14} /> Consistent unlocked</Chip>
      <Txt x={660} y={570} w={580} className="ladder k-muted" style={{ fontSize: 13 }}>Weekly XP powers an opt-in leaderboard. Streak freezes are supported.</Txt>
    </Board>
  );
}

export const slide: SlideDef = {
  Scene,
  steps: [
    {
      title: 'Two currencies, never mixed',
      caption: 'Credits are spent per message or review and refunded on any failure; XP is reputation and can never be spent.',
      say: "There are two currencies, and they never mix. Credits are what you spend: one credit per message, per lab, per review. If anything fails, the credit comes back automatically. XP is your reputation. You earn it, but you can never spend it.",
      body: (
        <>
          <p className="r-p"><b>Free</b>: review quizzes, skipped auto-checks, greetings and clarifying turns in Coach. <b>Refund</b>: automatic on any generation or judge failure.</p>
          <p className="r-note"><b>Economy invariant:</b> the most credits a quiz can award must stay below the cost of generating it, so credits can never be farmed.</p>
        </>
      ),
    },
    {
      title: 'XP, levels and a rank',
      caption: 'Mastery earns XP; the level curve is 50 × L × (L − 1); at level 6 Shishya becomes Vidhyarthi.',
      say: "Mastering topics earns XP. Your level follows a simple curve. Level 2 needs 100 XP, level 5 needs 1000. And at level 6, your rank changes from Shishya, the apprentice, to Vidhyarthi, the learner.",
      body: <p className="r-p">XP: sub-topic pass <b>10</b>, topic complete <b>50</b>, first correct <b>5</b>, perfect bonus <b>15</b>, daily login <b>2</b>, achievement <b>+50</b>.</p>,
    },
    {
      title: 'From Shishya to Gyani',
      caption: 'Six Sanskrit ranks, achievements and daily streaks make progress visible.',
      say: "There are six ranks, from Shishya to Gyani, the wise one. Plus achievements like Curious Mind and Perfect Score, and daily streaks. Five days in a row unlocks Consistent. Progress you can actually see.",
      body: <p className="r-p">Achievements: First Step, Curious Mind, Scholar, Consistent, Dedicated, Committed, Unstoppable, Perfect Score, Exam Ready, Bright Start, Subject Topper.</p>,
    },
  ],
};
