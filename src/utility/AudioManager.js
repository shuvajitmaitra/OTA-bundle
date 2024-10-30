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
    // Check if there is an existing audio playing and pause it
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause(); // Using pause instead of pauseAsync
    }
    this.currentAudio = audio;
  }

  reset() {
    this.currentAudio = null;
  }
}

export default AudioManager;
