import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

// Use the provider's bulk export, never thousands of individual chapter requests.
// Optional: --source-dir <directory containing NKJV.json and create-table.sql>.
const root = fileURLToPath(new URL('../', import.meta.url));
const sourceIndex = process.argv.indexOf('--source-dir');
const sourceDir = sourceIndex >= 0 ? process.argv[sourceIndex + 1] : null;
if (sourceIndex >= 0 && !sourceDir) throw new Error('--source-dir requires a directory.');
const books = JSON.parse(await readFile(path.join(root, 'public/bible/Books.json'), 'utf8'));
const reference = await Promise.all(books.map(async (book) => JSON.parse(await readFile(path.join(root, 'public/bible', `${book}.json`), 'utf8'))));
const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : process.platform === 'win32' ? { channel: 'msedge' } : {}),
});
try {
  const page = await browser.newPage();
  for (const version of ['NKJV', 'JPKJV']) {
    const url = version === 'NKJV' ? 'https://bolls.life/static/translations/NKJV.json'
      : 'https://raw.githubusercontent.com/FujiHaruka/bible-api/master/mysql/sql/create-table.sql.tar.gz';
    const filename = version === 'NKJV' ? 'NKJV.json' : 'create-table.sql';
    let rows;
    if (sourceDir) {
      const contents = await readFile(path.resolve(sourceDir, filename), 'utf8');
      rows = version === 'NKJV' ? JSON.parse(contents) : contents;
    }
    else {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${version} download failed (${response.status}). Extract the bulk ZIP and pass --source-dir.`);
      if (version === 'NKJV') rows = await response.json();
      else {
        const tar = gunzipSync(Buffer.from(await response.arrayBuffer()));
        for (let offset = 0; offset + 512 <= tar.length;) {
          const name = tar.subarray(offset, offset + 100).toString().replace(/\0.*$/, '');
          const size = parseInt(tar.subarray(offset + 124, offset + 136).toString().replace(/\0.*$/, '').trim(), 8);
          if (!name || !Number.isFinite(size)) break;
          if (name === 'create-table.sql') { rows = tar.subarray(offset + 512, offset + 512 + size).toString('utf8'); break; }
          offset += 512 + Math.ceil(size / 512) * 512;
        }
      }
    }
    if (version === 'JPKJV') {
      if (typeof rows !== 'string') throw new Error('Japanese source database was not found.');
      const codes = 'Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev'.split(' ');
      // Read INSERT values as data; never execute the source SQL.
      rows = [...rows.matchAll(/\('([^']+)', '((?:\\.|''|[^'\\])*)'\)/g)].map((match) => {
        const [code, chapter, verse] = match[1].split('.');
        const text = match[2].replace(/''/g, "'").replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n').replace(/\\r/g, '\r');
        return { book: codes.indexOf(code) + 1, chapter: Number(chapter), verse: parseInt(verse, 10), text, sourceReference: match[1], part: /\d[ab]$/.test(match[1]) };
      });
    }
    if (!Array.isArray(rows) || !rows.length) throw new Error(`${version}: invalid bulk export.`);
    // Use a real HTML parser to decode entities and omit markup and ruby annotations.
    const cleaned = await page.evaluate((input) => input.map((row) => {
      const doc = new DOMParser().parseFromString(row.text, 'text/html');
      doc.querySelectorAll('script, style, sup, rt, rp').forEach((node) => node.remove());
      return { book: row.book, chapter: row.chapter, verse: row.verse, text: (doc.body.textContent || '').replace(/\s+/g, ' ').trim(), sourceReference: row.sourceReference, part: row.part };
    }), rows);
    const converted = reference.map((book) => ({
      book: book.book,
      chapters: book.chapters.map((chapter) => ({ chapter: String(chapter.chapter), verses: [] })),
    }));
    let verseCount = 0;
    const groupedReferences = [];
    const seen = new Set();
    for (const row of cleaned) {
      if (row.verse === 0) continue; // Provider introductions are not numbered verses.
      const chapter = converted[row.book - 1]?.chapters[row.chapter - 1];
      const key = `${row.book}/${row.chapter}/${row.verse}`;
      if (seen.has(key) && row.part && chapter) {
        const existing = chapter.verses.find((verse) => Number(verse.verse) === row.verse);
        existing.text += row.text;
        continue;
      }
      if (!chapter || !Number.isInteger(row.verse) || row.verse < 1 || !row.text || seen.has(key)) {
        throw new Error(`${version}: invalid, empty or duplicate verse at ${key}.`);
      }
      seen.add(key);
      if (row.sourceReference && /\s|\d[ab]$/.test(row.sourceReference)) groupedReferences.push(row.sourceReference);
      chapter.verses.push({ verse: String(row.verse), text: row.text });
      verseCount++;
    }
    for (const book of converted) for (const chapter of book.chapters) {
      if (!chapter.verses.length) throw new Error(`${version}: missing chapter ${book.book} ${chapter.chapter}.`);
      chapter.verses.sort((a, b) => Number(a.verse) - Number(b.verse));
    }
    const output = path.join(root, 'public/bible', version);
    await mkdir(output, { recursive: true });
    for (const book of converted) await writeFile(path.join(output, `${book.book}.json`), JSON.stringify(book), 'utf8');
    await writeFile(path.join(output, 'Books.json'), JSON.stringify(books), 'utf8');
    await writeFile(path.join(output, 'source.json'), JSON.stringify({
      version, source: url, downloadedAt: new Date().toISOString(), books: converted.length,
      chapters: converted.reduce((total, book) => total + book.chapters.length, 0), verses: verseCount,
      attribution: version === 'NKJV' ? 'New King James Version © 1982 Thomas Nelson.' : 'Japanese Colloquial Bible (口語訳), 1954/1955.',
      normalization: 'Provider HTML converted to plain text; pronunciation annotations and commentary omitted. Original numbered verse text retained.',
      numbering: 'Source chapter and verse numbering retained.',
      combinedVerses: groupedReferences,
      combinedVerseHandling: 'Source groups spanning several verses are stored once at the first numbered verse; lettered parts of one verse are joined in source order. No scripture text is omitted or duplicated.',
    }, null, 2) + '\n');
    console.log(`${version}: bundled ${converted.length} books, 1,189 chapters, ${verseCount} verses in public/bible/${version}/`);
  }
} finally { await browser.close(); }
