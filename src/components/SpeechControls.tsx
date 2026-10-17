import { Pause, Play, Square, Volume2 } from 'lucide-react';
import { useChapterSpeech } from '../utils/useChapterSpeech';
import type { TranslationId } from '../utils/translations';

export function SpeechControls(props: { book: string; chapter: number; version: TranslationId; onNavigate: (book: string, chapter: number) => void }) {
  const speech = useChapterSpeech(props);
  const active = speech.state !== 'idle';
  return <section className="speech-controls" aria-label="Read aloud controls">
    <div className="flex flex-wrap items-center gap-2">
      {speech.state === 'playing'
        ? <button onClick={speech.pause} className="speech-button" aria-label="Pause reading"><Pause size={14} />Pause</button>
        : <button onClick={speech.play} disabled={!speech.supported || speech.state === 'loading'} className="speech-button" aria-label={speech.state === 'paused' ? 'Resume reading' : 'Listen to chapter'}>{speech.state === 'paused' ? <Play size={14} /> : <Volume2 size={14} />}{speech.state === 'loading' ? 'Opening…' : speech.state === 'paused' ? 'Resume' : 'Listen'}</button>}
      {active && <button onClick={speech.stop} className="speech-button" aria-label="Stop reading"><Square size={13} />Stop</button>}
      <label className="flex items-center gap-1.5 text-xs text-neutral-400">Speed
        <select aria-label="Reading speed" value={speech.rate} disabled={!speech.supported} onChange={(event) => speech.setRate(Number(event.target.value))} className="translation-select">
          {[.5, .75, .9, .95, 1, 1.1, 1.25, 1.5, 1.75, 2].map((rate) => <option key={rate} value={rate}>{rate}×</option>)}
        </select>
      </label>
      <details className="speech-voice"><summary className="text-xs text-neutral-400 cursor-pointer py-2">Voice</summary>
        <div className="speech-voice-options"><label className="block text-xs text-neutral-400 mb-2" htmlFor="reading-voice">Reading voice</label>
          <select id="reading-voice" aria-label="Reading voice" value={speech.voiceURI} disabled={!speech.supported} onChange={(event) => speech.setVoice(event.target.value)} className="translation-select w-full">
            <option value="auto">Automatic · best available</option>
            {speech.voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
          </select><p className="text-[11px] text-neutral-400 mt-2">Uses voices installed in your browser or device. Reads scripture without verse numbers and continues into the next chapter.</p>
        </div>
      </details>
    </div>
    {speech.reading && <p role="status" className="text-[11px] text-neutral-400 mt-2">{speech.state === 'paused' ? 'Paused' : 'Reading'} {speech.reading} · continues automatically</p>}
    {!speech.supported && <p className="text-xs text-neutral-400 mt-2">Read aloud is not supported by this browser.</p>}
    {speech.error && <p role="alert" className="text-xs text-neutral-400 mt-2 max-w-sm">{speech.error}</p>}
  </section>;
}
