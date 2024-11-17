import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import Modal from "react-native-modal";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import ModalBackAndCrossButton from "../ChatCom/Modal/ModalBackAndCrossButton";
import { Text } from "react-native";
import MyButton from "../AuthenticationCom/MyButton";
import QuizAnswerModal from "./QuizAnswerModal";

export default function QuizResultModal({ isQuizResultModalVisible, toggleQuizResultModal, isStartQuizModalVisible }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isQuizAnswerModalVisible, setIsQuizAnswerModalVisible] = useState(false);
  const toggleQuizAnswerModal = () => {
    setIsQuizAnswerModalVisible((pre) => !pre);
  };
  const data = {
    moduleName: "Working with variable in Python to manage data",
    totalQuestions: 10,
    totalMarks: 10,
    correctAnswers: 8,
    totalTime: "10 Minutes",
    submissionDate: "May 10, 2024",
  };
  return (
    <Modal isVisible={isQuizResultModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <ModalBackAndCrossButton toggleModal={toggleQuizResultModal} />
        </View>
        <Text style={styles.heading}>Module Quiz</Text>
        <View style={styles.quizContainer}>
          <Text style={styles.congoText}>
            Congratulations! You have scored {data.correctAnswers} out of {data.totalMarks}.
          </Text>
          <View style={styles.bgImgContainer}>
            <Image
              source={{
                uri: "https://s3-alpha-sig.figma.com/img/56cb/c19c/ae696f83c08a4fd277b41909795095c1?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Dr3zsALk6vOOGQ0fPagwcpAB0OazcYqu94R5sI7pK9K0acvZjgSwKZ5aYH7unjXqOq44GunUoPtfw2O3C41mPY5RugoZQaQOA6fHf65THc0Zn5ZiHYZUi3jpYbuExqwEWjDBEs9s5dkIAGWKpmXiz-7KW5zrI1W3Jb0dLhU9LNdavg4u4PQBWsnjSNoNRb573oDDNR9GkwINdxP00iqKhOx9zSPHcYe3SmwVeNe7N73-GtVwq1uP7fxioRhn5waOkcs1bxYvB~VsbGRnVzutPFFyUzsZO~PDQJi1I5F0NS8vEPGZ~31bzXQ8n8gwl-l5~vK3HBcwLItDCkyrL4NxEQ__",
              }}
              style={styles.bgImg}
            />
            {/* <View style={styles.overlay} /> */}
            <Text style={styles.modalHeading}>{data.correctAnswers}</Text>
            <Text style={styles.modalSubHeading}>Out of {data.totalMarks}</Text>
          </View>
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
          <MyButton
            onPress={toggleQuizResultModal}
            title={"Cancel"}
            bg={Colors.PrimaryOpacityColor}
            colour={Colors.Primary}
            width={responsiveScreenHeight(10)}
            fontSize={responsiveScreenFontSize(1.6)}
          />
          <MyButton
            onPress={() => {}}
            title={"Restart"}
            bg={Colors.Primary}
            colour={Colors.PureWhite}
            fontSize={responsiveScreenFontSize(1.6)}
            width={responsiveScreenHeight(10)}
          />
          <MyButton
            onPress={toggleQuizAnswerModal}
            title={"View Answer"}
            bg={Colors.BodyText}
            colour={Colors.PureWhite}
            width={responsiveScreenHeight(14)}
            fontSize={responsiveScreenFontSize(1.6)}
          />
        </View>
      </View>
      {/* <StartQuizModal 
            toggleStartQuizModal={toggleStartQuizModal}
            isStartQuizModalVisible ={isStartQuizModalVisible}
            /> */}
      <QuizAnswerModal toggleQuizAnswerModal={toggleQuizAnswerModal} isQuizAnswerModalVisible={isQuizAnswerModalVisible} />
    </Modal>
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
    congoText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      textAlign: "center",
    },
    bgImg: {
      width: responsiveScreenWidth(25),
      height: responsiveScreenWidth(25),
      borderRadius: 50,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      borderRadius: 10,
    },
    modalHeading: {
      position: "absolute",
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2.4),
      fontFamily: CustomFonts.SEMI_BOLD,
      fontWeight: "600",
      textShadowColor: "rgba(0, 0, 0, .5)", // Shadow color with opacity
      textShadowOffset: { width: 2, height: 2 }, // Offset of the shadow
      textShadowRadius: 3,
      top: 25, // Blur radius of the shadow
    },
    modalSubHeading: {
      position: "absolute",
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      fontWeight: "600",
      textShadowColor: "rgba(0, 0, 0, .5)", // Shadow color with opacity
      textShadowOffset: { width: 2, height: 2 }, // Offset of the shadow
      textShadowRadius: 3,
      bottom: 25, // Blur radius of the shadow
    },
    bgImgContainer: {
      position: "relative",
      width: responsiveScreenWidth(25),
      height: responsiveScreenWidth(25),
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
  });
