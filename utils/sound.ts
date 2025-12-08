class SoundManager {
  private context: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Do not initialize in constructor to avoid "The AudioContext was not allowed to start" warning
  }

  private initContext() {
    if (!this.context) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.context = new AudioContext();
      }
    }
    // Resume context if suspended (browser autoplay policy)
    if (this.context && this.context.state === 'suspended') {
      this.context.resume().catch(e => console.error("Audio resume failed", e));
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
    if (this.isMuted) return;
    this.initContext(); // Ensure context is ready on user interaction
    if (!this.context) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

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
    if (this.isMuted) return;
    this.initContext();
    if (!this.context) return;

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
    if (this.isMuted) return;
    // Note: This might still be blocked if called on page load without interaction
    this.initContext(); 
    if (!this.context) return;

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
