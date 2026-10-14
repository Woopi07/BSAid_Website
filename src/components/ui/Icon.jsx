// Lightweight inline icon set (24x24, stroke-based) so the site has no icon dependency.
const paths = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  android: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
      <path d="M8 4l1.5 2.5M16 4l-1.5 2.5M3.5 11v5M20.5 11v5M9 18v2.5M15 18v2.5" />
      <circle cx="9.5" cy="9.5" r=".6" fill="currentColor" />
      <circle cx="14.5" cy="9.5" r=".6" fill="currentColor" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" />,
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  arrow: <path d="M5 12h14m0 0-5-5m5 5-5 5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M7 7l10 10M17 7 7 17" />,
  hint: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  campus: (
    <>
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v9h14v-9M9 19v-5h6v5M3 19h18" />
    </>
  ),
  classroom: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M7 20h10M12 16v4M7 9h6M7 12h4" />
    </>
  ),
  library: <path d="M4 19V5M8 19V5M12 19l3-14 4 1-3 13M3 19h18" />,
  student: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M15 14.2c3 0 6 1.6 6 4.8" />
    </>
  ),
  simulation: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M7 12h4M9 10v4M15.5 11h.01M17.5 13h.01" />
    </>
  ),
  analyze: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5M8.5 11h5M11 8.5v5" />
    </>
  ),
  journal: (
    <>
      <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6z" />
      <path d="M6 3v18M10 8h5M10 12h5M10 16h3" />
    </>
  ),
  taccount: <path d="M4 6h16M12 6v14M6 10h3M15 10h3M6 14h3M15 14h3" />,
  worksheet: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M3 14h18M9 4v16M15 4v16" />
    </>
  ),
  store: (
    <>
      <path d="M4 9h16l-1.5-4h-13z" />
      <path d="M5 9v10h14V9M9 19v-5h6v5M4 9c0 1.7 1.3 2.5 2.7 2.5S9.3 10.7 9.3 9c0 1.7 1.3 2.5 2.7 2.5s2.7-.8 2.7-2.5c0 1.7 1.3 2.5 2.7 2.5S20 10.7 20 9" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3" />
    </>
  ),
  gem: <path d="M6 4h12l3 5-9 11L3 9zM3 9h18M9 4l3 16M15 4l-3 16" />,
  cart: (
    <>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.8" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  tutorial: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.5 5.5 3.5-5.5 3.5z" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </>
  ),
  review: (
    <>
      <path d="M9 11.5 11 13.5l4-4.5" />
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" />
    </>
  ),
  tips: (
    <>
      <rect x="4" y="6" width="13" height="14" rx="1.5" />
      <path d="M8 3h11a1 1 0 0 1 1 1v12M8 11h5M8 15h3" />
    </>
  ),
  book: (
    <>
      <path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5z" />
      <path d="M12 6v14" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="8" r="2" />
      <path d="M6 7v10M18 10c0 4-6 3-11.2 7.4" />
    </>
  ),
};

export default function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.75 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
