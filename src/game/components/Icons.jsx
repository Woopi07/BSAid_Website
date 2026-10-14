const paths = {
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12.5h18M10.5 12.5v1.5h3v-1.5" />
    </>
  ),
  home: <path d="M4 11 12 4l8 7M6 9.5V20h4.5v-5.5h3V20H18V9.5" />,
  chart: <path d="M4 20h16M6.5 16.5v-4M10.5 16.5V8M14.5 16.5v-6M18.5 16.5V5.5" />,
  book: (
    <>
      <path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15H6.5A2 2 0 0 1 4.5 18V5A1.5 1.5 0 0 1 6 3.5z" />
      <path d="M4.5 18a2 2 0 0 1 2-2h12" />
    </>
  ),
  gear: (
    <>
      <path d="M10.3 3.5h3.4l.5 2.4 1.7.9 2.3-.9 1.7 2.9-1.8 1.6v2l1.8 1.6-1.7 2.9-2.3-.9-1.7.9-.5 2.4h-3.4l-.5-2.4-1.7-.9-2.3.9-1.7-2.9 1.8-1.6v-2L3.9 8.8l1.7-2.9 2.3.9 1.7-.9z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  hourglass: <path d="M7 3.5h10M7 20.5h10M8 3.5c0 4 3.5 5.5 4 8.5.5-3 4-4.5 4-8.5M8 20.5c0-4 3.5-5.5 4-8.5.5 3 4 4.5 4 8.5" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
    </>
  ),
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1.5A3 3 0 0 0 8 10.5M16 6h3v1.5a3 3 0 0 1-3 3M12 13v3.5M8.5 20h7M9.5 20l.5-3.5h4l.5 3.5" />,
  volume: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  menu: <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />,
  bulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1v.1h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z" />
    </>
  ),
  refresh: <path d="M19.5 8.5A8 8 0 0 0 5 7.5M4.5 4v4h4M4.5 15.5A8 8 0 0 0 19 16.5M19.5 20v-4h-4" />,
  chevronLeft: <path d="m14.5 6-6 6 6 6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" />,
  doc: (
    <>
      <path d="M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z" />
      <path d="M14 3.5v4h4M9 12h6M9 15.5h4" />
    </>
  ),
  skip: <path d="M6 5.5v13l8-6.5zM17.5 5.5v13" />,
  exit: <path d="M14 4.5h4.5v15H14M10 8l-4 4 4 4M6 12h9.5" />,
  truck: (
    <>
      <path d="M3 6.5h11v9H3zM14 9.5h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </>
  ),
};

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 2, filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
