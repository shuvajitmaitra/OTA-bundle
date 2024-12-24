import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import Modal from 'react-native-modal';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import {Text} from 'react-native';
import MyButton from '../AuthenticationCom/MyButton';
import {RadioButton} from 'react-native-paper';
import CloseIcon from '../../assets/Icons/CloseIcon';
import CountdownTimer from '../AssessmentCom/CountdownTimer';
import QuizCongoModal from './QuizCongoModal';
import GlobalRadioGroup from '../../../SharedComponent/GlobalRadioButton';

const questions = [
  {
    question: "1. What does the 'M' in MERN stack stand for?",
    options: ['MongoDB', 'MySQL', 'MariaDB', 'Memcached'],
  },
  {
    question:
      '2. Which library is used for building user interfaces in the MERN stack?',
    options: ['Angular', 'Vue', 'React', 'Svelte'],
  },
  {
    question: '3. What is Express.js primarily used for in the MERN stack?',
    options: [
      'Database management',
      'Server-side logic',
      'Frontend development',
      'State management',
    ],
  },
  {
    question:
      '4. Which component of the MERN stack is responsible for handling HTTP requests?',
    options: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
  {
    question: '5. Which of the following is a NoSQL database?',
    options: ['PostgreSQL', 'MongoDB', 'OracleDB', 'SQLite'],
  },
  {
    question: '6. What is Node.js primarily used for?',
    options: [
      'Client-side scripting',
      'Server-side scripting',
      'Database management',
      'CSS styling',
    ],
  },
  {
    question: '7. Which command is used to start a React application?',
    options: ['npm start', 'npm run', 'npm init', 'npm build'],
  },
  {
    question: '8. Which templating engine is commonly used with Express.js?',
    options: ['Handlebars', 'EJS', 'Pug', 'All of the above'],
  },
  {
    question:
      '9. What is the primary purpose of using MongoDB in the MERN stack?',
    options: [
      'To store JSON-like documents',
      'To manage CSS styles',
      'To serve static files',
      'To create RESTful APIs',
    ],
  },
  {
    question:
      '10. Which of the following is a correct way to create a new React component?',
    options: [
      'function MyComponent() {}',
      'let MyComponent = function() {}',
      'class MyComponent extends React.Component {}',
      'All of the above',
    ],
  },
];

export default function StartQuizModal({
  isStartQuizModalVisible,
  toggleStartQuizModal,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isQuizCongoModalVisible, setIsQuizCongoModalVisible] = useState(false);
  const toggleQuizCongoModal = () => {
    setIsQuizCongoModalVisible(pre => !pre);
  };
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions?.length).fill(null),
  );

  const handleNext = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toggleStartQuizModal(); // Close the StartQuizModal
      setIsQuizCongoModalVisible(true); // Open the QuizCongoModal
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = newValue => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = newValue;
    setSelectedOptions(updatedOptions);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Modal isVisible={isStartQuizModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTop}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>Time Left:-</Text>
              <CountdownTimer initialMinutes={10} initialSeconds={0} />
            </View>
            <View>
              <TouchableOpacity onPress={toggleStartQuizModal}>
                <CloseIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />
          <View style={styles.modalBody}>
            <View>
              <Text style={styles.modalHeading}>Module Quiz</Text>
              <Text style={styles.modalSubHeading}>
                Please select one answer and click{' '}
                <Text style={styles.nextBtnText}>Next Button</Text>
              </Text>
            </View>
            <View style={styles.QuestionContainer}>
              <Text style={styles.question}>{currentQuestion.question}</Text>

              <GlobalRadioGroup
                options={currentQuestion.options.map(option => ({
                  label: option,
                  value: option,
                }))} // Map options to label-value pair
                selectedValue={selectedOptions[currentQuestionIndex]} // Current selected value
                onSelect={handleOptionChange} // Handle the selection
              />
            </View>
            <View style={styles.nextContainer}>
              <Text style={styles.queNo}>
                {currentQuestionIndex + 1} out of {questions?.length} questions
              </Text>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentQuestionIndex === 0}>
                <Text
                  style={[
                    styles.previousBtn,
                    currentQuestionIndex === 0 && {opacity: 0.5},
                  ]}>
                  Previous
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext}>
                <Text style={styles.nextBtn}>
                  {currentQuestionIndex === questions?.length - 1
                    ? 'Submit'
                    : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <QuizCongoModal
        isQuizCongoModalVisible={isQuizCongoModalVisible}
        toggleQuizCongoModal={toggleQuizCongoModal}
      />
    </>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      paddingHorizontal: responsiveScreenWidth(4),
      justifyContent: 'space-between',
    },
    timerContainer: {
      borderWidth: 1,
      overFlow: 'hidden',
      borderRadius: responsiveScreenWidth(3),
      borderColor: Colors.Primary,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.PrimaryOpacityColor,
      flexDirection: 'row',
      alignItems: 'center',
    },
    timerText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    time: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      fontWeight: '600',
    },
    timerBg: {
      backgroundColor: 'native',
      marginHorizontal: -5,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
      width: responsiveScreenWidth(80),
      alignSelf: 'center',
    },
    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(3),
    },
    modalBody: {
      alignSelf: 'center',
      width: responsiveScreenWidth(80),
      paddingVertical: responsiveScreenWidth(4.5),
    },
    modalHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    QuestionContainer: {
      paddingHorizontal: responsiveScreenWidth(3),
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
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: Colors.White,
      marginBottom: responsiveScreenWidth(5),
      borderRadius: responsiveScreenWidth(2),
    },
    nextContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    queNo: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      width: responsiveScreenWidth(25),
    },
    nextBtn: {
      width: responsiveScreenWidth(25),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      backgroundColor: Colors.BodyText,
      color: Colors.PureWhite,
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      textAlign: 'center',
    },
    previousBtn: {
      width: responsiveScreenWidth(25),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      textAlign: 'center',
    },
    nextBtnText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.REGULAR,
    },
  });
