/**
 * FLOWLOG Sound System
 * Sophisticated audio feedback using Web Audio API
 * Follows "Calm Power" design principles - subtle, modern, non-intrusive
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Initialize AudioContext on first user interaction
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Enable or disable sounds globally
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Play a sound with given parameters
   */
  private play(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.15,
    fadeOut: boolean = true
  ) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);

    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    }

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Play a chord (multiple frequencies)
   */
  private playChord(
    frequencies: number[],
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.1
  ) {
    frequencies.forEach((freq) => {
      this.play(freq, duration, type, volume);
    });
  }

  /**
   * Timer Start - Uplifting, energetic tone
   * Rising frequency for motivation
   */
  timerStart() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    
    const now = this.audioContext.currentTime;
    
    // Rising pitch: C5 to E5 (523.25 Hz to 659.25 Hz)
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  /**
   * Timer Pause - Neutral, soft tone
   * Single gentle note
   */
  timerPause() {
    this.play(440, 0.12, 'sine', 0.15); // A4
  }

  /**
   * Timer Resume - Gentle upward tone
   */
  timerResume() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    
    const now = this.audioContext.currentTime;
    
    // Gentle rise: G4 to A4
    oscillator.frequency.setValueAtTime(392, now);
    oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.1);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Timer Stop/Save - Satisfying completion chord
   * Harmonious resolution
   */
  timerStop() {
    // Perfect fifth chord: C5, E5, G5 (major chord)
    this.playChord([523.25, 659.25, 783.99], 0.3, 'sine', 0.12);
  }

  /**
   * Enter Zen Mode - Ethereal, calming tone
   * Descending frequencies for relaxation
   */
  enterZenMode() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    
    const now = this.audioContext.currentTime;
    
    // Descending ethereal tone: A5 to C5
    oscillator.frequency.setValueAtTime(880, now);
    oscillator.frequency.exponentialRampToValueAtTime(523.25, now + 0.4);
    
    // Gentle fade in and out
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    oscillator.start(now);
    oscillator.stop(now + 0.4);
  }

  /**
   * Exit Zen Mode - Gentle rising tone
   */
  exitZenMode() {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    
    const now = this.audioContext.currentTime;
    
    // Rising tone: C5 to A5
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.25);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    oscillator.start(now);
    oscillator.stop(now + 0.25);
  }

  /**
   * Success/Achievement - Celebratory arpeggio
   * For save success, achievements, etc.
   */
  success() {
    if (!this.enabled || !this.audioContext) return;

    // Ascending major arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const noteDelay = 0.06;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.play(freq, 0.15, 'sine', 0.15);
      }, index * noteDelay * 1000);
    });
  }

  /**
   * Milestone reached - Special celebratory sound
   * For hourly milestones (1hr, 2hr, etc.)
   */
  milestone() {
    // Triumphant chord progression
    this.playChord([523.25, 659.25, 783.99], 0.2, 'sine', 0.15);
    setTimeout(() => {
      this.playChord([587.33, 739.99, 880], 0.3, 'sine', 0.15);
    }, 150);
  }

  /**
   * Subtle UI feedback - Very short, quiet click
   * For button presses, selections, etc.
   */
  uiClick() {
    this.play(1200, 0.03, 'sine', 0.08, false);
  }

  /**
   * Selection change - Soft notification
   */
  selection() {
    this.play(800, 0.08, 'sine', 0.1);
  }

  /**
   * Error/Alert - Gentle warning tone
   */
  alert() {
    this.play(300, 0.15, 'sine', 0.15);
    setTimeout(() => {
      this.play(280, 0.15, 'sine', 0.12);
    }, 100);
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
