import { useAudio } from '../context/AudioProvider.jsx';
import Icon from './Icons.jsx';

export default function AudioControl({ compact = false }) {
  const { muted, musicVolume, toggleMute, setMusicVolume, started } = useAudio();

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-1 ring-1 ring-inset ring-white/15 sm:pr-3">
      <button
        type="button"
        onClick={toggleMute}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        aria-pressed={muted}
        title={muted ? 'Unmute' : 'Mute'}
      >
        <Icon name={muted ? 'mute' : 'volume'} className="h-5 w-5" />
      </button>
      {!compact && (
        <label className="hidden items-center gap-2 sm:flex">
          <span className="sr-only">Music volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVolume}
            disabled={muted}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            className="h-1.5 w-20 cursor-pointer accent-ep-amber disabled:opacity-40 lg:w-24"
          />
        </label>
      )}
      {!started && !muted && (
        <span className="hidden text-[11px] font-bold text-white/70 xl:inline">Click anywhere for music</span>
      )}
    </div>
  );
}
