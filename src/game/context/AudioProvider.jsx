import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AudioEngine } from '../audio/engine.js';
import { load, save } from '../storage.js';

const KEY = 'entry-point:audio';
const defaults = { muted: false, musicVolume: 0.55, sfxVolume: 0.8 };
const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const engineRef = useRef(null);
  if (!engineRef.current) engineRef.current = new AudioEngine();
  const engine = engineRef.current;

  const [settings, setSettings] = useState(() => load(KEY, defaults));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    engine.setMuted(settings.muted);
    engine.setMusicVolume(settings.musicVolume);
    engine.setSfxVolume(settings.sfxVolume);
    save(KEY, settings);
  }, [engine, settings]);

  // Browsers only allow audio after a user gesture: start the BGM on the first click/tap/key anywhere.
  useEffect(() => {
    const begin = () => {
      if (!engine.unlock()) return;
      engine.startMusic();
      setStarted(true);
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('keydown', begin);
    };
    window.addEventListener('pointerdown', begin);
    window.addEventListener('keydown', begin);
    return () => {
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('keydown', begin);
      engine.stopMusic();
    };
  }, [engine]);

  const play = useCallback(
    (name) => {
      engine.unlock();
      engine.play(name);
    },
    [engine]
  );

  const value = useMemo(
    () => ({
      ...settings,
      started,
      play,
      toggleMute: () => setSettings((s) => ({ ...s, muted: !s.muted })),
      setMusicVolume: (v) => setSettings((s) => ({ ...s, musicVolume: v })),
      setSfxVolume: (v) => setSettings((s) => ({ ...s, sfxVolume: v })),
    }),
    [settings, started, play]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export const useAudio = () => useContext(AudioCtx);
