class AudioManager {
  static instance = null;
  currentAudio = null;

  static getInstance() {
    if (AudioManager.instance == null) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setAudio(audio) {
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pauseAsync();
    }
    this.currentAudio = audio;
  }

  reset() {
    this.currentAudio = null;
  }
}

export default AudioManager;
