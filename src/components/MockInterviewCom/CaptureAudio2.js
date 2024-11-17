// CaptureAudio.js

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import { useTheme } from "../../context/ThemeContext";
import CheckIconTwo from "../../assets/Icons/CheckIconTwo";

const formatTime = (time) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes?.toString().padStart(2, "0")}:${seconds
    ?.toString()
    .padStart(2, "0")}`;
};

const CaptureAudio2 = ({
  sendRenderedAudio,
  setIsRecorderVisible,
  isSendingAudio,
  setSelectedAudio,
  stopAudio,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  const recordingIntervalRef = useRef(null);
  const isCreatingRecording = useRef(false);

  const recordingDurationLimit = 180; // 3 minutes limit for recording

  useEffect(() => {
    handleStopRecording();
    setIsRecording(false);
  }, [stopAudio]);

  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate((status) => {
        setPlaybackPosition(status.positionMillis);
        setPlaybackDuration(status.durationMillis);
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    }
  }, [sound]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  

  const handleStartRecording = async () => {
    if (isRecording || isCreatingRecording.current) return;

    try {
      if (recording) {
        const status = await recording.getStatusAsync();
        if (status.isLoaded) {
          await recording.unloadAsync();
          setRecording(null);
        }
      }

      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.unloadAsync();
          setSound(null);
        }
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 22050,
          numberOfChannels: 1,
          bitRate: 32000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
          sampleRate: 22050,
          numberOfChannels: 1,
          bitRate: 32000,
        },
      };

      const newRecording = new Audio.Recording();
      isCreatingRecording.current = true;

      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setIsRecording(true);
      setRecording(newRecording);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          if (prevDuration >= recordingDurationLimit) {
            handleStopRecording();
          }
          return prevDuration + 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      isCreatingRecording.current = false;
    }
  };

  const handleStopRecording = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = null;
    setRecordingDuration(0);

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedURI(uri);
    setSelectedAudio(uri);
  };

  const handlePlayRecording = async () => {
    if (isRecording) return;

    if (!sound) {
      const newSound = await Audio.Sound.createAsync({ uri: recordedURI });
      setSound(newSound.sound);
      await newSound.sound.playAsync();
    } else {
      if (playbackPosition >= playbackDuration) {
        await sound.setPositionAsync(0);
      }
      await sound.playAsync();
    }

    setIsPlaying(true);
  };

  const handlePauseRecording = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const sendRecording = () => {
    sendRenderedAudio(recordedURI);
  };

  return (
    <View style={styles.container}>
      {recordedURI && !isRecording && (
        <View style={styles.progressContainer}>
          <View
            style={{
              ...styles.progressBar,
              width: `${(playbackPosition / playbackDuration) * 100}%`,
            }}
          />
        </View>
      )}
      {recordedURI && !isRecording && (
        <View style={styles.durationContainer}>
          <Text style={{ color: Colors.BodyText }}>
            {formatTime(playbackPosition / 1000)}
          </Text>
          <Text style={{ color: Colors.BodyText }}>
            {formatTime(playbackDuration / 1000)}
          </Text>
        </View>
      )}
      <View style={styles.controls}>
        <TouchableWithoutFeedback onPress={handleStartRecording}>
          {!isRecording ? (
            <FontAwesome
              name="microphone"
              size={25}
              style={styles.greenIcon}
            />
          ) : (
            <FontAwesome
              name="stop"
              size={25}
              onPress={handleStopRecording}
              style={styles.redIcon}
            />
          )}
        </TouchableWithoutFeedback>
        <Text style={styles.recordingText}>
          {isRecording ? `Recording ${recordingDuration}s` : ""}
        </Text>
        {recordedURI &&
          !isRecording &&
          (isPlaying ? (
            <MaterialIcons
              name="pause"
              size={30}
              onPress={handlePauseRecording}
              style={styles.defaultIcon}
            />
          ) : (
            <MaterialIcons
              name="play-arrow"
              size={30}
              onPress={handlePlayRecording}
              style={styles.defaultIcon}
            />
          ))}
        {recordedURI && !isRecording && (
          <>
            {isSendingAudio ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <TouchableOpacity onPress={sendRecording}>
                <CheckIconTwo size={30} />
              </TouchableOpacity>
            )}
          </>
        )}
        {!isRecording && (
          <FontAwesome
            name="trash"
            size={25}
            onPress={() => {
              setSelectedAudio([]);
              setIsRecorderVisible(false);
            }}
            style={styles.redIcon}
          />
        )}
      </View>
    </View>
  );
};

const getStyles = (Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    progressContainer: {
      width: "80%",
      height: 10,
      backgroundColor: "#EFEFEF",
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    },
    progressBar: {
      height: "100%",
      backgroundColor: "#4a9eff",
      borderRadius: 5,
    },
    durationContainer: {
      flexDirection: "row",
      width: "80%",
      justifyContent: "space-between",
    },
    controls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: responsiveScreenWidth(5),
      backgroundColor: Colors.PrimaryOpacityColor,
      paddingHorizontal: responsiveScreenWidth(10),
      borderRadius: 100,
      paddingVertical: responsiveScreenHeight(1),
    },
    greenIcon: {
      color: "#25D366",
    },
    redIcon: {
      color: Colors.Red,
    },
    defaultIcon: {
      color: Colors.BodyText,
    },
    recordingText: {
      fontSize: 12,
      color: "gray",
    },
  });

export default CaptureAudio2;
