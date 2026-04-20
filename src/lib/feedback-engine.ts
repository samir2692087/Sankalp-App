
/**
 * @fileOverview High-fidelity Neural Feedback Engine.
 * Synthesizes real-time audio and triggers haptics for system immersion.
 */

class FeedbackEngine {
  private audioCtx: AudioContext | null = null;

  private initAudio() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.initAudio();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  // Soft digital tap for standard interactions
  tap() {
    this.playTone(800, 'sine', 0.1, 0.1);
    this.vibrate(10);
  }

  // Deep success tone for victories
  success() {
    this.playTone(400, 'sine', 0.5, 0.2);
    setTimeout(() => this.playTone(600, 'sine', 0.4, 0.15), 100);
    this.vibrate([20, 50, 30]);
  }

  // Low pulse for warnings or risk
  warning() {
    this.playTone(150, 'square', 0.3, 0.1);
    this.vibrate([100, 50, 100]);
  }

  // Haptic feedback (Vibration API)
  vibrate(pattern: number | number[]) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}

export const feedback = new FeedbackEngine();
