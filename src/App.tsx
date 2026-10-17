import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import type { ActiveTab } from './components/Header';
import { BibleReader } from './components/BibleReader';
import { PeopleGraph } from './components/PeopleGraph';
import { BibleMap } from './components/BibleMap';
import { CommandPalette } from './components/CommandPalette';
import { getStoredSettings, saveSettings } from './utils/studyStorage';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [targetVerse, setTargetVerse] = useState<number>();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStoredSettings().theme);
  const [fontSize, setFontSize] = useState(() => getStoredSettings().fontSize);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentEraOrder, setCurrentEraOrder] = useState(8);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setIsSearchOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  const navigate = (book: string, chapter: number, verse?: number) => {
    setCurrentBook(book); setCurrentChapter(chapter); setTargetVerse(verse);
  };
  const scripture = (book: string, chapter: number, verse?: number) => {
    navigate(book, chapter, verse); setActiveTab('reader');
  };
  const person = (id: string) => { setSelectedPersonId(id); setActiveTab('people'); };
  const location = (id: string) => { setSelectedLocationId(id); setActiveTab('map'); };
  return <div className="min-h-screen flex flex-col font-sans transition-colors bg-neutral-950 text-neutral-100">
    <Header activeTab={activeTab} onTabChange={setActiveTab} onOpenSearch={() => setIsSearchOpen(true)}
      theme={theme} onToggleTheme={() => {
        const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); saveSettings({ theme: next });
      }} fontSize={fontSize} onAdjustFontSize={(delta) => {
        const next = Math.max(14, Math.min(30, fontSize + delta)); setFontSize(next); saveSettings({ fontSize: next });
      }} currentBook={currentBook} currentChapter={currentChapter} />
    <div className="app-content flex-1 flex flex-col">
      {activeTab === 'reader' && <BibleReader currentBook={currentBook} currentChapter={currentChapter} targetVerse={targetVerse}
        onNavigate={navigate} onNavigateToPerson={person} onNavigateToLocation={location} fontSize={fontSize} />}
      {activeTab === 'people' && <PeopleGraph onNavigateToScripture={scripture} onNavigateToLocation={location}
        selectedPersonId={selectedPersonId} onSelectPerson={setSelectedPersonId} theme={theme} currentEraOrder={currentEraOrder} onEraChange={setCurrentEraOrder} />}
      {activeTab === 'map' && <BibleMap onNavigateToScripture={scripture} onNavigateToPerson={person}
        selectedLocationId={selectedLocationId} onSelectLocation={setSelectedLocationId} theme={theme} currentEraOrder={currentEraOrder} onEraChange={setCurrentEraOrder} />}
    </div>
    <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigateToScripture={scripture} onNavigateToPerson={person} onNavigateToLocation={location} />
  </div>;
}
export default App;
