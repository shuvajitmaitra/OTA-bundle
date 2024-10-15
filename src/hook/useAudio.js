import { useState, useRef } from "react";
import { Audio } from "expo-av";

export const useAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef(null);

  const startRecording = async () => {
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setIsRecording(true);
      setRecording(recording);
      recordingIntervalRef.current = setInterval(() => {
        recording.getStatusAsync().then((status) => {
          if (status.canRecord) {
            setRecordingDuration(status.durationMillis / 1000); // update recording duration in seconds
          } else if (status.isDoneRecording) {
            stopRecording(); // stop recording automatically when the duration limit is reached
          }
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    clearInterval(recordingIntervalRef.current);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(null);
    }
  };

  const playRecording = async () => {
    if (!sound) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordedURI },
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);
      setSound(sound);
    } else {
      await sound.playAsync();
    }
    setIsPlaying(true);
  };

  const pauseRecording = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.log(`Playback error: ${status.error}`);
        return;
      }
    }
    if (status.isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      if (status.didJustFinish) {
        // Optional: Reset playback to the start
        sound.setPositionAsync(0);
      }
    }
  };

  return {
    isRecording,
    recordingDuration,
    recordedURI,
    isPlaying,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    setRecording,
    setRecordedURI,
  };
};
