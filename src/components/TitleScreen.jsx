import { useCallback, useEffect, useRef, useState } from 'react';
import PixelSprite from './ui/PixelSprite.jsx';
import TutorialModal from './TutorialModal.jsx';
import QuitScreen from './QuitScreen.jsx';

const MENU = [
  { id: 'play', label: 'Play', hint: 'Open the game online' },
  { id: 'tutorial', label: 'Tutorial', hint: 'Learn the ropes with Faraday' },
  { id: 'quit', label: 'Quit', hint: 'Leave so soon?' },
];

// Decorative pixel sprites scattered around the title, echoing the arcade poster style.
function Scenery() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute left-1/2 top-[38%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wood/30 blur-3xl" />
      <div className="absolute left-1/2 top-[38%] h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
      <div className="pixel-dots absolute inset-0" />
      <div className="absolute inset-x-[-50%] bottom-0 h-[38%] overflow-hidden">
        <div className="grid-floor h-[200%] w-full animate-grid" />
      </div>

      <div className="absolute left-[4%] top-[16%] animate-bob">
        <PixelSprite name="bolt" scale={6} className="h-auto w-12 rotate-[-12deg] sm:w-20" />
      </div>
      <div className="absolute right-[6%] top-[14%] animate-bob [animation-delay:-1.5s]">
        <PixelSprite name="coin" scale={6} className="h-auto w-12 sm:w-20" />
      </div>
      <div className="absolute bottom-[14%] left-[7%] hidden animate-bob [animation-delay:-0.7s] sm:block">
        <PixelSprite name="calculator" scale={6} className="h-auto w-16 rotate-[8deg] lg:w-20" />
      </div>
      <div className="absolute bottom-[18%] right-[8%] hidden animate-twinkle sm:block">
        <PixelSprite name="star" scale={5} />
      </div>
      <div className="absolute left-[22%] top-[9%] hidden animate-twinkle [animation-delay:-0.8s] sm:block">
        <PixelSprite name="star" scale={3} />
      </div>
      <div className="absolute right-[24%] top-[30%] hidden animate-twinkle [animation-delay:-0.3s] md:block">
        <PixelSprite name="star" scale={3} />
      </div>
    </div>
  );
}

function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden="true">
      <div className="absolute -left-6 -top-14 animate-drift sm:-left-24">
        <PixelSprite name="cloud" scale={7} className="h-auto w-28 sm:w-40" />
      </div>
      <div className="absolute -left-2 top-4 animate-drift [animation-delay:-2s] sm:-left-40">
        <PixelSprite name="cloud" scale={5} className="h-auto w-20 sm:w-28" />
      </div>
      <div className="absolute -right-6 -top-16 animate-drift [animation-delay:-3s] sm:-right-24">
        <PixelSprite name="cloud" scale={7} className="h-auto w-28 -scale-x-100 sm:w-40" />
      </div>
      <div className="absolute -right-2 top-6 animate-drift [animation-delay:-1s] sm:-right-36">
        <PixelSprite name="cloud" scale={5} className="h-auto w-20 -scale-x-100 sm:w-28" />
      </div>
    </div>
  );
}

export default function TitleScreen() {
  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(null); // 'tutorial' | 'quit' | null
  const sectionRef = useRef(null);
  const buttonsRef = useRef([]);

  // PLAY opens the online game.
  const play = useCallback(() => {
    setModal(null);
    window.location.href = '/play/';
  }, []);

  const choose = useCallback(
    (id) => {
      if (id === 'play') play();
      else setModal(id);
    },
    [play]
  );

  const closeModal = useCallback(() => setModal(null), []);

  // Arcade controls: arrow keys / W-S move the cursor, Enter confirms — only while the title screen is on screen.
  useEffect(() => {
    if (modal) return undefined;
    const onKey = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < window.innerHeight * 0.5) return;
      const target = e.target;
      const inMenu = buttonsRef.current.includes(target);
      if (target !== document.body && !inMenu) return;

      const key = e.key.toLowerCase();
      if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        setSelected((i) => {
          const next = (i + 1) % MENU.length;
          if (inMenu) buttonsRef.current[next]?.focus();
          return next;
        });
      } else if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        setSelected((i) => {
          const next = (i - 1 + MENU.length) % MENU.length;
          if (inMenu) buttonsRef.current[next]?.focus();
          return next;
        });
      } else if (key === 'enter' && !inMenu) {
        e.preventDefault();
        choose(MENU[selected].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, selected, choose]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="scanlines relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-navy-950 px-4 pb-12 pt-24 text-center"
    >
      <Scenery />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="relative w-full">
          <Clouds />
          <p
            className="pixel-title relative font-heading text-[clamp(5rem,22vw,11rem)] font-bold leading-none tracking-tight"
            data-text="BSAid"
            role="img"
            aria-label="BSAid"
          >
            BSAid
          </p>
          <div className="absolute -right-1 top-0 hidden animate-nudge sm:block md:right-10" aria-hidden="true">
            <PixelSprite name="cursor" scale={5} className="rotate-[-8deg]" />
          </div>
        </div>

        <div className="mt-6 flex gap-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <PixelSprite key={i} name="star" scale={4} className={`animate-twinkle ${['', '[animation-delay:-0.5s]', '[animation-delay:-1s]'][i]}`} />
          ))}
        </div>

        <h1 className="mt-6 max-w-2xl font-pixel text-[14px] uppercase leading-[2] text-cream pixel-text-shadow sm:text-base sm:leading-[2]">
          Every transaction tells a story. <span className="text-gold">Will you make the right entry?</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
          Master Financial Accounting and Reporting 1 through interactive visual novel gameplay &mdash; one case
          file, one journal entry at a time.
        </p>

        {/* Main menu */}
        <nav aria-label="Title menu" className="pixel-box px-dark mt-8 w-full max-w-xs bg-navy-900/90 px-3 py-4 backdrop-blur">
          <ul className="flex flex-col gap-1">
            {MENU.map((item, i) => {
              const active = i === selected;
              return (
                <li key={item.id}>
                  <button
                    ref={(el) => (buttonsRef.current[i] = el)}
                    type="button"
                    onClick={() => choose(item.id)}
                    onMouseEnter={() => setSelected(i)}
                    onFocus={() => setSelected(i)}
                    aria-describedby={`menu-hint-${item.id}`}
                    className={`group relative flex w-full items-center justify-center gap-3 px-4 py-2.5 font-pixel text-base uppercase tracking-widest transition-colors sm:text-lg ${
                      active ? 'bg-forest-700 text-cream' : 'text-navy-200 hover:text-cream'
                    }`}
                  >
                    <span className={`absolute left-4 ${active ? 'animate-nudge' : 'invisible'}`} aria-hidden="true">
                      <PixelSprite name="arrow" scale={3} />
                    </span>
                    {item.label}
                    <span id={`menu-hint-${item.id}`} className="sr-only">
                      {item.hint}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-navy-200" aria-hidden="true">
            {MENU[selected].hint}
          </p>
        </nav>

        <p className="mt-6 hidden font-pixel text-[12px] uppercase tracking-widest text-navy-200 sm:block" aria-hidden="true">
          <span className="animate-blink text-gold">&#9654;</span> &uarr;&darr; select &middot; enter confirm
        </p>
      </div>

      {modal === 'tutorial' && <TutorialModal onClose={closeModal} onPlay={play} />}
      {modal === 'quit' && <QuitScreen onClose={closeModal} />}
    </section>
  );
}
