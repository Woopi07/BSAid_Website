import { useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import Dialog from './ui/Dialog.jsx';
import Icon from './ui/Icon.jsx';
import PixelSprite from './ui/PixelSprite.jsx';
import { notes } from '../notes/index.js';

const slug = (text) =>
  text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Markdown -> HTML, with ids on section headings (for the table of contents) and scrollable tables.
function render(md) {
  const toc = [];
  let html = marked.parse(md, { gfm: true });
  const plain = (inner) => inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  html = html.replace(/<h([23])>(.*?)<\/h\1>/g, (_, level, inner) => {
    const id = `sec-${toc.length}-${slug(inner)}`;
    toc.push({ id, label: plain(inner), level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  // Short notes list their subsections in the contents too; long ones only list the main sections.
  const sections = toc.filter((t) => t.level === 2).length;
  html = html.replace(/<table>/g, '<div class="note-table"><table>').replace(/<\/table>/g, '</table></div>');
  return { html, toc: sections < 5 ? toc : toc.filter((t) => t.level === 2) };
}

// Full-screen reader for one study note, with a table of contents and previous/next navigation.
export default function NoteReader({ noteId, onClose, onOpen }) {
  const index = notes.findIndex((n) => n.id === noteId);
  const note = notes[index];
  const [md, setMd] = useState(null);
  const [active, setActive] = useState(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setMd(null);
    note.load().then((m) => alive && setMd(m.default));
    return () => {
      alive = false;
    };
  }, [note]);

  const { html, toc } = useMemo(() => (md ? render(md) : { html: '', toc: [] }), [md]);

  // Highlight the section currently in view.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || !html) return undefined;
    root.scrollTop = 0;
    const heads = [...root.querySelectorAll('h2[id], h3[id]')].filter((h) => toc.some((t) => t.id === h.id));
    const onScroll = () => {
      const top = root.getBoundingClientRect().top + 90;
      let current = heads[0]?.id;
      heads.forEach((h) => h.getBoundingClientRect().top <= top && (current = h.id));
      setActive(current);
    };
    onScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, [html, toc]);

  const jump = (id) => {
    const el = bodyRef.current?.querySelector(`#${id}`);
    if (el) bodyRef.current.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
  };

  const prev = notes[index - 1];
  const next = notes[index + 1];

  return (
    <Dialog labelledBy="note-title" onClose={onClose} className="bg-navy-950/85">
      <div className="pixel-box px-dark flex h-[92dvh] w-full max-w-6xl animate-pop flex-col overflow-hidden bg-cream">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b-4 border-navy-950 bg-forest px-4 py-3 text-cream sm:px-6">
          <div className="min-w-0">
            <p className="font-pixel text-[11px] uppercase tracking-widest text-gold">{note.part}</p>
            <h2 id="note-title" className="truncate text-xl font-bold text-cream sm:text-2xl">
              {note.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 items-center gap-1 font-pixel text-[13px] uppercase text-cream hover:text-gold"
            aria-label="Close notes"
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={3} /> <span className="hidden sm:inline">Esc</span>
            <span className="sm:hidden">Close</span>
          </button>
        </header>

        <div className="flex min-h-0 flex-1">
          {toc.length > 0 && (
            <nav aria-label="Sections" className="hidden w-64 shrink-0 overflow-y-auto border-r-4 border-navy-950/10 bg-white/60 p-4 lg:block">
              <p className="font-pixel text-[11px] uppercase tracking-widest text-wood-600">Contents</p>
              <ol className="mt-3 flex flex-col gap-1">
                {toc.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => jump(t.id)}
                      className={`w-full py-2 pr-2.5 text-left leading-snug ${t.level === 3 ? 'pl-6 text-[13px]' : 'pl-2.5 text-sm font-semibold'} ${
                        active === t.id ? 'bg-navy-900 font-semibold text-cream' : 'text-navy-900 hover:bg-wood-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div ref={bodyRef} className="relative min-w-0 flex-1 overflow-y-auto">
            {md ? (
              <article className="note-content mx-auto max-w-3xl px-5 py-8 sm:px-8" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="flex h-full items-center justify-center gap-3 font-pixel text-[13px] uppercase tracking-widest text-navy-900">
                <PixelSprite name="coin" scale={3} className="animate-bob" /> Opening notes…
              </p>
            )}

            {md && (
              <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 pb-10 sm:flex-row sm:justify-between sm:px-8">
                {prev ? (
                  <button type="button" onClick={() => onOpen(prev.id)} className="pixel-btn bg-white text-navy-950 hover:bg-wood-100">
                    <Icon name="arrow" className="h-4 w-4 rotate-180" /> {prev.title}
                  </button>
                ) : (
                  <span />
                )}
                {next && (
                  <button type="button" onClick={() => onOpen(next.id)} className="pixel-btn bg-gold text-navy-950 hover:bg-gold-300">
                    {next.title} <Icon name="arrow" className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
