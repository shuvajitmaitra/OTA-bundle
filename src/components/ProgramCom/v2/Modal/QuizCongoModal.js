import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "../../context/ThemeContext";
import CustomFonts from "../../constants/CustomFonts";
import { responsiveScreenWidth, responsiveScreenFontSize, responsiveScreenHeight } from "react-native-responsive-dimensions";
import ModalBackAndCrossButton from "../ChatCom/Modal/ModalBackAndCrossButton";
import MyButton from "../AuthenticationCom/MyButton";
import StartQuizModal from "./StartQuizModal";
import QuizResultModal from "./QuizResultModal";

export default function QuizCongoModal({ toggleQuizCongoModal, isQuizCongoModalVisible }) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isQuizResultModalVisible, setIsQuizResultModalVisible] = useState(false);

  const handleOkPress = () => {
    setIsQuizResultModalVisible(true);
    toggleQuizCongoModal();
  };

  const handleQuizResultModalClose = () => {
    setIsQuizResultModalVisible(false);
  };

  return (
    <>
      <Modal isVisible={isQuizCongoModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTop}>
            <ModalBackAndCrossButton toggleModal={toggleQuizCongoModal} />
          </View>
          <View>
            <View style={styles.bgImgContainer}>
              <Image
                source={{
                  uri: "https://s3-alpha-sig.figma.com/img/56cb/c19c/ae696f83c08a4fd277b41909795095c1?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Dr3zsALk6vOOGQ0fPagwcpAB0OazcYqu94R5sI7pK9K0acvZjgSwKZ5aYH7unjXqOq44GunUoPtfw2O3C41mPY5RugoZQaQOA6fHf65THc0Zn5ZiHYZUi3jpYbuExqwEWjDBEs9s5dkIAGWKpmXiz-7KW5zrI1W3Jb0dLhU9LNdavg4u4PQBWsnjSNoNRb573oDDNR9GkwINdxP00iqKhOx9zSPHcYe3SmwVeNe7N73-GtVwq1uP7fxioRhn5waOkcs1bxYvB~VsbGRnVzutPFFyUzsZO~PDQJi1I5F0NS8vEPGZ~31bzXQ8n8gwl-l5~vK3HBcwLItDCkyrL4NxEQ__",
                }}
                style={styles.bgImg}
              />
              <View style={styles.overlay} />
              <Text style={styles.modalHeading}>Congratulations!</Text>
            </View>
            <Text style={styles.modalSubHeading}>You have submitted the quiz successfully</Text>
            <View style={styles.okBtnContainer}>
              <TouchableOpacity onPress={handleOkPress}>
                <Text style={styles.okBtn}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <QuizResultModal isQuizResultModalVisible={isQuizResultModalVisible} toggleQuizResultModal={handleQuizResultModalClose} />
    </>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    bgImgContainer: {
      position: "relative",
      width: responsiveScreenWidth(82),
      height: responsiveScreenHeight(20),
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    bgImg: {
      width: responsiveScreenWidth(82),
      height: responsiveScreenHeight(20),
      borderRadius: 10,
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
    modalContainer: {
      width: responsiveScreenWidth(90),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(4),
    },
    modalHeading: {
      position: "absolute",
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(2.4),
      fontFamily: CustomFonts.SEMI_BOLD,
      fontWeight: "600",
      textShadowColor: "rgba(0, 0, 0, .5)", // Shadow color with opacity
      textShadowOffset: { width: 2, height: 2 }, // Offset of the shadow
      textShadowRadius: 3, // Blur radius of the shadow
    },
    modalSubHeading: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.9),
      textAlign: "center",
      marginTop: responsiveScreenHeight(2),
    },
    okBtn: {
      width: responsiveScreenWidth(30),
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      backgroundColor: Colors.Primary,
      color: Colors.White,
      paddingHorizontal: responsiveScreenWidth(8),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: responsiveScreenWidth(2),
      textAlign: "center",
      justifyContent: "center",
    },
    okBtnContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: responsiveScreenHeight(2),
    },
  });
