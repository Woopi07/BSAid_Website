import { useEffect, useState } from 'react';
import Icon from './ui/Icon.jsx';
import Logo from './Logo.jsx';
import { navLinks, ANDROID_DOWNLOAD_URL } from '../data/content.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-navy-900/95 shadow-lg backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <a href="#top" className="text-white" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-navy-100 transition hover:text-gold">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ANDROID_DOWNLOAD_URL}
          className="hidden rounded-lg bg-gold px-4 py-2 font-heading text-sm font-semibold text-navy-900 transition hover:bg-gold-300 md:inline-flex"
        >
          Download
        </a>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 px-4 pb-6 md:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 font-medium text-navy-100 hover:bg-white/5 hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={ANDROID_DOWNLOAD_URL}
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gold py-3 font-heading font-semibold text-navy-900"
          >
            <Icon name="android" className="h-5 w-5" /> Download for Android
          </a>
        </div>
      )}
    </header>
  );
}
