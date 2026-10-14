export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#F59E0B" />
        <path d="M20 8 5 14.5 20 21l15-6.5z" fill="#0F1F4D" />
        <path d="M11 18.5v6c0 2.6 4 5 9 5s9-2.4 9-5v-6L20 22.5z" fill="#1E3A8A" />
        <path d="M33 15v7" stroke="#0F1F4D" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="font-heading text-xl font-bold tracking-tight">
        BSA<span className="text-gold">id</span>
      </span>
    </span>
  );
}
