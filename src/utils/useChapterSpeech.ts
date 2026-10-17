import { useCallback, useEffect, useRef, useState } from 'react';
import { BIBLE_BOOKS } from '../data/bibleMeta';
import { loadChapter } from './translations';
import type { TranslationId } from './translations';
import { getStoredSettings, saveSettings } from './studyStorage';

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused';
interface ReadingSession { book: string; chapter: number; version: TranslationId; chunks: string[]; index: number }
const sessionKey = (book: string, chapter: number, version: TranslationId) => `${version}/${book}/${chapter}`;

// Sentence-sized utterances avoid the long-utterance stalls found in some browsers.
export function speechChunks(text: string, language: string): string[] {
  const sentences = [...new Intl.Segmenter(language, { granularity: 'sentence' }).segment(text)].map((item) => item.segment.trim()).filter(Boolean);
  const chunks: string[] = [];
  for (const sentence of sentences) {
    let remaining = sentence;
    while (remaining.length > 280) {
      const boundary = remaining.lastIndexOf(' ', 280);
      const end = boundary > 100 ? boundary : 280;
      chunks.push(remaining.slice(0, end).trim()); remaining = remaining.slice(end).trim();
    }
    if (remaining) chunks.push(remaining);
  }
  return chunks;
}

export function useChapterSpeech({ book, chapter, version, onNavigate }: {
  book: string; chapter: number; version: TranslationId; onNavigate: (book: string, chapter: number) => void;
}) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [state, setState] = useState<PlaybackState>('idle');
  const [rate, setRate] = useState(() => getStoredSettings().speechRate);
  const [voiceURI, setVoiceURI] = useState(() => getStoredSettings().speechVoice || 'auto');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState('');
  const [reading, setReading] = useState('');
  const input = useRef({ book, chapter, version, onNavigate });
  input.current = { book, chapter, version, onNavigate };
  const settings = useRef({ rate, voiceURI, voices });
  settings.current = { rate, voiceURI, voices };
  const session = useRef<ReadingSession | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paused = useRef(false);
  const stop = useCallback(() => {
    generation.current++; session.current = null; utterance.current = null; paused.current = false;
    clearTimeout(timer.current);
    if (supported) { window.speechSynthesis.cancel(); window.speechSynthesis.resume(); }
    setState('idle'); setReading('');
  }, [supported]);
  useEffect(() => {
    if (!supported) return;
    const update = () => setVoices(window.speechSynthesis.getVoices());
    update(); window.speechSynthesis.addEventListener('voiceschanged', update);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', update);
  }, [supported]);
  useEffect(() => {
    const active = session.current;
    if (active && sessionKey(book, chapter, version) !== sessionKey(active.book, active.chapter, active.version)) stop();
  }, [book, chapter, version, stop]);
  useEffect(() => () => {
    generation.current++; session.current = null; clearTimeout(timer.current);
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  const speak = useRef<(current: ReadingSession) => void>(() => {});
  const beginChapter = useRef<(current: ReadingSession, navigate: boolean) => Promise<void>>(async () => {});
  beginChapter.current = async (current, navigate) => {
    const token = generation.current;
    setState('loading');
    try {
      const data = await loadChapter(current.book, current.chapter, current.version);
      if (session.current !== current || generation.current !== token) return;
      const language = current.version === 'JPKJV' ? 'ja-JP' : 'en-US';
      // Only scripture text is spoken. No verse, chapter or heading numbers are added.
      current.chunks = speechChunks(data.verses.map((verse) => verse.text).join(' '), language);
      current.index = 0;
      if (!current.chunks.length) throw new Error('This chapter has no readable text.');
      setReading(`${current.book} ${current.chapter}`);
      if (navigate) input.current.onNavigate(current.book, current.chapter);
      speak.current(current);
    } catch (reason) {
      if (session.current === current && generation.current === token) {
        stop(); setError(reason instanceof Error ? reason.message : 'The next chapter could not be loaded.');
      }
    }
  };
  speak.current = (current) => {
    if (session.current !== current || paused.current) return;
    if (current.index >= current.chunks.length) {
      const index = BIBLE_BOOKS.findIndex((entry) => entry.name === current.book);
      if (current.chapter < BIBLE_BOOKS[index].chaptersCount) current.chapter++;
      else if (index < BIBLE_BOOKS.length - 1) { current.book = BIBLE_BOOKS[index + 1].name; current.chapter = 1; }
      else { stop(); return; }
      void beginChapter.current(current, true);
      return;
    }
    const token = generation.current;
    const language = current.version === 'JPKJV' ? 'ja' : 'en';
    const available = settings.current.voices.filter((voice) => voice.lang.toLowerCase().startsWith(language));
    const quality = (voice: SpeechSynthesisVoice) => (/natural|neural|premium|enhanced/i.test(voice.name) ? 10 : 0) + (voice.default ? 2 : 0);
    const preferred = available.find((voice) => voice.voiceURI === settings.current.voiceURI)
      || [...available].sort((a, b) => quality(b) - quality(a))[0];
    const next = new SpeechSynthesisUtterance(current.chunks[current.index]);
    next.lang = preferred?.lang || (language === 'ja' ? 'ja-JP' : 'en-US');
    if (preferred) next.voice = preferred;
    next.rate = settings.current.rate; next.pitch = 1;
    next.onend = () => {
      if (token !== generation.current || session.current !== current) return;
      utterance.current = null; current.index++;
      timer.current = setTimeout(() => speak.current(current), 50);
    };
    next.onerror = (event) => {
      if (token !== generation.current || session.current !== current) return;
      stop(); setError(`Reading stopped (${event.error || 'voice unavailable'}). Try another voice or press Listen again.`);
    };
    utterance.current = next; setState('playing');
    try { window.speechSynthesis.speak(next); } catch { stop(); setError('This voice could not start. Try another voice.'); }
  };
  const play = () => {
    if (!supported) return;
    setError('');
    if (session.current && paused.current) {
      paused.current = false;
      window.speechSynthesis.resume();
      if (utterance.current) { setState('playing'); }
      else speak.current(session.current);
      return;
    }
    stop();
    const current: ReadingSession = { book, chapter, version, chunks: [], index: 0 };
    session.current = current;
    void beginChapter.current(current, false);
  };
  const pause = () => {
    if (!session.current || state !== 'playing') return;
    paused.current = true; window.speechSynthesis.pause(); setState('paused');
  };
  const change = (nextRate: number, nextVoice: string) => {
    setRate(nextRate); setVoiceURI(nextVoice);
    settings.current = { ...settings.current, rate: nextRate, voiceURI: nextVoice };
    saveSettings({ speechRate: nextRate, speechVoice: nextVoice });
    const active = session.current;
    if (active && utterance.current) {
      generation.current++; window.speechSynthesis.cancel(); utterance.current = null; clearTimeout(timer.current);
      if (!paused.current) speak.current(active);
    }
  };
  const language = version === 'JPKJV' ? 'ja' : 'en';
  return { state, rate, voiceURI, voices: voices.filter((voice) => voice.lang.toLowerCase().startsWith(language)), supported, error, reading, play, pause, stop,
    setRate: (value: number) => change(Math.max(.5, Math.min(2, value)), voiceURI), setVoice: (value: string) => change(rate, value) };
}
