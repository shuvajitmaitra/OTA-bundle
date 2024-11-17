import React, { useEffect, useState } from "react";
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import CustomFonts from "../../constants/CustomFonts";
import { useTheme } from "../../context/ThemeContext";
import Modal from "react-native-modal";
import { Audio } from "expo-av";
import ModalBackAndCrossButton from "../../components/ChatCom/Modal/ModalBackAndCrossButton";
import ArrowLeftWhite from "../../assets/Icons/ArrowLeftWhite";
import ArrowRightWhite from "../../assets/Icons/ArrowRightWhite";
import MyButton from "../../components/AuthenticationCom/MyButton";

import TrackPlayer from "./TrackPlayer"; // Import the TrackPlayer component
import VideoPlayer from "../../components/ProgramCom/VideoPlayer";
import axios from "../../utility/axiosInstance";
import { Alert } from "react-native";
import axiosInstance from "../../utility/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { updateInterviewAnswer } from "../../store/reducer/InterviewReducer";
import { showAlertModal } from "../../utility/commonFunction";
import GlobalAlertModal from "../SharedComponent/GlobalAlertModal";

export default function StartInterviewModal({ interview, toggleStartModal, isStartModalVisible }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const [uploaded, setUploaded] = useState([]);

  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        recording.getStatusAsync().then((status) => {
          if (status.isRecording) {
            setRecordingDuration(status.durationMillis);
          }
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [recording]);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        alert("Permission to access microphone is required!");
        return;
      }

      // Set the audio mode to enable recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedURI(uri);
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const reRecord = () => {
    setRecordedURI("");
    setRecordingDuration(0);
  };

  const uploadAudio = async (uri) => {
    if (!interview?.questions[currentIndex]?._id) {
      // return Alert.alert(
      //   "Interview Submitted",
      //   "Your interview has been successfully submitted.",
      //   [{ text: "OK", onPress: () => toggleStartModal() }]
      // );
      return showAlertModal({
        title: "Interview Submitted",
        type: "success",
        message: "Your interview has been successfully submitted",
      });
    }
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "audio/mpeg",
      name: "audio_recording.mp3",
    });

    try {
      const response = await axios.post("settings/video-audio-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload success", response.data);
      return response.data.url; // Assuming the API response contains the URL
    } catch (error) {
      console.error("Upload error", error);
      return null;
    }
  };

  const getInterviewAnswer = (interviewId, questionId) => {
    axiosInstance
      .get(`interview/answer/${interviewId}/${questionId}`)
      .then((res) => {
        console.log("res", JSON.stringify(res.data, null, 1));
        if (res.data.success) {
          dispatch(
            updateInterviewAnswer({
              answer: res.data.answer, //object
              interviewId: interview._id, //id
            })
          );
          setUploaded((pre) => [...pre, currentIndex]);
        }
      })
      .catch((error) => {
        console.log("error  you got from interview/answer", JSON.stringify(error, null, 1));
      });
  };

  const sendAudio = async () => {
    if (recordedURI) {
      const audioUrl = await uploadAudio(recordedURI);
      if (audioUrl) {
        try {
          const response = await axiosInstance.put("interview/submit-answer", {
            interview: interview?._id,
            audio: audioUrl,
            question: interview?.questions[currentIndex]?._id,
          });
          console.log("Answer submitted", response.data);
          if (response.data.success) {
            getInterviewAnswer(interview._id, interview?.questions[currentIndex]?._id);
          }
        } catch (error) {
          //   console.log("error", JSON.stringify(error, null, 1));
          console.error("Submit answer error", error.response.data);
        }
      }
    }
  };

  const formatDuration = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < interview?.questions?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRecordedURI("");
      setRecordingDuration(0);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setRecordedURI("");
      setRecordingDuration(0);
    }
  };

  const currentQuestion = interview?.questions?.[currentIndex]; // Get the current question based on the index

  const submitInterview = async () => {
    try {
      const response = await axios.post("interview/finalsubmission", {
        interview: interview._id,
      });
      // Alert.alert(
      //   "Interview Submitted",
      //   "Your interview has been successfully submitted.",
      //   [{ text: "OK", onPress: () => toggleStartModal() }]
      // );
      showAlertModal({
        title: "Interview Submitted",
        type: "success",
        message: "Your interview has been successfully submitted",
      });
    } catch (error) {
      console.error("Final submission error", error);
      // Alert.alert(
      //   "Submission Error",
      //   "There was an error submitting your interview. Please try again.",
      //   [{ text: "OK" }]
      // );

      showAlertModal({
        title: "Submission Error",
        type: "error",
        message: "There was an error submitting your interview. Please try again.",
      });
    }
  };

  return (
    <Modal isVisible={isStartModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <ModalBackAndCrossButton toggleModal={toggleStartModal} />
        </View>
        <Text style={styles.heading}>Web Elements Interview</Text>
        <View style={styles.dateContainer}>
          {interview?.questions?.length ? (
            <Text style={styles.title}>
              Question {currentIndex + 1}/{interview?.questions?.length}
            </Text>
          ) : (
            <Text style={styles.title}>Question unavailable</Text>
          )}
          <View style={styles.btnContainer}>
            {currentIndex > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <ArrowLeftWhite />
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentIndex < interview?.questions?.length - 1 && (
              <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                <Text style={styles.btnText}>Next</Text>
                <ArrowRightWhite />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Render VideoPlayer component with the current question's video URL */}
        <VideoPlayer url={currentQuestion?.video} />
        <Text style={styles.text}>You haven’t submitted this interview yet.</Text>
        <Text style={styles.question}>Question: {interview?.questions[currentIndex]?.title || "N/A"}</Text>
        <Text style={[styles.question, { color: Colors.BodyText, marginTop: responsiveScreenHeight(0) }]}>
          Hints: {interview?.questions[currentIndex]?.hint || "Try yourself"}
        </Text>
        <Text style={[styles.title, { marginVertical: responsiveScreenHeight(1) }]}>Record Audio</Text>
        {!uploaded.includes(currentIndex) ? (
          <View style={styles.recorderContainer}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              {!recordedURI && (
                <TouchableOpacity style={styles.recordBtn} onPress={recording ? stopRecording : startRecording}>
                  <Text style={styles.recordBtnText}>{recording ? "Stop Recording" : "Start Recording"}</Text>
                </TouchableOpacity>
              )}
            </View>
            {isRecording && <Text style={styles.durationText}>Recording : {formatDuration(recordingDuration)}</Text>}
            {recordedURI && (
              <>
                <TrackPlayer
                  recordedURI={recordedURI}
                  isActive={isPlaying}
                  onTogglePlay={togglePlay}
                  _id={`audioTrack${currentIndex}`} // Use currentIndex as the key for the track
                />
                <View style={styles.btnContainerLast}>
                  <TouchableOpacity style={styles.reRecordBtn} onPress={reRecord}>
                    <Text style={styles.reRecordBtnText}>Re-record</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadBtn} onPress={sendAudio} disabled={!recordedURI}>
                    <Text style={styles.uploadBtnText}>Upload</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ) : (
          <View style={[styles.recorderContainer]}>
            <View style={[styles.uploadBtn, { alignSelf: "center" }]}>
              <Text style={styles.uploadBtnText}>Answer uploaded</Text>
            </View>
          </View>
        )}

        <View style={styles.btnContainer2}>
          <MyButton flex={0.5} onPress={toggleStartModal} title={"Cancel"} bg={Colors.PrimaryOpacityColor} colour={Colors.Primary} />
          <MyButton
            flex={0.5}
            onPress={isRecording ? () => {} : submitInterview}
            title={"Submit"}
            bg={isRecording ? Colors.DisablePrimaryBackgroundColor : Colors.Primary}
            colour={isRecording ? Colors.DisablePrimaryButtonTextColor : Colors.PureWhite}
          />
        </View>
      </View>
      <GlobalAlertModal />
    </Modal>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    question: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      marginVertical: responsiveScreenHeight(1),
    },
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(5),
      paddingBottom: responsiveScreenHeight(1.5),
    },
    btnContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(2),
      alignItems: "center",
      marginBottom: responsiveScreenHeight(2),
    },
    btnContainer2: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: responsiveScreenWidth(4),
      marginBottom: responsiveScreenHeight(2),
      alignItems: "center",
      borderTopWidth: 1.5,
      borderColor: Colors.BorderColor,
      paddingTop: responsiveScreenHeight(2),
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
      textAlign: "center",
    },
    backBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: "row",
      gap: responsiveScreenWidth(1),
      alignItems: "center",
      height: responsiveScreenHeight(3.5),
    },
    nextBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: "row",
      gap: responsiveScreenWidth(1),
      alignItems: "center",
      height: responsiveScreenHeight(3.5),
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    heading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(2),
    },
    bgImg: {
      height: responsiveScreenHeight(22),
      objectFit: "cover",
      borderRadius: 5,
      marginBottom: responsiveScreenHeight(2),
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
    },
    recorderContainer: {
      paddingVertical: responsiveScreenHeight(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
    },
    recordBtn: {
      backgroundColor: "rgba(243, 65, 65, 0.10)",
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      flexDirection: "column",
      alignItems: "center",

      width: responsiveScreenWidth(35),
    },
    recordBtnText: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      textAlign: "center",
    },
    uploadBtn: {
      backgroundColor: Colors.Primary,
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      alignItems: "center",
      marginBottom: responsiveScreenHeight(1),
      width: responsiveScreenWidth(35),
    },
    uploadBtnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
    },
    durationText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      textAlign: "center",
      marginBottom: responsiveScreenHeight(1),
    },

    reRecordBtn: {
      backgroundColor: "rgba(243, 65, 65, 0.10)",
      padding: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      alignItems: "center",
      marginBottom: responsiveScreenHeight(1),
      width: responsiveScreenWidth(35),
    },
    reRecordBtnText: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
    },
    btnContainerLast: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: responsiveScreenHeight(1),
    },
  });
