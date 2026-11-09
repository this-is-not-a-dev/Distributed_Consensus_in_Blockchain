/** ShipLabs mark: a sail over a hull, the "ship" in ShipLabs. */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 32 32" aria-label="ShipLabs">
      <rect width="32" height="32" rx="8" fill="#17171b" stroke="#2a2a31" />
      <path d="M16.5 6v14h-9z" fill="#e3b341" />
      <path d="M18 9.5 25 20h-7z" fill="#e3b341" opacity=".55" />
      <path d="M6 22.5h20l-2.6 3.5H8.6z" fill="#ece9e2" />
    </svg>
  );
}
