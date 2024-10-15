import { View, StyleSheet, Text, ToastAndroid } from "react-native";
import React from "react";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import ReactNativeModal from "react-native-modal";

import ModalCustomButton from "./ModalCustomButton";
import CustomeFonts from "../../../constants/CustomeFonts";
import ModalBackAndCrossButton from "./ModalBackAndCrossButton";
import axiosInstance from "../../../utility/axiosInstance";
import { useTheme } from "../../../context/ThemeContext";
import { showToast } from "../../HelperFunction";

export default function ChatUnmuteModal({
  toggleChatUnmuteModal,
  isChatUnmuteModalVisible,
  item,
  fetchMembers,
  value,
  muteMessage,
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const handleUnmuteMember = () => {
    toggleChatUnmuteModal();

    axiosInstance
      .post(`/chat/member/update`, {
        actionType: "unmute",
        chat: item?.chat,
        date: new Date(),
        member: item?._id,
        note: muteMessage,
        selectedOption: value,
      })
      .then((res) => {
        if (res.data?.success) {
          showToast("Unmute successfully...");
          fetchMembers();
          //   console.log("item", item);
        }
      });
  };
  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isChatUnmuteModalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton toggleModal={toggleChatUnmuteModal} />
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>Unmute this member</Text>
            <Text style={styles.headingDescription}>
              Are you sure, you want to unmute this member?
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={toggleChatUnmuteModal}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />

            <ModalCustomButton
              toggleModal={handleUnmuteMember}
              textColor={Colors.PureWhite}
              backgroundColor="#27ac1f"
              buttonText="Unmute"
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
}

const getStyles = (Colors) =>
  StyleSheet.create({
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    modalChild: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      alignItems: "center",
    },
    modalHeading: {
      alignItems: "center",
      paddingTop: responsiveScreenHeight(1.7),
      gap: responsiveScreenWidth(2),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: "rgba(71, 71, 72, 1)",
    },
    modalHeadingText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomeFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    headingDescription: {
      color: Colors.BodyText,
      paddingHorizontal: responsiveScreenWidth(10),
      textAlign: "center",
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomeFonts.REGULAR,
    },
    radioButton: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },

    buttonContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(2.5),
      justifyContent: "center",
      paddingTop: responsiveScreenHeight(2.5),
    },
  });
