import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import Modal from "react-native-modal";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import ModalBackAndCrossButton from "../ChatCom/Modal/ModalBackAndCrossButton";
import ProgressWheel from "react-native-progress-wheel";
import { RadioButton } from "react-native-paper";

const questions = [
  {
    question: "1. What does the 'M' in MERN stack stand for?",
    options: ["MongoDB", "MySQL", "MariaDB", "Memcached"],
    correctAnswer: "MongoDB",
    userAnswer: "MongoDB",
    status: "right",
  },
  {
    question: "2. Which library is used for building user interfaces in the MERN stack?",
    options: ["Angular", "Vue", "React", "Svelte"],
    correctAnswer: "React",
    userAnswer: "React",
    status: "right",
  },
  {
    question: "3. What is Express.js primarily used for in the MERN stack?",
    options: ["Database management", "Server-side logic", "Frontend development", "State management"],
    correctAnswer: "Server-side logic",
    userAnswer: "State management",
    status: "wrong",
  },
  {
    question: "4. Which component of the MERN stack is responsible for handling HTTP requests?",
    options: ["MongoDB", "Express", "React", "Node.js"],
    correctAnswer: "Express",
    userAnswer: "Express",
    status: "right",
  },
  {
    question: "5. Which of the following is a NoSQL database?",
    options: ["PostgreSQL", "MongoDB", "OracleDB", "SQLite"],
    correctAnswer: "MongoDB",
    userAnswer: "MongoDB",
    status: "right",
  },
  {
    question: "6. What is Node.js primarily used for?",
    options: ["Client-side scripting", "Server-side scripting", "Database management", "CSS styling"],
    correctAnswer: "Server-side scripting",
    userAnswer: "Client-side scripting",
    status: "wrong",
  },
  {
    question: "7. Which command is used to start a React application?",
    options: ["npm start", "npm run", "npm init", "npm build"],
    correctAnswer: "npm start",
    userAnswer: "npm start",
    status: "right",
  },
  {
    question: "8. Which templating engine is commonly used with Express.js?",
    options: ["Handlebars", "EJS", "Pug", "All of the above"],
    correctAnswer: "All of the above",
    userAnswer: "All of the above",
    status: "right",
  },
  {
    question: "9. What is the primary purpose of using MongoDB in the MERN stack?",
    options: ["To store JSON-like documents", "To manage CSS styles", "To serve static files", "To create RESTful APIs"],
    correctAnswer: "To store JSON-like documents",
    userAnswer: "To store JSON-like documents",
    status: "right",
  },
  {
    question: "10. Which of the following is a correct way to create a new React component?",
    options: [
      "function MyComponent() {}",
      "let MyComponent = function() {}",
      "class MyComponent extends React.Component {}",
      "All of the above",
    ],
    correctAnswer: "All of the above",
    userAnswer: "All of the above",
    status: "right",
  },
];

const data = {
  moduleName: "Working with variable in Python to manage data",
  totalQuestions: 10,
  totalMarks: 10,
  correctAnswers: 8,
  totalTime: "10 Minutes",
  submissionDate: "May 10, 2024",
};

export default function QuizAnswerModal({ toggleQuizAnswerModal, isQuizAnswerModalVisible }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const correctAnswers = data.correctAnswers;
  const totalQuestions = data.totalQuestions;
  const percentage = (correctAnswers / totalQuestions) * 100;

  return (
    <Modal isVisible={isQuizAnswerModalVisible}>
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <ModalBackAndCrossButton toggleModal={toggleQuizAnswerModal} />
        </View>
        <View style={styles.moduleContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.heading}>
              Module Name: <Text style={{ fontFamily: CustomFonts.MEDIUM }}>{data.moduleName}</Text>
            </Text>
            <Text style={styles.title}>
              Number of Questions: <Text style={{ color: Colors.BodyText, fontFamily: CustomFonts.MEDIUM }}>{data.totalQuestions}</Text>
            </Text>
            <Text style={styles.title}>
              Right Answers: <Text style={{ color: Colors.Primary, fontFamily: CustomFonts.MEDIUM }}>{data.correctAnswers}</Text>
            </Text>
            <Text style={styles.title}>
              Wrong Answers:{" "}
              <Text style={{ color: Colors.Red, fontFamily: CustomFonts.MEDIUM }}>{data.totalQuestions - data.correctAnswers}</Text>
            </Text>
            <Text style={styles.title}>
              Submission Date: <Text style={{ color: Colors.BodyText, fontFamily: CustomFonts.MEDIUM }}>{data.submissionDate}</Text>
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <ProgressWheel size={80} width={8} color={Colors.Primary} progress={percentage} backgroundColor={Colors.PrimaryOpacityColor} />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>{`${Math.round(percentage)}%`}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.heading2}>Module Quiz</Text>
        <Text style={styles.title}>
          Module Name: <Text style={styles.text}>{data.moduleName}</Text>
        </Text>
        <Text style={styles.title}>
          Number of Questions: <Text style={styles.text}>{data.totalQuestions}</Text>
        </Text>

        {questions.map((item, index) => (
          <View key={index} style={styles.QuestionContainer}>
            <Text style={styles.question}>{item.question}</Text>
            <RadioButton.Group value={item.userAnswer}>
              {item.options.map((option, idx) => (
                <RadioButton.Item
                  key={idx}
                  label={option}
                  value={option}
                  status={option === item.userAnswer ? "checked" : "unchecked"}
                  // disabled={true}
                  labelStyle={[
                    styles.label,
                    item.status === "wrong" && option === item.userAnswer && styles.wrongAnswerText,
                    item.status === "right" && option === item.userAnswer && styles.rightAnswerText,
                  ]}
                  style={[
                    styles.radioButton,
                    item.status === "wrong" && option === item.userAnswer && styles.wrongAnswerOption,
                    item.status === "right" && option === item.userAnswer && styles.rightAnswerOption,
                  ]}
                  color={option === item.userAnswer ? (item.status === "wrong" ? Colors.Red : Colors.Primary) : Colors.Primary}
                />
              ))}
            </RadioButton.Group>
          </View>
        ))}
      </ScrollView>
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
    moduleContainer: {
      backgroundColor: Colors.PrimaryOpacityColor,
      paddingVertical: responsiveScreenWidth(2),
      paddingHorizontal: responsiveScreenWidth(3),
      borderRadius: responsiveScreenWidth(3),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoContainer: {
      width: responsiveScreenWidth(55),
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Primary,
      marginBottom: responsiveScreenHeight(1),
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
      marginBottom: responsiveScreenWidth(1),
    },
    progressContainer: {
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    progressTextContainer: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
    progressText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
    },
    heading2: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenWidth(1),
    },
    text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    QuestionContainer: {
      padding: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(2),
    },
    question: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.MEDIUM,
      paddingVertical: responsiveScreenHeight(2),
    },
    label: {
      marginLeft: 5,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    radioButton: {
      flexDirection: "row-reverse",
      alignItems: "center",
      backgroundColor: Colors.White,
      marginBottom: responsiveScreenWidth(5),
      borderRadius: responsiveScreenWidth(2),
    },

    wrongAnswerText: {
      color: Colors.Red,
    },
    wrongAnswerOption: {
      backgroundColor: "rgba(243, 65, 65, 0.10)",
    },
    rightAnswerText: {
      color: Colors.Primary,
    },

    rightAnswerOption: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
  });
