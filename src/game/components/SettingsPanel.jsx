import { useState } from 'react';
import { useGame } from '../context/GameProvider.jsx';
import { useAudio } from '../context/AudioProvider.jsx';
import PanelHeader from './PanelHeader.jsx';

function Slider({ id, label, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label htmlFor={id} className="font-rounded font-extrabold text-ep-ink">{label}</label>
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
          className="w-56 cursor-pointer accent-ep-green disabled:opacity-40"
        />
        <span className="w-10 text-right font-rounded font-bold text-slate-600">{Math.round(value * 100)}%</span>
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  const { dispatch } = useGame();
  const audio = useAudio();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="no-scrollbar flex h-full flex-col gap-5 overflow-y-auto pb-4">
      <PanelHeader icon="gear" title="Settings" subtitle="Tune the sound and manage your progress." />
      <section className="flex flex-col gap-5 rounded-2xl bg-ep-paper p-6 shadow-md ring-1 ring-ep-line">
        <h2 className="font-rounded text-lg font-black text-ep-ink">Sound</h2>
        <div className="flex items-center justify-between">
          <span className="font-rounded font-extrabold text-ep-ink">All audio</span>
          <button
            type="button"
            role="switch"
            aria-checked={!audio.muted}
            onClick={audio.toggleMute}
            className={`relative h-8 w-14 rounded-full transition ${audio.muted ? 'bg-slate-300' : 'bg-ep-green'}`}
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${audio.muted ? 'left-1' : 'left-7'}`} />
            <span className="sr-only">Audio enabled</span>
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
      <section className="flex flex-col gap-4 rounded-2xl bg-ep-paper p-6 shadow-md ring-1 ring-ep-line sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-rounded text-lg font-black text-ep-ink">Progress</h2>
          <p className="font-rounded text-sm font-semibold text-slate-500">Progress is saved in this browser.</p>
        </div>
        {confirm ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirm(false)} className="rounded-full bg-white px-5 py-2.5 font-rounded font-extrabold text-ep-ink ring-1 ring-ep-line">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'RESET_PROGRESS' });
                setConfirm(false);
              }}
              className="rounded-full bg-red-600 px-5 py-2.5 font-rounded font-extrabold text-white"
            >
              Yes, reset
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="rounded-full bg-white px-5 py-2.5 font-rounded font-extrabold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
            Reset all progress
          </button>
        )}
      </section>
    </div>
  );
}
