import Logo from './Logo.jsx';
import { navLinks } from '../data/content.js';

export default function Footer() {
  return (
    <footer className="border-t-4 border-navy-950 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
        <div>
          <Logo className="text-cream" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            A digital learning platform helping first-year Accountancy students master FAR1 &mdash; one entry at a
            time.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-pixel text-[13px] uppercase tracking-widest text-gold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition hover:text-gold">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
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
