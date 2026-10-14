import { useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import PanelHeader from './PanelHeader.jsx';

function Slider({ id, label, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label htmlFor={id} className="font-pixel text-[10px] uppercase text-navy-900">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-56 cursor-pointer accent-crimson-700 disabled:opacity-40"
        />
        <span className="w-12 text-right font-pixel text-[10px] text-navy-900">{Math.round(value * 100)}%</span>
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  const { dispatch } = useGame();
  const audio = useAudio();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="pixel-scroll flex h-full flex-col gap-8 overflow-y-auto p-1 pb-6">
      <PanelHeader icon="gear" title="Settings" subtitle="Tune the sound and manage your progress." />
      <section className="pixel-box flex flex-col gap-6 bg-white p-6">
        <h2 className="text-2xl font-bold">Sound</h2>
        <div className="flex items-center justify-between gap-4">
          <span className="font-pixel text-[10px] uppercase text-navy-900">All audio</span>
          <button
            type="button"
            role="switch"
            aria-checked={!audio.muted}
            onClick={audio.toggleMute}
            className={`pixel-btn min-w-[5.5rem] ${audio.muted ? 'bg-navy-600 text-navy-200' : 'bg-emerald-500 text-navy-950'}`}
          >
            {audio.muted ? 'Off' : 'On'}
          </button>
        </div>
        <Slider id="music-vol" label="Background music" value={audio.musicVolume} onChange={audio.setMusicVolume} disabled={audio.muted} />
        <Slider
          id="sfx-vol"
          label="Sound effects"
          value={audio.sfxVolume}
          onChange={(v) => {
            audio.setSfxVolume(v);
            audio.play('click');
          }}
          disabled={audio.muted}
        />
      </section>
      <section className="pixel-box flex flex-col gap-5 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Progress</h2>
          <p className="text-sm text-slate-600">Progress is saved in this browser.</p>
        </div>
        {confirm ? (
          <div className="flex gap-5">
            <button type="button" onClick={() => setConfirm(false)} className="pixel-btn bg-cream text-navy-950 hover:bg-white">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'RESET_PROGRESS' });
                setConfirm(false);
              }}
              className="pixel-btn bg-crimson-700 text-cream hover:bg-crimson"
            >
              Yes, reset
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="pixel-btn bg-white text-crimson-700 hover:bg-rose-50">
            Reset progress
          </button>
        )}
      </section>
    </div>
  );
}
