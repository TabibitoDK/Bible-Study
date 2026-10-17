import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Compass,
  Search,
  BookOpen,
  Network,
  X,
  Calendar,
  List,
} from 'lucide-react';
import { BIBLICAL_LOCATIONS } from '../data/biblicalLocations';
import type { BiblicalLocation } from '../data/biblicalLocations';
import { BIBLICAL_PEOPLE } from '../data/biblicalPeople';
import { TimelineSlider } from './TimelineSlider';
import { parseScriptureReference } from '../utils/scriptureReference';

interface BibleMapProps {
  onNavigateToScripture: (book: string, chapter: number, verse?: number) => void;
  onNavigateToPerson: (personId: string) => void;
  selectedLocationId?: string | null;
  onSelectLocation?: (locationId: string | null) => void;
  theme: 'dark' | 'light';
  currentEraOrder: number;
  onEraChange: (era: number) => void;
}

export const BibleMap: React.FC<BibleMapProps> = ({
  onNavigateToScripture,
  onNavigateToPerson,
  selectedLocationId: propSelectedLocationId,
  onSelectLocation,
  theme,
  currentEraOrder,
  onEraChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Filters & State
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');

  // Selected Location
  const [activeLocation, setActiveLocation] = useState<BiblicalLocation | null>(null);
  const [showPlaces, setShowPlaces] = useState(() => window.innerWidth >= 1024);
  const inspectedLocation = activeLocation ? { ...activeLocation, events: activeLocation.events.filter((event) => event.eraOrder <= currentEraOrder) } : null;
  const selectPlace = (location: BiblicalLocation) => {
    setActiveLocation(location); onSelectLocation?.(location.id);
    if (window.innerWidth < 640) setShowPlaces(false);
    mapRef.current?.flyTo(location.coordinates, 8, { duration: .8 });
  };

  // Filtered locations based on Chronological Time Slider and Region
  const filteredLocations = useMemo(() => {
    return BIBLICAL_LOCATIONS.filter((loc) => {
      // 1. Time Slider filter: only show locations that exist up to the current era
      if (loc.eraOrder > currentEraOrder) return false;

      // 2. Region filter
      if (selectedRegion !== 'All' && loc.region !== selectedRegion) return false;

      // 3. Search query
      if (searchLocationQuery.trim()) {
        const q = searchLocationQuery.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.modernName.toLowerCase().includes(q) ||
          loc.description.toLowerCase().includes(q)
        );
      }
      return true;
    }).map((loc) => ({
      ...loc,
      // Filter events to only those that occurred up to currentEraOrder
      events: loc.events.filter((evt) => evt.eraOrder <= currentEraOrder),
    }));
  }, [currentEraOrder, selectedRegion, searchLocationQuery]);

  // Sync prop selected location
  useEffect(() => {
    if (propSelectedLocationId) {
      const loc = BIBLICAL_LOCATIONS.find((l) => l.id === propSelectedLocationId);
      if (loc) {
        setActiveLocation(loc);
        setSelectedRegion('All'); setSearchLocationQuery('');
        if (loc.eraOrder > currentEraOrder) onEraChange(loc.eraOrder);
        if (mapRef.current) {
          mapRef.current.flyTo(loc.coordinates, 9, { duration: 1.2 });
        }
      }
    }
  }, [propSelectedLocationId]);

  // Initialize Leaflet Map (without journey polyline tracks)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    // Center on Holy Land / Eastern Mediterranean
    const map = L.map(mapContainerRef.current, {
      center: BIBLICAL_LOCATIONS.find((location) => location.id === propSelectedLocationId)?.coordinates || [32.0, 35.5],
      zoom: propSelectedLocationId ? 9 : 6,
      minZoom: 3,
      maxZoom: 16,
      zoomControl: false,
    });

    // Custom monochrome tile layer (OpenStreetMap with high-contrast grayscale filter)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Canon & Chronos Biblical Atlas',
      className: 'monochrome-map-tiles',
      maxZoom: 19,
    });
    tileLayer.addTo(map);

    // Zoom control in bottom right
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapRef.current = map;
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(mapContainerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Markers when era or filters change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    filteredLocations.forEach((loc) => {
      const isSelected = activeLocation?.id === loc.id;
      const eventsCount = loc.events.length;

      // Create Custom Monochrome HTML Pin
      const pinHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-7 h-7 rounded-full flex items-center justify-center transition-all transform hover:scale-125 ${
            isSelected
              ? 'bg-neutral-100 text-neutral-950 ring-4 ring-neutral-400 shadow-2xl scale-125'
              : 'bg-neutral-900 border border-neutral-600 text-neutral-200 hover:border-neutral-100 shadow-md'
          }">
            <div class="w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-neutral-950' : 'bg-neutral-100'}"></div>
          </div>
          ${
            eventsCount > 0
              ? `<span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-600 text-[8px] font-mono flex items-center justify-center text-neutral-200">
                  ${eventsCount}
                </span>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-biblical-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon, title: loc.name, alt: loc.name, keyboard: true });

      marker.on('click', () => selectPlace(loc));

      marker.bindTooltip(`<b>${loc.name}</b><br/><span style="font-size:10px; opacity:0.8">${loc.modernName}</span>`, {
        direction: 'top',
        offset: [0, -12],
        className: 'monochrome-tooltip',
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [filteredLocations, activeLocation, theme]);

  // Fly to region preset
  const handleFlyToPreset = (center: [number, number], zoom: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="atlas-page relative w-full overflow-hidden bg-neutral-950 flex flex-col">
      {/* Top Floating Controls */}
      <div className="atlas-toolbar">
        <button onClick={() => setShowPlaces((value) => !value)} className="speech-button" aria-expanded={showPlaces} aria-controls="atlas-places"><List size={15} />{showPlaces ? 'Hide places' : 'Show places'}</button>
        {/* Region Filter */}
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg p-1 flex items-center gap-1 shadow-lg text-xs">
          <span className="text-[10px] font-mono uppercase text-neutral-400 px-2 flex items-center gap-1">
            <Compass className="w-3 h-3" /> Region:
          </span>
          <select
            aria-label="Map region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 text-neutral-200 py-1 px-2 rounded focus:outline-none text-xs"
          >
            <option value="All">All Biblical Lands</option>
            <option value="Canaan & Israel">Canaan & Israel</option>
            <option value="Egypt & Sinai">Egypt & Sinai</option>
            <option value="Mesopotamia">Mesopotamia (Ur, Babylon)</option>
            <option value="Asia Minor & Greece">Asia Minor & Greece</option>
            <option value="Roman Empire">Roman Empire</option>
          </select>
        </div>

        {/* Quick Search Location */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search biblical place..."
            value={searchLocationQuery}
            onChange={(e) => { setSearchLocationQuery(e.target.value); setShowPlaces(true); }}
            className="w-40 sm:w-52 pl-7 pr-3 py-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 shadow-lg"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
        </div>

        {/* Quick Region Presets */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-1 rounded-lg shadow-lg text-xs">
          <button
            onClick={() => handleFlyToPreset([31.7767, 35.2345], 11)}
            className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            Jerusalem
          </button>
          <button
            onClick={() => handleFlyToPreset([32.8236, 35.5843], 10)}
            className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            Galilee
          </button>
          <button
            onClick={() => handleFlyToPreset([28.5392, 33.9750], 9)}
            className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            Sinai
          </button>
          <button
            onClick={() => handleFlyToPreset([37.9497, 27.3639], 9)}
            className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            Ephesus
          </button>
          <button
            onClick={() => handleFlyToPreset([32.0, 35.5], 5)}
            className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="atlas-stage">
      <div ref={mapContainerRef} className="atlas-map-canvas absolute inset-0" aria-label="Biblical atlas map" />
      {showPlaces && <aside id="atlas-places" aria-label="Biblical places" className="atlas-places">
        <div className="flex items-center justify-between gap-3 p-3 border-b border-neutral-800">
          <div><h2 className="text-sm font-semibold">Biblical places</h2><p className="text-[11px] text-neutral-400 mt-1">{filteredLocations.length} locations in this era</p></div>
          <button onClick={() => setShowPlaces(false)} aria-label="Close places" className="p-2"><X size={16} /></button>
        </div>
        <div className="min-h-0 overflow-y-auto p-2 space-y-1">
          {!filteredLocations.length && <p className="text-xs text-neutral-400 p-3">No places match these filters. Change the search, region or era.</p>}
          {filteredLocations.map((location) => <button key={location.id} onClick={() => selectPlace(location)} className={`atlas-place-button ${activeLocation?.id === location.id ? 'bg-neutral-800' : ''}`}>
            <span className="block text-xs font-medium">{location.name}</span><span className="block text-[10px] text-neutral-400 mt-1">{location.region} · {location.events.length} events</span>
          </button>)}
        </div>
      </aside>}

      {/* Slide-over Inspector Drawer for Selected Location */}
      {inspectedLocation && (
        <aside aria-label="Location details" className="atlas-details absolute top-0 right-0 z-30 w-full sm:w-[420px] h-full bg-neutral-950 border-l border-neutral-800 p-5 flex flex-col overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                {inspectedLocation.region}
              </span>
              <h2 className="font-heading text-2xl font-bold text-neutral-100 mt-0.5">
                {inspectedLocation.name}
              </h2>
              {inspectedLocation.ancientName && (
                <div className="text-xs font-serif text-neutral-400 mt-0.5">
                  Ancient: {inspectedLocation.ancientName} &bull; Modern: {inspectedLocation.modernName}
                </div>
              )}
            </div>
            <button
              aria-label="Close location details"
              onClick={() => { setActiveLocation(null); onSelectLocation?.(null); }}
              className="p-1 text-neutral-400 hover:text-neutral-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Geographic & Historical Overview
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {inspectedLocation.description}
            </p>
          </div>

          {/* Biblical Events at this Location (Filtered to current era) */}
          <div className="mt-6 flex-1">
            <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Biblical Events ({inspectedLocation.events.length})</span>
            </h3>

            {inspectedLocation.events.length === 0 ? (
              <p className="text-xs text-neutral-500 italic p-3 rounded bg-neutral-900 border border-neutral-800">
                No recorded biblical events at this location prior to Era {currentEraOrder}. Advance the timeline slider below to reveal later events.
              </p>
            ) : (
              <div className="space-y-3">
                {inspectedLocation.events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-heading font-semibold text-xs text-neutral-100">
                        {evt.title}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                        {evt.era.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                      {evt.description}
                    </p>

                    {/* Scriptures for this event */}
                    <div className="pt-1 flex flex-wrap gap-1">
                      {evt.verses.map((vRef, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const reference = parseScriptureReference(vRef);
                            if (reference) onNavigateToScripture(reference.book, reference.chapter, reference.verse);
                          }}
                          className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white transition flex items-center gap-1"
                        >
                          <BookOpen className="w-2.5 h-2.5 text-neutral-400" />
                          <span>{vRef}</span>
                        </button>
                      ))}
                    </div>

                    {/* People involved in this event */}
                    {evt.peopleIds.length > 0 && (
                      <div className="pt-1 flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-neutral-500 font-mono">Figures:</span>
                        {evt.peopleIds.map((pId) => {
                          const person = BIBLICAL_PEOPLE.find((p) => p.id === pId);
                          return (
                            <button
                              key={pId}
                              onClick={() => onNavigateToPerson(pId)}
                              className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-200 transition flex items-center gap-0.5"
                            >
                              <Network className="w-2.5 h-2.5 text-neutral-400" />
                              <span>{person?.name || pId}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Biblical Figures for this City */}
          {inspectedLocation.relatedPeople.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                Biblical Characters Associated
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {inspectedLocation.relatedPeople.map((pId) => {
                  const person = BIBLICAL_PEOPLE.find((p) => p.id === pId);
                  return (
                    <button
                      key={pId}
                      onClick={() => onNavigateToPerson(pId)}
                      className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-200 transition flex items-center gap-1"
                    >
                      <Network className="w-3 h-3 text-neutral-400" />
                      <span>{person?.name || pId}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      )}
      </div>
      <div className="atlas-timeline"><TimelineSlider currentEraOrder={currentEraOrder} onEraChange={onEraChange} revealedCountText={`${filteredLocations.length} Locations Active`} /></div>
    </div>
  );
};
