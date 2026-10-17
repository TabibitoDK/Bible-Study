import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Book,
  Network,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { parseScriptureReference } from '../utils/scriptureReference';
import { BIBLE_BOOKS } from '../data/bibleMeta';
import { BIBLICAL_PEOPLE } from '../data/biblicalPeople';
import { BIBLICAL_LOCATIONS } from '../data/biblicalLocations';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScripture: (book: string, chapter: number, verse?: number) => void;
  onNavigateToPerson: (personId: string) => void;
  onNavigateToLocation: (locationId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateToScripture,
  onNavigateToPerson,
  onNavigateToLocation,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search Results
  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default recommended / curated quick links
      return [
        { type: 'scripture', title: 'Genesis 1', subtitle: 'The Creation of Heaven and Earth', action: () => onNavigateToScripture('Genesis', 1) },
        { type: 'scripture', title: 'Psalm 23', subtitle: 'The Lord is My Shepherd', action: () => onNavigateToScripture('Psalms', 23) },
        { type: 'scripture', title: 'John 1', subtitle: 'The Word Made Flesh', action: () => onNavigateToScripture('John', 1) },
        { type: 'person', title: 'Abraham', subtitle: 'Father of Faith & Covenant Patriarch', action: () => onNavigateToPerson('abraham') },
        { type: 'person', title: 'Jesus Christ', subtitle: 'Son of God & Savior of the World', action: () => onNavigateToPerson('jesus') },
        { type: 'location', title: 'Jerusalem', subtitle: 'The Holy City of Zion', action: () => onNavigateToLocation('jerusalem') },
      ];
    }

    const items: Array<{
      type: 'scripture' | 'person' | 'location' | 'event';
      title: string;
      subtitle: string;
      action: () => void;
    }> = [];

    const reference = parseScriptureReference(q);
    if (reference) {
      items.push({ type: 'scripture',
        title: reference.book + ' ' + reference.chapter + (reference.verse ? ':' + reference.verse : ''),
        subtitle: reference.meta.testament + ' • ' + reference.meta.category,
        action: () => onNavigateToScripture(reference.book, reference.chapter, reference.verse),
      });
    }

    // 2. Search Books
    for (const b of BIBLE_BOOKS) {
      if (b.name.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q)) {
        items.push({
          type: 'scripture',
          title: b.name,
          subtitle: `${b.testament} • ${b.chaptersCount} chapters`,
          action: () => onNavigateToScripture(b.name, 1),
        });
      }
      if (items.length >= 8) break;
    }

    // 3. Search Biblical People
    for (const p of BIBLICAL_PEOPLE) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'person',
          title: p.name,
          subtitle: `${p.role} (${p.era})`,
          action: () => onNavigateToPerson(p.id),
        });
      }
      if (items.length >= 12) break;
    }

    // 4. Search Biblical Locations & Events
    for (const loc of BIBLICAL_LOCATIONS) {
      if (
        loc.name.toLowerCase().includes(q) ||
        loc.modernName.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
      ) {
        items.push({
          type: 'location',
          title: loc.name,
          subtitle: `${loc.region} • ${loc.modernName}`,
          action: () => onNavigateToLocation(loc.id),
        });
      }

      // Check events inside location
      for (const evt of loc.events) {
        if (evt.title.toLowerCase().includes(q) || evt.description.toLowerCase().includes(q)) {
          items.push({
            type: 'event',
            title: evt.title,
            subtitle: `Event in ${loc.name} (${evt.era})`,
            action: () => onNavigateToLocation(loc.id),
          });
        }
      }

      if (items.length >= 16) break;
    }

    return items;
  }, [query]);

  // Handle arrow keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        results[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-800 gap-3">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search scripture (e.g. 'John 3', 'Romans 8'), people ('Moses', 'Paul'), or places ('Jerusalem')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No matching scriptures, people, or locations found for "{query}".
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-100 text-neutral-950 font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-200 text-neutral-950'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      {item.type === 'scripture' && <Book className="w-3.5 h-3.5" />}
                      {item.type === 'person' && <Network className="w-3.5 h-3.5" />}
                      {item.type === 'location' && <MapPin className="w-3.5 h-3.5" />}
                      {item.type === 'event' && <Calendar className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <div className="text-xs">{item.title}</div>
                      <div
                        className={`text-[10px] truncate max-w-sm ${
                          isSelected ? 'text-neutral-700' : 'text-neutral-500'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-neutral-900 opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard hints footer */}
        <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; Select</span>
            <span>ESC Close</span>
          </div>
          <span>Canon & Chronos Global Search</span>
        </div>
      </div>
    </div>
  );
};
