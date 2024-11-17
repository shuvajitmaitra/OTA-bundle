import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import Modal from "react-native-modal";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import ModalBackAndCrossButton from "../ChatCom/Modal/ModalBackAndCrossButton";
import { Text } from "react-native";
import MyButton from "../AuthenticationCom/MyButton";
import StartQuizModal from "./StartQuizModal";

export default function QuizModal({ isQuizModalVisible, toggleQuizModal, setIsQuizModalVisible }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isStartQuizModalVisible, setIsStartQuizModalVisible] = useState(false);

  const toggleStartQuizModal = () => {
    setIsStartQuizModalVisible((pre) => !pre);
  };

  const handleStartQuiz = () => {
    toggleQuizModal(); // Close the QuizModal
    setIsStartQuizModalVisible(true); // Open the StartQuizModal
  };

  // Demo data for the quiz
  const data = {
    totalQuestions: 10,
    totalMarks: 10,
    totalTime: "10 Minutes",
  };

  return (
    <>
      <Modal isVisible={isQuizModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTop}>
            <ModalBackAndCrossButton toggleModal={toggleQuizModal} />
          </View>
          <Text style={styles.heading}>Module Quiz</Text>
          <View style={styles.quizContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.title}>Total Questions</Text>
              <Text style={styles.text}>{data.totalQuestions}</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.title}>Total Marks</Text>
              <Text style={styles.text}>{data.totalMarks}</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.title}>Total Time</Text>
              <Text style={styles.text}>{data.totalTime}</Text>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <MyButton onPress={toggleQuizModal} title={"Cancel"} bg={Colors.PrimaryOpacityColor} colour={Colors.Primary} />
            <MyButton onPress={handleStartQuiz} title={"Start Quiz"} bg={Colors.Primary} colour={Colors.PureWhite} />
          </View>
        </View>
      </Modal>
      <StartQuizModal toggleStartQuizModal={toggleStartQuizModal} isStartQuizModalVisible={isStartQuizModalVisible} />
    </>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
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
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(1),
    },
    quizContainer: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(4),
      flexDirection: "column",
      gap: responsiveScreenWidth(4),
      marginBottom: responsiveScreenHeight(2),
    },
    totalContainer: {
      padding: responsiveScreenWidth(2),
      backgroundColor: Colors.White,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: responsiveScreenWidth(2),
    },
    title: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
