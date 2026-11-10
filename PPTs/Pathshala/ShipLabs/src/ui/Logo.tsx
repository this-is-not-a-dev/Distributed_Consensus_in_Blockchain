import logoUrl from '../assets/shiplabs-logo.webp';
import markUrl from '../assets/shiplabs-mark.webp';

/** ShipLabs brand: the gold terminal-hex mark, alone or with the wordmark. Transparent, keyed off black. */
export function Logo({ mark = false, height = 30, className = '' }: { mark?: boolean; height?: number; className?: string }) {
  return (
    <img
      className={`logo ${className}`}
      src={mark ? markUrl : logoUrl}
      height={height}
      alt="ShipLabs"
      draggable={false}
    />
  );
}
