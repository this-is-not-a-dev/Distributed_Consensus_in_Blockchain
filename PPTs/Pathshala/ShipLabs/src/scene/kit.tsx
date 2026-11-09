import { useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import type { LucideIcon } from 'lucide-react';
import { useStepTimeline } from '../engine/useStepTimeline';

gsap.registerPlugin(MotionPathPlugin);

// The scene kit: every slide is drawn on a fixed 1280×720 artboard with these few shapes,
// so one concept keeps one shape across the whole deck (card = component, orb = AI model,
// cylinder = database, window = browser / VS Code, pill = data packet).

export type Tone = 'gold' | 'sky' | 'violet' | 'green' | 'amber' | 'red' | 'muted' | 'code';
type Q = (sel: string) => Element[];
type Build = (tl: gsap.core.Timeline, next: (fn: (at: number) => void) => void, q: Q) => void;

/**
 * Binds a scene's GSAP timeline to the current step. Elements are found by class inside the
 * scene root, so scenes stay plain markup plus one build function.
 */
export function useScene(step: number, build: Build, deps: unknown[] = []) {
  const root = useRef<HTMLDivElement>(null);
  useStepTimeline(step, (tl, next) => build(tl, next, gsap.utils.selector(root) as Q), deps);
  return root;
}

/** Scene root. `data-step` lets CSS run looping ambient motion for specific steps only. */
export function Board({ root, step, children, className = '' }: { root: Ref<HTMLDivElement>; step: number; children: ReactNode; className?: string }) {
  return (
    <div ref={root} className={`k-board ${className}`} data-step={step}>
      {children}
    </div>
  );
}

// ── Timeline helpers. Every reveal is a fromTo, so the hidden start state is applied at
// build time and stepping Back restores it exactly. ──

const T = (q: Q, t: string | Element[]) => (typeof t === 'string' ? q(t) : t);

/** Fade + lift in. */
export function pop(tl: gsap.core.Timeline, q: Q, t: string | Element[], at: number, stagger = 0.08, y = 18) {
  const els = T(q, t);
  if (els.length) tl.fromTo(els, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, stagger }, at);
}

/** Scale in with a little spring: chips, badges, stamps. */
export function spring(tl: gsap.core.Timeline, q: Q, t: string | Element[], at: number, stagger = 0.08) {
  const els = T(q, t);
  if (els.length) tl.fromTo(els, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, stagger, ease: 'back.out(2.2)' }, at);
}

/** Draw SVG strokes (paths need pathLength="1"). */
export function draw(tl: gsap.core.Timeline, q: Q, t: string | Element[], at: number, stagger = 0.1) {
  const els = T(q, t);
  if (els.length) tl.fromTo(els, { strokeDashoffset: 1, autoAlpha: 0 }, { strokeDashoffset: 0, autoAlpha: 1, stagger, ease: 'power2.inOut' }, at);
}

/** Dim everything in `all` except `keep`. */
export function focus(tl: gsap.core.Timeline, q: Q, all: string, keep: string | null, at: number, dim = 0.28) {
  const keepEls = keep ? new Set(q(keep)) : null;
  q(all).forEach((el) => tl.to(el, { opacity: !keepEls || keepEls.has(el) ? 1 : dim }, at));
}

/** Move an SVG element along an SVG path (both inside the same <svg>). */
export function travel(tl: gsap.core.Timeline, q: Q, el: string, path: string, at: number, duration = 0.8, fadeOut = false) {
  const [e] = q(el);
  const [p] = q(path);
  if (!e || !p) return;
  tl.fromTo(
    e,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration,
      ease: 'sine.inOut',
      motionPath: { path: p as SVGPathElement, align: p as SVGPathElement, alignOrigin: [0.5, 0.5], start: 0, end: 1 },
      immediateRender: true,
    },
    at,
  );
  if (fadeOut) tl.to(e, { autoAlpha: 0, duration: 0.25 }, at + duration);
}

/** Count a number up inside an element. Chained counts on one element pass `first = false`. */
export function count(tl: gsap.core.Timeline, q: Q, el: string, from: number, to: number, at: number, suffix = '', first = true) {
  const [e] = q(el);
  if (!e) return;
  const o = { v: from };
  tl.fromTo(o, { v: from }, { v: to, ease: 'power1.out', immediateRender: first, onUpdate: () => void (e.textContent = `${Math.round(o.v)}${suffix}`) }, at);
}

// ── Shapes ──

export const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({ left: x, top: y, width: w, height: h });

/** A component / concept card. */
export function Card({
  x, y, w = 220, h, tone = 'muted', icon: Icon, title, sub, className = '', children, style,
}: {
  x: number; y: number; w?: number; h?: number; tone?: Tone; icon?: LucideIcon; title?: ReactNode; sub?: ReactNode;
  className?: string; children?: ReactNode; style?: CSSProperties;
}) {
  return (
    <div className={`k-card ${className}`} data-tone={tone} style={{ ...box(x, y, w, h), ...style }}>
      {(Icon || title) && (
        <div className="k-card-head">
          {Icon && <span className="k-ico"><Icon size={18} strokeWidth={1.8} /></span>}
          {title && <span className="k-card-title">{title}</span>}
        </div>
      )}
      {sub && <div className="k-card-sub">{sub}</div>}
      {children}
    </div>
  );
}

/** Free text placed on the board. */
export function Txt({ x, y, w, className = '', children, style }: { x: number; y: number; w?: number; className?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className={`k-txt ${className}`} style={{ ...box(x, y, w), ...style }}>
      {children}
    </div>
  );
}

/** Small rounded label: chips, tags, packets in HTML. */
export function Chip({ x, y, tone = 'muted', className = '', children, style }: { x?: number; y?: number; tone?: Tone; className?: string; children: ReactNode; style?: CSSProperties }) {
  const placed = x !== undefined && y !== undefined;
  return (
    <span className={`k-chip ${placed ? 'k-abs' : ''} ${className}`} data-tone={tone} style={{ ...(placed ? box(x, y) : {}), ...style }}>
      {children}
    </span>
  );
}

/** The AI model: a breathing gold orb. */
export function Orb({ x, y, r = 46, tone = 'gold', label, className = '' }: { x: number; y: number; r?: number; tone?: Tone; label?: ReactNode; className?: string }) {
  return (
    <div className={`k-orb ${className}`} data-tone={tone} style={{ left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
      <span className="k-orb-core" />
      {label && <span className="k-orb-label">{label}</span>}
    </div>
  );
}

/** Database cylinder. */
export function Cyl({ x, y, w = 150, h = 120, label, sub, className = '' }: { x: number; y: number; w?: number; h?: number; label: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={`k-cyl ${className}`} style={box(x, y, w, h)}>
      <span className="k-cyl-fill" />
      <span className="k-cyl-label">{label}</span>
      {sub && <span className="k-cyl-sub">{sub}</span>}
    </div>
  );
}

/** Browser or VS Code window frame. */
export function Win({
  x, y, w, h, kind = 'browser', title, className = '', children,
}: { x: number; y: number; w: number; h: number; kind?: 'browser' | 'vscode' | 'terminal'; title?: ReactNode; className?: string; children?: ReactNode }) {
  return (
    <div className={`k-win ${className}`} data-kind={kind} style={box(x, y, w, h)}>
      <div className="k-win-bar">
        <i /><i /><i />
        {title && <span className="k-win-title">{title}</span>}
      </div>
      <div className="k-win-body">
        {kind === 'vscode' && <span className="k-win-strip" />}
        <div className="k-win-content">{children}</div>
      </div>
    </div>
  );
}

/** Code lines; `l` adds a class per line so scenes can target them (".ln-3"). */
export function Code({ lines, className = '', start = 1 }: { lines: (string | { t: string; c?: string })[]; className?: string; start?: number }) {
  return (
    <pre className={`k-code ${className}`}>
      {lines.map((ln, i) => {
        const { t, c = '' } = typeof ln === 'string' ? { t: ln } : ln;
        return (
          <div key={i} className={`k-ln ln-${i + start} ${c}`}>
            <span className="k-ln-no">{i + start}</span>
            <span className="k-ln-t">{t || ' '}</span>
          </div>
        );
      })}
    </pre>
  );
}

/** Progress ring (0–100); `.k-ring-arc` is the animatable stroke (pathLength 100). */
export function Ring({ x, y, r = 60, tone = 'gold', className = '', children, ticks = [] }: { x: number; y: number; r?: number; tone?: Tone; className?: string; children?: ReactNode; ticks?: number[] }) {
  const s = r * 2 + 16;
  return (
    <div className={`k-ring ${className}`} data-tone={tone} style={{ left: x - s / 2, top: y - s / 2, width: s, height: s }}>
      <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s}>
        <circle cx={s / 2} cy={s / 2} r={r} className="k-ring-track" />
        <circle cx={s / 2} cy={s / 2} r={r} className="k-ring-arc" pathLength={100} transform={`rotate(-90 ${s / 2} ${s / 2})`} />
        {ticks.map((t) => {
          const a = (t / 100) * Math.PI * 2 - Math.PI / 2;
          return <line key={t} className="k-ring-tick" x1={s / 2 + Math.cos(a) * (r - 9)} y1={s / 2 + Math.sin(a) * (r - 9)} x2={s / 2 + Math.cos(a) * (r + 9)} y2={s / 2 + Math.sin(a) * (r + 9)} />;
        })}
      </svg>
      <div className="k-ring-inner">{children}</div>
    </div>
  );
}

/** Full-board SVG layer for wires and travelling packets. */
export function Wires({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg className={`k-wires ${className}`} viewBox="0 0 1280 720" aria-hidden>
      <defs>
        {(['gold', 'sky', 'violet', 'green', 'amber', 'red', 'muted', 'code'] as Tone[]).map((t) => (
          <marker key={t} id={`arrow-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="k-arrowhead" data-tone={t} />
          </marker>
        ))}
      </defs>
      {children}
    </svg>
  );
}

/** One wire. `arrow` puts a head on the end. */
export function Wire({ d, tone = 'muted', className = '', arrow = true, dashed = false }: { d: string; tone?: Tone; className?: string; arrow?: boolean; dashed?: boolean }) {
  return (
    <path
      d={d}
      pathLength={1}
      className={`k-wire ${dashed ? 'k-dashed' : ''} ${className}`}
      data-tone={tone}
      markerEnd={arrow ? `url(#arrow-${tone})` : undefined}
    />
  );
}

/** A data packet that travels along a wire (SVG, centred on its origin). */
export function Packet({ label, tone = 'gold', className = '', w }: { label: string; tone?: Tone; className?: string; w?: number }) {
  const width = w ?? Math.max(44, label.length * 8.6 + 22);
  return (
    <g className={`k-packet ${className}`} data-tone={tone}>
      <rect x={-width / 2} y={-13} width={width} height={26} rx={13} />
      <text x={0} y={1} dominantBaseline="middle" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
