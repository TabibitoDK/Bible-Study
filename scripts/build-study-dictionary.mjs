import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const names = JSON.parse(await readFile(path.join(root, 'public/bible/Books.json'), 'utf8'));
const words = new Set();
for (const edition of ['', 'NKJV', 'NIV']) for (const name of names) {
  const book = JSON.parse(await readFile(path.join(root, 'public/bible', edition, `${name}.json`), 'utf8'));
  for (const chapter of book.chapters) for (const verse of chapter.verses) for (const word of verse.text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []) words.add(word);
}
function forms(word) {
  const plain = word.replace(/'s$/, '');
  const roots = [word, plain];
  if (plain.endsWith('ies')) roots.push(plain.slice(0, -3) + 'y');
  if (plain.endsWith('s')) roots.push(plain.slice(0, -1));
  if (plain.endsWith('es')) roots.push(plain.slice(0, -2));
  for (const ending of ['ed', 'ing']) if (plain.endsWith(ending)) {
    const stem = plain.slice(0, -ending.length);
    roots.push(stem, stem + 'e');
    if (/(.)\1$/.test(stem)) roots.push(stem.slice(0, -1));
    if (ending === 'ed' && stem.endsWith('i')) roots.push(stem.slice(0, -1) + 'y');
  }
  return roots;
}
const indices = new Map();
const glosses = new Map();
const source = path.join(root, 'node_modules/wordnet-db/dict');
for (const [file, part] of [['noun', 'noun'], ['verb', 'verb'], ['adj', 'adjective'], ['adv', 'adverb']]) {
  const data = await readFile(path.join(source, `data.${file}`), 'utf8');
  for (const line of data.split(/\r?\n/)) {
    if (!/^\d/.test(line)) continue;
    const divider = line.indexOf('|');
    if (divider < 0) continue;
    const offset = line.slice(0, line.indexOf(' '));
    const definition = line.slice(divider + 1).trim().split(/;\s*"/)[0];
    glosses.set(`${file}/${offset}`, { meaning: definition, detail: `${part} · WordNet (bundled)` });
  }
  const index = await readFile(path.join(source, `index.${file}`), 'utf8');
  for (const line of index.split(/\r?\n/)) {
    if (!/^[a-z]/.test(line)) continue;
    const fields = line.trim().split(/\s+/);
    const lemma = fields[0];
    const count = Number(fields[3]);
    const offsets = fields.slice(6 + count);
    const entries = indices.get(lemma) || [];
    for (const offset of offsets.slice(0, 2)) {
      const gloss = glosses.get(`${file}/${offset}`);
      if (gloss && !entries.some((entry) => entry.meaning === gloss.meaning)) entries.push(gloss);
    }
    indices.set(lemma, entries);
  }
}
const entries = {};
const aliases = {};
for (const word of words) {
  const lemma = forms(word).find((candidate) => indices.has(candidate));
  if (!lemma) continue;
  entries[lemma] = indices.get(lemma).slice(0, 3);
  if (word !== lemma) aliases[word] = lemma;
}
// Include short dictionary phrases made up of words present in the bundled Bible.
for (const [lemma, meanings] of indices) if (lemma.includes('_')) {
  const parts = lemma.split('_');
  if (parts.length <= 4 && parts.every((word) => words.has(word))) entries[parts.join(' ')] = meanings.slice(0, 2);
}
if (!entries.earth?.length || !entries.create?.length) throw new Error('Dictionary import did not produce expected entries.');
const output = path.join(root, 'public/dictionary');
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'english.json'), JSON.stringify({ source: 'Princeton WordNet, via wordnet-db 3.1.14', entries, aliases }));
await copyFile(path.join(root, 'node_modules/wordnet-db/LICENSE'), path.join(output, 'LICENSE.txt'));
console.log(`Bundled ${Object.keys(entries).length} word/phrase entries and ${Object.keys(aliases).length} inflected forms.`);
