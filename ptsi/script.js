/* PTSI — interactions (vanilla JS, no dependencies) */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ------------------------------------------------------------------
     Labelled image placeholders.
     Any <img data-label="..."> whose src fails to load (e.g. the
     /api/placeholder/W/H URLs) is swapped for an SVG showing its label and
     size, so you can see exactly which original photo belongs where.
     Once you set a real src, this does nothing.
     ------------------------------------------------------------------ */
  const placeholderSVG = (img) => {
    const m = (img.getAttribute('src') || '').match(/placeholder\/(\d+)\/(\d+)/);
    const w = m ? +m[1] : img.width || 400;
    const h = m ? +m[2] : img.height || 300;
    const label = img.dataset.label || 'Image';
    const fs = Math.max(10, Math.min(w / (label.length * 0.62), h / 4, 64));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="100%" height="100%" fill="#e6ecf4"/>
      <rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="none" stroke="#9fb3cc" stroke-width="2" stroke-dasharray="8 6" rx="6"/>
      <text x="50%" y="50%" fill="#0a3d7c" font-family="Arial, sans-serif" font-weight="700" font-size="${fs}" text-anchor="middle" dominant-baseline="middle">${label.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
      ${h >= 80 ? `<text x="50%" y="${h / 2 + fs * 0.9}" fill="#5b6574" font-family="Arial, sans-serif" font-size="${Math.max(9, fs * 0.4)}" text-anchor="middle" dominant-baseline="hanging">${w} × ${h}</text>` : ''}
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };
  const swapPlaceholder = (img) => {
    if (img.dataset.phDone) return;
    img.dataset.phDone = '1';
    img.src = placeholderSVG(img);
    img.classList.add('is-placeholder');
  };
  const watchImg = (img) => {
    if (!img.dataset.label) return;
    if (img.complete && img.naturalWidth === 0) swapPlaceholder(img);
    else img.addEventListener('error', () => swapPlaceholder(img), { once: true });
  };
  $$('img[data-label]').forEach(watchImg);

  /* ------------------------------------------------------------------
     Sticky smart header: shrinks + turns translucent after scrolling
     ------------------------------------------------------------------ */
  const header = $('#siteHeader');
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScrollHeader();

  // Mobile nav
  const navToggle = $('#navToggle');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  navToggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  $$('.main-nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));

  // Highlight the nav link of the section in view
  const navLinks = $$('.nav-link:not(.nav-cta)');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => sectionObserver.observe(s));

  /* ------------------------------------------------------------------
     Hero: parallax layers
     ------------------------------------------------------------------ */
  const hero = $('.hero');
  const layers = $$('[data-parallax]');
  let ticking = false;
  const parallax = () => {
    const y = window.scrollY;
    if (y < hero.offsetHeight) {
      layers.forEach((l) => { l.style.transform = `translate3d(0, ${y * parseFloat(l.dataset.parallax)}px, 0)`; });
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    onScrollHeader();
    if (!reduceMotion && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });

  /* ------------------------------------------------------------------
     Hero: typing animation for the tagline
     ------------------------------------------------------------------ */
  const typedEl = $('#typed');
  const tagline = 'Solutions that Transform';
  if (reduceMotion) {
    typedEl.textContent = tagline;
  } else {
    let i = 0;
    const type = () => {
      typedEl.textContent = tagline.slice(0, ++i);
      if (i < tagline.length) setTimeout(type, 55 + Math.random() * 70);
    };
    setTimeout(type, 600);
  }

  /* ------------------------------------------------------------------
     Scroll reveal (fade-in + slide-up)
     ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      // drop the stagger delay once in so hover feels instant
      e.target.addEventListener('transitionend', () => e.target.classList.add('settled'), { once: true });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     Animated counters (e.g. 0 → 32 years)
     ------------------------------------------------------------------ */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start = parseInt(el.dataset.start || '0', 10);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1800;
    const t0 = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      el.textContent = Math.round(start + (target - start) * easeOut(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      animateCounter(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('.counter').forEach((el) => counterObserver.observe(el));

  /* ------------------------------------------------------------------
     Infinite marquee: fill the track to at least the viewport width,
     then clone it once so translateX(-100%) loops seamlessly.
     ------------------------------------------------------------------ */
  $$('.marquee').forEach((marquee) => {
    const track = $('.marquee-track', marquee);
    const originals = Array.from(track.children);
    while (track.scrollWidth < window.innerWidth * 1.1 && originals.length) {
      originals.forEach((li) => {
        const c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        track.appendChild(c);
      });
    }
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marquee.appendChild(clone);
    const pxPerSec = parseFloat(marquee.dataset.speed) || 40;
    const setDuration = () => {
      const dur = `${track.scrollWidth / pxPerSec}s`;
      [track, clone].forEach((t) => t.style.setProperty('--duration', dur));
    };
    setDuration();
    $$('img[data-label]', clone).forEach((img) => { delete img.dataset.phDone; watchImg(img); });
    window.addEventListener('load', setDuration);
  });

  /* ------------------------------------------------------------------
     Client reviews slider (auto-advances, swipe, dots)
     ------------------------------------------------------------------ */
  const slider = $('#reviewSlider');
  if (slider) {
    const track = $('.review-track', slider);
    const slides = Array.from(track.children);
    const dotsWrap = $('.review-dots', slider);
    let index = 0;
    let timer;

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Review ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });
    const go = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, j) => d.setAttribute('aria-selected', String(j === index)));
      slides.forEach((s, j) => s.setAttribute('aria-hidden', String(j !== index)));
    };
    const restart = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => go(index + 1), 6000);
    };
    $$('.review-btn', slider).forEach((b) => b.addEventListener('click', () => { go(index + +b.dataset.dir); restart(); }));
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);

    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
      restart();
    });

    go(0);
    restart();
  }

  /* ------------------------------------------------------------------
     Floating quick-contact button
     ------------------------------------------------------------------ */
  const fab = $('#fab');
  const fabToggle = $('#fabToggle');
  const fabMenu = $('#fabMenu');
  const setFab = (open) => {
    fab.classList.toggle('is-open', open);
    fabToggle.setAttribute('aria-expanded', String(open));
    fabToggle.setAttribute('aria-label', open ? 'Close quick contact' : 'Open quick contact');
    fabMenu.setAttribute('aria-hidden', String(!open));
    $$('a', fabMenu).forEach((a) => a.tabIndex = open ? 0 : -1);
  };
  fabToggle.addEventListener('click', (e) => { e.stopPropagation(); setFab(!fab.classList.contains('is-open')); });
  $$('a', fabMenu).forEach((a) => a.addEventListener('click', () => setFab(false)));
  document.addEventListener('click', (e) => { if (!fab.contains(e.target)) setFab(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (fab.classList.contains('is-open')) { setFab(false); fabToggle.focus(); }
    setNav(false);
  });

  /* ------------------------------------------------------------------
     Product category tabs (click, arrow keys)
     ------------------------------------------------------------------ */
  const tabs = $$('.tab-list [role="tab"]');
  const selectTab = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
    });
  });

  /* ------------------------------------------------------------------
     Inquiry form: validate, then open the visitor's email app with the
     inquiry addressed to sales@ptsiphil.com (no backend needed)
     ------------------------------------------------------------------ */
  const form = $('#inquiryForm');
  if (form) {
    const note = $('#formNote');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('input, textarea', form).forEach((f) => {
        const bad = !f.checkValidity() || (f.required && !f.value.trim());
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        note.textContent = 'Please complete the highlighted fields.';
        note.classList.add('error');
        $('.invalid', form).focus();
        return;
      }
      const v = Object.fromEntries(new FormData(form));
      const body = [
        `Company Name: ${v.company}`,
        `Name: ${v.first} ${v.last}`,
        `Job Title: ${v.title || '-'}`,
        `Phone Number: ${v.phone || '-'}`,
        `Email: ${v.email}`,
        '',
        v.message,
      ].join('\n');
      const subject = `Website inquiry from ${v.company}`;
      window.location.href = `mailto:sales@ptsiphil.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      note.classList.remove('error');
      note.textContent = 'Thank you! Your email app should open with your inquiry ready to send.';
    });
    form.addEventListener('input', (e) => e.target.classList.remove('invalid'));
  }

  $('#year').textContent = new Date().getFullYear();
})();
