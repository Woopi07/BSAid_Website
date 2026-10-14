// Procedural audio for Entry Point, built on the Web Audio API so no audio files are needed.
// - BGM: a calm 76 BPM lo-fi study loop (electric-piano chords, round bass, soft kick/hat, vinyl crackle).
// - SFX: click, pop, chime (correct), warning (incorrect), unlock fanfare, page turn.
// The AudioContext is only created inside unlock(), which must be called from a user gesture
// to satisfy browser autoplay policies.

const BPM = 76;
const STEP = 60 / BPM / 2; // eighth note in seconds
const LOOKAHEAD = 0.12; // seconds scheduled ahead
const TICK_MS = 30;

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

// Fmaj7 – Em7 – Dm7 – Cmaj7(add9): warm, unresolved, easy to study to.
const CHORDS = [
  { bass: 41, notes: [57, 60, 64, 65] },
  { bass: 40, notes: [55, 59, 62, 64] },
  { bass: 38, notes: [53, 57, 60, 62] },
  { bass: 36, notes: [55, 59, 62, 64] },
];
// Sparse pentatonic melody, one cell per eighth note (null = rest). 4 bars x 8 steps.
const MELODY = [
  72, null, null, 69, null, null, 67, null,
  null, null, 71, null, 69, null, null, null,
  69, null, 67, null, null, 64, null, null,
  null, 67, null, null, 64, null, 62, null,
];

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.musicVolume = 0.55;
    this.sfxVolume = 0.8;
    this.muted = false;
    this.playing = false;
    this.step = 0;
    this.nextTime = 0;
    this.timer = null;
  }

  get ready() {
    return !!this.ctx;
  }

  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      this.ctx = new Ctx();
      const ctx = this.ctx;

      this.master = ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 3;
      this.master.connect(comp).connect(ctx.destination);

      // Music bus: gentle low-pass for the "lo-fi" warmth.
      this.music = ctx.createGain();
      this.music.gain.value = this.musicVolume * 0.5;
      this.musicTone = ctx.createBiquadFilter();
      this.musicTone.type = 'lowpass';
      this.musicTone.frequency.value = 2400;
      this.music.connect(this.musicTone).connect(this.master);

      this.sfx = ctx.createGain();
      this.sfx.gain.value = this.sfxVolume;
      this.sfx.connect(this.master);

      this.noise = this.makeNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  makeNoiseBuffer() {
    const len = this.ctx.sampleRate * 2;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  setMuted(muted) {
    this.muted = muted;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.08);
  }

  setMusicVolume(v) {
    this.musicVolume = v;
    if (this.ctx) this.music.gain.setTargetAtTime(v * 0.5, this.ctx.currentTime, 0.1);
  }

  setSfxVolume(v) {
    this.sfxVolume = v;
    if (this.ctx) this.sfx.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  // ---------- Background music ----------

  startMusic() {
    if (!this.ctx || this.playing) return;
    this.playing = true;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.15;
    this.startCrackle();
    this.timer = setInterval(() => this.schedule(), TICK_MS);
  }

  stopMusic() {
    this.playing = false;
    clearInterval(this.timer);
    this.timer = null;
    if (this.crackle) {
      this.crackle.stop();
      this.crackle = null;
    }
  }

  schedule() {
    const ctx = this.ctx;
    // If the tab was throttled, skip ahead instead of firing a burst of stale notes.
    if (this.nextTime < ctx.currentTime - 0.2) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += STEP * (this.step % 2 === 0 ? 1.08 : 0.92); // light swing
      this.step = (this.step + 1) % 32;
    }
  }

  playStep(step, t) {
    const bar = Math.floor(step / 8);
    const beat = step % 8;
    const chord = CHORDS[bar];

    if (beat === 0) {
      chord.notes.forEach((n, i) => this.keys(midi(n), t + i * 0.012, STEP * 7, 0.07));
      this.bass(midi(chord.bass), t, STEP * 3.5);
    }
    if (beat === 4) this.bass(midi(chord.bass + 7), t, STEP * 2.5);
    if (beat === 5) chord.notes.slice(1).forEach((n) => this.keys(midi(n), t, STEP * 2, 0.035));

    if (beat === 0 || beat === 5) this.kick(t);
    if (beat === 4) this.snare(t);
    if (beat % 2 === 1) this.hat(t, beat === 7 ? 0.05 : 0.03);

    const note = MELODY[step];
    if (note) this.bell(midi(note), t, STEP * 3, 0.05);
  }

  envGain(t, peak, attack, duration) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    return g;
  }

  keys(freq, t, dur, peak) {
    const ctx = this.ctx;
    const g = this.envGain(t, peak, 0.02, dur);
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 1600;
    [0, 4].forEach((detune, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = freq;
      o.detune.value = detune;
      o.connect(tone);
      o.start(t);
      o.stop(t + dur + 0.05);
    });
    tone.connect(g).connect(this.music);
  }

  bell(freq, t, dur, peak) {
    const ctx = this.ctx;
    const g = this.envGain(t, peak, 0.005, dur);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.25;
    o.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.music);
    o.start(t);
    o2.start(t);
    o.stop(t + dur + 0.05);
    o2.stop(t + dur + 0.05);
  }

  bass(freq, t, dur) {
    const g = this.envGain(t, 0.16, 0.015, dur);
    const o = this.ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(g).connect(this.music);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  kick(t) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = this.envGain(t, 0.28, 0.004, 0.32);
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    o.connect(g).connect(this.music);
    o.start(t);
    o.stop(t + 0.35);
  }

  noiseHit(t, { type, freq, q = 1, peak, dur }, dest = this.music) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = this.envGain(t, peak, 0.003, dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.02);
  }

  snare(t) {
    this.noiseHit(t, { type: 'bandpass', freq: 1800, q: 0.8, peak: 0.07, dur: 0.18 });
  }

  hat(t, peak) {
    this.noiseHit(t, { type: 'highpass', freq: 7000, peak, dur: 0.05 });
  }

  startCrackle() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 3200;
    f.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.012;
    src.connect(f).connect(g).connect(this.music);
    src.start();
    this.crackle = src;
  }

  // ---------- Sound effects ----------

  tone(freq, t, { type = 'sine', peak = 0.2, attack = 0.005, dur = 0.2, to } = {}) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.8);
    const g = this.envGain(t, peak, attack, dur);
    o.connect(g).connect(this.sfx);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  play(name) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + 0.005;
    switch (name) {
      case 'click':
        this.tone(520, t, { type: 'triangle', peak: 0.12, dur: 0.07, to: 780 });
        break;
      case 'pop':
        this.tone(380, t, { peak: 0.22, dur: 0.12, to: 920 });
        this.tone(1200, t + 0.03, { peak: 0.05, dur: 0.06 });
        break;
      case 'page':
        this.noiseHit(t, { type: 'bandpass', freq: 2600, q: 0.7, peak: 0.08, dur: 0.12 }, this.sfx);
        break;
      case 'chime':
        [72, 76, 79, 84].forEach((n, i) => {
          this.tone(midi(n), t + i * 0.075, { peak: 0.16, dur: 0.6 });
          this.tone(midi(n) * 2, t + i * 0.075, { peak: 0.04, dur: 0.4 });
        });
        break;
      case 'warning':
        this.tone(330, t, { type: 'triangle', peak: 0.16, dur: 0.16 });
        this.tone(247, t + 0.16, { type: 'triangle', peak: 0.16, dur: 0.28 });
        break;
      case 'locked':
        this.tone(180, t, { type: 'square', peak: 0.05, dur: 0.1 });
        this.tone(150, t + 0.09, { type: 'square', peak: 0.05, dur: 0.12 });
        break;
      case 'unlock':
        [67, 72, 76, 79, 84, 88].forEach((n, i) => this.tone(midi(n), t + i * 0.09, { peak: 0.14, dur: 0.7 }));
        break;
      default:
        break;
    }
  }
}
