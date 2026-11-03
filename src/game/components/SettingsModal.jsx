import Dialog from '../../components/ui/Dialog.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import Icon from './Icons.jsx';

function Slider({ id, label, value, onChange, disabled }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="flex items-center justify-between font-pixel text-[12px] uppercase text-navy-900">
        {label}
        <span>{Math.round(value * 100)}%</span>
      </span>
      <input
        id={id}
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-forest disabled:opacity-40"
      />
    </label>
  );
}

// Quick settings (sound) that can be opened from any screen without leaving it.
export default function SettingsModal({ onClose }) {
  const audio = useAudio();
  return (
    <Dialog labelledBy="settings-title" onClose={onClose} className="bg-navy-950/80">
      <div className="pixel-box px-dark w-full max-w-sm animate-pop bg-white">
        <div className="flex items-center justify-between border-b-4 border-navy-950 bg-navy px-4 py-3">
          <h2 id="settings-title" className="flex items-center gap-2 font-pixel text-[13px] uppercase tracking-widest text-white">
            <Icon name="gear" className="h-4 w-4" strokeWidth={2.5} /> Settings
          </h2>
          <button type="button" onClick={onClose} className="text-white hover:text-gold" aria-label="Close settings">
            <Icon name="close" className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="font-pixel text-[12px] uppercase text-navy-900">All audio</span>
            <button
              type="button"
              role="switch"
              aria-checked={!audio.muted}
              onClick={audio.toggleMute}
              className={`pixel-btn min-w-[5.5rem] ${audio.muted ? 'bg-cream text-navy-600' : 'bg-forest text-white'}`}
            >
              {audio.muted ? 'Off' : 'On'}
            </button>
          </div>
          <Slider id="modal-music" label="Background music" value={audio.musicVolume} onChange={audio.setMusicVolume} disabled={audio.muted} />
          <Slider
            id="modal-sfx"
            label="Sound effects"
            value={audio.sfxVolume}
            onChange={(v) => {
              audio.setSfxVolume(v);
              audio.play('click');
            }}
            disabled={audio.muted}
          />
          <button type="button" onClick={onClose} className="pixel-btn bg-forest text-white hover:bg-forest-700">
            Done
          </button>
        </div>
      </div>
    </Dialog>
  );
}
