import { lazy, Suspense, useEffect, useState } from 'react';
import Section from './ui/Section.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Icon from './ui/Icon.jsx';
import { notes } from '../notes/index.js';

// The reader (and the Markdown parser it uses) loads only when a note is opened.
const NoteReader = lazy(() => import('./NoteReader.jsx'));

const noteFromHash = () => {
  const id = window.location.hash.replace(/^#note-/, '');
  return notes.some((n) => n.id === id) ? id : null;
};

// Study notes converted from the BSAid PDF case notes. A card opens the note in a reader;
// #note-<id> in the URL opens it directly, so a note can be linked.
export default function Notes() {
  const [open, setOpen] = useState(null);

  // Open a linked note once the loading screen is out of the way (its keys would otherwise close the reader).
  useEffect(() => {
    const fromHash = () => setOpen(noteFromHash());
    if (window.__splashDone) fromHash();
    else window.addEventListener('splash:done', fromHash, { once: true });
    window.addEventListener('hashchange', fromHash);
    return () => {
      window.removeEventListener('splash:done', fromHash);
      window.removeEventListener('hashchange', fromHash);
    };
  }, []);

  const show = (id) => {
    setOpen(id);
    window.history.replaceState(null, '', `#note-${id}`);
  };
  const close = () => {
    setOpen(null);
    window.history.replaceState(null, '', '#notes');
  };

  return (
    <Section id="notes" className="bg-cream">
      <SectionHeading eyebrow="Study notes" title="Review the notes. Then crack the case.">
        The BSAid case notes, ready to read right here &mdash; every definition, worked example, and memory trick you
        need before you play.
      </SectionHeading>

      <ol className="mt-16 grid gap-x-6 gap-y-10 p-1 sm:grid-cols-2">
        {notes.map((n, i) => (
          <li key={n.id} className="pt-3">
            <button
              type="button"
              onClick={() => show(n.id)}
              className="pixel-box group relative flex h-full w-full flex-col bg-white p-5 pt-8 text-left transition-transform hover:-translate-y-1 sm:p-6 sm:pt-9"
            >
              <span className="absolute -top-4 left-3 bg-navy-950 px-2.5 py-2 font-pixel text-[12px] text-cream group-hover:bg-gold group-hover:text-navy-950">
                NOTE {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex items-start gap-4">
                <span className="inline-flex shrink-0 bg-forest p-3 text-cream">
                  <Icon name={n.icon} strokeWidth={2.25} />
                </span>
                <span className="min-w-0">
                  <span className="block font-pixel text-[11px] uppercase tracking-widest text-wood-600">{n.part}</span>
                  <span className="mt-1 block font-heading text-2xl font-bold leading-tight text-navy-900">{n.title}</span>
                </span>
              </span>
              <span className="mt-4 text-slate-600">{n.summary}</span>
              <span className="mt-4 flex flex-wrap gap-2">
                {n.topics.map((t) => (
                  <span key={t} className="bg-wood-100 px-2 py-1 text-xs font-semibold text-wood-800">
                    {t}
                  </span>
                ))}
              </span>
              <span className="mt-auto flex items-center gap-2 pt-6 font-pixel text-[13px] uppercase tracking-wide text-forest-700 group-hover:text-navy-900">
                Read notes <Icon name="arrow" className="h-4 w-4" />
              </span>
            </button>
          </li>
        ))}
      </ol>

      {open && (
        <Suspense fallback={null}>
          <NoteReader noteId={open} onClose={close} onOpen={show} />
        </Suspense>
      )}
    </Section>
  );
}
