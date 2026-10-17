import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Book,
  Network,
  MapPin,
  Search,
  X,
  Compass,
  Calendar,
  Users,
} from 'lucide-react';
import { BIBLE_BOOKS, CATEGORIES } from '../data/bibleMeta';
import { BIBLICAL_PEOPLE, BIBLICAL_RELATIONSHIPS } from '../data/biblicalPeople';
import type { BiblicalPerson } from '../data/biblicalPeople';
import { BIBLICAL_LOCATIONS } from '../data/biblicalLocations';
import type { BiblicalLocation } from '../data/biblicalLocations';
import { getStoredSettings, saveSettings } from '../utils/studyStorage';
import { isTranslation, loadChapter, TRANSLATIONS } from '../utils/translations';
import type { TranslationId, ScriptureChapter } from '../utils/translations';
import { ScriptureVerseRow } from './ScriptureVerseRow';
import { SelectionMeaning } from './SelectionMeaning';
import type { MeaningSelection } from './SelectionMeaning';
import { SpeechControls } from './SpeechControls';
import chapterTitles from '../data/chapterTitles.json';

interface BibleReaderProps {
  currentBook: string;
  currentChapter: number;
  targetVerse?: number;
  onNavigate: (book: string, chapter: number, verse?: number) => void;
  onNavigateToPerson: (personId: string) => void;
  onNavigateToLocation: (locationId: string) => void;
  fontSize: number;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  currentBook,
  currentChapter,
  targetVerse,
  onNavigate,
  onNavigateToPerson,
  onNavigateToLocation,
  fontSize,
}) => {
  const [currentChapterObj, setChapterData] = useState<ScriptureChapter | null>(null);
  const [translation, setTranslation] = useState<TranslationId>(() => {
    const saved = getStoredSettings().translation;
    return isTranslation(saved) ? saved : 'KJV';
  });
  const [retry, setRetry] = useState(0);
  const [meaningSelection, setMeaningSelection] = useState<MeaningSelection | null>(null);
  const closeMeaning = useCallback(() => {
    setMeaningSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);
  const [copyError, setCopyError] = useState('');
  const readerTopRef = useRef<HTMLElement | null>(null);
  const edition = TRANSLATIONS.find((item) => item.id === translation)!;
  const chapterTitle = (chapterTitles as Record<string, string[]>)[currentBook]?.[currentChapter - 1];
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer & Filter states
  const [showBookDrawer, setShowBookDrawer] = useState<boolean>(false);
  const [bookFilterQuery, setBookFilterQuery] = useState<string>('');
  const [selectedTestament, setSelectedTestament] = useState<'All' | 'OT' | 'NT'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const entityClickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inspectEntity = (entity: NonNullable<typeof activeSidebarEntity>) => {
    clearTimeout(entityClickTimer.current);
    entityClickTimer.current = setTimeout(() => {
      if (window.getSelection()?.isCollapsed !== false) setActiveSidebarEntity(entity);
    }, 240);
  };
  useEffect(() => () => clearTimeout(entityClickTimer.current), [currentBook, currentChapter]);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  // Slide-over Entity Inspector Sidebar state
  const [activeSidebarEntity, setActiveSidebarEntity] = useState<{
    type: 'person' | 'location';
    id: string;
    person?: BiblicalPerson;
    location?: BiblicalLocation;
  } | null>(null);

  // Immediate relationships for sidebar person
  const sidebarPersonRelationships = useMemo(() => {
    if (!activeSidebarEntity?.person) return [];
    const pId = activeSidebarEntity.person.id;
    return BIBLICAL_RELATIONSHIPS.filter(
      (r) => r.source === pId || r.target === pId
    ).map((r) => {
      const isSource = r.source === pId;
      const otherId = isSource ? r.target : r.source;
      const otherPerson = BIBLICAL_PEOPLE.find((p) => p.id === otherId);
      return {
        ...r,
        otherPerson,
      };
    });
  }, [activeSidebarEntity]);

  const verseContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Current Book Metadata
  const currentMeta = useMemo(() => {
    return BIBLE_BOOKS.find((b) => b.name === currentBook) || BIBLE_BOOKS[0];
  }, [currentBook]);

  // Load the bundled book for this edition. Cancel stale navigation/version requests.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setChapterData(null);
    loadChapter(currentBook, currentChapter, translation, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setChapterData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [currentBook, currentChapter, translation, retry]);

  useEffect(() => {
    setMeaningSelection(null);
    setActiveSidebarEntity(null);
    if (!targetVerse) readerTopRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [currentBook, currentChapter, targetVerse]);

  useEffect(() => { setMeaningSelection(null); }, [translation]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const inspect = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) return;
      const text = selection.toString().replace(/\s+/g, ' ').trim();
      if (!text || text.length > 240) return;
      const element = (node: Node | null) => node instanceof Element ? node : node?.parentElement;
      const start = element(selection.anchorNode)?.closest<HTMLElement>('[data-verse-text]');
      const end = element(selection.focusNode)?.closest<HTMLElement>('[data-verse-text]');
      if (!start || !end || !readerTopRef.current?.contains(start) || !readerTopRef.current?.contains(end)) return;
      const verse = Number(start.closest('[data-verse]')?.getAttribute('data-verse'));
      const version = start.dataset.version;
      if (!verse || !isTranslation(version)) return;
      setMeaningSelection((previous) => previous?.text === text && previous.verse === verse && previous.version === version ? previous : { text, book: currentBook, chapter: currentChapter, verse, version });
    };
    const schedule = () => { clearTimeout(timer); timer = setTimeout(inspect, 180); };
    document.addEventListener('selectionchange', schedule);
    document.addEventListener('pointerup', schedule);
    return () => { clearTimeout(timer); document.removeEventListener('selectionchange', schedule); document.removeEventListener('pointerup', schedule); };
  }, [currentBook, currentChapter]);

  useEffect(() => {
    const selected = document.querySelector('[data-current-chapter="true"]') as HTMLElement | null;
    if (selected?.parentElement) selected.parentElement.scrollLeft = Math.max(0, selected.offsetLeft - selected.parentElement.offsetLeft - selected.parentElement.clientWidth / 2);
  }, [currentBook, currentChapter]);

  useEffect(() => {
    if (!showBookDrawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setShowBookDrawer(false); };
    document.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', close); };
  }, [showBookDrawer]);

  // Scroll to target verse if specified
  useEffect(() => {
    if (!loading && targetVerse && verseContainerRefs.current[targetVerse]) {
      const timer = setTimeout(() => {
        verseContainerRefs.current[targetVerse]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [targetVerse, currentBook, currentChapter, loading]);

  // Pre-index people and location keywords for fast regex matching
  const entityKeywords = useMemo(() => {
    const peopleMap = new Map<string, typeof BIBLICAL_PEOPLE[0]>();
    for (const p of BIBLICAL_PEOPLE) {
      peopleMap.set(p.name.toLowerCase(), p);
      if (p.name.includes(' ')) {
        // e.g. "Simon Peter" -> also "Peter"
        const parts = p.name.split(' ');
        for (const pt of parts) {
          if (pt.length > 3 && !['king', 'lord', 'john', 'mark'].includes(pt.toLowerCase())) {
            peopleMap.set(pt.toLowerCase(), p);
          }
        }
      }
    }

    const locationMap = new Map<string, typeof BIBLICAL_LOCATIONS[0]>();
    for (const loc of BIBLICAL_LOCATIONS) {
      locationMap.set(loc.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, ''), loc);
    }

    return { peopleMap, locationMap };
  }, []);

  // Filtered books list
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((b) => {
      if (selectedTestament === 'OT' && b.testament !== 'Old Testament') return false;
      if (selectedTestament === 'NT' && b.testament !== 'New Testament') return false;
      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
      if (bookFilterQuery.trim()) {
        const q = bookFilterQuery.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedTestament, selectedCategory, bookFilterQuery]);

  // Chapter Navigation
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      onNavigate(currentBook, currentChapter - 1);
    } else {
      const currIdx = BIBLE_BOOKS.findIndex((b) => b.name === currentBook);
      if (currIdx > 0) {
        const prevBook = BIBLE_BOOKS[currIdx - 1];
        onNavigate(prevBook.name, prevBook.chaptersCount);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < currentMeta.chaptersCount) {
      onNavigate(currentBook, currentChapter + 1);
    } else {
      const currIdx = BIBLE_BOOKS.findIndex((b) => b.name === currentBook);
      if (currIdx < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currIdx + 1];
        onNavigate(nextBook.name, 1);
      }
    }
  };

  // Copy verse text
  const handleCopyVerse = async (verseNum: number, text: string, verseVersion: TranslationId) => {
    const formatted = `"${text}" — ${currentBook} ${currentChapter}:${verseNum} (${TRANSLATIONS.find((item) => item.id === verseVersion)?.label})`;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopyError('');
      setCopiedVerse(verseNum);
      setTimeout(() => setCopiedVerse(null), 2000);
    } catch { setCopyError('Copy was unavailable. Select the verse text and copy it manually.'); }
  };

  // Render text with clickable People and Location tags
  const renderVerseContent = (text: string) => {
    // Regex splits by word boundary while preserving words
    const tokens = text.split(/(\b[A-Za-z]+['’]?[A-Za-z]*\b|[^\w\s]+|\s+)/);

    return tokens.map((token, idx) => {
      const clean = token.toLowerCase().trim();
      if (!clean) return <span key={idx}>{token}</span>;

      // Check Person
      const person = entityKeywords.peopleMap.get(clean);
      if (person) {
        return (
          <span
            key={idx}
            onClick={() => {
              if (window.getSelection()?.isCollapsed === false) return;
              inspectEntity({
                type: 'person',
                id: person.id,
                person,
              });
            }}
            className="cursor-pointer font-medium underline decoration-neutral-500/50 hover:decoration-neutral-100 hover:text-white transition px-0.5 rounded hover:bg-neutral-800"
            title={`Biblical Figure: ${person.name} (${person.role})`}
          >
            {token}
          </span>
        );
      }

      // Check Location
      const loc = entityKeywords.locationMap.get(clean);
      if (loc) {
        return (
          <span
            key={idx}
            onClick={() => {
              if (window.getSelection()?.isCollapsed === false) return;
              inspectEntity({
                type: 'location',
                id: loc.id,
                location: loc,
              });
            }}
            className="cursor-pointer font-medium border-b border-dotted border-neutral-400 hover:border-neutral-100 hover:text-white transition px-0.5 rounded hover:bg-neutral-800"
            title={`Biblical Location: ${loc.name} (${loc.region})`}
          >
            {token}
          </span>
        );
      }

      return <span key={idx}>{token}</span>;
    });
  };

  return (
    <div className="reader-layout flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto">
      {/* Book & Chapter Selection Drawer (Desktop Sidebar / Mobile Modal) */}
      <aside
        aria-label="Bible books"
        className={`book-drawer fixed inset-y-0 left-0 z-50 w-80 bg-neutral-950 border-r border-neutral-800 p-4 transform transition-transform duration-200 lg:sticky lg:translate-x-0 ${
          showBookDrawer ? 'translate-x-0 shadow-2xl visible' : '-translate-x-full lg:translate-x-0 invisible lg:visible'
        } flex flex-col h-full`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-neutral-300" />
            <h2 className="font-heading font-semibold text-sm tracking-wider uppercase text-neutral-100">
              Canon of Scripture
            </h2>
          </div>
          <button
            onClick={() => setShowBookDrawer(false)}
            aria-label="Close book selector"
            className="lg:hidden p-1 text-neutral-400 hover:text-neutral-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Book */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search 66 books..."
            value={bookFilterQuery}
            onChange={(e) => setBookFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Testament Filter Tabs */}
        <div className="mt-3 grid grid-cols-3 gap-1 p-0.5 bg-neutral-900 border border-neutral-800 rounded text-[11px]">
          {(['All', 'OT', 'NT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTestament(t)}
              className={`py-1 rounded font-mono transition ${
                selectedTestament === t
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {t === 'All' ? 'All (66)' : t === 'OT' ? 'Old (39)' : 'New (27)'}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="mt-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1.5 px-2 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Books List (Scrollable) */}
        <div className="mt-3 flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredBooks.length === 0 && <p className="py-6 text-center text-xs text-neutral-400">No matching books. Try clearing your filters.</p>}
          {filteredBooks.map((book) => {
            const isSelected = book.name === currentBook;
            return (
              <button
                key={book.id}
                onClick={() => {
                  onNavigate(book.name, 1);
                  setShowBookDrawer(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition flex items-center justify-between group ${
                  isSelected
                    ? 'bg-neutral-100 text-neutral-950 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100'
                }`}
              >
                <div>
                  <div className="text-xs flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-60">
                      {String(book.order).padStart(2, '0')}
                    </span>
                    <span>{book.name}</span>
                  </div>
                  <div
                    className={`text-[10px] truncate max-w-[170px] ${
                      isSelected ? 'text-neutral-700' : 'text-neutral-500'
                    }`}
                  >
                    {book.category}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-200 text-neutral-950'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400'
                  }`}
                >
                  {book.chaptersCount} ch
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {showBookDrawer && (
        <div
          onClick={() => setShowBookDrawer(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Scripture Canvas */}
      <main ref={readerTopRef} className="scripture-main flex-1 flex flex-col min-w-0 px-4 sm:px-8 py-6">
        {/* Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBookDrawer(true)}
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200 hover:border-neutral-600"
            >
              <Book className="w-3.5 h-3.5" />
              <span>Select Book</span>
            </button>

            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded text-xs font-mono">
              <span className="font-heading font-semibold text-neutral-100">{currentBook}</span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-300">Chapter {currentChapter}</span>
              <span className="text-neutral-600 text-[10px]">
                of {currentMeta.chaptersCount}
              </span>
            </div>
          </div>

          {/* Action Buttons: Audio, Prev/Next */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-neutral-400">
              Version
              <select aria-label="Bible version" value={translation} onChange={(event) => {
                const version = event.target.value as TranslationId;
                setTranslation(version);
                saveSettings({ translation: version });
              }} className="translation-select">
                {TRANSLATIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <SpeechControls book={currentBook} chapter={currentChapter} version={translation} onNavigate={onNavigate} />

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevChapter}
                disabled={currentBook === 'Genesis' && currentChapter === 1}
                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-neutral-100 transition"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextChapter}
                disabled={currentBook === 'Revelation' && currentChapter === 22}
                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-neutral-100 transition"
                title="Next Chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chapter Selector Grid */}
        <div className="chapter-strip relative py-3 overflow-x-auto flex items-center gap-1 border-b border-neutral-800/60 scrollbar-thin" aria-label="Chapters">
          <span className="text-[11px] font-mono uppercase text-neutral-500 mr-2 shrink-0">
            Chapters:
          </span>
          {Array.from({ length: currentMeta.chaptersCount }, (_, i) => i + 1).map((ch) => {
            const isChSelected = ch === currentChapter;
            return (
              <button
                key={ch}
                data-current-chapter={isChSelected}
                aria-current={isChSelected ? 'page' : undefined}
                title={`Chapter ${ch}: ${(chapterTitles as Record<string, string[]>)[currentBook]?.[ch - 1] || ''}`}
                onClick={() => onNavigate(currentBook, ch)}
                className={`w-7 h-7 shrink-0 rounded font-mono text-xs flex items-center justify-center transition ${
                  isChSelected
                    ? 'bg-neutral-100 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {/* Scripture Content */}
        <div className="flex-1 max-w-3xl mx-auto w-full py-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
              <div className="w-8 h-8 border-2 border-neutral-700 border-t-neutral-200 rounded-full animate-spin" />
              <p className="font-heading tracking-widest text-xs uppercase">
                Opening {currentBook}...
              </p>
            </div>
          )}

          {error && (
            <div role="alert" className="p-6 rounded-lg bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
              <p className="text-neutral-300 text-sm">{error}</p>
              <button
                onClick={() => setRetry((value) => value + 1)}
                className="px-4 py-2 bg-neutral-100 text-neutral-950 text-xs font-semibold rounded"
              >
                Try again
              </button>
            </div>
          )}


          {!loading && !error && currentChapterObj && (
            <article className="space-y-6" lang={edition.lang}>
              {/* Classical Chapter Title */}
              <div className="text-center pb-8 border-b border-neutral-800/80">
                <span className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase block mb-1">
                  {currentMeta.testament} &bull; {currentMeta.category}
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-widest uppercase text-neutral-100">
                  {currentBook}
                </h1>
                <div className="w-12 h-0.5 bg-neutral-700 mx-auto my-3" />
                <h2 className="font-heading text-base sm:text-lg tracking-wider text-neutral-300 uppercase">
                  Chapter {currentChapter}
                </h2>
                <h3 className="chapter-title font-scripture text-2xl sm:text-3xl text-neutral-100 mt-3">{chapterTitle}</h3>
                <p className="mt-2 text-xs text-neutral-400">{edition.name}</p>
                <p className="mt-3 text-xs text-neutral-400 max-w-xl mx-auto italic font-scripture">
                  "{currentMeta.summary}"
                </p>
              </div>

              <p className="text-xs text-neutral-400">Highlight a word or phrase for its meaning. Use the language icon beside a verse to change its version.</p>
              {copyError && <p role="alert" className="text-sm text-neutral-400">{copyError}</p>}
              <div className="verse-list space-y-4 font-scripture" style={{ fontSize: fontSize, lineHeight: 1.75 }}>
                {currentChapterObj.verses.map((verse) => {
                  const number = Number(verse.verse);
                  return <ScriptureVerseRow
                    key={[currentBook, currentChapter, translation, verse.verse].join('/')}
                    book={currentBook} chapter={currentChapter} verse={verse} version={translation}
                    target={targetVerse === number} copied={copiedVerse === number}
                    onRef={(element) => { verseContainerRefs.current[number] = element; }}
                    renderText={renderVerseContent} onCopy={handleCopyVerse}
                  />;
                })}
              </div>

              {/* Bottom Chapter Pager */}
              <div className="chapter-pager pt-10 pb-6 flex flex-wrap gap-3 items-center justify-between border-t border-neutral-800">
                <button
                  onClick={handlePrevChapter}
                  disabled={currentBook === 'Genesis' && currentChapter === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-neutral-100 hover:border-neutral-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Chapter</span>
                </button>

                <div className="pager-reference text-xs font-mono text-neutral-500">
                  {currentBook} {currentChapter} : 1 - {currentChapterObj.verses.at(-1)?.verse}
                </div>

                <button
                  onClick={handleNextChapter}
                  disabled={currentBook === 'Revelation' && currentChapter === 22}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-neutral-100 hover:border-neutral-700 transition"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">Study titles adapted from the public-domain <a className="underline" href="https://berean.bible/downloads.htm" target="_blank" rel="noopener noreferrer">Berean Standard Bible</a> section headings. {translation === 'NKJV' && <>Bundled NKJV text sourced from <a className="underline" href="https://bolls.life" target="_blank" rel="noopener noreferrer">Bolls Bible</a>. NKJV © Thomas Nelson.</>} {translation === 'JPKJV' && <>Bundled Japanese Colloquial Bible, 1954/1955, sourced from <a className="underline" href="https://github.com/FujiHaruka/bible-api" target="_blank" rel="noopener noreferrer">FujiHaruka's Bible dataset</a>.</>}</p>
              {translation === 'NIV' && <p className="text-xs text-neutral-500 leading-relaxed">New International Version. NIV text supplied from your imported Bible file. Copyright Biblica, Inc.</p>}
            </article>
          )}
        </div>
      </main>

      {meaningSelection && <SelectionMeaning selection={meaningSelection} onClose={closeMeaning} />}

      {/* Slide-over Entity Inspector Sidebar (Pops up on click without jumping page) */}
      {activeSidebarEntity && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Subtle backdrop */}
          <div
            onClick={() => setActiveSidebarEntity(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <aside className="w-screen max-w-md sm:max-w-lg bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col h-full z-10 overflow-y-auto">
              {/* Header with Close */}
              <div className="p-6 border-b border-neutral-800 flex items-start justify-between bg-neutral-900/40">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                    {activeSidebarEntity.type === 'person' ? '✦ Biblical Figure Profile' : '✦ Biblical Geography & Atlas'}
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-neutral-100">
                    {activeSidebarEntity.type === 'person'
                      ? activeSidebarEntity.person?.name
                      : activeSidebarEntity.location?.name}
                  </h2>
                  {activeSidebarEntity.type === 'person' && activeSidebarEntity.person?.hebrewGreek && (
                    <div className="text-xs font-serif text-neutral-400 mt-1">
                      {activeSidebarEntity.person.hebrewGreek}{' '}
                      {activeSidebarEntity.person.meaning && (
                        <span className="italic font-sans text-neutral-500">
                          ({activeSidebarEntity.person.meaning})
                        </span>
                      )}
                    </div>
                  )}
                  {activeSidebarEntity.type === 'location' && activeSidebarEntity.location && (
                    <div className="text-xs font-serif text-neutral-400 mt-1">
                      {activeSidebarEntity.location.ancientName && (
                        <span>Ancient: {activeSidebarEntity.location.ancientName} &bull; </span>
                      )}
                      <span>Modern: {activeSidebarEntity.location.modernName}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveSidebarEntity(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-md hover:bg-neutral-800 transition"
                  title="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Badges */}
              <div className="px-6 pt-4 flex flex-wrap gap-2">
                {activeSidebarEntity.type === 'person' && activeSidebarEntity.person && (
                  <>
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-200">
                      {activeSidebarEntity.person.role}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
                      {activeSidebarEntity.person.era}
                    </span>
                  </>
                )}
                {activeSidebarEntity.type === 'location' && activeSidebarEntity.location && (
                  <>
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-medium text-neutral-200 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-neutral-400" />
                      {activeSidebarEntity.location.region}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
                      {activeSidebarEntity.location.coordinates[0].toFixed(2)}°N,{' '}
                      {activeSidebarEntity.location.coordinates[1].toFixed(2)}°E
                    </span>
                  </>
                )}
              </div>

              {/* Summary */}
              <div className="p-6 border-b border-neutral-800/80 space-y-1">
                <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  {activeSidebarEntity.type === 'person' ? 'Biblical Overview' : 'Historical & Sacred Geography'}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {activeSidebarEntity.type === 'person'
                    ? activeSidebarEntity.person?.summary
                    : activeSidebarEntity.location?.description}
                </p>
              </div>

              {/* PERSON SPECIFIC CONTENT */}
              {activeSidebarEntity.type === 'person' && activeSidebarEntity.person && (
                <div className="p-6 space-y-6 flex-1">
                  {/* Key Scriptures */}
                  <div>
                    <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                      <Book className="w-3 h-3 text-neutral-400" />
                      <span>Key Scripture References</span>
                    </h3>
                    <div className="space-y-1.5">
                      {activeSidebarEntity.person.verses.map((vRef, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const match = vRef.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)/);
                            if (match) {
                              const book = match[1].trim();
                              const chapter = parseInt(match[2]);
                              onNavigate(book, chapter);
                            }
                          }}
                          className="w-full text-left px-3 py-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 flex items-center justify-between group transition"
                        >
                          <span className="font-mono text-neutral-200">{vRef}</span>
                          <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 flex items-center gap-1 font-mono">
                            Read <ChevronRight className="w-3 h-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Relationships */}
                  {sidebarPersonRelationships.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-neutral-400" />
                        <span>Direct Family & Ministry Connections ({sidebarPersonRelationships.length})</span>
                      </h3>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {sidebarPersonRelationships.map((rel, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (rel.otherPerson) {
                                setActiveSidebarEntity({
                                  type: 'person',
                                  id: rel.otherPerson.id,
                                  person: rel.otherPerson,
                                });
                              }
                            }}
                            className="w-full text-left p-2.5 rounded bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 transition flex items-center justify-between text-xs group"
                          >
                            <div>
                              <div className="font-semibold text-neutral-200 group-hover:text-white">
                                {rel.otherPerson?.name || 'Biblical Figure'}
                              </div>
                              <div className="text-[10px] text-neutral-400">{rel.label}</div>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                              {rel.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Associated Locations */}
                  {activeSidebarEntity.person.places.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>Associated Sacred Places</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSidebarEntity.person.places.map((placeId) => {
                          const loc = BIBLICAL_LOCATIONS.find((l) => l.id === placeId);
                          return (
                            <button
                              key={placeId}
                              onClick={() => {
                                if (loc) {
                                  setActiveSidebarEntity({
                                    type: 'location',
                                    id: loc.id,
                                    location: loc,
                                  });
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 capitalize transition flex items-center gap-1"
                            >
                              <span>{loc?.name || placeId.replace('-', ' ')}</span>
                              <ChevronRight className="w-3 h-3 text-neutral-500" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LOCATION SPECIFIC CONTENT */}
              {activeSidebarEntity.type === 'location' && activeSidebarEntity.location && (
                <div className="p-6 space-y-6 flex-1">
                  {/* Historical Events */}
                  <div>
                    <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      <span>Biblical Events at this Location ({activeSidebarEntity.location.events.length})</span>
                    </h3>
                    <div className="space-y-3">
                      {activeSidebarEntity.location.events.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-heading font-semibold text-neutral-100">
                              {evt.title}
                            </h4>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                              {evt.era.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                            {evt.description}
                          </p>
                          <div className="pt-1 flex flex-wrap gap-1">
                            {evt.verses.map((vRef, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const match = vRef.match(/^(\d?\s?[A-Za-z]+)\s+(\d+)/);
                                  if (match) {
                                    const book = match[1].trim();
                                    const chapter = parseInt(match[2]);
                                    onNavigate(book, chapter);
                                  }
                                }}
                                className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white transition flex items-center gap-1"
                              >
                                <Book className="w-2.5 h-2.5 text-neutral-400" />
                                <span>{vRef}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Associated Figures */}
                  {activeSidebarEntity.location.relatedPeople.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-neutral-400" />
                        <span>Biblical Figures Connected</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSidebarEntity.location.relatedPeople.map((pId) => {
                          const person = BIBLICAL_PEOPLE.find((p) => p.id === pId);
                          return (
                            <button
                              key={pId}
                              onClick={() => {
                                if (person) {
                                  setActiveSidebarEntity({
                                    type: 'person',
                                    id: person.id,
                                    person,
                                  });
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition flex items-center gap-1"
                            >
                              <Network className="w-3 h-3 text-neutral-400" />
                              <span>{person?.name || pId}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Sticky Action Footer to jump to full interactive page */}
              <div className="p-6 border-t border-neutral-800 bg-neutral-900/80 sticky bottom-0 mt-auto">
                {activeSidebarEntity.type === 'person' ? (
                  <button
                    onClick={() => {
                      const id = activeSidebarEntity.id;
                      setActiveSidebarEntity(null);
                      onNavigateToPerson(id);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold rounded-lg text-xs shadow-lg transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-neutral-950" />
                      <span>Explore in People Relationship Network</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const id = activeSidebarEntity.id;
                      setActiveSidebarEntity(null);
                      onNavigateToLocation(id);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold rounded-lg text-xs shadow-lg transition group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-neutral-950" />
                      <span>Explore on Biblical Atlas Map</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                <p className="text-[10px] text-center text-neutral-500 font-mono mt-2">
                  Clicking opens the interactive full-page visualization
                </p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};
