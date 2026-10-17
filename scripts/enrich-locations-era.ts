import fs from 'fs';
import path from 'path';
import { BIBLICAL_LOCATIONS } from '../src/data/biblicalLocations';

const eraOrderMap: Record<string, number> = {
  'Creation & Patriarchs': 1,
  'Exodus & Judges': 2,
  'Exodus': 2,
  'Judges': 3,
  'Monarchy & Prophets': 4,
  'Monarchy': 4,
  'Divided Kingdom': 5,
  'Exile & Return': 6,
  'Gospels & Christ': 7,
  'Apostles & Early Church': 8,
};

const enrichedLocations = BIBLICAL_LOCATIONS.map((loc) => {
  const enrichedEvents = loc.events.map((evt) => {
    let order = eraOrderMap[evt.era] || 1;
    // Granular tuning by title/description
    if (evt.era === 'Exodus & Judges') {
      if (evt.title.toLowerCase().includes('conquer') || evt.title.toLowerCase().includes('judges') || evt.title.toLowerCase().includes('jericho') || evt.title.toLowerCase().includes('samuel') || evt.title.toLowerCase().includes('ruth')) {
        order = 3;
      } else {
        order = 2;
      }
    } else if (evt.era === 'Monarchy & Prophets') {
      if (evt.title.toLowerCase().includes('elijah') || evt.title.toLowerCase().includes('elisha') || evt.title.toLowerCase().includes('split') || evt.title.toLowerCase().includes('golden calf') || evt.title.toLowerCase().includes('ivory') || evt.title.toLowerCase().includes('hezekiah') || evt.title.toLowerCase().includes('josiah') || evt.title.toLowerCase().includes('isaiah') || evt.title.toLowerCase().includes('jeremiah') || evt.title.toLowerCase().includes('syrian')) {
        order = 5;
      } else {
        order = 4;
      }
    }

    return {
      ...evt,
      eraOrder: order,
    };
  });

  const minEraOrder = enrichedEvents.length > 0 ? Math.min(...enrichedEvents.map((e) => e.eraOrder)) : 1;

  return {
    ...loc,
    eraOrder: minEraOrder,
    events: enrichedEvents,
  };
});

const outContent = `export type RegionType =
  | 'Canaan & Israel'
  | 'Egypt & Sinai'
  | 'Mesopotamia'
  | 'Asia Minor & Greece'
  | 'Roman Empire';

export interface BiblicalEvent {
  id: string;
  title: string;
  era: string;
  eraOrder: number; // 1 to 8
  description: string;
  verses: string[];
  peopleIds: string[];
}

export interface BiblicalLocation {
  id: string;
  name: string;
  ancientName?: string;
  modernName: string;
  region: RegionType;
  coordinates: [number, number]; // [lat, lng]
  eraOrder: number; // 1 to 8: earliest biblical era this location appears
  description: string;
  events: BiblicalEvent[];
  scriptureRefs: string[];
  relatedPeople: string[];
}

export const BIBLICAL_LOCATIONS: BiblicalLocation[] = ${JSON.stringify(enrichedLocations, null, 2)};
`;

fs.writeFileSync(path.resolve(import.meta.dir, '../src/data/biblicalLocations.ts'), outContent, 'utf8');
console.log('Successfully enriched biblicalLocations.ts with eraOrder!');
