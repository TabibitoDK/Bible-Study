// Optional display/audio preferences only. No notes, bookmarks or account data.
export interface ReaderSettings {
  translation?: string;
  fontSize: number;
  theme: 'dark' | 'light';
  speechRate: number;
  speechVoice?: string;
}
const key = 'canon_chronos_settings';
export const defaultSettings: ReaderSettings = { fontSize: 19, theme: 'dark', speechRate: 1 };
export function getStoredSettings(): ReaderSettings {
  try {
    const input = JSON.parse(localStorage.getItem(key) || '{}');
    return {
      theme: input.theme === 'light' ? 'light' : 'dark',
      fontSize: Number.isFinite(input.fontSize) ? Math.max(14, Math.min(30, input.fontSize)) : 19,
      speechRate: Number.isFinite(input.speechRate) ? Math.max(.5, Math.min(2, input.speechRate)) : 1,
      translation: typeof input.translation === 'string' ? input.translation : undefined,
      speechVoice: typeof input.speechVoice === 'string' ? input.speechVoice : undefined,
    };
  } catch { return { ...defaultSettings }; }
}
export function saveSettings(update: Partial<ReaderSettings>) {
  const settings = { ...getStoredSettings(), ...update };
  try { localStorage.setItem(key, JSON.stringify(settings)); } catch { /* Preferences are optional on static hosting. */ }
  return settings;
}
