// Sound Manager using Web Audio API for game sound effects
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  createOscillator(type, frequency, duration, volume = 1) {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
    
    return { oscillator, gainNode };
  }

  createNoise(duration, volume = 1) {
    if (!this.enabled || !this.audioContext) return;
    
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume * this.masterVolume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    noise.start();
    noise.stop(this.audioContext.currentTime + duration);
  }

  // Jump sound - quick ascending tone
  playJump() {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // Double jump - magical sparkle sound
  playDoubleJump() {
    if (!this.enabled || !this.audioContext) return;
    
    const frequencies = [600, 800, 1000, 1200];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator('sine', freq, 0.1, 0.3);
      }, i * 30);
    });
  }

  // Dash sound - whoosh
  playDash() {
    if (!this.enabled || !this.audioContext) return;
    
    this.createNoise(0.2, 0.8);
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);
    
    gain.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // Magic cast - zap sound
  playCast() {
    if (!this.enabled || !this.audioContext) return;
    
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);
    
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15);
    
    gain.gain.setValueAtTime(this.masterVolume * 0.25, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(this.audioContext.currentTime + 0.2);
    osc2.stop(this.audioContext.currentTime + 0.2);
  }

  // Freeze cast - icy sound
  playFreezeCast() {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.25);
    
    gain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
    
    // Add crystalline overtones
    setTimeout(() => this.createOscillator('sine', 1800, 0.15, 0.2), 50);
    setTimeout(() => this.createOscillator('sine', 2200, 0.1, 0.15), 100);
  }

  // Enemy hit - impact
  playEnemyHit() {
    if (!this.enabled || !this.audioContext) return;
    
    this.createNoise(0.1, 0.6);
    this.createOscillator('square', 150, 0.1, 0.4);
  }

  // Enemy defeat - explosion
  playEnemyDefeat() {
    if (!this.enabled || !this.audioContext) return;
    
    this.createNoise(0.3, 1);
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    
    gain.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  // Collect item - coin/orb sound
  playCollect() {
    if (!this.enabled || !this.audioContext) return;
    
    this.createOscillator('sine', 880, 0.1, 0.4);
    setTimeout(() => this.createOscillator('sine', 1320, 0.15, 0.3), 80);
  }

  // Power-up activation - triumphant sound
  playPowerUp() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [523, 659, 784, 1047]; // C, E, G, C (octave)
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator('sine', freq, 0.2, 0.4);
        this.createOscillator('triangle', freq * 2, 0.15, 0.2);
      }, i * 80);
    });
  }

  // Take damage - hurt sound
  playDamage() {
    if (!this.enabled || !this.audioContext) return;
    
    this.createNoise(0.15, 0.7);
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
    
    gain.gain.setValueAtTime(this.masterVolume * 0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.25);
  }

  // Shield hit - metallic clang
  playShieldHit() {
    if (!this.enabled || !this.audioContext) return;
    
    this.createOscillator('triangle', 800, 0.15, 0.5);
    this.createOscillator('sine', 1200, 0.1, 0.3);
    this.createNoise(0.08, 0.4);
  }

  // Level complete - victory fanfare
  playLevelComplete() {
    if (!this.enabled || !this.audioContext) return;
    
    const melody = [
      { freq: 523, time: 0 },
      { freq: 659, time: 150 },
      { freq: 784, time: 300 },
      { freq: 1047, time: 450 },
      { freq: 784, time: 600 },
      { freq: 1047, time: 750 }
    ];
    
    melody.forEach(note => {
      setTimeout(() => {
        this.createOscillator('sine', note.freq, 0.25, 0.4);
        this.createOscillator('triangle', note.freq / 2, 0.2, 0.2);
      }, note.time);
    });
  }

  // Game over - sad descending tone
  playGameOver() {
    if (!this.enabled || !this.audioContext) return;
    
    const notes = [400, 350, 300, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.createOscillator('sine', freq, 0.4, 0.4);
        this.createOscillator('sawtooth', freq / 2, 0.3, 0.15);
      }, i * 300);
    });
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Singleton instance
const soundManager = new SoundManager();
export default soundManager;