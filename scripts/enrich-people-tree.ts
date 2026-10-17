import fs from 'fs';
import path from 'path';
import { BIBLICAL_PEOPLE, BIBLICAL_RELATIONSHIPS } from '../src/data/biblicalPeople';

const genealogicalData: Record<string, { gen: number; eraOrder: number; father?: string; mother?: string; spouse?: string }> = {
  adam: { gen: 1, eraOrder: 1, spouse: 'eve' },
  eve: { gen: 1, eraOrder: 1, spouse: 'adam' },
  cain: { gen: 2, eraOrder: 1, father: 'adam', mother: 'eve' },
  abel: { gen: 2, eraOrder: 1, father: 'adam', mother: 'eve' },
  seth: { gen: 2, eraOrder: 1, father: 'adam', mother: 'eve' },
  enosh: { gen: 3, eraOrder: 1, father: 'seth' },
  kenan: { gen: 4, eraOrder: 1, father: 'enosh' },
  mahalalel: { gen: 5, eraOrder: 1, father: 'kenan' },
  jared: { gen: 6, eraOrder: 1, father: 'mahalalel' },
  enoch: { gen: 7, eraOrder: 1, father: 'jared' },
  methuselah: { gen: 8, eraOrder: 1, father: 'enoch' },
  'lamech-patriarch': { gen: 9, eraOrder: 1, father: 'methuselah' },
  noah: { gen: 10, eraOrder: 1, father: 'lamech-patriarch' },
  shem: { gen: 11, eraOrder: 1, father: 'noah' },
  arphaxad: { gen: 12, eraOrder: 1, father: 'shem' },
  shelah: { gen: 13, eraOrder: 1, father: 'arphaxad' },
  eber: { gen: 14, eraOrder: 1, father: 'shelah' },
  peleg: { gen: 15, eraOrder: 1, father: 'eber' },
  reu: { gen: 16, eraOrder: 1, father: 'peleg' },
  serug: { gen: 17, eraOrder: 1, father: 'reu' },
  'nahor-i': { gen: 18, eraOrder: 1, father: 'serug' },
  terah: { gen: 19, eraOrder: 1, father: 'nahor-i' },
  abraham: { gen: 20, eraOrder: 1, father: 'terah', spouse: 'sarah' },
  sarah: { gen: 20, eraOrder: 1, spouse: 'abraham' },
  hagar: { gen: 20, eraOrder: 1 },
  ishmael: { gen: 21, eraOrder: 1, father: 'abraham', mother: 'hagar' },
  lot: { gen: 20, eraOrder: 1 },
  isaac: { gen: 21, eraOrder: 1, father: 'abraham', mother: 'sarah', spouse: 'rebekah' },
  rebekah: { gen: 21, eraOrder: 1, spouse: 'isaac' },
  esau: { gen: 22, eraOrder: 1, father: 'isaac', mother: 'rebekah' },
  jacob: { gen: 22, eraOrder: 1, father: 'isaac', mother: 'rebekah', spouse: 'rachel' },
  leah: { gen: 22, eraOrder: 1, spouse: 'jacob' },
  rachel: { gen: 22, eraOrder: 1, spouse: 'jacob' },
  judah: { gen: 23, eraOrder: 1, father: 'jacob', mother: 'leah' },
  perez: { gen: 24, eraOrder: 1, father: 'judah' },
  hezron: { gen: 25, eraOrder: 1, father: 'perez' },
  ram: { gen: 26, eraOrder: 2, father: 'hezron' },
  amminadab: { gen: 27, eraOrder: 2, father: 'ram' },
  nahshon: { gen: 28, eraOrder: 2, father: 'amminadab' },
  salmon: { gen: 29, eraOrder: 3, father: 'nahshon', spouse: 'rahab' },
  rahab: { gen: 29, eraOrder: 3, spouse: 'salmon' },
  boaz: { gen: 30, eraOrder: 3, father: 'salmon', mother: 'rahab', spouse: 'ruth' },
  ruth: { gen: 30, eraOrder: 3, spouse: 'boaz' },
  naomi: { gen: 29, eraOrder: 3 },
  obed: { gen: 31, eraOrder: 3, father: 'boaz', mother: 'ruth' },
  jesse: { gen: 32, eraOrder: 4, father: 'obed' },
  levi: { gen: 23, eraOrder: 1, father: 'jacob', mother: 'leah' },
  kohath: { gen: 24, eraOrder: 2, father: 'levi' },
  amram: { gen: 25, eraOrder: 2, father: 'kohath', spouse: 'jochebed' },
  jochebed: { gen: 25, eraOrder: 2, spouse: 'amram' },
  moses: { gen: 26, eraOrder: 2, father: 'amram', mother: 'jochebed' },
  aaron: { gen: 26, eraOrder: 2, father: 'amram', mother: 'jochebed' },
  miriam: { gen: 26, eraOrder: 2, father: 'amram', mother: 'jochebed' },
  joshua: { gen: 27, eraOrder: 3 },
  caleb: { gen: 27, eraOrder: 3 },
  samuel: { gen: 31, eraOrder: 3 },
  saul: { gen: 32, eraOrder: 4 },
  jonathan: { gen: 33, eraOrder: 4, father: 'saul' },
  david: { gen: 33, eraOrder: 4, father: 'jesse', spouse: 'bathsheba' },
  bathsheba: { gen: 33, eraOrder: 4, spouse: 'david' },
  solomon: { gen: 34, eraOrder: 4, father: 'david', mother: 'bathsheba' },
  rehoboam: { gen: 35, eraOrder: 5, father: 'solomon' },
  abijah: { gen: 36, eraOrder: 5, father: 'rehoboam' },
  asa: { gen: 37, eraOrder: 5, father: 'abijah' },
  jehoshaphat: { gen: 38, eraOrder: 5, father: 'asa' },
  joram: { gen: 39, eraOrder: 5, father: 'jehoshaphat' },
  uzziah: { gen: 40, eraOrder: 5, father: 'joram' },
  jotham: { gen: 41, eraOrder: 5, father: 'uzziah' },
  ahaz: { gen: 42, eraOrder: 5, father: 'jotham' },
  hezekiah: { gen: 43, eraOrder: 5, father: 'ahaz' },
  manasseh: { gen: 44, eraOrder: 5, father: 'hezekiah' },
  amon: { gen: 45, eraOrder: 5, father: 'manasseh' },
  josiah: { gen: 46, eraOrder: 5, father: 'amon' },
  jeconiah: { gen: 47, eraOrder: 6, father: 'josiah' },
  shealtiel: { gen: 48, eraOrder: 6, father: 'jeconiah' },
  zerubbabel: { gen: 49, eraOrder: 6, father: 'shealtiel' },
  abiud: { gen: 50, eraOrder: 6, father: 'zerubbabel' },
  eliakim: { gen: 51, eraOrder: 6, father: 'abiud' },
  matthan: { gen: 52, eraOrder: 6, father: 'eliakim' },
  'jacob-father-joseph': { gen: 53, eraOrder: 6, father: 'matthan' },
  'joseph-husband': { gen: 54, eraOrder: 7, father: 'jacob-father-joseph', spouse: 'mary-mother' },
  'mary-mother': { gen: 54, eraOrder: 7, spouse: 'joseph-husband' },
  jesus: { gen: 55, eraOrder: 7, mother: 'mary-mother', father: 'joseph-husband' },
  'john-baptist': { gen: 54, eraOrder: 7 },
  peter: { gen: 55, eraOrder: 7 },
  andrew: { gen: 55, eraOrder: 7 },
  'james-zebedee': { gen: 55, eraOrder: 7 },
  'john-apostle': { gen: 55, eraOrder: 7 },
  thomas: { gen: 55, eraOrder: 7 },
  matthew: { gen: 55, eraOrder: 7 },
  'mary-magdalene': { gen: 55, eraOrder: 7 },
  lazarus: { gen: 55, eraOrder: 7 },
  stephen: { gen: 56, eraOrder: 8 },
  paul: { gen: 56, eraOrder: 8 },
  barnabas: { gen: 56, eraOrder: 8 },
  silas: { gen: 56, eraOrder: 8 },
  timothy: { gen: 57, eraOrder: 8 },
  luke: { gen: 56, eraOrder: 8 },
  'james-brother': { gen: 55, eraOrder: 8, mother: 'mary-mother' },
};

const enrichedPeople = BIBLICAL_PEOPLE.map((p) => {
  const g = genealogicalData[p.id] || { gen: 20, eraOrder: 1 };
  return {
    ...p,
    eraOrder: g.eraOrder,
    generation: g.gen,
    fatherId: g.father,
    motherId: g.mother,
    spouseId: g.spouse,
  };
});

const outContent = `export type BiblicalEra =
  | 'Creation & Patriarchs'
  | 'Exodus & Judges'
  | 'Monarchy & Prophets'
  | 'Exile & Return'
  | 'Gospels & Christ'
  | 'Apostles & Early Church';

export type RelationshipType =
  | 'parent-child'
  | 'spouse'
  | 'sibling'
  | 'mentor-disciple'
  | 'alliance'
  | 'rivalry';

export interface BiblicalPerson {
  id: string;
  name: string;
  hebrewGreek?: string;
  meaning?: string;
  era: BiblicalEra;
  eraOrder: number; // 1 = Patriarchs, 2 = Exodus, 3 = Judges, 4 = United Kings, 5 = Divided Kings, 6 = Exile, 7 = Gospels, 8 = Apostles
  generation: number; // 1 = Adam, 2 = Seth, ... 20 = Abraham, ... 33 = David, ... 55 = Jesus
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  role: string;
  gender: 'male' | 'female';
  importance: 1 | 2 | 3;
  summary: string;
  verses: string[];
  places: string[];
}

export interface BiblicalRelationship {
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
}

export const BIBLICAL_ERAS: BiblicalEra[] = [
  'Creation & Patriarchs',
  'Exodus & Judges',
  'Monarchy & Prophets',
  'Exile & Return',
  'Gospels & Christ',
  'Apostles & Early Church',
];

export const BIBLICAL_PEOPLE: BiblicalPerson[] = ${JSON.stringify(enrichedPeople, null, 2)};

export const BIBLICAL_RELATIONSHIPS: BiblicalRelationship[] = ${JSON.stringify(BIBLICAL_RELATIONSHIPS, null, 2)};
`;

fs.writeFileSync(path.resolve(import.meta.dir, '../src/data/biblicalPeople.ts'), outContent, 'utf8');
console.log('Successfully enriched biblicalPeople.ts with eraOrder and generation!');
