import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MapPin,
  Network,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import { BIBLICAL_PEOPLE } from '../data/biblicalPeople';
import type { BiblicalPerson } from '../data/biblicalPeople';

interface GenerationalTreeProps {
  currentEraOrder: number;
  onNavigateToScripture: (book: string, chapter: number, verse?: number) => void;
  onNavigateToLocation: (locationId: string) => void;
  onSelectPerson: (personId: string) => void;
  onSwitchToGraphView: (personId?: string) => void;
}

export const GenerationalTree: React.FC<GenerationalTreeProps> = ({
  currentEraOrder,
  onNavigateToScripture,
  onNavigateToLocation,
  onSelectPerson,
  onSwitchToGraphView,
}) => {
  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  const [collapsedEpochs, setCollapsedEpochs] = useState<Record<string, boolean>>({});

  const toggleEpochCollapse = (epochTitle: string) => {
    setCollapsedEpochs((prev) => ({
      ...prev,
      [epochTitle]: !prev[epochTitle],
    }));
  };

  // Filter people strictly by the Time Slider (eraOrder <= currentEraOrder)
  const visiblePeople = useMemo(() => {
    return BIBLICAL_PEOPLE.filter((p) => p.eraOrder <= currentEraOrder);
  }, [currentEraOrder]);

  // Group by generation number
  const generationsMap = useMemo(() => {
    const map = new Map<number, BiblicalPerson[]>();
    for (const p of visiblePeople) {
      if (!map.has(p.generation)) {
        map.set(p.generation, []);
      }
      map.get(p.generation)!.push(p);
    }
    // Sort generation numbers ascending
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [visiblePeople]);

  // Pre-index person map for fast father/mother/child lookups
  const personLookup = useMemo(() => {
    const map = new Map<string, BiblicalPerson>();
    for (const p of BIBLICAL_PEOPLE) {
      map.set(p.id, p);
    }
    return map;
  }, []);

  // Filtered generations by search
  const filteredGenerations = useMemo(() => {
    if (!treeSearchQuery.trim()) return generationsMap;
    const q = treeSearchQuery.toLowerCase();

    return generationsMap
      .map(([genNum, people]) => {
        const filtered = people.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q)
        );
        return [genNum, filtered] as [number, BiblicalPerson[]];
      })
      .filter(([_, people]) => people.length > 0);
  }, [generationsMap, treeSearchQuery]);

  // Epoch Name descriptor based on generation number
  const getEpochName = (gen: number): { title: string; range: string } => {
    if (gen <= 10) return { title: 'Antediluvian Era (Creation to Great Flood)', range: 'Gen 1 – 10' };
    if (gen <= 19) return { title: 'Post-Flood Line of Shem to Terah', range: 'Gen 11 – 19' };
    if (gen <= 23) return { title: 'The Patriarchs & Covenant of Israel', range: 'Gen 20 – 23' };
    if (gen <= 28) return { title: 'Sojourn in Egypt & The Exodus Generation', range: 'Gen 24 – 28' };
    if (gen <= 32) return { title: 'Conquest of Canaan, Judges & Ruth', range: 'Gen 29 – 32' };
    if (gen <= 46) return { title: 'United Kingdom & Kings of Judah', range: 'Gen 33 – 46' };
    if (gen <= 53) return { title: 'Exile in Babylon & Second Temple Restoration', range: 'Gen 47 – 53' };
    if (gen <= 55) return { title: 'The Promised Messiah: Jesus Christ', range: 'Gen 54 – 55' };
    return { title: 'The Apostolic Church & Disciples', range: 'Gen 56 – 57' };
  };

  return (
    <div className="w-full flex flex-col h-full bg-neutral-950 text-neutral-100 overflow-y-auto p-4 sm:p-8">
      {/* Top Search & Filter Bar */}
      <div className="max-w-5xl mx-auto w-full pb-6 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-wider uppercase text-neutral-100 flex items-center gap-2">
            <span>Pedigree & Generational Tree</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-normal">
              {visiblePeople.length} Figures Visible
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Explicit parent-to-child generational hierarchy tracing the messianic line from Adam to Jesus Christ.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search generational tree..."
            value={treeSearchQuery}
            onChange={(e) => setTreeSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none w-56 sm:w-64"
          />
        </div>
      </div>

      {/* Main Generational Tree Flow */}
      <div className="max-w-5xl mx-auto w-full py-8 space-y-10">
        {filteredGenerations.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs">
            No biblical figures match your current time filter or search query.
          </div>
        ) : (
          filteredGenerations.map(([genNum, people], idx) => {
            const epoch = getEpochName(genNum);
            const isFirstInEpoch =
              idx === 0 || getEpochName(filteredGenerations[idx - 1][0]).title !== epoch.title;
            const isEpochCollapsed = !!collapsedEpochs[epoch.title];

            return (
              <div key={genNum} className="space-y-4">
                {/* Epoch Header Banner */}
                {isFirstInEpoch && (
                  <button
                    onClick={() => toggleEpochCollapse(epoch.title)}
                    className="w-full text-left pt-6 pb-2 border-b-2 border-neutral-800 flex items-center justify-between group hover:border-neutral-600 transition"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        Historical Epoch &bull; {epoch.range}
                      </span>
                      <h3 className="font-heading font-bold text-sm sm:text-base text-neutral-200 group-hover:text-white flex items-center gap-2">
                        <span>{epoch.title}</span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 group-hover:text-white">
                      <span>{isEpochCollapsed ? 'Expand' : 'Collapse'}</span>
                      {isEpochCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                )}

                {/* If epoch is collapsed, hide generation rows */}
                {!isEpochCollapsed && (
                  <>
                    {/* Generation Row Card */}
                    <div className="relative pl-6 sm:pl-10 border-l-2 border-neutral-800 space-y-3">
                      {/* Generation Badge on line */}
                      <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full bg-neutral-950 border-2 border-neutral-600 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-200 shadow">
                        {genNum}
                      </div>

                      {/* Generation Tag */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                          Generation {genNum}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-600">
                          ({people.length} {people.length === 1 ? 'person' : 'people'})
                        </span>
                      </div>

                      {/* People in this Generation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {people.map((person) => {
                          const father = person.fatherId ? personLookup.get(person.fatherId) : null;
                          const mother = person.motherId ? personLookup.get(person.motherId) : null;
                          const spouse = person.spouseId ? personLookup.get(person.spouseId) : null;

                          // Find children in subsequent generations
                          const children = BIBLICAL_PEOPLE.filter(
                            (c) => c.fatherId === person.id || c.motherId === person.id
                          );

                          const isPivotal = person.importance === 1;

                          return (
                            <div
                              key={person.id}
                              className={`p-4 rounded-xl border transition-all space-y-3 relative group ${
                                isPivotal
                                  ? 'bg-neutral-900 border-neutral-600 shadow-md hover:border-neutral-300'
                                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                              }`}
                            >
                              {/* Top: Name & Initial */}
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs border ${
                                      isPivotal
                                        ? 'bg-neutral-100 text-neutral-950 border-white'
                                        : 'bg-neutral-900 text-neutral-200 border-neutral-700'
                                    }`}
                                  >
                                    {person.name[0]}
                                  </div>
                                  <div>
                                    <h4 className="font-heading font-bold text-sm text-neutral-100 group-hover:text-white flex items-center gap-1.5">
                                      <span>{person.name}</span>
                                      {isPivotal && (
                                        <Sparkles className="w-3 h-3 text-neutral-400" />
                                      )}
                                    </h4>
                                    {person.hebrewGreek && (
                                      <span className="text-[10px] font-serif text-neutral-400">
                                        {person.hebrewGreek}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                                  Gen {person.generation}
                                </span>
                              </div>

                              {/* Role */}
                              <p className="text-[11px] text-neutral-400 leading-tight">
                                {person.role}
                              </p>

                              {/* Lineage & Relatives Badges */}
                              <div className="space-y-1 pt-1 border-t border-neutral-800/80 text-[10px] font-mono">
                                {father && (
                                  <div className="flex items-center gap-1.5 text-neutral-400">
                                    <span className="text-neutral-500 w-12 text-right">Father:</span>
                                    <button
                                      onClick={() => onSelectPerson(father.id)}
                                      className="text-neutral-200 hover:underline hover:text-white"
                                    >
                                      {father.name} (Gen {father.generation})
                                    </button>
                                  </div>
                                )}

                                {mother && (
                                  <div className="flex items-center gap-1.5 text-neutral-400">
                                    <span className="text-neutral-500 w-12 text-right">Mother:</span>
                                    <button
                                      onClick={() => onSelectPerson(mother.id)}
                                      className="text-neutral-200 hover:underline hover:text-white"
                                    >
                                      {mother.name} (Gen {mother.generation})
                                    </button>
                                  </div>
                                )}

                                {spouse && (
                                  <div className="flex items-center gap-1.5 text-neutral-400">
                                    <span className="text-neutral-500 w-12 text-right">Spouse:</span>
                                    <button
                                      onClick={() => onSelectPerson(spouse.id)}
                                      className="text-neutral-200 hover:underline hover:text-white"
                                    >
                                      {spouse.name}
                                    </button>
                                  </div>
                                )}

                                {children.length > 0 && (
                                  <div className="flex items-start gap-1.5 text-neutral-400 pt-0.5">
                                    <span className="text-neutral-500 w-12 text-right shrink-0">
                                      Children:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {children.map((c) => (
                                        <button
                                          key={c.id}
                                          onClick={() => onSelectPerson(c.id)}
                                          className="px-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                                        >
                                          {c.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {person.places.length > 0 && (
                                  <div className="flex items-center gap-1.5 text-neutral-400 pt-0.5">
                                    <span className="text-neutral-500 w-12 text-right shrink-0">Place:</span>
                                    <button
                                      onClick={() => onNavigateToLocation(person.places[0])}
                                      className="text-neutral-300 hover:text-white capitalize flex items-center gap-1 truncate"
                                    >
                                      <MapPin className="w-2.5 h-2.5 text-neutral-500" />
                                      <span className="truncate">{person.places[0].replace('-', ' ')}</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Quick Actions */}
                              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                                <button
                                  onClick={() => onSelectPerson(person.id)}
                                  className="text-neutral-300 hover:text-white font-medium flex items-center gap-1"
                                >
                                  <span>Profile</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>

                                {person.verses.length > 0 && (
                                  <button
                                    onClick={() => {
                                      const match = person.verses[0].match(/^(\d?\s?[A-Za-z]+)\s+(\d+)/);
                                      if (match) {
                                        onNavigateToScripture(match[1].trim(), parseInt(match[2]));
                                      }
                                    }}
                                    className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1 font-mono text-[9px]"
                                    title={`Read ${person.verses[0]}`}
                                  >
                                    <BookOpen className="w-3 h-3 text-neutral-500" />
                                    <span className="truncate max-w-[70px]">{person.verses[0]}</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => onSwitchToGraphView(person.id)}
                                  className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                                  title="Inspect in 360° Network Graph"
                                >
                                  <Network className="w-3 h-3" />
                                  <span>Graph</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Generational Connector Arrow */}
                    {idx < filteredGenerations.length - 1 && (
                      <div className="pl-6 sm:pl-10 py-1">
                        <ArrowDown className="w-4 h-4 text-neutral-700" />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
