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

export default function BlockMemberModal({
  toggleBlockMemberModal,
  isBlockMemberModalVisible,
  item,
  fetchMembers,
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const handleBlockMember = () => {
    toggleBlockMemberModal();
    axiosInstance
      .post(`/chat/member/update`, {
        member: item?._id,
        chat: item?.chat,
        actionType: "block",
      })
      .then((res) => {
        console.log("🚀 ~ handleBlockMember ~ res:", res.data);
        if (res.data?.success) {
          showToast("Block successfully...");
          fetchMembers();
          //   console.log("item", item);
        }
      });
  };
  const handleUnBlockMember = () => {
    toggleBlockMemberModal();
    axiosInstance
      .post(`/chat/member/update`, {
        member: item?._id,
        chat: item?.chat,
        actionType: "Unblock",
      })
      .then((res) => {
        console.log("🚀 ~ handleUnBlockMember ~ res:", res.data);
        if (res.data?.success) {
          showToast("Unlocked successfully...");
          fetchMembers();
          //   console.log("item", item);
        }
      });
  };
  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isBlockMemberModalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton toggleModal={toggleBlockMemberModal} />
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>
              {item.isBlocked ? "Unblock" : "Block"} this member
            </Text>
            <Text style={styles.headingDescription}>
              Are you sure, you want to {item.isBlocked ? "unblock" : "block"}
              this member?
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={toggleBlockMemberModal}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            {item.isBlocked ? (
              <ModalCustomButton
                toggleModal={handleUnBlockMember}
                textColor={Colors.White}
                backgroundColor="#27ac1f"
                buttonText="Unblock"
              />
            ) : (
              <ModalCustomButton
                toggleModal={handleBlockMember}
                textColor={Colors.PureWhite}
                backgroundColor="#27ac1f"
                buttonText="Block"
              />
            )}
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
      maxHeight: responsiveScreenHeight(80),
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
