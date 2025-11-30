// Music Manager for background music
class MusicManager {
  constructor() {
    this.audio = null;
    this.tracks = [
      'https://docs.google.com/uc?export=download&id=11H7HA7HzzHwIkdwAOpNHPV6nFKWmyBLD',
      'https://docs.google.com/uc?export=download&id=196pmOSeoz2DbUEEZvJA6lL15z0s5h-Bw',
      'https://docs.google.com/uc?export=download&id=1kZHnpdEv63dogPFpEnV6is1Gec6nRaK-'
    ];
    this.currentTrack = 0;
    this.volume = 0.3;
    this.enabled = true;
    this.isPlaying = false;
  }

  init() {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = false;
      this.audio.volume = this.volume;
      
      // Play next track when current one ends
      this.audio.addEventListener('ended', () => {
        this.nextTrack();
      });
      
      // Handle errors
      this.audio.addEventListener('error', (e) => {
        console.warn('Music playback error, trying next track');
        this.nextTrack();
      });
    }
  }

  play(trackIndex = null) {
    if (!this.enabled) return;
    
    this.init();
    
    if (trackIndex !== null) {
      this.currentTrack = trackIndex;
    }
    
    this.audio.src = this.tracks[this.currentTrack];
    this.audio.play().catch(e => {
      // Autoplay blocked, will play on user interaction
      console.log('Music autoplay blocked, will play on interaction');
    });
    this.isPlaying = true;
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  resume() {
    if (this.audio && this.enabled) {
      this.audio.play().catch(e => {});
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  nextTrack() {
    this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
    if (this.enabled && this.isPlaying) {
      this.play(this.currentTrack);
    }
  }

  previousTrack() {
    this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
    if (this.enabled && this.isPlaying) {
      this.play(this.currentTrack);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  setMuted(muted) {
    this.enabled = !muted;
    if (muted && this.audio) {
      this.pause();
    } else if (!muted && this.isPlaying) {
      this.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.pause();
    } else {
      this.resume();
    }
    return this.enabled;
  }
}

const musicManager = new MusicManager();
export default musicManager;