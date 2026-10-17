export type BiblicalEra =
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

export const BIBLICAL_PEOPLE: BiblicalPerson[] = [
  {
    "id": "adam",
    "name": "Adam",
    "hebrewGreek": "אָדָם",
    "meaning": "Man / Red earth",
    "era": "Creation & Patriarchs",
    "role": "First Man & Federal Head of Humanity",
    "gender": "male",
    "importance": 1,
    "summary": "Created in the image and likeness of God from the dust of the ground, placed in Eden to cultivate it, and became the father of humanity.",
    "verses": [
      "Genesis 1:26-28",
      "Genesis 2:7",
      "Genesis 3:6-19",
      "Romans 5:12-19",
      "1 Corinthians 15:22"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 1,
    "spouseId": "eve"
  },
  {
    "id": "eve",
    "name": "Eve",
    "hebrewGreek": "חַוָּה (Chavvah)",
    "meaning": "Mother of all living",
    "era": "Creation & Patriarchs",
    "role": "First Woman & Mother of All Living",
    "gender": "female",
    "importance": 1,
    "summary": "Fashioned by God from Adam’s side as his suitable partner and companion; received the first gospel promise of the Seed who would crush the serpent.",
    "verses": [
      "Genesis 2:18-24",
      "Genesis 3:1-20",
      "2 Corinthians 11:3",
      "1 Timothy 2:13"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 1,
    "spouseId": "adam"
  },
  {
    "id": "cain",
    "name": "Cain",
    "hebrewGreek": "קַיִן",
    "meaning": "Acquired / Produced",
    "era": "Creation & Patriarchs",
    "role": "Firstborn of Adam & Eve / First Murderer",
    "gender": "male",
    "importance": 3,
    "summary": "Tiller of the soil whose faithless offering was rejected; in jealous wrath he killed his righteous brother Abel and was banished to the land of Nod.",
    "verses": [
      "Genesis 4:1-16",
      "Hebrews 11:4",
      "1 John 3:12"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 2,
    "fatherId": "adam",
    "motherId": "eve"
  },
  {
    "id": "abel",
    "name": "Abel",
    "hebrewGreek": "הֶבֶל (Hevel)",
    "meaning": "Breath / Vapor",
    "era": "Creation & Patriarchs",
    "role": "Second Son of Adam & First Martyr of Faith",
    "gender": "male",
    "importance": 2,
    "summary": "Keeper of sheep who offered the fat portions of the firstborn of his flock by faith, commended by God as righteous before being martyred.",
    "verses": [
      "Genesis 4:2-10",
      "Hebrews 11:4",
      "Matthew 23:35"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 2,
    "fatherId": "adam",
    "motherId": "eve"
  },
  {
    "id": "seth",
    "name": "Seth",
    "hebrewGreek": "שֵׁת",
    "meaning": "Appointed / Substitute",
    "era": "Creation & Patriarchs",
    "role": "Third Named Son of Adam / Seed of the Promise",
    "gender": "male",
    "importance": 2,
    "summary": "Born after Abel’s murder to carry the godly lineage; in his generation men first began to call upon the name of Yahweh.",
    "verses": [
      "Genesis 4:25-26",
      "Genesis 5:3-8",
      "Luke 3:38"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 2,
    "fatherId": "adam",
    "motherId": "eve"
  },
  {
    "id": "enosh",
    "name": "Enosh",
    "hebrewGreek": "אֱנוֹשׁ",
    "meaning": "Mortal man / Frail",
    "era": "Creation & Patriarchs",
    "role": "Son of Seth / Patriarch in Messianic Line",
    "gender": "male",
    "importance": 3,
    "summary": "Son of Seth and grandson of Adam; during his days public corporate worship of Yahweh began in earnest.",
    "verses": [
      "Genesis 4:26",
      "Genesis 5:9-11",
      "Luke 3:38"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 3,
    "fatherId": "seth"
  },
  {
    "id": "kenan",
    "name": "Kenan",
    "hebrewGreek": "קֵינָן",
    "meaning": "Acquisition / Possession",
    "era": "Creation & Patriarchs",
    "role": "Son of Enosh / Fourth Patriarch from Adam",
    "gender": "male",
    "importance": 3,
    "summary": "Patriarch who lived 910 years, father of Mahalalel in the unbroken genealogical chain from Adam to Noah.",
    "verses": [
      "Genesis 5:12-14",
      "1 Chronicles 1:2",
      "Luke 3:37"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 4,
    "fatherId": "enosh"
  },
  {
    "id": "mahalalel",
    "name": "Mahalalel",
    "hebrewGreek": "מַהֲלַלְאֵל",
    "meaning": "Praise of God",
    "era": "Creation & Patriarchs",
    "role": "Fifth Patriarch from Adam",
    "gender": "male",
    "importance": 3,
    "summary": "Son of Kenan and father of Jared, lived 895 years in the antediluvian line of faith.",
    "verses": [
      "Genesis 5:15-17",
      "Luke 3:37"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 5,
    "fatherId": "kenan"
  },
  {
    "id": "jared",
    "name": "Jared",
    "hebrewGreek": "יֶרֶד",
    "meaning": "Descent / Descending",
    "era": "Creation & Patriarchs",
    "role": "Sixth Patriarch from Adam & Father of Enoch",
    "gender": "male",
    "importance": 3,
    "summary": "Lived 962 years, the second-longest recorded lifespan in the Bible, and raised Enoch.",
    "verses": [
      "Genesis 5:18-20",
      "Luke 3:37"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 6,
    "fatherId": "mahalalel"
  },
  {
    "id": "enoch",
    "name": "Enoch",
    "hebrewGreek": "חֲנוֹךְ",
    "meaning": "Dedicated / Initiated",
    "era": "Creation & Patriarchs",
    "role": "Seventh from Adam Who Walked with God",
    "gender": "male",
    "importance": 2,
    "summary": "Walked in unbroken fellowship with God for 300 years; he did not see death because God took him directly to glory.",
    "verses": [
      "Genesis 5:21-24",
      "Hebrews 11:5",
      "Jude 1:14-15"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 7,
    "fatherId": "jared"
  },
  {
    "id": "methuselah",
    "name": "Methuselah",
    "hebrewGreek": "מְתוּשֶׁלַח",
    "meaning": "When he dies, it shall come",
    "era": "Creation & Patriarchs",
    "role": "Eighth Patriarch / Longest Lived Man (969 Years)",
    "gender": "male",
    "importance": 2,
    "summary": "Son of Enoch who lived 969 years, dying in the very year of the Great Deluge, demonstrating God’s long-suffering patience.",
    "verses": [
      "Genesis 5:25-27",
      "1 Chronicles 1:3",
      "Luke 3:37"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 8,
    "fatherId": "enoch"
  },
  {
    "id": "lamech-patriarch",
    "name": "Lamech",
    "hebrewGreek": "לֶמֶךְ",
    "meaning": "Despairing / Strong youth",
    "era": "Creation & Patriarchs",
    "role": "Father of Noah",
    "gender": "male",
    "importance": 3,
    "summary": "Named his son Noah prophesying: \"This one will comfort us concerning our work and the toil of our hands because of the ground which the Lord has cursed.\"",
    "verses": [
      "Genesis 5:28-31",
      "Luke 3:36"
    ],
    "places": [
      "eden"
    ],
    "eraOrder": 1,
    "generation": 9,
    "fatherId": "methuselah"
  },
  {
    "id": "noah",
    "name": "Noah",
    "hebrewGreek": "נֹחַ",
    "meaning": "Rest / Comfort",
    "era": "Creation & Patriarchs",
    "role": "Righteous Builder of the Ark & Second Father of Humanity",
    "gender": "male",
    "importance": 1,
    "summary": "Blameless in his generation, he walked with God, built the Ark upon divine warning, survived the worldwide Flood, and received the Rainbow Covenant.",
    "verses": [
      "Genesis 6:8-22",
      "Genesis 7-9",
      "Hebrews 11:7",
      "1 Peter 3:20",
      "Luke 3:36"
    ],
    "places": [
      "ararat"
    ],
    "eraOrder": 1,
    "generation": 10,
    "fatherId": "lamech-patriarch"
  },
  {
    "id": "shem",
    "name": "Shem",
    "hebrewGreek": "שֵׁם",
    "meaning": "Name / Renown",
    "era": "Creation & Patriarchs",
    "role": "Eldest Godly Son of Noah / Ancestor of Abraham",
    "gender": "male",
    "importance": 2,
    "summary": "Honored his father, received Noah’s prime blessing (\"Blessed be the Lord God of Shem\"), and established the Semitic covenant lineage.",
    "verses": [
      "Genesis 9:26-27",
      "Genesis 10:21-31",
      "Genesis 11:10-11",
      "Luke 3:36"
    ],
    "places": [
      "ararat"
    ],
    "eraOrder": 1,
    "generation": 11,
    "fatherId": "noah"
  },
  {
    "id": "arphaxad",
    "name": "Arphaxad",
    "hebrewGreek": "אַרְפַּכְשַׁד",
    "meaning": "Healer / Release",
    "era": "Creation & Patriarchs",
    "role": "Son of Shem Born Two Years After the Flood",
    "gender": "male",
    "importance": 3,
    "summary": "First post-flood patriarch in the covenant lineage leading directly to Abraham and Jesus Christ.",
    "verses": [
      "Genesis 11:10-13",
      "Luke 3:36"
    ],
    "places": [
      "ararat"
    ],
    "eraOrder": 1,
    "generation": 12,
    "fatherId": "shem"
  },
  {
    "id": "shelah",
    "name": "Shelah",
    "hebrewGreek": "שֶׁלַח",
    "meaning": "Sprout / Mission",
    "era": "Creation & Patriarchs",
    "role": "Grandson of Shem & Father of Eber",
    "gender": "male",
    "importance": 3,
    "summary": "Patriarch in the post-flood genealogical record preserving the sacred line toward Abraham.",
    "verses": [
      "Genesis 11:12-15",
      "Luke 3:35"
    ],
    "places": [
      "ararat"
    ],
    "eraOrder": 1,
    "generation": 13,
    "fatherId": "arphaxad"
  },
  {
    "id": "eber",
    "name": "Eber",
    "hebrewGreek": "עֵבֶר",
    "meaning": "Region beyond / The Hebrew",
    "era": "Creation & Patriarchs",
    "role": "Great-Grandson of Shem / Namesake of the Hebrews",
    "gender": "male",
    "importance": 2,
    "summary": "Patriarch from whose name the term \"Hebrew\" is derived; lived during the division of the earth after Babel.",
    "verses": [
      "Genesis 10:24-25",
      "Genesis 11:14-17",
      "Luke 3:35"
    ],
    "places": [
      "ararat"
    ],
    "eraOrder": 1,
    "generation": 14,
    "fatherId": "shelah"
  },
  {
    "id": "peleg",
    "name": "Peleg",
    "hebrewGreek": "פֶּלֶג",
    "meaning": "Division",
    "era": "Creation & Patriarchs",
    "role": "Son of Eber in Whose Days the Earth was Divided",
    "gender": "male",
    "importance": 3,
    "summary": "Born when mankind was scattered at the Tower of Babel; preserved the patriarchal lineage.",
    "verses": [
      "Genesis 10:25",
      "Genesis 11:16-19",
      "Luke 3:35"
    ],
    "places": [
      "babylon"
    ],
    "eraOrder": 1,
    "generation": 15,
    "fatherId": "eber"
  },
  {
    "id": "reu",
    "name": "Reu",
    "hebrewGreek": "רְעוּ",
    "meaning": "Friend / Companion",
    "era": "Creation & Patriarchs",
    "role": "Son of Peleg / Patriarch in Messianic Line",
    "gender": "male",
    "importance": 3,
    "summary": "Patriarch who lived 239 years, father of Serug in the line of Shem.",
    "verses": [
      "Genesis 11:18-21",
      "Luke 3:35"
    ],
    "places": [
      "ur"
    ],
    "eraOrder": 1,
    "generation": 16,
    "fatherId": "peleg"
  },
  {
    "id": "serug",
    "name": "Serug",
    "hebrewGreek": "שְׂרוּג",
    "meaning": "Branch / Tendril",
    "era": "Creation & Patriarchs",
    "role": "Great-Grandfather of Abraham",
    "gender": "male",
    "importance": 3,
    "summary": "Patriarch who lived 230 years, father of Nahor I in ancient Mesopotamia.",
    "verses": [
      "Genesis 11:20-23",
      "Luke 3:35"
    ],
    "places": [
      "ur"
    ],
    "eraOrder": 1,
    "generation": 17,
    "fatherId": "reu"
  },
  {
    "id": "nahor-i",
    "name": "Nahor",
    "hebrewGreek": "נָחוֹר",
    "meaning": "Snorting / Piercing",
    "era": "Creation & Patriarchs",
    "role": "Grandfather of Abraham & Father of Terah",
    "gender": "male",
    "importance": 3,
    "summary": "Son of Serug who fathered Terah in the Chaldean plains.",
    "verses": [
      "Genesis 11:22-25",
      "Luke 3:34"
    ],
    "places": [
      "ur"
    ],
    "eraOrder": 1,
    "generation": 18,
    "fatherId": "serug"
  },
  {
    "id": "terah",
    "name": "Terah",
    "hebrewGreek": "תֶּרַח",
    "meaning": "Delay / Wanderer",
    "era": "Creation & Patriarchs",
    "role": "Father of Abraham, Nahor, and Haran",
    "gender": "male",
    "importance": 2,
    "summary": "Led his clan out from Ur of the Chaldeans en route toward Canaan, settled and died in Haran at age 205.",
    "verses": [
      "Genesis 11:26-32",
      "Joshua 24:2",
      "Luke 3:34"
    ],
    "places": [
      "ur",
      "haran"
    ],
    "eraOrder": 1,
    "generation": 19,
    "fatherId": "nahor-i"
  },
  {
    "id": "abraham",
    "name": "Abraham",
    "hebrewGreek": "אַבְרָהָם",
    "meaning": "Father of a Multitude of Nations",
    "era": "Creation & Patriarchs",
    "role": "Father of Faith & Covenant Patriarch",
    "gender": "male",
    "importance": 1,
    "summary": "Called out of Ur by God, entered into an unconditional everlasting covenant, credited with righteousness by faith, offered Isaac on Moriah, and fathered the nation of Israel.",
    "verses": [
      "Genesis 12:1-4",
      "Genesis 15:1-6",
      "Genesis 17:1-8",
      "Genesis 22:1-18",
      "Romans 4:1-12",
      "Galatians 3:6-9",
      "Hebrews 11:8-19"
    ],
    "places": [
      "ur",
      "haran",
      "shechem",
      "bethel",
      "hebron",
      "jerusalem"
    ],
    "eraOrder": 1,
    "generation": 20,
    "fatherId": "terah",
    "spouseId": "sarah"
  },
  {
    "id": "sarah",
    "name": "Sarah",
    "hebrewGreek": "שָׂרָה",
    "meaning": "Princess",
    "era": "Creation & Patriarchs",
    "role": "Matriarch & Mother of Isaac",
    "gender": "female",
    "importance": 1,
    "summary": "Wife of Abraham who barren until age 90, miraculously conceived Isaac according to God’s promise; honored as model of faith.",
    "verses": [
      "Genesis 17:15-19",
      "Genesis 18:9-15",
      "Genesis 21:1-7",
      "Hebrews 11:11",
      "1 Peter 3:6"
    ],
    "places": [
      "ur",
      "hebron"
    ],
    "eraOrder": 1,
    "generation": 20,
    "spouseId": "abraham"
  },
  {
    "id": "hagar",
    "name": "Hagar",
    "hebrewGreek": "הָגָר",
    "meaning": "Flight / Stranger",
    "era": "Creation & Patriarchs",
    "role": "Egyptian Handmaid of Sarah & Mother of Ishmael",
    "gender": "female",
    "importance": 2,
    "summary": "Sarah's maid who encountered the God who sees (El Roi) in the desert and bore Ishmael.",
    "verses": [
      "Genesis 16:1-16",
      "Genesis 21:8-21",
      "Galatians 4:21-31"
    ],
    "places": [
      "hebron",
      "beersheba"
    ],
    "eraOrder": 1,
    "generation": 20
  },
  {
    "id": "ishmael",
    "name": "Ishmael",
    "hebrewGreek": "יִשְׁמָעֵאל",
    "meaning": "God Hears",
    "era": "Creation & Patriarchs",
    "role": "Firstborn Son of Abraham by Hagar",
    "gender": "male",
    "importance": 2,
    "summary": "Father of twelve desert princes and a great nation according to God’s promise to Abraham.",
    "verses": [
      "Genesis 16:11-16",
      "Genesis 17:20",
      "Genesis 25:12-18"
    ],
    "places": [
      "beersheba"
    ],
    "eraOrder": 1,
    "generation": 21,
    "fatherId": "abraham",
    "motherId": "hagar"
  },
  {
    "id": "lot",
    "name": "Lot",
    "hebrewGreek": "לוֹט",
    "meaning": "Covering / Veil",
    "era": "Creation & Patriarchs",
    "role": "Nephew of Abraham",
    "gender": "male",
    "importance": 2,
    "summary": "Accompanied Abraham into Canaan, chose the lush Jordan valley near Sodom, was rescued by angels from divine judgment, and fathered Moab and Ammon.",
    "verses": [
      "Genesis 12:4-5",
      "Genesis 13:8-13",
      "Genesis 19:1-29",
      "2 Peter 2:7-8"
    ],
    "places": [
      "hebron",
      "sodom",
      "zoar"
    ],
    "eraOrder": 1,
    "generation": 20
  },
  {
    "id": "isaac",
    "name": "Isaac",
    "hebrewGreek": "יִצְחָק (Yitzchak)",
    "meaning": "Laughter / He Laughs",
    "era": "Creation & Patriarchs",
    "role": "Son of the Covenant Promise & Second Patriarch",
    "gender": "male",
    "importance": 1,
    "summary": "Miracle child born to Abraham and Sarah in their old age, bound upon Mount Moriah as a type of Christ, married Rebekah, and fathered Jacob and Esau.",
    "verses": [
      "Genesis 21:1-7",
      "Genesis 22:1-14",
      "Genesis 26:1-6",
      "Hebrews 11:17-20",
      "Galatians 4:28"
    ],
    "places": [
      "hebron",
      "beersheba",
      "gerar"
    ],
    "eraOrder": 1,
    "generation": 21,
    "fatherId": "abraham",
    "motherId": "sarah",
    "spouseId": "rebekah"
  },
  {
    "id": "rebekah",
    "name": "Rebekah",
    "hebrewGreek": "רִבְקָה",
    "meaning": "Captivating / Tied firmly",
    "era": "Creation & Patriarchs",
    "role": "Wife of Isaac & Mother of Jacob and Esau",
    "gender": "female",
    "importance": 2,
    "summary": "Met by Abraham's servant at the well in Nahor; received divine revelation about her twins and helped Jacob secure the blessing.",
    "verses": [
      "Genesis 24:15-67",
      "Genesis 25:21-26",
      "Genesis 27:5-17",
      "Romans 9:10-12"
    ],
    "places": [
      "haran",
      "beersheba"
    ],
    "eraOrder": 1,
    "generation": 21,
    "spouseId": "isaac"
  },
  {
    "id": "esau",
    "name": "Esau (Edom)",
    "hebrewGreek": "עֵשָׂו",
    "meaning": "Hairy / Rough",
    "era": "Creation & Patriarchs",
    "role": "Firstborn Twin of Isaac & Father of the Edomites",
    "gender": "male",
    "importance": 2,
    "summary": "Skillful hunter who despised his birthright for a bowl of red stew, lost the patriarchal blessing, yet later reconciled with Jacob.",
    "verses": [
      "Genesis 25:25-34",
      "Genesis 27:30-41",
      "Genesis 33:1-16",
      "Hebrews 12:16-17"
    ],
    "places": [
      "beersheba",
      "seir"
    ],
    "eraOrder": 1,
    "generation": 22,
    "fatherId": "isaac",
    "motherId": "rebekah"
  },
  {
    "id": "jacob",
    "name": "Jacob (Israel)",
    "hebrewGreek": "יַעֲקֹב / יִשְׂרָאֵל",
    "meaning": "Heel-catcher / Prince with God",
    "era": "Creation & Patriarchs",
    "role": "Third Patriarch & Father of the Twelve Tribes",
    "gender": "male",
    "importance": 1,
    "summary": "Dreamed of the ladder at Bethel, worked fourteen years for Rachel and Leah, wrestled with the Angel at Peniel, and fathered the twelve tribes of Israel.",
    "verses": [
      "Genesis 28:10-22",
      "Genesis 32:24-30",
      "Genesis 35:9-15",
      "Genesis 49:1-28",
      "Matthew 1:2"
    ],
    "places": [
      "bethel",
      "shechem",
      "peniel",
      "hebron",
      "goshen"
    ],
    "eraOrder": 1,
    "generation": 22,
    "fatherId": "isaac",
    "motherId": "rebekah",
    "spouseId": "rachel"
  },
  {
    "id": "leah",
    "name": "Leah",
    "hebrewGreek": "לֵאָה",
    "meaning": "Weary",
    "era": "Creation & Patriarchs",
    "role": "First Wife of Jacob & Mother of Judah and Levi",
    "gender": "female",
    "importance": 2,
    "summary": "Elder daughter of Laban; blessed by God with six sons including Judah (the royal messianic line) and Levi (the priestly line).",
    "verses": [
      "Genesis 29:16-35",
      "Genesis 30:17-21",
      "Genesis 49:31",
      "Ruth 4:11"
    ],
    "places": [
      "haran",
      "hebron"
    ],
    "eraOrder": 1,
    "generation": 22,
    "spouseId": "jacob"
  },
  {
    "id": "rachel",
    "name": "Rachel",
    "hebrewGreek": "רָחֵל",
    "meaning": "Ewe lamb",
    "era": "Creation & Patriarchs",
    "role": "Beloved Wife of Jacob & Mother of Joseph and Benjamin",
    "gender": "female",
    "importance": 2,
    "summary": "Jacob served fourteen years for her hand; after prolonged barrenness bore Joseph, and died in labor near Bethlehem bearing Benjamin.",
    "verses": [
      "Genesis 29:16-30",
      "Genesis 30:1-24",
      "Genesis 35:16-20",
      "Jeremiah 31:15"
    ],
    "places": [
      "haran",
      "bethlehem"
    ],
    "eraOrder": 1,
    "generation": 22,
    "spouseId": "jacob"
  },
  {
    "id": "judah",
    "name": "Judah",
    "hebrewGreek": "יְהוּדָה",
    "meaning": "Praise / Yahweh be praised",
    "era": "Creation & Patriarchs",
    "role": "Fourth Son of Jacob / Royal Messianic Line",
    "gender": "male",
    "importance": 1,
    "summary": "Pledged himself as surety for Benjamin in Egypt; received the prophetic patriarchal blessing that the royal scepter would not depart until Shiloh comes.",
    "verses": [
      "Genesis 37:26-27",
      "Genesis 44:18-34",
      "Genesis 49:8-12",
      "Matthew 1:2-3",
      "Revelation 5:5"
    ],
    "places": [
      "hebron",
      "goshen"
    ],
    "eraOrder": 1,
    "generation": 23,
    "fatherId": "jacob",
    "motherId": "leah"
  },
  {
    "id": "perez",
    "name": "Perez",
    "hebrewGreek": "פֶּרֶץ",
    "meaning": "Breach / Breakthrough",
    "era": "Creation & Patriarchs",
    "role": "Son of Judah & Father of the Royal Line",
    "gender": "male",
    "importance": 2,
    "summary": "Twin son of Judah and Tamar whose lineage produced King David and Jesus Christ.",
    "verses": [
      "Genesis 38:29",
      "Ruth 4:18",
      "Matthew 1:3",
      "Luke 3:33"
    ],
    "places": [
      "hebron"
    ],
    "eraOrder": 1,
    "generation": 24,
    "fatherId": "judah"
  },
  {
    "id": "hezron",
    "name": "Hezron",
    "hebrewGreek": "חֶצְרוֹן",
    "meaning": "Enclosed / Courtyard",
    "era": "Creation & Patriarchs",
    "role": "Son of Perez Who Went Down into Egypt",
    "gender": "male",
    "importance": 3,
    "summary": "Grandson of Judah who entered Egypt with Jacob's clan; key link in the royal messianic genealogy.",
    "verses": [
      "Genesis 46:12",
      "Ruth 4:18-19",
      "Matthew 1:3"
    ],
    "places": [
      "goshen"
    ],
    "eraOrder": 1,
    "generation": 25,
    "fatherId": "perez"
  },
  {
    "id": "ram",
    "name": "Ram",
    "hebrewGreek": "רָם",
    "meaning": "High / Exalted",
    "era": "Exodus & Judges",
    "role": "Son of Hezron in Egypt",
    "gender": "male",
    "importance": 3,
    "summary": "Lived in Egypt during the period of Israel’s multiplying; father of Amminadab.",
    "verses": [
      "Ruth 4:19",
      "1 Chronicles 2:9",
      "Matthew 1:3-4"
    ],
    "places": [
      "goshen"
    ],
    "eraOrder": 2,
    "generation": 26,
    "fatherId": "hezron"
  },
  {
    "id": "amminadab",
    "name": "Amminadab",
    "hebrewGreek": "עַמִּינָדָב",
    "meaning": "My people are noble",
    "era": "Exodus & Judges",
    "role": "Prince of Judah during the Exodus",
    "gender": "male",
    "importance": 3,
    "summary": "Father of Nahshon the tribal prince and Elisheba who married Aaron the High Priest, uniting the royal and priestly families.",
    "verses": [
      "Exodus 6:23",
      "Numbers 1:7",
      "Ruth 4:19-20",
      "Matthew 1:4"
    ],
    "places": [
      "goshen",
      "sinai"
    ],
    "eraOrder": 2,
    "generation": 27,
    "fatherId": "ram"
  },
  {
    "id": "nahshon",
    "name": "Nahshon",
    "hebrewGreek": "נַחְשׁוֹן",
    "meaning": "Enchanter / Navigator",
    "era": "Exodus & Judges",
    "role": "Prince of the Tribe of Judah in the Wilderness",
    "gender": "male",
    "importance": 2,
    "summary": "Commander of the tribe of Judah who led the march of Israel in the wilderness and brought the first offering for the Tabernacle altar.",
    "verses": [
      "Numbers 1:7",
      "Numbers 2:3",
      "Numbers 7:12",
      "Ruth 4:20",
      "Matthew 1:4"
    ],
    "places": [
      "sinai",
      "kadesh-barnea"
    ],
    "eraOrder": 2,
    "generation": 28,
    "fatherId": "amminadab"
  },
  {
    "id": "salmon",
    "name": "Salmon",
    "hebrewGreek": "שַׂלְמוֹן",
    "meaning": "Garment / Peaceful",
    "era": "Exodus & Judges",
    "role": "Son of Nahshon & Husband of Rahab",
    "gender": "male",
    "importance": 2,
    "summary": "Entered the Promised Land under Joshua and married Rahab of Jericho, fathering Boaz of Bethlehem.",
    "verses": [
      "Ruth 4:20-21",
      "1 Chronicles 2:11",
      "Matthew 1:4-5"
    ],
    "places": [
      "jericho",
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 29,
    "fatherId": "nahshon",
    "spouseId": "rahab"
  },
  {
    "id": "rahab",
    "name": "Rahab",
    "hebrewGreek": "רָחָב",
    "meaning": "Broad / Spacious",
    "era": "Exodus & Judges",
    "role": "Woman of Jericho & Mother of Boaz",
    "gender": "female",
    "importance": 1,
    "summary": "Hid Joshua's spies by faith, tied the scarlet cord in her window, survived the fall of Jericho, married Salmon, and entered the royal lineage of Christ.",
    "verses": [
      "Joshua 2:1-21",
      "Joshua 6:22-25",
      "Matthew 1:5",
      "Hebrews 11:31",
      "James 2:25"
    ],
    "places": [
      "jericho",
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 29,
    "spouseId": "salmon"
  },
  {
    "id": "boaz",
    "name": "Boaz",
    "hebrewGreek": "בֹּעַז",
    "meaning": "In Him is Strength",
    "era": "Exodus & Judges",
    "role": "Kinsman-Redeemer of Bethlehem & Husband of Ruth",
    "gender": "male",
    "importance": 1,
    "summary": "Honorable landowner in Bethlehem who redeemed the inheritance of Elimelech, married the Moabitess Ruth, and fathered Obed.",
    "verses": [
      "Ruth 2:1-12",
      "Ruth 3:9-13",
      "Ruth 4:1-10",
      "Matthew 1:5"
    ],
    "places": [
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 30,
    "fatherId": "salmon",
    "motherId": "rahab",
    "spouseId": "ruth"
  },
  {
    "id": "ruth",
    "name": "Ruth",
    "hebrewGreek": "רוּת",
    "meaning": "Friend / Companion",
    "era": "Exodus & Judges",
    "role": "Moabitess Convert & Great-Grandmother of David",
    "gender": "female",
    "importance": 1,
    "summary": "Clung to Naomi with immortal devotion (\"Thy people shall be my people, and thy God my God\"), gleaned in Boaz's field, and became ancestress of the Messiah.",
    "verses": [
      "Ruth 1:16-17",
      "Ruth 2:11-12",
      "Ruth 4:13-17",
      "Matthew 1:5"
    ],
    "places": [
      "moab",
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 30,
    "spouseId": "boaz"
  },
  {
    "id": "naomi",
    "name": "Naomi (Mara)",
    "hebrewGreek": "נָעֳמִי",
    "meaning": "Pleasant",
    "era": "Exodus & Judges",
    "role": "Mother-in-Law of Ruth",
    "gender": "female",
    "importance": 2,
    "summary": "Bereaved of husband and sons in Moab, returned desolate to Bethlehem, and through Boaz and Ruth was restored to joy and family honor.",
    "verses": [
      "Ruth 1:1-22",
      "Ruth 4:14-17"
    ],
    "places": [
      "moab",
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 29
  },
  {
    "id": "obed",
    "name": "Obed",
    "hebrewGreek": "עוֹבֵד",
    "meaning": "Servant / Worshiper",
    "era": "Exodus & Judges",
    "role": "Son of Boaz and Ruth & Father of Jesse",
    "gender": "male",
    "importance": 2,
    "summary": "Nursed on Naomi's lap in Bethlehem; father of Jesse and grandfather of King David.",
    "verses": [
      "Ruth 4:17-22",
      "1 Chronicles 2:12",
      "Matthew 1:5",
      "Luke 3:32"
    ],
    "places": [
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 31,
    "fatherId": "boaz",
    "motherId": "ruth"
  },
  {
    "id": "jesse",
    "name": "Jesse",
    "hebrewGreek": "יִשַׁי",
    "meaning": "I possess / Yahweh exists",
    "era": "Monarchy & Prophets",
    "role": "Father of King David / The Root of Jesse",
    "gender": "male",
    "importance": 1,
    "summary": "Bethlehemite farmer whose eighth son David was anointed king by Samuel; celebrated in prophecy as the \"Root of Jesse\" from which Christ blooms.",
    "verses": [
      "1 Samuel 16:1-13",
      "Isaiah 11:1-2",
      "Romans 15:12",
      "Matthew 1:5-6"
    ],
    "places": [
      "bethlehem"
    ],
    "eraOrder": 4,
    "generation": 32,
    "fatherId": "obed"
  },
  {
    "id": "levi",
    "name": "Levi",
    "hebrewGreek": "לֵוִי",
    "meaning": "Attached / Joined",
    "era": "Creation & Patriarchs",
    "role": "Third Son of Jacob / Father of the Priestly Tribe",
    "gender": "male",
    "importance": 2,
    "summary": "Son of Jacob and Leah whose descendants were chosen by God as the ministers of the sanctuary and high priests of Israel.",
    "verses": [
      "Genesis 29:34",
      "Genesis 49:5-7",
      "Exodus 6:16",
      "Numbers 3:5-10"
    ],
    "places": [
      "hebron",
      "goshen"
    ],
    "eraOrder": 1,
    "generation": 23,
    "fatherId": "jacob",
    "motherId": "leah"
  },
  {
    "id": "kohath",
    "name": "Kohath",
    "hebrewGreek": "קְהָת",
    "meaning": "Assembly / Obedience",
    "era": "Exodus & Judges",
    "role": "Son of Levi & Grandfather of Moses and Aaron",
    "gender": "male",
    "importance": 3,
    "summary": "Ancestor of the Kohathite Levites who bore the most sacred furnishings of the Tabernacle including the Ark.",
    "verses": [
      "Genesis 46:11",
      "Exodus 6:16-18",
      "Numbers 4:1-20"
    ],
    "places": [
      "goshen"
    ],
    "eraOrder": 2,
    "generation": 24,
    "fatherId": "levi"
  },
  {
    "id": "amram",
    "name": "Amram",
    "hebrewGreek": "עַמְרָם",
    "meaning": "Exalted People",
    "era": "Exodus & Judges",
    "role": "Father of Moses, Aaron, and Miriam",
    "gender": "male",
    "importance": 2,
    "summary": "A faithful Levite who married Jochebed and hid his newborn son Moses by faith when Pharaoh commanded Hebrew boys to be drowned.",
    "verses": [
      "Exodus 6:18-20",
      "Numbers 26:59",
      "Hebrews 11:23"
    ],
    "places": [
      "goshen"
    ],
    "eraOrder": 2,
    "generation": 25,
    "fatherId": "kohath",
    "spouseId": "jochebed"
  },
  {
    "id": "jochebed",
    "name": "Jochebed",
    "hebrewGreek": "יוֹכֶבֶד",
    "meaning": "Yahweh is Glory",
    "era": "Exodus & Judges",
    "role": "Mother of Moses, Aaron, and Miriam",
    "gender": "female",
    "importance": 2,
    "summary": "Heroic mother who constructed an ark of bulrushes on the Nile to save infant Moses, and was providentially hired to nurse her own child.",
    "verses": [
      "Exodus 2:1-10",
      "Exodus 6:20",
      "Numbers 26:59"
    ],
    "places": [
      "goshen"
    ],
    "eraOrder": 2,
    "generation": 25,
    "spouseId": "amram"
  },
  {
    "id": "moses",
    "name": "Moses",
    "hebrewGreek": "מֹשֶׁה (Moshe)",
    "meaning": "Drawn Out of the Water",
    "era": "Exodus & Judges",
    "role": "Lawgiver, Deliverer & Prophet of Yahweh",
    "gender": "male",
    "importance": 1,
    "summary": "Spoke with God face-to-face, unleashed the Ten Plagues, parted the Red Sea, received the Torah at Mount Sinai, and led Israel 40 years through the wilderness.",
    "verses": [
      "Exodus 3:1-14",
      "Exodus 14:13-31",
      "Exodus 20:1-17",
      "Deuteronomy 34:1-12",
      "Hebrews 11:24-29"
    ],
    "places": [
      "goshen",
      "sinai",
      "red-sea",
      "kadesh-barnea",
      "nebo"
    ],
    "eraOrder": 2,
    "generation": 26,
    "fatherId": "amram",
    "motherId": "jochebed"
  },
  {
    "id": "aaron",
    "name": "Aaron",
    "hebrewGreek": "אַהֲרֹן",
    "meaning": "Light-bringer / Exalted",
    "era": "Exodus & Judges",
    "role": "First High Priest of Israel & Brother of Moses",
    "gender": "male",
    "importance": 1,
    "summary": "Spokesman for Moses before Pharaoh; his budding almond rod confirmed his divine priesthood, establishing the Levitical sacrificial rites.",
    "verses": [
      "Exodus 4:14-16",
      "Exodus 28:1-4",
      "Numbers 17:1-10",
      "Hebrews 5:4"
    ],
    "places": [
      "goshen",
      "sinai",
      "mount-hor"
    ],
    "eraOrder": 2,
    "generation": 26,
    "fatherId": "amram",
    "motherId": "jochebed"
  },
  {
    "id": "miriam",
    "name": "Miriam",
    "hebrewGreek": "מִרְיָם",
    "meaning": "Beloved / Bitterness",
    "era": "Exodus & Judges",
    "role": "Prophetess & Sister of Moses and Aaron",
    "gender": "female",
    "importance": 2,
    "summary": "Watched over infant Moses at the Nile, led the women in joyful song and timbrel after the Red Sea triumph.",
    "verses": [
      "Exodus 2:4-8",
      "Exodus 15:20-21",
      "Numbers 12:1-15"
    ],
    "places": [
      "goshen",
      "red-sea",
      "kadesh-barnea"
    ],
    "eraOrder": 2,
    "generation": 26,
    "fatherId": "amram",
    "motherId": "jochebed"
  },
  {
    "id": "joshua",
    "name": "Joshua",
    "hebrewGreek": "יְהוֹשֻׁעַ (Yehoshua)",
    "meaning": "Yahweh is Salvation",
    "era": "Exodus & Judges",
    "role": "Commander of Israel & Successor to Moses",
    "gender": "male",
    "importance": 1,
    "summary": "Faithful spy who trusted God, succeeded Moses, led Israel across the dried-up Jordan, brought down the walls of Jericho, and settled the twelve tribes in Canaan.",
    "verses": [
      "Exodus 17:9-14",
      "Numbers 14:6-9",
      "Joshua 1:1-9",
      "Joshua 6:1-20",
      "Joshua 24:14-15"
    ],
    "places": [
      "sinai",
      "kadesh-barnea",
      "jericho",
      "shechem"
    ],
    "eraOrder": 3,
    "generation": 27
  },
  {
    "id": "caleb",
    "name": "Caleb",
    "hebrewGreek": "כָּלֵב",
    "meaning": "Whole-hearted / Faithful",
    "era": "Exodus & Judges",
    "role": "Faithful Spy of Judah & Conqueror of Hebron",
    "gender": "male",
    "importance": 2,
    "summary": "One of only two adults of the Exodus generation who fully trusted Yahweh to take the land; claimed Hebron at age 85 with undiminished strength.",
    "verses": [
      "Numbers 13:30",
      "Numbers 14:24",
      "Joshua 14:6-14"
    ],
    "places": [
      "kadesh-barnea",
      "hebron"
    ],
    "eraOrder": 3,
    "generation": 27
  },
  {
    "id": "samuel",
    "name": "Samuel",
    "hebrewGreek": "שְׁמוּאֵל",
    "meaning": "Heard of God / Asked of God",
    "era": "Exodus & Judges",
    "role": "Last Judge, Priest & Kingmaker Prophet",
    "gender": "male",
    "importance": 1,
    "summary": "Dedicated by Hannah at Shiloh, heard God call his name as a boy, transitioned Israel into the monarchy by anointing both Saul and David.",
    "verses": [
      "1 Samuel 1:20",
      "1 Samuel 3:1-10",
      "1 Samuel 10:1",
      "1 Samuel 16:1-13",
      "Acts 3:24"
    ],
    "places": [
      "shiloh",
      "ramah",
      "bethlehem"
    ],
    "eraOrder": 3,
    "generation": 31
  },
  {
    "id": "saul",
    "name": "King Saul",
    "hebrewGreek": "שָׁאוּל",
    "meaning": "Asked for / Desired",
    "era": "Monarchy & Prophets",
    "role": "First King of United Israel",
    "gender": "male",
    "importance": 1,
    "summary": "Tall Benjaminite anointed by Samuel; won early victories against Philistines but forfeited the throne through pride and disobedience.",
    "verses": [
      "1 Samuel 9:1-2",
      "1 Samuel 10:17-24",
      "1 Samuel 15:10-23",
      "1 Samuel 31:1-6"
    ],
    "places": [
      "gibeah",
      "gilgal",
      "gilboa"
    ],
    "eraOrder": 4,
    "generation": 32
  },
  {
    "id": "jonathan",
    "name": "Jonathan",
    "hebrewGreek": "יְהוֹנָתָן",
    "meaning": "Yahweh Has Given",
    "era": "Monarchy & Prophets",
    "role": "Prince of Israel & Beloved Covenant Brother of David",
    "gender": "male",
    "importance": 2,
    "summary": "Heroic son of Saul who routed Philistines by faith, loved David as his own soul, and willingly relinquished his crown in deference to God’s chosen king.",
    "verses": [
      "1 Samuel 14:6-15",
      "1 Samuel 18:1-4",
      "1 Samuel 20:12-17",
      "2 Samuel 1:26"
    ],
    "places": [
      "gibeah",
      "gilboa"
    ],
    "eraOrder": 4,
    "generation": 33,
    "fatherId": "saul"
  },
  {
    "id": "david",
    "name": "King David",
    "hebrewGreek": "דָּוִד",
    "meaning": "Beloved",
    "era": "Monarchy & Prophets",
    "role": "Greatest King of Israel & A Man After God’s Own Heart",
    "gender": "male",
    "importance": 1,
    "summary": "Shepherd boy who slew Goliath, captured Zion, united all twelve tribes, penned the Psalms, and received God’s eternal Messianic Covenant.",
    "verses": [
      "1 Samuel 16:11-13",
      "1 Samuel 17:32-50",
      "2 Samuel 5:1-5",
      "2 Samuel 7:8-16",
      "Psalm 23",
      "Matthew 1:6"
    ],
    "places": [
      "bethlehem",
      "adullam",
      "hebron",
      "jerusalem"
    ],
    "eraOrder": 4,
    "generation": 33,
    "fatherId": "jesse",
    "spouseId": "bathsheba"
  },
  {
    "id": "bathsheba",
    "name": "Bathsheba",
    "hebrewGreek": "בַּת־שֶׁבַע",
    "meaning": "Daughter of the Oath",
    "era": "Monarchy & Prophets",
    "role": "Queen Mother & Mother of King Solomon",
    "gender": "female",
    "importance": 2,
    "summary": "Wife of Uriah who became David’s queen, mother of Solomon, and secured Solomon’s succession to the throne of Israel.",
    "verses": [
      "2 Samuel 11:2-5",
      "2 Samuel 12:24",
      "1 Kings 1:11-31",
      "Matthew 1:6"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 4,
    "generation": 33,
    "spouseId": "david"
  },
  {
    "id": "solomon",
    "name": "King Solomon (Jedidiah)",
    "hebrewGreek": "שְׁלֹמֹה",
    "meaning": "Peaceable / Shalom",
    "era": "Monarchy & Prophets",
    "role": "Wisest King & Builder of the First Temple",
    "gender": "male",
    "importance": 1,
    "summary": "Endowed with divine wisdom, constructed the glorious Temple in Jerusalem, compiled Proverbs and Ecclesiastes, and ruled over Israel's golden age.",
    "verses": [
      "1 Kings 3:5-14",
      "1 Kings 6:1-14",
      "1 Kings 10:1-9",
      "Proverbs 1:1",
      "Matthew 1:6"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 4,
    "generation": 34,
    "fatherId": "david",
    "motherId": "bathsheba"
  },
  {
    "id": "rehoboam",
    "name": "Rehoboam",
    "hebrewGreek": "רְחַבְעָם",
    "meaning": "He Enlargeth the People",
    "era": "Monarchy & Prophets",
    "role": "First King of Judah after the Kingdom Split",
    "gender": "male",
    "importance": 2,
    "summary": "Solomon’s son whose harsh rejection of elders caused the ten northern tribes to secede, fracturing Israel into Judah and Israel.",
    "verses": [
      "1 Kings 11:43",
      "1 Kings 12:1-24",
      "Matthew 1:7"
    ],
    "places": [
      "shechem",
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 35,
    "fatherId": "solomon"
  },
  {
    "id": "abijah",
    "name": "Abijah",
    "hebrewGreek": "אֲבִיָּה",
    "meaning": "My Father is Yahweh",
    "era": "Monarchy & Prophets",
    "role": "King of Judah / Son of Rehoboam",
    "gender": "male",
    "importance": 3,
    "summary": "King of Judah who defeated Jeroboam in battle while pleading the covenant of salt with David.",
    "verses": [
      "1 Kings 15:1-8",
      "2 Chronicles 13:1-20",
      "Matthew 1:7"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 36,
    "fatherId": "rehoboam"
  },
  {
    "id": "asa",
    "name": "King Asa",
    "hebrewGreek": "אָסָא",
    "meaning": "Healer / Physician",
    "era": "Monarchy & Prophets",
    "role": "Reforming King of Judah",
    "gender": "male",
    "importance": 2,
    "summary": "Reigned forty-one years in Jerusalem; removed idols and trusted the Lord to defeat Zerah the Ethiopian’s army of a million men.",
    "verses": [
      "1 Kings 15:9-24",
      "2 Chronicles 14-16",
      "Matthew 1:7-8"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 37,
    "fatherId": "abijah"
  },
  {
    "id": "jehoshaphat",
    "name": "King Jehoshaphat",
    "hebrewGreek": "יְהוֹשָׁפָט",
    "meaning": "Yahweh Has Judged",
    "era": "Monarchy & Prophets",
    "role": "Godly King of Judah / Singer of Victory",
    "gender": "male",
    "importance": 2,
    "summary": "Sent Levites throughout Judah to teach the Law; when invaded, he appointed singers to lead the army chanting \"Praise the Lord, for His mercy endureth forever!\"",
    "verses": [
      "1 Kings 22:41-50",
      "2 Chronicles 17-20",
      "Matthew 1:8"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 38,
    "fatherId": "asa"
  },
  {
    "id": "joram",
    "name": "Joram (Jehoram)",
    "hebrewGreek": "יוֹרָם",
    "meaning": "Yahweh is Exalted",
    "era": "Monarchy & Prophets",
    "role": "King of Judah / Son of Jehoshaphat",
    "gender": "male",
    "importance": 3,
    "summary": "Married Athaliah daughter of Ahab, leading Judah into northern idolatry.",
    "verses": [
      "2 Kings 8:16-24",
      "2 Chronicles 21:1-20",
      "Matthew 1:8"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 39,
    "fatherId": "jehoshaphat"
  },
  {
    "id": "uzziah",
    "name": "King Uzziah (Azariah)",
    "hebrewGreek": "עֻזִּיָּהוּ",
    "meaning": "My Strength is Yahweh",
    "era": "Monarchy & Prophets",
    "role": "Prosperous King of Judah during Isaiah’s Youth",
    "gender": "male",
    "importance": 2,
    "summary": "Reigned 52 years, built fortresses and advanced military engines, but struck with leprosy after proudly entering the Temple to burn incense.",
    "verses": [
      "2 Kings 15:1-7",
      "2 Chronicles 26:1-23",
      "Isaiah 6:1",
      "Matthew 1:8-9"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 40,
    "fatherId": "joram"
  },
  {
    "id": "jotham",
    "name": "Jotham",
    "hebrewGreek": "יוֹתָם",
    "meaning": "Yahweh is Perfect",
    "era": "Monarchy & Prophets",
    "role": "Righteous King of Judah / Son of Uzziah",
    "gender": "male",
    "importance": 3,
    "summary": "Became mighty because he ordered his ways before the Lord his God; built the Upper Gate of the Temple.",
    "verses": [
      "2 Kings 15:32-38",
      "2 Chronicles 27:1-9",
      "Matthew 1:9"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 41,
    "fatherId": "uzziah"
  },
  {
    "id": "ahaz",
    "name": "King Ahaz",
    "hebrewGreek": "אָחָז",
    "meaning": "He Has Grasped",
    "era": "Monarchy & Prophets",
    "role": "Wicked King of Judah / Recipient of Immanuel Sign",
    "gender": "male",
    "importance": 2,
    "summary": "Practiced idolatry and sacrificed his son; Isaiah challenged him to ask for a sign, giving the prophecy: \"A virgin shall conceive and bear a Son, and shall call His name Immanuel.\"",
    "verses": [
      "2 Kings 16:1-20",
      "Isaiah 7:1-14",
      "Matthew 1:9"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 42,
    "fatherId": "jotham"
  },
  {
    "id": "hezekiah",
    "name": "King Hezekiah",
    "hebrewGreek": "חִזְקִיָּהוּ",
    "meaning": "Yahweh Strengthens",
    "era": "Monarchy & Prophets",
    "role": "Great Reforming King of Judah",
    "gender": "male",
    "importance": 1,
    "summary": "Reopened and cleansed the Temple, dug Jerusalem's water tunnel, prayed when Sennacherib besieged Zion, and was granted fifteen extra years of life.",
    "verses": [
      "2 Kings 18:1-8",
      "2 Kings 19:14-37",
      "2 Kings 20:1-11",
      "Isaiah 36-39",
      "Matthew 1:9-10"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 43,
    "fatherId": "ahaz"
  },
  {
    "id": "manasseh",
    "name": "Manasseh",
    "hebrewGreek": "מְנַשֶּׁה",
    "meaning": "Causing to forget",
    "era": "Monarchy & Prophets",
    "role": "Longest-Reigning King of Judah (55 Years)",
    "gender": "male",
    "importance": 2,
    "summary": "Filled Jerusalem with pagan idols; taken in chains to Babylon where he humbled himself before God and was restored in repentance.",
    "verses": [
      "2 Kings 21:1-18",
      "2 Chronicles 33:1-20",
      "Matthew 1:10"
    ],
    "places": [
      "jerusalem",
      "babylon"
    ],
    "eraOrder": 5,
    "generation": 44,
    "fatherId": "hezekiah"
  },
  {
    "id": "amon",
    "name": "Amon",
    "hebrewGreek": "אָמוֹן",
    "meaning": "Faithful / Skilled artisan",
    "era": "Monarchy & Prophets",
    "role": "King of Judah / Father of Josiah",
    "gender": "male",
    "importance": 3,
    "summary": "Reigned two years, did evil in the sight of the Lord, and was assassinated by his servants in his own house.",
    "verses": [
      "2 Kings 21:19-26",
      "2 Chronicles 33:21-25",
      "Matthew 1:10"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 5,
    "generation": 45,
    "fatherId": "manasseh"
  },
  {
    "id": "josiah",
    "name": "King Josiah",
    "hebrewGreek": "יֹאשִׁיָּהוּ",
    "meaning": "Healed by Yahweh",
    "era": "Monarchy & Prophets",
    "role": "Youthful King & Great Reformer of Judah",
    "gender": "male",
    "importance": 1,
    "summary": "Crowned at age eight, rediscovered the Book of the Law during Temple repairs, tore his robes in repentance, purged idolatry, and led the greatest Passover since Samuel.",
    "verses": [
      "2 Kings 22:1-13",
      "2 Kings 23:1-25",
      "2 Chronicles 34-35",
      "Matthew 1:10-11"
    ],
    "places": [
      "jerusalem",
      "megiddo"
    ],
    "eraOrder": 5,
    "generation": 46,
    "fatherId": "amon"
  },
  {
    "id": "jeconiah",
    "name": "Jeconiah (Jehoiachin)",
    "hebrewGreek": "יְכָנְיָהוּ",
    "meaning": "Yahweh Will Establish",
    "era": "Exile & Return",
    "role": "King of Judah Carried Captive into Babylon",
    "gender": "male",
    "importance": 2,
    "summary": "Surrendered to Nebuchadnezzar during the 597 BC siege of Jerusalem; preserved in Babylon and given a seat above the other kings, continuing the royal seed.",
    "verses": [
      "2 Kings 24:8-16",
      "2 Kings 25:27-30",
      "1 Chronicles 3:16-17",
      "Matthew 1:11-12"
    ],
    "places": [
      "jerusalem",
      "babylon"
    ],
    "eraOrder": 6,
    "generation": 47,
    "fatherId": "josiah"
  },
  {
    "id": "shealtiel",
    "name": "Shealtiel",
    "hebrewGreek": "שְׁאַלְתִּיאֵל",
    "meaning": "I Have Asked of God",
    "era": "Exile & Return",
    "role": "Prince of Judah Born in Babylonian Exile",
    "gender": "male",
    "importance": 2,
    "summary": "Eldest son of Jeconiah in Babylon; legal father of Zerubbabel who led the first return to Zion.",
    "verses": [
      "1 Chronicles 3:17",
      "Ezra 3:2",
      "Haggai 1:1",
      "Matthew 1:12",
      "Luke 3:27"
    ],
    "places": [
      "babylon"
    ],
    "eraOrder": 6,
    "generation": 48,
    "fatherId": "jeconiah"
  },
  {
    "id": "zerubbabel",
    "name": "Zerubbabel",
    "hebrewGreek": "זְרֻבָּבֶל",
    "meaning": "Sown in Babylon / Seed of Babylon",
    "era": "Exile & Return",
    "role": "Governor of Judah & Rebuilder of the Second Temple",
    "gender": "male",
    "importance": 1,
    "summary": "Led 42,000 Jewish exiles back from Babylon, laid the foundation of the Second Temple, and was called God's signet ring by Haggai and Zechariah (\"Not by might nor by power, but by My Spirit\").",
    "verses": [
      "Ezra 2:2",
      "Ezra 3:8-13",
      "Haggai 2:20-23",
      "Zechariah 4:6-10",
      "Matthew 1:12-13",
      "Luke 3:27"
    ],
    "places": [
      "babylon",
      "jerusalem"
    ],
    "eraOrder": 6,
    "generation": 49,
    "fatherId": "shealtiel"
  },
  {
    "id": "abiud",
    "name": "Abiud",
    "hebrewGreek": "Ἀβιούδ",
    "meaning": "My Father is Majesty",
    "era": "Exile & Return",
    "role": "Son of Zerubbabel / Post-Exilic Messianic Link",
    "gender": "male",
    "importance": 3,
    "summary": "Patriarch in the post-exilic royal Davidic lineage leading directly toward Saint Joseph.",
    "verses": [
      "Matthew 1:13"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 6,
    "generation": 50,
    "fatherId": "zerubbabel"
  },
  {
    "id": "eliakim",
    "name": "Eliakim",
    "hebrewGreek": "Ἐλιακίμ",
    "meaning": "God Will Raise Up",
    "era": "Exile & Return",
    "role": "Son of Abiud in Second Temple Period",
    "gender": "male",
    "importance": 3,
    "summary": "Father of Azor recorded in Matthew’s royal genealogy of the Messiah.",
    "verses": [
      "Matthew 1:13"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 6,
    "generation": 51,
    "fatherId": "abiud"
  },
  {
    "id": "matthan",
    "name": "Matthan",
    "hebrewGreek": "Ματθάν",
    "meaning": "Gift",
    "era": "Exile & Return",
    "role": "Grandfather of Joseph (Husband of Mary)",
    "gender": "male",
    "importance": 3,
    "summary": "Father of Jacob and grandfather of Joseph the carpenter of Nazareth.",
    "verses": [
      "Matthew 1:15"
    ],
    "places": [
      "jerusalem",
      "nazareth"
    ],
    "eraOrder": 6,
    "generation": 52,
    "fatherId": "eliakim"
  },
  {
    "id": "jacob-father-joseph",
    "name": "Jacob (Father of Joseph)",
    "hebrewGreek": "Ἰακώβ",
    "meaning": "Supplanter",
    "era": "Exile & Return",
    "role": "Father of Joseph the Carpenter",
    "gender": "male",
    "importance": 3,
    "summary": "Final named ancestor in Matthew’s genealogy who fathered Joseph, the husband of Mary of whom was born Jesus.",
    "verses": [
      "Matthew 1:16"
    ],
    "places": [
      "nazareth"
    ],
    "eraOrder": 6,
    "generation": 53,
    "fatherId": "matthan"
  },
  {
    "id": "joseph-husband",
    "name": "Joseph of Nazareth",
    "hebrewGreek": "Ἰωσήף",
    "meaning": "May He Add",
    "era": "Gospels & Christ",
    "role": "Righteous Husband of Mary & Legal Father of Jesus",
    "gender": "male",
    "importance": 1,
    "summary": "A righteous craftsman of the house and lineage of David who received divine instruction in dreams, took pregnant Mary as his wife, and protected infant Jesus from Herod.",
    "verses": [
      "Matthew 1:16-25",
      "Matthew 2:13-23",
      "Luke 2:4-7",
      "Luke 2:41-51"
    ],
    "places": [
      "nazareth",
      "bethlehem",
      "egypt"
    ],
    "eraOrder": 7,
    "generation": 54,
    "fatherId": "jacob-father-joseph",
    "spouseId": "mary-mother"
  },
  {
    "id": "mary-mother",
    "name": "Mary (Mother of Jesus)",
    "hebrewGreek": "Μαριάμ / Μαρία",
    "meaning": "Beloved / Exalted",
    "era": "Gospels & Christ",
    "role": "Mother of the Incarnate Christ",
    "gender": "female",
    "importance": 1,
    "summary": "Humbly submitted to the angelic Annunciation (\"Behold the handmaid of the Lord\"), chanted the Magnificat, gave birth in Bethlehem, and stood faithfully at the foot of the Cross.",
    "verses": [
      "Luke 1:26-38",
      "Luke 1:46-55",
      "Luke 2:19",
      "John 19:25-27",
      "Acts 1:14"
    ],
    "places": [
      "nazareth",
      "bethlehem",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 54,
    "spouseId": "joseph-husband"
  },
  {
    "id": "jesus",
    "name": "Jesus Christ",
    "hebrewGreek": "Ἰησοῦς Χριστός / ישוע המשיח",
    "meaning": "Yahweh is Salvation / The Anointed One",
    "era": "Gospels & Christ",
    "role": "Son of God, Messiah, Savior & King of Kings",
    "gender": "male",
    "importance": 1,
    "summary": "The eternal Word made flesh, fulfilling every Old Testament prophecy from Genesis to Malachi. Lived sinlessly, manifested the Kingdom of God, died as an atoning sacrifice for the world, and rose bodily from the grave on the third day.",
    "verses": [
      "Matthew 1:21",
      "John 1:1-14",
      "John 14:6",
      "Luke 24:1-7",
      "Philippians 2:5-11",
      "Revelation 1:8"
    ],
    "places": [
      "bethlehem",
      "nazareth",
      "sea-of-galilee",
      "capernaum",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 55,
    "fatherId": "joseph-husband",
    "motherId": "mary-mother"
  },
  {
    "id": "john-baptist",
    "name": "John the Baptist",
    "hebrewGreek": "Ἰωάννης ὁ Βαπτιστής",
    "meaning": "Yahweh is Gracious",
    "era": "Gospels & Christ",
    "role": "Forerunner of Christ & Greatest of the Prophets",
    "gender": "male",
    "importance": 1,
    "summary": "Filled with the Holy Spirit from his mother's womb, preached repentance in the wilderness, baptized Jesus in the Jordan, and proclaimed: \"Behold the Lamb of God who taketh away the sin of the world!\"",
    "verses": [
      "Matthew 3:1-17",
      "Luke 1:13-17",
      "John 1:19-34",
      "John 3:28-30"
    ],
    "places": [
      "jordan-river",
      "macherus"
    ],
    "eraOrder": 7,
    "generation": 54
  },
  {
    "id": "peter",
    "name": "Simon Peter (Cephas)",
    "hebrewGreek": "Σίμων Πέτρος / כֵּיפָא",
    "meaning": "Rock / Stone",
    "era": "Gospels & Christ",
    "role": "Chief Apostle & Leader of the Early Church",
    "gender": "male",
    "importance": 1,
    "summary": "Fisherman who confessed Jesus as the Christ, was restored by Jesus on the shore of Galilee, preached the inaugural sermon at Pentecost, opened the gospel to Gentiles, and authored two epistles.",
    "verses": [
      "Matthew 16:16-19",
      "Luke 22:31-34",
      "John 21:15-19",
      "Acts 2:14-41",
      "1 Peter 1:3-9"
    ],
    "places": [
      "capernaum",
      "sea-of-galilee",
      "jerusalem",
      "antioch",
      "rome"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "andrew",
    "name": "Andrew",
    "hebrewGreek": "Ἀνδρέας",
    "meaning": "Manly / Courageous",
    "era": "Gospels & Christ",
    "role": "Apostle & First-Called Disciple",
    "gender": "male",
    "importance": 2,
    "summary": "Disciple of John the Baptist who first recognized Jesus and brought his brother Simon Peter to the Lord.",
    "verses": [
      "John 1:35-42",
      "John 6:8-9",
      "John 12:20-22"
    ],
    "places": [
      "bethsaida",
      "capernaum",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "james-zebedee",
    "name": "James (Son of Zebedee)",
    "hebrewGreek": "Ἰάκωβος",
    "meaning": "Supplanter",
    "era": "Gospels & Christ",
    "role": "Son of Thunder & First Apostolic Martyr",
    "gender": "male",
    "importance": 1,
    "summary": "Part of Jesus' inner circle who witnessed the Transfiguration and Gethsemane; became the first apostle martyred under Herod Agrippa I.",
    "verses": [
      "Mark 3:17",
      "Matthew 17:1-2",
      "Mark 10:35-40",
      "Acts 12:1-2"
    ],
    "places": [
      "capernaum",
      "sea-of-galilee",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "john-apostle",
    "name": "John the Apostle (The Beloved)",
    "hebrewGreek": "Ἰωάννης",
    "meaning": "Yahweh is Gracious",
    "era": "Gospels & Christ",
    "role": "The Beloved Disciple, Evangelist & Seer of Patmos",
    "gender": "male",
    "importance": 1,
    "summary": "Reclined on Jesus' bosom at the Last Supper, cared for Mary at the Cross, outran Peter to the empty tomb, and authored the Fourth Gospel, three epistles, and Revelation.",
    "verses": [
      "John 13:23",
      "John 19:26-27",
      "John 20:2-8",
      "1 John 1:1-4",
      "Revelation 1:9-19"
    ],
    "places": [
      "capernaum",
      "jerusalem",
      "ephesus",
      "patmos"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "thomas",
    "name": "Thomas (Didymus)",
    "hebrewGreek": "Θωμᾶς",
    "meaning": "The Twin",
    "era": "Gospels & Christ",
    "role": "Apostle & Bold Confessor of the Risen Lord",
    "gender": "male",
    "importance": 2,
    "summary": "Demanded to touch Christ’s wounds before proclaiming the supreme confession: \"My Lord and my God!\"",
    "verses": [
      "John 11:16",
      "John 14:5",
      "John 20:24-29"
    ],
    "places": [
      "capernaum",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "matthew",
    "name": "Matthew (Levi)",
    "hebrewGreek": "Μαθθαῖος",
    "meaning": "Gift of Yahweh",
    "era": "Gospels & Christ",
    "role": "Tax Collector Turned Apostle & Gospel Author",
    "gender": "male",
    "importance": 2,
    "summary": "Left his tax collection booth at Capernaum upon Jesus' call and wrote the First Gospel establishing Jesus as David’s Messianic King.",
    "verses": [
      "Matthew 9:9-13",
      "Mark 2:14",
      "Luke 5:27-32"
    ],
    "places": [
      "capernaum",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "mary-magdalene",
    "name": "Mary Magdalene",
    "hebrewGreek": "Μαρία ἡ Μαγδαληνή",
    "meaning": "Tower / Of Magdala",
    "era": "Gospels & Christ",
    "role": "Devoted Disciple & First Witness of the Risen Christ",
    "gender": "female",
    "importance": 1,
    "summary": "Delivered from seven demons, supported Jesus' ministry, remained steadfast at Calvary, and was the first person to whom the risen Jesus appeared at the garden tomb.",
    "verses": [
      "Luke 8:1-3",
      "Mark 15:40",
      "John 20:1-18"
    ],
    "places": [
      "magdala",
      "jerusalem"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "lazarus",
    "name": "Lazarus of Bethany",
    "hebrewGreek": "Λάζαρος",
    "meaning": "God Has Helped",
    "era": "Gospels & Christ",
    "role": "Friend of Jesus Raised from the Dead",
    "gender": "male",
    "importance": 2,
    "summary": "Brother of Mary and Martha who had been four days in the tomb when Jesus commanded: \"Lazarus, come forth!\"",
    "verses": [
      "John 11:1-44",
      "John 12:9-11"
    ],
    "places": [
      "bethany"
    ],
    "eraOrder": 7,
    "generation": 55
  },
  {
    "id": "stephen",
    "name": "Stephen",
    "hebrewGreek": "Στέφανος",
    "meaning": "Crown / Wreath",
    "era": "Apostles & Early Church",
    "role": "First Christian Deacon & Protomartyr",
    "gender": "male",
    "importance": 1,
    "summary": "Full of grace and power, delivered a panoramic defense of the faith before the Sanhedrin, beheld Jesus standing at God’s right hand, and prayed for his executioners as he was stoned.",
    "verses": [
      "Acts 6:5-15",
      "Acts 7:1-60",
      "Acts 8:2"
    ],
    "places": [
      "jerusalem"
    ],
    "eraOrder": 8,
    "generation": 56
  },
  {
    "id": "paul",
    "name": "Paul (Saul of Tarsus)",
    "hebrewGreek": "Παῦλος / שָׁאוּל",
    "meaning": "Small / Humble",
    "era": "Apostles & Early Church",
    "role": "Apostle to the Gentiles & Author of the Epistles",
    "gender": "male",
    "importance": 1,
    "summary": "Zealous persecutor converted on the Damascus road by the risen Christ, conducted worldwide missionary journeys planting churches, and authored thirteen canonical epistles.",
    "verses": [
      "Acts 9:1-22",
      "Acts 13-28",
      "Romans 1:1",
      "2 Corinthians 11:23-28",
      "2 Timothy 4:7-8"
    ],
    "places": [
      "tarsus",
      "jerusalem",
      "damascus",
      "antioch",
      "ephesus",
      "corinth",
      "athens",
      "rome"
    ],
    "eraOrder": 8,
    "generation": 56
  },
  {
    "id": "barnabas",
    "name": "Barnabas (Joseph of Cyprus)",
    "hebrewGreek": "Βαρναβᾶς",
    "meaning": "Son of Encouragement",
    "era": "Apostles & Early Church",
    "role": "Apostolic Leader & Mentor of Paul and Mark",
    "gender": "male",
    "importance": 1,
    "summary": "Vouched for Saul when others feared him, co-pastored the church in Antioch, and accompanied Paul on the First Missionary Journey.",
    "verses": [
      "Acts 4:36-37",
      "Acts 9:26-27",
      "Acts 11:22-26",
      "Acts 13:1-3",
      "Acts 15:36-40"
    ],
    "places": [
      "cyprus",
      "jerusalem",
      "antioch"
    ],
    "eraOrder": 8,
    "generation": 56
  },
  {
    "id": "silas",
    "name": "Silas (Silvanus)",
    "hebrewGreek": "Σίλας / Σιλουανός",
    "meaning": "Of the Forest",
    "era": "Apostles & Early Church",
    "role": "Prophet, Co-worker of Paul & Peter",
    "gender": "male",
    "importance": 2,
    "summary": "Accompanied Paul on his Second Missionary Journey, singing praises at midnight in the Philippian jail during the earthquake.",
    "verses": [
      "Acts 15:22-40",
      "Acts 16:19-34",
      "1 Peter 5:12"
    ],
    "places": [
      "jerusalem",
      "antioch",
      "philippi",
      "corinth"
    ],
    "eraOrder": 8,
    "generation": 56
  },
  {
    "id": "timothy",
    "name": "Timothy",
    "hebrewGreek": "Τιμόθεος",
    "meaning": "Honoring God",
    "era": "Apostles & Early Church",
    "role": "Pastor of Ephesus & Spiritual Son of Paul",
    "gender": "male",
    "importance": 1,
    "summary": "Joined Paul at Lystra, served as his most trusted emissary, and received two pastoral epistles charging him to guard the deposit of faith.",
    "verses": [
      "Acts 16:1-3",
      "Philippians 2:19-22",
      "1 Timothy 1:1-2",
      "2 Timothy 1:5",
      "2 Timothy 4:1-5"
    ],
    "places": [
      "lystra",
      "ephesus",
      "rome"
    ],
    "eraOrder": 8,
    "generation": 57
  },
  {
    "id": "luke",
    "name": "Luke the Physician",
    "hebrewGreek": "Λουκᾶς",
    "meaning": "Light-giving",
    "era": "Apostles & Early Church",
    "role": "Beloved Physician & Author of Luke-Acts",
    "gender": "male",
    "importance": 1,
    "summary": "Gentile doctor who researched the life of Christ and the apostolic expansion; remained with Paul in his final Roman imprisonment (\"Only Luke is with me\").",
    "verses": [
      "Luke 1:1-4",
      "Colossians 4:14",
      "2 Timothy 4:11",
      "Philemon 1:24"
    ],
    "places": [
      "antioch",
      "philippi",
      "rome"
    ],
    "eraOrder": 8,
    "generation": 56
  },
  {
    "id": "james-brother",
    "name": "James the Just (Brother of Jesus)",
    "hebrewGreek": "Ἰάκωβος ὁ Δίκαιος",
    "meaning": "Supplanter",
    "era": "Apostles & Early Church",
    "role": "Leader of the Jerusalem Church & Author of James",
    "gender": "male",
    "importance": 1,
    "summary": "Brother of Jesus who beheld the risen Lord, moderated the Jerusalem Council in Acts 15, and authored the Epistle of James.",
    "verses": [
      "Matthew 13:55",
      "1 Corinthians 15:7",
      "Acts 15:13-21",
      "Galatians 2:9",
      "James 1:1"
    ],
    "places": [
      "nazareth",
      "jerusalem"
    ],
    "eraOrder": 8,
    "generation": 55,
    "motherId": "mary-mother"
  }
];

export const BIBLICAL_RELATIONSHIPS: BiblicalRelationship[] = [
  {
    "source": "adam",
    "target": "eve",
    "type": "spouse",
    "label": "Spouse (First Marriage)"
  },
  {
    "source": "adam",
    "target": "cain",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "adam",
    "target": "abel",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "adam",
    "target": "seth",
    "type": "parent-child",
    "label": "Father of (Promise Line)"
  },
  {
    "source": "eve",
    "target": "cain",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "eve",
    "target": "abel",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "eve",
    "target": "seth",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "cain",
    "target": "abel",
    "type": "rivalry",
    "label": "Murdered brother"
  },
  {
    "source": "seth",
    "target": "enosh",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "enosh",
    "target": "kenan",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "kenan",
    "target": "mahalalel",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "mahalalel",
    "target": "jared",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "jared",
    "target": "enoch",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "enoch",
    "target": "methuselah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "methuselah",
    "target": "lamech-patriarch",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "lamech-patriarch",
    "target": "noah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "noah",
    "target": "shem",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "shem",
    "target": "arphaxad",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "arphaxad",
    "target": "shelah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "shelah",
    "target": "eber",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "eber",
    "target": "peleg",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "peleg",
    "target": "reu",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "reu",
    "target": "serug",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "serug",
    "target": "nahor-i",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "nahor-i",
    "target": "terah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "terah",
    "target": "abraham",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "abraham",
    "target": "sarah",
    "type": "spouse",
    "label": "Spouse (Covenant Matriarch)"
  },
  {
    "source": "abraham",
    "target": "hagar",
    "type": "spouse",
    "label": "Handmaid"
  },
  {
    "source": "abraham",
    "target": "lot",
    "type": "alliance",
    "label": "Uncle & Protector of"
  },
  {
    "source": "abraham",
    "target": "isaac",
    "type": "parent-child",
    "label": "Father of (Promise Child)"
  },
  {
    "source": "abraham",
    "target": "ishmael",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "sarah",
    "target": "isaac",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "hagar",
    "target": "ishmael",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "isaac",
    "target": "rebekah",
    "type": "spouse",
    "label": "Spouse"
  },
  {
    "source": "isaac",
    "target": "esau",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "isaac",
    "target": "jacob",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "rebekah",
    "target": "jacob",
    "type": "parent-child",
    "label": "Mother & Counselor of"
  },
  {
    "source": "esau",
    "target": "jacob",
    "type": "sibling",
    "label": "Twin Brothers (Reconciled)"
  },
  {
    "source": "jacob",
    "target": "leah",
    "type": "spouse",
    "label": "Wife"
  },
  {
    "source": "jacob",
    "target": "rachel",
    "type": "spouse",
    "label": "Beloved Wife"
  },
  {
    "source": "jacob",
    "target": "judah",
    "type": "parent-child",
    "label": "Father of (Royal Scepter)"
  },
  {
    "source": "jacob",
    "target": "levi",
    "type": "parent-child",
    "label": "Father of (Priesthood)"
  },
  {
    "source": "leah",
    "target": "judah",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "leah",
    "target": "levi",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "judah",
    "target": "perez",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "perez",
    "target": "hezron",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "hezron",
    "target": "ram",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "ram",
    "target": "amminadab",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "amminadab",
    "target": "nahshon",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "nahshon",
    "target": "salmon",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "salmon",
    "target": "rahab",
    "type": "spouse",
    "label": "Husband of"
  },
  {
    "source": "salmon",
    "target": "boaz",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "rahab",
    "target": "boaz",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "boaz",
    "target": "ruth",
    "type": "spouse",
    "label": "Kinsman-Redeemer & Husband"
  },
  {
    "source": "naomi",
    "target": "ruth",
    "type": "alliance",
    "label": "Mother-in-law & Devoted Companion"
  },
  {
    "source": "boaz",
    "target": "obed",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "ruth",
    "target": "obed",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "obed",
    "target": "jesse",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "jesse",
    "target": "david",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "levi",
    "target": "kohath",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "kohath",
    "target": "amram",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "amram",
    "target": "jochebed",
    "type": "spouse",
    "label": "Spouse"
  },
  {
    "source": "amram",
    "target": "moses",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "amram",
    "target": "aaron",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "amram",
    "target": "miriam",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "jochebed",
    "target": "moses",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "jochebed",
    "target": "aaron",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "jochebed",
    "target": "miriam",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "moses",
    "target": "aaron",
    "type": "sibling",
    "label": "Brothers & Co-Leaders"
  },
  {
    "source": "moses",
    "target": "miriam",
    "type": "sibling",
    "label": "Siblings"
  },
  {
    "source": "moses",
    "target": "joshua",
    "type": "mentor-disciple",
    "label": "Mentored & Commissioned"
  },
  {
    "source": "joshua",
    "target": "caleb",
    "type": "alliance",
    "label": "Faithful Spy Companions"
  },
  {
    "source": "joshua",
    "target": "rahab",
    "type": "alliance",
    "label": "Protected in Jericho"
  },
  {
    "source": "samuel",
    "target": "saul",
    "type": "mentor-disciple",
    "label": "Anointed First King"
  },
  {
    "source": "samuel",
    "target": "david",
    "type": "mentor-disciple",
    "label": "Anointed King in Bethlehem"
  },
  {
    "source": "saul",
    "target": "jonathan",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "saul",
    "target": "david",
    "type": "rivalry",
    "label": "Jealous Adversary"
  },
  {
    "source": "jonathan",
    "target": "david",
    "type": "alliance",
    "label": "Covenant Soul-Brothers"
  },
  {
    "source": "david",
    "target": "bathsheba",
    "type": "spouse",
    "label": "Spouse & Queen Mother"
  },
  {
    "source": "david",
    "target": "solomon",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "bathsheba",
    "target": "solomon",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "solomon",
    "target": "rehoboam",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "rehoboam",
    "target": "abijah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "abijah",
    "target": "asa",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "asa",
    "target": "jehoshaphat",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "jehoshaphat",
    "target": "joram",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "joram",
    "target": "uzziah",
    "type": "parent-child",
    "label": "Ancestor/Father of"
  },
  {
    "source": "uzziah",
    "target": "jotham",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "jotham",
    "target": "ahaz",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "ahaz",
    "target": "hezekiah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "hezekiah",
    "target": "manasseh",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "manasseh",
    "target": "amon",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "amon",
    "target": "josiah",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "josiah",
    "target": "jeconiah",
    "type": "parent-child",
    "label": "Grandfather/Father of"
  },
  {
    "source": "jeconiah",
    "target": "shealtiel",
    "type": "parent-child",
    "label": "Father of in Babylon"
  },
  {
    "source": "shealtiel",
    "target": "zerubbabel",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "zerubbabel",
    "target": "abiud",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "abiud",
    "target": "eliakim",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "eliakim",
    "target": "matthan",
    "type": "parent-child",
    "label": "Ancestor of"
  },
  {
    "source": "matthan",
    "target": "jacob-father-joseph",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "jacob-father-joseph",
    "target": "joseph-husband",
    "type": "parent-child",
    "label": "Father of"
  },
  {
    "source": "joseph-husband",
    "target": "mary-mother",
    "type": "spouse",
    "label": "Betrothed & Married"
  },
  {
    "source": "joseph-husband",
    "target": "jesus",
    "type": "parent-child",
    "label": "Earthly Legal Father"
  },
  {
    "source": "mary-mother",
    "target": "jesus",
    "type": "parent-child",
    "label": "Mother of the Incarnate Lord"
  },
  {
    "source": "mary-mother",
    "target": "james-brother",
    "type": "parent-child",
    "label": "Mother of"
  },
  {
    "source": "john-baptist",
    "target": "jesus",
    "type": "alliance",
    "label": "Forerunner who Baptized Jesus"
  },
  {
    "source": "jesus",
    "target": "peter",
    "type": "mentor-disciple",
    "label": "Called as Rock & Chief Apostle"
  },
  {
    "source": "jesus",
    "target": "andrew",
    "type": "mentor-disciple",
    "label": "Called as Apostle"
  },
  {
    "source": "jesus",
    "target": "james-zebedee",
    "type": "mentor-disciple",
    "label": "Inner Circle Apostle"
  },
  {
    "source": "jesus",
    "target": "john-apostle",
    "type": "mentor-disciple",
    "label": "The Beloved Disciple"
  },
  {
    "source": "jesus",
    "target": "thomas",
    "type": "mentor-disciple",
    "label": "Apostle (\"My Lord and my God\")"
  },
  {
    "source": "jesus",
    "target": "matthew",
    "type": "mentor-disciple",
    "label": "Called from Tax Office"
  },
  {
    "source": "jesus",
    "target": "mary-magdalene",
    "type": "mentor-disciple",
    "label": "Delivered & First Resurrection Witness"
  },
  {
    "source": "jesus",
    "target": "lazarus",
    "type": "alliance",
    "label": "Beloved Friend Raised from Dead"
  },
  {
    "source": "peter",
    "target": "andrew",
    "type": "sibling",
    "label": "Brothers & Fishermen"
  },
  {
    "source": "james-zebedee",
    "target": "john-apostle",
    "type": "sibling",
    "label": "Sons of Zebedee"
  },
  {
    "source": "peter",
    "target": "john-apostle",
    "type": "alliance",
    "label": "Pillars of the Early Church"
  },
  {
    "source": "stephen",
    "target": "paul",
    "type": "rivalry",
    "label": "Saul consented to Stephen's death"
  },
  {
    "source": "jesus",
    "target": "paul",
    "type": "mentor-disciple",
    "label": "Appeared & Commissioned on Damascus Road"
  },
  {
    "source": "barnabas",
    "target": "paul",
    "type": "mentor-disciple",
    "label": "Vouched for Saul & First Missionary Partner"
  },
  {
    "source": "paul",
    "target": "silas",
    "type": "alliance",
    "label": "Second Missionary Journey Partner"
  },
  {
    "source": "paul",
    "target": "timothy",
    "type": "mentor-disciple",
    "label": "Spiritual Father to True Son in Faith"
  },
  {
    "source": "paul",
    "target": "luke",
    "type": "alliance",
    "label": "Beloved Physician & Companion"
  },
  {
    "source": "paul",
    "target": "peter",
    "type": "alliance",
    "label": "Apostles to Gentiles & Jews"
  },
  {
    "source": "paul",
    "target": "james-brother",
    "type": "alliance",
    "label": "Conferred at Jerusalem Council"
  },
  {
    "source": "peter",
    "target": "james-brother",
    "type": "alliance",
    "label": "Pillars of the Jerusalem Church"
  }
];
