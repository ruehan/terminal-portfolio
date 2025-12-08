class SoundManager {
  private context: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      // Initialize AudioContext lazily on user interaction usually, but we'll try here
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.context = new AudioContext();
      }
    } catch (e) {
      console.error('Web Audio API not supported', e);
    }
  }

  private initContext() {
    if (!this.context) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.context = new AudioContext();
      }
    }
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }

  public playKeystroke() {
    if (this.isMuted || !this.context) return;
    this.initContext();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    // Mechanical switch sound simulation
    // Short burst of noise + sine wave
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  public playBeep() {
    if (this.isMuted || !this.context) return;
    this.initContext();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.context.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.context.currentTime + 0.3);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.context.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  public playSuccess() {
    if (this.isMuted || !this.context) return;
    this.initContext();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.5);
  }
}

export const soundManager = new SoundManager();
