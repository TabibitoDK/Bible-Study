import { BIBLE_BOOKS } from '../data/bibleMeta';

export function parseScriptureReference(value: string) {
  const match = value.trim().match(/^(.+?)\s*(\d+)(?::(\d+))?(?:\s*[-–].*)?$/);
  if (!match) return null;
  let name = match[1].toLowerCase().replace(/[\s.]+/g, '');
  if (name === 'songofsongs') name = 'songofsolomon';
  if (name.length < 2) return null;
  const meta = BIBLE_BOOKS.find((book) => book.name.toLowerCase().replace(/\s/g, '').startsWith(name));
  const chapter = Number(match[2]);
  const verse = match[3] === undefined ? undefined : Number(match[3]);
  if (!meta || chapter < 1 || chapter > meta.chaptersCount || (verse !== undefined && verse < 1)) return null;
  return { book: meta.name, chapter, verse, meta };
}
