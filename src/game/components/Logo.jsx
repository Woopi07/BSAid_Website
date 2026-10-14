export default function Logo({ className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center font-display leading-[0.85] tracking-wide text-ep-amber ${className}`}
      style={{ textShadow: '0 2px 0 #7C2D12, 2px 0 0 #1E3A8A, -2px 0 0 #1E3A8A, 0 -2px 0 #1E3A8A, 0 4px 0 #1E3A8A' }}
      aria-label="Entry Point"
      role="img"
    >
      <span className="text-[17px] text-white">ENTRY</span>
      <span className="text-[19px]">POINT</span>
    </span>
  );
}
