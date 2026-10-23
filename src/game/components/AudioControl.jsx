import { useAudio } from '../context/AudioProvider.jsx';
import Icon from './Icons.jsx';

export default function AudioControl() {
  const { muted, musicVolume, toggleMute, setMusicVolume, started } = useAudio();

  return (
    <div className="flex items-center gap-3">
      {!started && !muted && (
        <span className="hidden animate-blink font-pixel text-[11px] uppercase text-wood-200 xl:inline">Click for music</span>
      )}
      <label className="hidden items-center sm:flex">
        <span className="sr-only">Music volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={musicVolume}
          disabled={muted}
          onChange={(e) => setMusicVolume(Number(e.target.value))}
          className="h-2 w-20 cursor-pointer accent-gold disabled:opacity-40 lg:w-24"
        />
      </label>
      <button
        type="button"
        onClick={toggleMute}
        className={`pixel-btn h-9 w-9 p-0 ${muted ? 'bg-navy-600 text-navy-200' : 'bg-gold text-navy-950 hover:bg-gold-300'}`}
        aria-label={muted ? 'Unmute audio' : 'Mute audio'}
        aria-pressed={muted}
        title={muted ? 'Unmute' : 'Mute'}
      >
        <Icon name={muted ? 'mute' : 'volume'} className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </div>
  );
}
