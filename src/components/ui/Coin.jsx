export default function Coin({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#F59E0B" />
      <circle cx="12" cy="12" r="7.2" fill="none" stroke="#FCD34D" strokeWidth="1.5" />
      <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B45309" fontFamily="Poppins, sans-serif">
        ₱
      </text>
    </svg>
  );
}
