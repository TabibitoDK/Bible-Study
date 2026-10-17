export interface TimelineEra {
  id: string;
  order: number;
  name: string;
  shortName: string;
  bibleScope: string;
  approxDate: string;
  description: string;
  keyFigures: string[];
}

export const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: 'creation-patriarchs',
    order: 1,
    name: 'Creation & Patriarchs',
    shortName: 'Patriarchs',
    bibleScope: 'Genesis 1 – 50',
    approxDate: 'Beginnings – c. 1800 BC',
    description: 'From Adam & Eve to Noah, Abraham, Isaac, Jacob, and Joseph in Egypt.',
    keyFigures: ['Adam', 'Noah', 'Abraham', 'Isaac', 'Jacob', 'Joseph', 'Judah'],
  },
  {
    id: 'exodus-wilderness',
    order: 2,
    name: 'Exodus & Wilderness',
    shortName: 'Exodus',
    bibleScope: 'Exodus – Deuteronomy',
    approxDate: 'c. 1446 – 1406 BC',
    description: 'Deliverance from Egypt, Red Sea crossing, the Law at Mount Sinai, and 40 years wandering.',
    keyFigures: ['Moses', 'Aaron', 'Miriam', 'Amminadab', 'Nahshon'],
  },
  {
    id: 'conquest-judges',
    order: 3,
    name: 'Conquest & Judges',
    shortName: 'Judges',
    bibleScope: 'Joshua – 1 Samuel 7',
    approxDate: 'c. 1406 – 1050 BC',
    description: 'Entering Canaan under Joshua, Rahab, tribal judges, Ruth & Boaz, and the prophet Samuel.',
    keyFigures: ['Joshua', 'Caleb', 'Rahab', 'Boaz', 'Ruth', 'Samuel'],
  },
  {
    id: 'united-kingdom',
    order: 4,
    name: 'United Monarchy',
    shortName: 'United Kings',
    bibleScope: '1 Samuel 8 – 1 Kings 11',
    approxDate: 'c. 1050 – 930 BC',
    description: 'King Saul, Jonathan, King David conquering Jerusalem, and Solomon building the Temple.',
    keyFigures: ['Saul', 'Jonathan', 'David', 'Bathsheba', 'Solomon'],
  },
  {
    id: 'divided-kingdom',
    order: 5,
    name: 'Divided Kingdom & Prophets',
    shortName: 'Kingdoms',
    bibleScope: '1 Kings 12 – 2 Kings 25',
    approxDate: 'c. 930 – 586 BC',
    description: 'The split into Judah and Israel, Elijah, Elisha, Isaiah, Hezekiah, Josiah, and Jeremiah.',
    keyFigures: ['Rehoboam', 'Elijah', 'Hezekiah', 'Isaiah', 'Josiah', 'Jeremiah'],
  },
  {
    id: 'exile-return',
    order: 6,
    name: 'Babylonian Exile & Return',
    shortName: 'Exile & Return',
    bibleScope: 'Daniel, Esther, Ezra, Nehemiah',
    approxDate: 'c. 586 – 400 BC',
    description: 'Exile in Babylon, Daniel in lions’ den, Queen Esther, and Zerubbabel rebuilding the Second Temple.',
    keyFigures: ['Daniel', 'Esther', 'Zerubbabel', 'Ezra', 'Nehemiah'],
  },
  {
    id: 'gospels-christ',
    order: 7,
    name: 'The Gospels & Life of Christ',
    shortName: 'Life of Christ',
    bibleScope: 'Matthew – John',
    approxDate: 'c. 4 BC – AD 33',
    description: 'The incarnation, baptism, ministry, miracles, crucifixion, and resurrection of Jesus Christ.',
    keyFigures: ['Jesus', 'Mary', 'Joseph', 'John the Baptist', 'Peter', 'John'],
  },
  {
    id: 'apostolic-church',
    order: 8,
    name: 'Apostolic Expansion & Epistles',
    shortName: 'Early Church',
    bibleScope: 'Acts – Revelation',
    approxDate: 'c. AD 33 – 100',
    description: 'Pentecost, missionary journeys of Paul, planting churches in Rome, Greece, and Asia Minor.',
    keyFigures: ['Paul', 'Barnabas', 'Silas', 'Timothy', 'Luke', 'James the Just'],
  },
];
