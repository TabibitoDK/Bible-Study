import { BIBLE_BOOKS } from '../data/bibleMeta';

export const TRANSLATIONS = [
  { id: 'KJV', label: 'KJV', name: 'King James Version', lang: 'en' },
  { id: 'NKJV', label: 'NKJV', name: 'New King James Version', lang: 'en' },
  { id: 'NIV', label: 'NIV', name: 'New International Version', lang: 'en' },
  { id: 'JPKJV', label: '日本語 · 口語訳', name: 'Japanese Colloquial Bible (1954/1955)', lang: 'ja' },
] as const;
export type TranslationId = typeof TRANSLATIONS[number]['id'];
export interface ScriptureVerse { verse: string; text: string }
export interface ScriptureChapter { chapter: string; verses: ScriptureVerse[] }

const cache = new Map<string, ScriptureChapter>();
export function isTranslation(value: unknown): value is TranslationId {
  return TRANSLATIONS.some((translation) => translation.id === value);
}

export async function loadChapter(book: string, chapter: number, version: TranslationId, signal?: AbortSignal): Promise<ScriptureChapter> {
  const key = `${version}/${book}/${chapter}`;
  if (cache.has(key)) return cache.get(key)!;
  const meta = BIBLE_BOOKS.find((entry) => entry.name === book);
  if (!meta || chapter < 1 || chapter > meta.chaptersCount) throw new Error('This chapter does not exist.');
  const directory = version === 'KJV' ? 'bible' : `bible/${version}`;
  const url = `${import.meta.env.BASE_URL}${directory}/${encodeURIComponent(book)}.json`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Could not load ${version}. Please try again (${response.status}).`);
  const data = await response.json();
  if (data.book !== book || !Array.isArray(data.chapters) || data.chapters.length !== meta.chaptersCount) {
    throw new Error(`The bundled ${version} Bible file is invalid.`);
  }
  for (const item of data.chapters) {
    if (typeof item.chapter !== 'string' || !Array.isArray(item.verses) || !item.verses.length || item.verses.some((verse: ScriptureVerse) => typeof verse.verse !== 'string' || typeof verse.text !== 'string' || !verse.text.trim())) {
      throw new Error(`The bundled ${version} Bible file is invalid.`);
    }
  }
  for (const item of data.chapters) cache.set(`${version}/${book}/${Number(item.chapter)}`, item);
  const result = cache.get(key);
  if (!result) throw new Error('No verses were found for this chapter.');
  return result;
}
