import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import { TIMELINE_ERAS } from '../data/timelineEras';

interface TimelineSliderProps {
  currentEraOrder: number; // 1 to 8
  onEraChange: (eraOrder: number) => void;
  revealedCountText?: string; // e.g. "24 Figures Visible" or "12 Cities Active"
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentEraOrder,
  onEraChange,
  revealedCountText,
}) => {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const activeEra = TIMELINE_ERAS.find((e) => e.order === currentEraOrder) || TIMELINE_ERAS[TIMELINE_ERAS.length - 1];

  // Auto-play timer
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentEraOrder >= 8) {
          setIsPlaying(false);
        } else {
          onEraChange(currentEraOrder + 1);
        }
      }, 2400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentEraOrder, onEraChange]);

  const handlePrev = () => {
    if (currentEraOrder > 1) {
      onEraChange(currentEraOrder - 1);
    }
  };

  const handleNext = () => {
    if (currentEraOrder < 8) {
      onEraChange(currentEraOrder + 1);
    }
  };

  return (
    <div className="w-full bg-neutral-950/95 backdrop-blur-md border border-neutral-800 rounded-xl p-3 sm:p-4 shadow-2xl space-y-3">
      {/* Top Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
            <Clock className="w-4 h-4 text-neutral-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                Era {activeEra.order} of 8 &bull; {activeEra.approxDate}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-[9px] text-neutral-300">
                {activeEra.bibleScope}
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-neutral-100 flex items-center gap-2">
              <span>{activeEra.name}</span>
            </h3>
          </div>
        </div>

        {/* Revealed Counter & Fast Reset */}
        <div className="flex items-center gap-2">
          {revealedCountText && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
              <Eye className="w-3 h-3 text-neutral-400" />
              <span>{revealedCountText}</span>
            </span>
          )}

          {currentEraOrder < 8 && (
            <button
              onClick={() => onEraChange(8)}
              className="text-[10px] font-mono text-neutral-400 hover:text-white underline decoration-dotted transition"
            >
              Reveal All (Full Bible)
            </button>
          )}
        </div>
      </div>

      {/* Slider Track with Step Nodes */}
      <div className="space-y-2">
        <div className="relative pt-1">
          {/* Custom Track Slider */}
          <input
            type="range"
            min={1}
            max={8}
            step={1}
            value={currentEraOrder}
            onChange={(e) => onEraChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
          />

          {/* Stepper Ticks & Labels */}
          <div className="flex justify-between items-start pt-1.5">
            {TIMELINE_ERAS.map((era) => {
              const isPassed = era.order <= currentEraOrder;
              const isCurrent = era.order === currentEraOrder;
              return (
                <button
                  key={era.id}
                  onClick={() => onEraChange(era.order)}
                  className="flex flex-col items-center group text-center"
                  style={{ width: `${100 / 8}%` }}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full border transition-all ${
                      isCurrent
                        ? 'bg-neutral-100 border-white ring-2 ring-neutral-400 scale-125'
                        : isPassed
                        ? 'bg-neutral-300 border-neutral-400'
                        : 'bg-neutral-900 border-neutral-700'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono mt-1 hidden md:block transition-colors ${
                      isCurrent
                        ? 'text-neutral-100 font-bold'
                        : isPassed
                        ? 'text-neutral-400'
                        : 'text-neutral-600'
                    }`}
                  >
                    {era.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Controls: Prev, Play/Pause, Next */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentEraOrder <= 1}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 disabled:opacity-40 text-neutral-300 transition text-[11px]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Earlier</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 transition text-[11px]"
            title={isPlaying ? 'Pause Auto-Play' : 'Play Timeline Progression'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-neutral-300" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-neutral-300" />
                <span className="hidden sm:inline">Auto-Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentEraOrder >= 8}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 disabled:opacity-40 text-neutral-300 transition text-[11px]"
          >
            <span className="hidden sm:inline">Later</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Short explanation context */}
        <p className="text-[11px] text-neutral-400 italic truncate max-w-xs sm:max-w-md font-sans">
          "{activeEra.description}"
        </p>
      </div>
    </div>
  );
};
