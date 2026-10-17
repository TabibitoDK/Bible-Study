interface DictionaryEntry { meaning: string; detail: string }
interface DictionaryData { entries: Record<string, DictionaryEntry[]>; aliases: Record<string, string> }
let pending: Promise<DictionaryData> | undefined;
export async function bundledDefinitions(word: string) {
  if (!pending) pending = fetch(`${import.meta.env.BASE_URL}dictionary/english.json`).then((response) => {
    if (!response.ok) throw new Error('Local dictionary could not be loaded.');
    return response.json() as Promise<DictionaryData>;
  }).catch((reason) => { pending = undefined; throw reason; });
  const data = await pending;
  const key = data.aliases[word] || word;
  return (data.entries[key] || []).slice(0, 2).map((entry) => ({ term: word, ...entry, source: 'https://wordnet.princeton.edu/' }));
}
