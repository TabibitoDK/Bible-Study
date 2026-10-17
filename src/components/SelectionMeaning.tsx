import { useEffect, useRef, useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { glossaryMeaning, normalizeTerm } from '../data/studyGlossary';
import { BIBLICAL_PEOPLE } from '../data/biblicalPeople';
import { BIBLICAL_LOCATIONS } from '../data/biblicalLocations';
import { loadChapter } from '../utils/translations';
import type { TranslationId } from '../utils/translations';
import { bundledDefinitions } from '../utils/studyDictionary';

export interface MeaningSelection { text: string; book: string; chapter: number; verse: number; version: TranslationId }
interface Definition { term: string; meaning: string; detail?: string; source?: string }
const ignored = new Set('a an the of and or to in on at for by with from is are was were be been being he she it they them his her their this that you your i me my we our not as into'.split(' '));
const dictionaryCache = new Map<string, Definition[]>();

async function dictionary(word: string, signal: AbortSignal): Promise<Definition[]> {
  if (dictionaryCache.has(word)) return dictionaryCache.get(word)!;
  try {
    const local = await bundledDefinitions(word);
    if (local.length) { dictionaryCache.set(word, local); return local; }
  } catch { /* An online entry may still be available if a local asset fails. */ }
  if (signal.aborted) throw new Error('Lookup cancelled.');
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { signal });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error('The dictionary is temporarily unavailable.');
  const entries = await response.json();
  if (!Array.isArray(entries)) return [];
  const meanings: Definition[] = entries.flatMap((entry) => (Array.isArray(entry.meanings) ? entry.meanings : []).flatMap((meaning: { partOfSpeech?: string; definitions?: { definition: string }[] }) =>
    (meaning.definitions || []).slice(0, 1).filter((item) => typeof item.definition === 'string').map((item) => ({ term: word, meaning: item.definition, detail: meaning.partOfSpeech, source: Array.isArray(entry.sourceUrls) && typeof entry.sourceUrls[0] === 'string' && entry.sourceUrls[0].startsWith('https://') ? entry.sourceUrls[0] : 'https://dictionaryapi.dev/' })))).slice(0, 2);
  dictionaryCache.set(word, meanings);
  return meanings;
}

export function SelectionMeaning({ selection, onClose }: { selection: MeaningSelection; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [context, setContext] = useState('');
  const [contextVersion, setContextVersion] = useState('NIV');
  const [retry, setRetry] = useState(0);
  const phrase = selection.text.trim().split(/\s+/).length > 1;
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let disposed = false;
    setDefinitions([]); setNotice(''); setLoading(false);
    const local = glossaryMeaning(selection.text);
    const name = normalizeTerm(selection.text);
    const person = BIBLICAL_PEOPLE.find((item) => normalizeTerm(item.name) === name);
    const place = BIBLICAL_LOCATIONS.find((item) => normalizeTerm(item.name) === name);
    if (local) setDefinitions([{ term: selection.text, meaning: local.meaning, detail: local.reference ? `Bible study glossary · ${local.reference}` : 'Plain-language glossary' }]);
    else if (person || place) setDefinitions([{ term: selection.text, meaning: person?.summary || place!.description, detail: 'People & places study notes' }]);
    else {
      const words = [...new Set((name.match(/[a-z]+(?:'[a-z]+)?/g) || []).filter((word) => !ignored.has(word)))].slice(0, 4);
      if (!words.length) setNotice('No glossary entry for this selection. Use the English verse below for context.');
      else {
        setLoading(true);
        if (phrase) setNotice('Word meanings are shown below. Read the modern wording for the phrase in context.');
        const lookup = async (): Promise<Definition[]> => {
          if (phrase) {
            try { const entry = await bundledDefinitions(name); if (entry.length) return entry; } catch { /* Continue with individual words. */ }
          }
          const results = await Promise.allSettled(words.map(async (word): Promise<Definition[]> => {
          const entry = glossaryMeaning(word);
          return entry ? [{ term: word, meaning: entry.meaning, detail: entry.reference ? `Bible study glossary · ${entry.reference}` : 'Plain-language glossary' }] : dictionary(word, controller.signal);
          }));
          const found = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
          if (!found.length && results.some((result) => result.status === 'rejected')) throw new Error('Dictionary unavailable');
          return found;
        };
        lookup().then((found) => {
          if (disposed) return;
          setDefinitions(found); setLoading(false);
          if (phrase && found.some((entry) => entry.term === name)) setNotice('');
          if (!found.length) setNotice('No dictionary entry was found. Read the verse below for context.');
        }).catch(() => {
          if (!disposed) { setLoading(false); setNotice('The dictionary could not be reached. The verse below is available from your bundled Bible.'); }
        });
      }
    }
    return () => { disposed = true; clearTimeout(timeout); controller.abort(); };
  }, [selection, retry, phrase]);
  useEffect(() => {
    const controller = new AbortController();
    setContext('');
    const version = selection.version === 'NIV' ? 'NKJV' : 'NIV';
    setContextVersion(version);
    loadChapter(selection.book, selection.chapter, version, controller.signal).then((chapter) => {
      if (!controller.signal.aborted) setContext(chapter.verses.find((item) => Number(item.verse) === selection.verse)?.text || 'This verse is not separately numbered in this edition.');
    }).catch(() => { if (!controller.signal.aborted) setContext('The alternate wording could not be loaded.'); });
    return () => controller.abort();
  }, [selection]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const outside = (event: PointerEvent) => {
      const target = event.target as Element;
      if (!ref.current?.contains(target) && !target.closest('[data-verse-text]')) onClose();
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [onClose]);
  return <aside ref={ref} className="meaning-card" role="dialog" aria-label="Word and phrase meaning" aria-live="polite">
    <div className="flex items-start justify-between gap-3 border-b border-neutral-800 pb-3">
      <div className="min-w-0"><p className="text-[10px] tracking-widest text-neutral-400 uppercase flex items-center gap-2"><BookOpen size={13} />Word & phrase meaning</p><h3 className="font-scripture text-2xl mt-2 break-words">“{selection.text}”</h3><p className="text-xs text-neutral-400 mt-1">{selection.book} {selection.chapter}:{selection.verse}</p></div>
      <button onClick={onClose} aria-label="Close meaning" className="p-2 rounded hover:bg-neutral-800 shrink-0"><X size={18} /></button>
    </div>
    <div className="meaning-card-body">
      {loading && <p role="status" className="text-sm text-neutral-400">Looking up meaning…</p>}
      {notice && <p className="text-xs text-neutral-400 mb-3">{notice}</p>}
      {definitions.map((entry, index) => <div key={`${entry.term}-${index}`} className="mb-4"><p className="text-sm font-semibold mb-1">{entry.term}</p><p className="text-sm leading-relaxed text-neutral-200">{entry.meaning}</p>{entry.detail && <p className="text-[11px] text-neutral-400 mt-2">{entry.detail}</p>}{entry.source && <a href={entry.source} target="_blank" rel="noopener noreferrer" className="text-[11px] text-neutral-400 underline">Dictionary source · {entry.detail || 'English definition'}</a>}</div>)}
      {!loading && !definitions.length && <button onClick={() => setRetry((value) => value + 1)} className="text-xs underline mb-4">Try lookup again</button>}
      <div className="border-t border-neutral-800 pt-3"><p className="text-[10px] text-neutral-400 uppercase tracking-wider">Modern wording · {contextVersion}</p><p className="font-scripture text-lg mt-2 text-neutral-200 leading-relaxed">{context || 'Loading verse context…'}</p></div>
      <p className="text-[11px] text-neutral-400 mt-3">Definitions describe possible senses. The surrounding passage determines which sense applies.</p>
    </div>
  </aside>;
}
