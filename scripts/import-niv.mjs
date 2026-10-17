import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Import the user's unnumbered, one-verse-per-line NIV text export.
// Only the seven reviewed combined lines below need splitting. Missing NIV
// verses retain their original reference gaps; no KJV text is substituted.
const inputPath = process.argv[2];
if (!inputPath) throw new Error('Usage: node scripts/import-niv.mjs <bible-niv.txt>');
const root = fileURLToPath(new URL('../', import.meta.url));
const input = await readFile(inputPath);
const lines = input.toString('utf8').split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
const names = JSON.parse(await readFile(path.join(root, 'public/bible/Books.json'), 'utf8'));
const omitted = {
  Matthew: ['17:21', '18:11', '23:14'],
  Mark: ['7:16', '9:44', '9:46', '11:26', '15:28'],
  Luke: ['17:36', '23:17'], John: ['5:4'],
  Acts: ['8:37', '15:34', '24:7', '28:29'], Romans: ['16:24'],
};
const combined = {
  Exodus: [{ start: '30:23', splits: ['500 shekels of cassia'] }],
  Numbers: [
    { start: '31:32', splits: ['72,000 cattle', '61,000 donkeys'] },
    { start: '31:37', splits: ['36,000 cattle', '30,500 donkeys', '16,000 people'] },
    { start: '31:43', splits: ['36,000 cattle', '30,500 donkeys'] },
  ],
  Ezra: [{ start: '2:66', splits: ['435 camels'] }, { start: '8:26', splits: ['20 bowls of gold'] }],
  Nehemiah: [{ start: '7:68', splits: ['435 camels'] }],
};
const sections = [];
for (const line of lines) {
  const book = line.replace(/^st /, '1 ').replace(/^nd /, '2 ').replace(/^rd /, '3 ');
  if (names.includes(book)) sections.push({ book, rows: [], psalmBoundaries: [] });
  else {
    const section = sections.at(-1);
    if (!section) throw new Error('Unexpected text before the first book.');
    const psalm = line.match(/^PSALM (\d+)$/);
    if (section.book === 'Psalms' && psalm) section.psalmBoundaries.push({ chapter: Number(psalm[1]), offset: section.rows.length });
    else section.rows.push(line);
  }
}
if (sections.length !== 66 || sections.some((section, index) => section.book !== names[index])) throw new Error('Expected all 66 books in canonical order.');
const converted = [];
let total = 0;
for (const section of sections) {
  const reference = JSON.parse(await readFile(path.join(root, 'public/bible', `${section.book}.json`), 'utf8'));
  let cursor = 0;
  let pending = [];
  const output = { book: section.book, chapters: [] };
  for (const chapter of reference.chapters) {
    if (section.book === 'Psalms') {
      const boundary = section.psalmBoundaries[Number(chapter.chapter) - 1];
      if (!boundary || boundary.chapter !== Number(chapter.chapter) || boundary.offset !== cursor) throw new Error(`Psalm ${chapter.chapter} boundary mismatch.`);
    }
    const verses = [];
    for (const verse of chapter.verses) {
      const ref = `${chapter.chapter}:${verse.verse}`;
      if (omitted[section.book]?.includes(ref)) continue;
      const group = combined[section.book]?.find((entry) => entry.start === ref);
      if (group) {
        if (pending.length) throw new Error('Overlapping combined verses.');
        const text = section.rows[cursor++];
        if (!text) throw new Error(`Missing combined verse at ${section.book} ${ref}.`);
        let remainder = text;
        for (const marker of group.splits) {
          const position = remainder.indexOf(marker);
          if (position <= 0 || remainder.indexOf(marker, position + 1) !== -1) throw new Error(`Combined-verse boundary mismatch at ${section.book} ${ref}: ${marker}`);
          pending.push(remainder.slice(0, position).trim());
          remainder = remainder.slice(position);
        }
        pending.push(remainder.trim());
      }
      const text = pending.length ? pending.shift() : section.rows[cursor++];
      if (!text) throw new Error(`Missing text at ${section.book} ${ref}.`);
      verses.push({ verse: verse.verse, text });
      total++;
    }
    if (!verses.length || pending.length) throw new Error(`Invalid chapter boundary: ${section.book} ${chapter.chapter}.`);
    output.chapters.push({ chapter: chapter.chapter, verses });
  }
  if (cursor !== section.rows.length) throw new Error(`Unconsumed input in ${section.book}: ${section.rows.length - cursor} lines.`);
  const original = section.rows.join(' ').replace(/\s+/g, ' ');
  const restored = output.chapters.flatMap((chapter) => chapter.verses.map((verse) => verse.text)).join(' ').replace(/\s+/g, ' ');
  if (restored !== original) throw new Error(`Source preservation check failed for ${section.book}.`);
  converted.push(output);
}
if (total !== 31086 || converted.reduce((count, book) => count + book.chapters.length, 0) !== 1189) throw new Error('Unexpected NIV chapter or verse count.');
const directory = path.join(root, 'public/bible/NIV');
await mkdir(directory, { recursive: true });
for (const book of converted) await writeFile(path.join(directory, `${book.book}.json`), JSON.stringify(book), 'utf8');
await writeFile(path.join(directory, 'Books.json'), JSON.stringify(names));
await writeFile(path.join(directory, 'source.json'), JSON.stringify({
  version: 'NIV', source: path.basename(inputPath), sha256: createHash('sha256').update(input).digest('hex'),
  books: 66, chapters: 1189, verses: total,
  attribution: 'New International Version. NIV text supplied by the user; copyright Biblica, Inc.',
  edition: 'Edition year is not identified in the supplied file.',
  normalization: 'Whitespace trimmed; seven combined source lines split at reviewed verse boundaries. Source text preserved verbatim apart from whitespace. No scripture text added.',
  omittedReferences: omitted, splitReferences: combined,
}, null, 2) + '\n');
console.log(`NIV: imported 66 books, 1,189 chapters and ${total} verses. All source text preserved.`);
