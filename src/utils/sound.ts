// Web Audio API Synthesizer for instant, lag-free typewriter sound effects

class SoundManager {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Check saved preference
    const saved = localStorage.getItem('typing_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('typing_sound_enabled', String(this.enabled));
    if (this.enabled) {
      this.playKeyClick();
    }
    return this.enabled;
  }

  public playKeyClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Mechanical switch click simulation
      const randomFreq = 700 + Math.random() * 250;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(randomFreq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playSpaceKey() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Thocky low keypress for spacebar
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.06);
    } catch {
      // fallback
    }
  }

  public playError() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch {
      // fallback
    }
  }

  public playComplete() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord fanfare

      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + idx * 0.09;
        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // fallback
    }
  }
}

export const soundManager = new SoundManager();
