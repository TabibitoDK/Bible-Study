import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Check, Copy, Languages, X } from 'lucide-react';
import { loadChapter, TRANSLATIONS } from '../utils/translations';
import type { ScriptureVerse, TranslationId } from '../utils/translations';

export function ScriptureVerseRow({ book, chapter, verse, version, target, copied, onRef, renderText, onCopy }: {
  book: string; chapter: number; verse: ScriptureVerse; version: TranslationId;
  target: boolean; copied: boolean;
  onRef: (element: HTMLDivElement | null) => void;
  renderText: (text: string) => ReactNode;
  onCopy: (number: number, text: string, version: TranslationId) => void;
}) {
  const [override, setOverride] = useState<TranslationId>(version);
  const [display, setDisplay] = useState({ text: verse.text, version });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const number = Number(verse.verse);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    if (override === version) {
      setDisplay({ text: verse.text, version }); setLoading(false);
    } else {
      setLoading(true);
      loadChapter(book, chapter, override, controller.signal).then((data) => {
        if (controller.signal.aborted) return;
        const match = data.verses.find((entry) => entry.verse === verse.verse);
        if (!match) throw new Error('This verse is not separately numbered in that edition. The previous version is still shown.');
        setDisplay({ text: match.text, version: override }); setLoading(false);
      }).catch((reason) => {
        if (!controller.signal.aborted) { setError(reason.message); setLoading(false); }
      });
    }
    return () => controller.abort();
  }, [book, chapter, override, version, verse.text, verse.verse, retry]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  const changed = display.version !== version;
  return <div ref={onRef} data-verse={verse.verse} className={`verse-row group relative p-2.5 -mx-2.5 rounded-md transition-all flex gap-3 ${target ? 'bg-neutral-800/80 border-l-2 border-neutral-100' : 'hover:bg-neutral-900/40'}`}>
    <span className="verse-number select-none font-mono text-[11px] font-bold text-neutral-500 pt-1 shrink-0 w-6 text-right">{verse.verse}</span>
    <div className="verse-body flex-1 min-w-0">
      <p data-verse-text data-version={display.version} lang={TRANSLATIONS.find((item) => item.id === display.version)?.lang} className="text-neutral-200">{renderText(display.text)}</p>
      {changed && <div className="temporary-version text-xs font-sans text-neutral-400 mt-2 flex flex-wrap items-center gap-2"><span>{TRANSLATIONS.find((item) => item.id === display.version)?.label} · temporary</span><button onClick={() => setOverride(version)} className="underline">Reset to {TRANSLATIONS.find((item) => item.id === version)?.label}</button></div>}
      {loading && <p role="status" className="text-xs font-sans text-neutral-400 mt-2">Loading verse…</p>}
      {error && <p role="alert" className="text-xs font-sans text-neutral-400 mt-2">{error} <button className="underline" onClick={() => setRetry((value) => value + 1)}>Retry</button></p>}
    </div>
    <div className="verse-actions flex items-center gap-1 self-start pt-1 shrink-0">
      <div ref={menuRef} className="relative">
        <button ref={triggerRef} type="button" title={`Change version for verse ${number}`} aria-label={`Change version for verse ${number}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className={`p-1 rounded ${changed ? 'text-neutral-100 bg-neutral-800' : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800'}`}><Languages size={15} /></button>
        {open && <div role="menu" aria-label={`Version for verse ${number}`} className="verse-version-menu" onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')];
          const current = items.indexOf(document.activeElement as HTMLButtonElement);
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
          items[next]?.focus();
        }}>
          <div className="flex items-center justify-between gap-3 px-3 py-2"><span className="text-xs font-semibold">Verse {number} version</span><button onClick={() => { setOpen(false); triggerRef.current?.focus(); }} aria-label="Close verse versions"><X size={14} /></button></div>
          {TRANSLATIONS.map((item) => <button key={item.id} role="menuitemradio" aria-checked={override === item.id} onClick={() => { setOverride(item.id); setOpen(false); triggerRef.current?.focus(); }} className="verse-version-option"><span>{item.label}{item.id === version ? ' · chapter version' : ''}</span>{override === item.id && <Check size={14} />}</button>)}
          <p className="text-[11px] text-neutral-400 px-3 py-2 border-t border-neutral-800">Only this verse. Resets on refresh.</p>
        </div>}
      </div>
      <button onClick={() => onCopy(number, display.text, display.version)} title="Copy verse" className="p-1 rounded text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800">{copied ? <Check size={14} /> : <Copy size={14} />}</button>
    </div>
  </div>;
}
