class SoundManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // Lazy init
  }

  public initialize() {
    if (!this.context) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.context = new AudioContext();
        this.masterGain = this.context.createGain();
        this.masterGain.gain.value = 0.3; // Master volume
        this.masterGain.connect(this.context.destination);
      }
    }
  }

  public resumeContext() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume().catch(e => console.error("Audio resume failed", e));
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }

  public playKeystroke() {
    if (this.isMuted) return;
    this.initialize();
    this.resumeContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.05);

    gain.gain.setValueAtTime(0.05, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  public playBeep() {
    if (this.isMuted) return;
    this.initialize();
    this.resumeContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.context.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.context.currentTime + 0.3);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.context.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.initialize();
    this.resumeContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + 0.5);
  }

  public playUnlock() {
    if (this.isMuted) return;
    this.initialize();
    this.resumeContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1760, this.context.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.context.currentTime);
    osc.stop(this.context.currentTime + 0.5);
  }

  public playBGM() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initialize();
    this.resumeContext();
    if (!this.context || !this.masterGain) return;

    this.isBgmPlaying = true;
    this.bgmGain = this.context.createGain();
    this.bgmGain.gain.setValueAtTime(0, this.context.currentTime);
    this.bgmGain.gain.linearRampToValueAtTime(0.05, this.context.currentTime + 2); // Fade in
    this.bgmGain.connect(this.masterGain);

    // Create a drone chord (Cmaj7/9)
    const freqs = [130.81, 196.00, 246.94, 293.66]; // C3, G3, B3, D4
    
    freqs.forEach(freq => {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        // Add subtle detuning for richness
        const lfo = this.context.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1 + Math.random() * 0.1; // Slow LFO
        const lfoGain = this.context.createGain();
        lfoGain.gain.value = 2; // Detune amount
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(this.bgmGain!);
        osc.start();
        this.bgmOscillators.push(osc);
        this.bgmOscillators.push(lfo); // Keep track to stop later
    });
  }

  public stopBGM() {
    if (!this.context || !this.isBgmPlaying || !this.bgmGain) return;
    
    const now = this.context.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.linearRampToValueAtTime(0, now + 2); // Fade out

    setTimeout(() => {
        this.bgmOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
        });
        this.bgmOscillators = [];
        this.isBgmPlaying = false;
        if (this.bgmGain) {
            this.bgmGain.disconnect();
            this.bgmGain = null;
        }
    }, 2000);
  }
}

export const soundManager = new SoundManager();
