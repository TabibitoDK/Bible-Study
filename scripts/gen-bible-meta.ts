import fs from "fs";
import path from "path";

const BIBLE_DIR = path.resolve(import.meta.dir, "../public/bible");
const OUT_FILE = path.resolve(import.meta.dir, "../src/data/bibleMeta.ts");

if (!fs.existsSync(path.dirname(OUT_FILE))) {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
}

const books = JSON.parse(fs.readFileSync(path.join(BIBLE_DIR, "Books.json"), "utf8"));

const otCategories: Record<string, string> = {
  Genesis: "Pentateuch", Exodus: "Pentateuch", Leviticus: "Pentateuch", Numbers: "Pentateuch", Deuteronomy: "Pentateuch",
  Joshua: "Historical", Judges: "Historical", Ruth: "Historical", "1 Samuel": "Historical", "2 Samuel": "Historical",
  "1 Kings": "Historical", "2 Kings": "Historical", "1 Chronicles": "Historical", "2 Chronicles": "Historical",
  Ezra: "Historical", Nehemiah: "Historical", Esther: "Historical",
  Job: "Wisdom & Poetry", Psalms: "Wisdom & Poetry", Proverbs: "Wisdom & Poetry", Ecclesiastes: "Wisdom & Poetry", "Song of Solomon": "Wisdom & Poetry",
  Isaiah: "Major Prophets", Jeremiah: "Major Prophets", Lamentations: "Major Prophets", Ezekiel: "Major Prophets", Daniel: "Major Prophets",
  Hosea: "Minor Prophets", Joel: "Minor Prophets", Amos: "Minor Prophets", Obadiah: "Minor Prophets", Jonah: "Minor Prophets",
  Micah: "Minor Prophets", Nahum: "Minor Prophets", Habakkuk: "Minor Prophets", Zephaniah: "Minor Prophets", Haggai: "Minor Prophets",
  Zechariah: "Minor Prophets", Malachi: "Minor Prophets",
};

const ntCategories: Record<string, string> = {
  Matthew: "Gospels", Mark: "Gospels", Luke: "Gospels", John: "Gospels",
  Acts: "Apostolic History",
  Romans: "Pauline Epistles", "1 Corinthians": "Pauline Epistles", "2 Corinthians": "Pauline Epistles",
  Galatians: "Pauline Epistles", Ephesians: "Pauline Epistles", Philippians: "Pauline Epistles",
  Colossians: "Pauline Epistles", "1 Thessalonians": "Pauline Epistles", "2 Thessalonians": "Pauline Epistles",
  "1 Timothy": "Pauline Epistles", "2 Timothy": "Pauline Epistles", Titus: "Pauline Epistles", Philemon: "Pauline Epistles",
  Hebrews: "General Epistles", James: "General Epistles", "1 Peter": "General Epistles", "2 Peter": "General Epistles",
  "1 John": "General Epistles", "2 John": "General Epistles", "3 John": "General Epistles", Jude: "General Epistles",
  Revelation: "Apocalyptic",
};

const summaries: Record<string, string> = {
  Genesis: "The book of origins: creation, fall, flood, and the patriarchal covenants with Abraham, Isaac, Jacob, and Joseph.",
  Exodus: "The deliverance of Israel from Egypt, the covenant at Mount Sinai, and the establishment of the Tabernacle.",
  Leviticus: "Sacred laws, holiness, the sacrificial system, and priesthood of Aaron.",
  Numbers: "The census, wilderness wandering, rebellion, and journey toward the Promised Land.",
  Deuteronomy: "Moses' final discourses, the reiteration of the Law, and the renewal of the covenant.",
  Joshua: "The conquest and distribution of Canaan under the leadership of Joshua.",
  Judges: "Cycles of apostasy, oppression, repentance, and deliverance through leaders called judges.",
  Ruth: "A narrative of loyalty, redemption, and providence in the lineage of David.",
  "1 Samuel": "The transition from judges to monarchy: Samuel, Saul's tragic reign, and David's rise.",
  "2 Samuel": "The reign of King David, the establishment of Jerusalem, and royal struggles.",
  "1 Kings": "Solomon's golden age, the construction of the Temple, the kingdom divided, and the prophet Elijah.",
  "2 Kings": "The decline and fall of Israel to Assyria and Judah to Babylon, and the ministry of Elisha.",
  "1 Chronicles": "Genealogies from Adam and the priestly history of David's reign and temple preparations.",
  "2 Chronicles": "Solomon's temple, the history of Judah's kings, and the decree of Cyrus.",
  Ezra: "The return from Babylonian exile, the rebuilding of the second Temple, and religious reform.",
  Nehemiah: "The reconstruction of Jerusalem's walls and civil-spiritual renewal under Nehemiah.",
  Esther: "God's providential deliverance of the Jewish people in the Persian empire under Queen Esther.",
  Job: "A profound contemplation of suffering, divine sovereignty, and unyielding faith.",
  Psalms: "Sacred poetry, laments, praises, prayers, and prophetic messianic songs.",
  Proverbs: "Practical wisdom, moral guidance, and the fear of the Lord for righteous living.",
  Ecclesiastes: "Reflections on the vanity of earthly life and the pursuit of ultimate meaning in God.",
  "Song of Solomon": "An allegorical celebration of marital love, beauty, and devotion.",
  Isaiah: "Prophecies of judgment, holy restoration, the Suffering Servant, and the new creation.",
  Jeremiah: "The weeping prophet's warning to Judah, the fall of Jerusalem, and the New Covenant.",
  Lamentations: "Poetic laments over the destruction of Jerusalem and the desolation of Zion.",
  Ezekiel: "Visions of God's glory, the valley of dry bones, and the restored future temple.",
  Daniel: "Faithfulness in Babylonian exile, apocalyptic visions of world empires, and God's eternal kingdom.",
  Hosea: "God's unfailing love depicted through the prophet's marriage to unfaithful Gomer.",
  Joel: "The plague of locusts, the solemn Day of the Lord, and the outpouring of the Holy Spirit.",
  Amos: "A shepherd's cry for social justice and righteousness against religious hypocrisy.",
  Obadiah: "Prophetic doom upon Edom for their hostility toward Jerusalem.",
  Jonah: "The reluctant prophet sent to Nineveh and God's boundlessly compassionate mercy.",
  Micah: "Judgment for oppression, the promise of a Ruler born in Bethlehem, and doing justly.",
  Nahum: "The fall and judgment of the Assyrian capital, Nineveh.",
  Habakkuk: "Dialogue on why the wicked prosper and the righteous living by faith.",
  Zephaniah: "The coming Day of the Lord and the restoration of a humble remnant.",
  Haggai: "Exhortations to finish rebuilding the Temple in post-exilic Jerusalem.",
  Zechariah: "Visions of restoration, the humble King entering on a donkey, and the pierced Messiah.",
  Malachi: "Final Old Testament warnings regarding tithing, unfaithfulness, and the coming of Elijah.",
  Matthew: "The Gospel of Jesus as the promised Messianic King fulfilling Old Testament scripture.",
  Mark: "The urgent Gospel of Jesus Christ as the Suffering Servant and Son of God.",
  Luke: "A meticulous historical account of the Son of Man who came to seek and save the lost.",
  John: "The theological Gospel of Jesus as the incarnate Word, the Lamb, and the Son of God.",
  Acts: "The birth of the Church, the Holy Spirit at Pentecost, and the gospel spreading to Rome.",
  Romans: "Paul's magnum opus on justification by faith, grace, and redemption in Christ.",
  "1 Corinthians": "Pastoral correction on church unity, morality, spiritual gifts, and the resurrection.",
  "2 Corinthians": "Paul's defense of his apostolic authority, comfort in affliction, and generous giving.",
  Galatians: "Freedom in Christ and justification by faith apart from the works of the Law.",
  Ephesians: "The eternal purpose of God, the mystery of the Church, and the armor of God.",
  Philippians: "The epistle of joy, humility in Christ, and pressing toward the heavenly prize.",
  Colossians: "The cosmic supremacy and preeminence of Christ above all philosophy and principalities.",
  "1 Thessalonians": "Encouragement under persecution and the hope of Christ's glorious return.",
  "2 Thessalonians": "Clarification concerning the Day of the Lord and warning against idleness.",
  "1 Timothy": "Pastoral instructions on church order, leadership qualifications, and sound doctrine.",
  "2 Timothy": "Paul's poignant final charge to Timothy to guard the faith and endure hardness.",
  Titus: "Setting churches in order in Crete and the grace that teaches godly living.",
  Philemon: "A personal appeal for reconciliation and brotherhood regarding the runaway slave Onesimus.",
  Hebrews: "The absolute superiority of Christ, His eternal high priesthood, and the hall of faith.",
  James: "Practical faith demonstrated through works, speech control, and steadfast perseverance.",
  "1 Peter": "Living as pilgrims and strangers with living hope amidst fiery trials.",
  "2 Peter": "Guarding against false teachers, growing in spiritual grace, and the day of God.",
  "1 John": "Fellowship with God, the test of authentic love, and assurance of eternal life.",
  "2 John": "Abiding in truth, walking in love, and guarding against deceivers.",
  "3 John": "Commending hospitality to fellow laborers and warning against prideful Diotrephes.",
  Jude: "Contending earnestly for the faith once delivered to the saints against apostasy.",
  Revelation: "The triumphant apocalyptic unveiling of Jesus Christ, the overthrow of evil, and the New Jerusalem."
};

const bookMetaList = books.map((name: string, index: number) => {
  const filePath = path.join(BIBLE_DIR, `${name}.json`);
  let chaptersCount = 0;
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    chaptersCount = data.chapters?.length || 0;
  }
  const isOt = index < 39;
  const testament = isOt ? "Old Testament" : "New Testament";
  const category = isOt ? (otCategories[name] || "Old Testament") : (ntCategories[name] || "New Testament");
  const summary = summaries[name] || `The holy biblical book of ${name}.`;

  return {
    id: name,
    name,
    order: index + 1,
    testament,
    category,
    chaptersCount,
    summary,
  };
});

const content = `// Generated Bible metadata for all 66 books
export interface BookMeta {
  id: string;
  name: string;
  order: number;
  testament: 'Old Testament' | 'New Testament';
  category: string;
  chaptersCount: number;
  summary: string;
}

export const BIBLE_BOOKS: BookMeta[] = ${JSON.stringify(bookMetaList, null, 2)};

export const TESTAMENTS = ['Old Testament', 'New Testament'] as const;

export const CATEGORIES = [
  'Pentateuch',
  'Historical',
  'Wisdom & Poetry',
  'Major Prophets',
  'Minor Prophets',
  'Gospels',
  'Apostolic History',
  'Pauline Epistles',
  'General Epistles',
  'Apocalyptic'
] as const;
`;

fs.writeFileSync(OUT_FILE, content, "utf8");
console.log("Successfully generated src/data/bibleMeta.ts with 66 books!");
