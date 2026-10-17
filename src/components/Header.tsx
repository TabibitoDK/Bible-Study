import { useEffect, useRef } from 'react';
import { BookOpen, Network, MapPin, Search, Sun, Moon } from 'lucide-react';
export type ActiveTab = 'reader' | 'people' | 'map';
interface HeaderProps {
  activeTab: ActiveTab; onTabChange: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  theme: 'dark' | 'light'; onToggleTheme: () => void;
  fontSize: number; onAdjustFontSize: (delta: number) => void;
  currentBook: string; currentChapter: number;
}
export function Header(props: HeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty('--app-header-height', `${entry.target.getBoundingClientRect().height}px`);
    });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);
  const tabs = [
    { id: 'reader', label: 'Scripture', icon: BookOpen },
    { id: 'people', label: 'People', icon: Network },
    { id: 'map', label: 'Atlas', icon: MapPin },
  ] as const;
  return <header ref={headerRef} className="app-header sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md text-neutral-100">
    <div className="header-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex flex-wrap items-center justify-between gap-3 py-3">
      <button onClick={() => props.onTabChange('reader')} className="flex items-center gap-3 text-left" aria-label="Canon and Chronos home">
        <span className="w-9 h-9 rounded-lg border border-neutral-700 bg-neutral-900 flex items-center justify-center shrink-0"><BookOpen size={19} /></span>
        <span><span className="brand-title font-heading font-bold tracking-widest text-sm block">CANON & CHRONOS</span><span className="text-[10px] text-neutral-400 hidden sm:block mt-1">Scripture, people & places</span></span>
      </button>
      <nav aria-label="Main navigation" className="main-nav flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} aria-current={props.activeTab === id ? 'page' : undefined} onClick={() => props.onTabChange(id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition ${props.activeTab === id ? 'bg-neutral-100 text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-neutral-100'}`}>
          <Icon size={15} /><span>{label}</span>
        </button>)}
      </nav>
      <div className="header-tools flex items-center gap-2">
        <button onClick={props.onOpenSearch} className="p-2 rounded-md border border-neutral-800 text-neutral-400 hover:text-neutral-100" title="Search Bible, people and places (Ctrl+K)"><Search size={16} /></button>
        {props.activeTab === 'reader' && <div className="hidden sm:flex items-center border border-neutral-800 rounded-md text-neutral-400">
          <button disabled={props.fontSize <= 14} onClick={() => props.onAdjustFontSize(-1)} className="px-2 py-2 text-xs" aria-label="Decrease font size">A−</button><span className="text-[10px] font-mono">{props.fontSize}</span><button disabled={props.fontSize >= 30} onClick={() => props.onAdjustFontSize(1)} className="px-2 py-2 text-xs" aria-label="Increase font size">A+</button>
        </div>}
        <button onClick={props.onToggleTheme} className="p-2 rounded-md border border-neutral-800 text-neutral-400 hover:text-neutral-100" title={props.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>{props.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>
      </div>
    </div>
  </header>;
}
