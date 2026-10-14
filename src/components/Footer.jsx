import Logo from './Logo.jsx';
import Icon from './ui/Icon.jsx';
import { navLinks, GDD_URL, ANDROID_DOWNLOAD_URL } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="border-t-4 border-navy-950 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <Logo className="text-cream" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            A simulation-based educational game helping first-year Accountancy students master FAR1 &mdash; one entry
            at a time.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-pixel text-[10px] uppercase tracking-widest text-gold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-gold">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={ANDROID_DOWNLOAD_URL} className="transition hover:text-gold">
                Download
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-pixel text-[10px] uppercase tracking-widest text-gold">Resources</h2>
          <a
            href={GDD_URL}
            download="Game-Design-Document.pdf"
            className="pixel-box-flat px-navy mt-5 flex items-center gap-3 bg-navy-950 p-4 transition-colors hover:bg-navy-800"
          >
            <span className="bg-gold p-2 text-navy-950">
              <Icon name="file" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">Game-Design-Document.pdf</span>
              <span className="block text-xs">Version 1 &middot; PDF</span>
            </span>
            <Icon name="download" className="h-5 w-5 shrink-0 text-gold" />
          </a>
        </div>
      </div>

      <div className="border-t-4 border-navy-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} BSAid. All rights reserved.</p>
          <p>Made by Accountancy students, for Accountancy students.</p>
        </div>
      </div>
    </footer>
  );
}
