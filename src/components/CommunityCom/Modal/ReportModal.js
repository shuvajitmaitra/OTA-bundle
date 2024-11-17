import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import ReactNativeModal from "react-native-modal";
import { RadioButton } from "react-native-paper";

import CustomFonts from "../../../constants/CustomFonts";
import axiosInstance from "../../../utility/axiosInstance";
import { useTheme } from "../../../context/ThemeContext";
import { showToast } from "../../HelperFunction";
import ModalBackAndCrossButton from "../../ChatCom/Modal/ModalBackAndCrossButton";
import ModalCustomButton from "../../ChatCom/Modal/ModalCustomButton";
import { RadioGroup } from "react-native-radio-buttons-group";
import TextArea from "../../Calendar/Modal/TextArea";
import { handleError } from "../../../actions/chat-noti";
import { useDispatch } from "react-redux";
import { setReported } from "../../../store/reducer/communityReducer";
import GlobalRadioGroup from "../../SharedComponent/GlobalRadioButton";
import { showAlertModal } from "../../../utility/commonFunction";

export default function ReportModal({ setIsModalVisible, isModalVisible, post, closePopover }) {
  const [report, setReport] = useState({
    post: post._id,
    action: "report",
    reportReason: "spam",
    note: "",
  });

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const itemList = [
    { id: 1, label: "Spam or Scam", value: "spam" },
    { id: 2, label: "Bullying or Harassment", value: "harassment" },
    { id: 3, label: "Impersonation", value: "impersonation" },
    { id: 4, label: "Privacy Violation", value: "privacyViolation" },
    { id: 5, label: "Hate Speech or Discrimination", value: "hateSpeech" },
    { id: 6, label: "Other", value: "other" },
  ];

  // const [selectedId, setSelectedId] = useState(1);
  const dispatch = useDispatch();

  const handleReport = async () => {
    console.log("object");
    // console.log("post._id", JSON.stringify(post._id, null, 1));
    try {
      const { data } = await axiosInstance.post("/content/community/post/option/save", report);
      console.log("data", JSON.stringify(data, null, 1));
      if (!data.postOption) {
        setIsModalVisible((prev) => !prev);
        closePopover();
        // dispatch(setReported({ post: post._id, action: "remove" }));
        return;
      }
      if (data?.postOption?._id) {
        dispatch(setReported(post._id));
        setIsModalVisible((prev) => !prev);
        closePopover();
        showAlertModal("Reported successfully");
        console.log("Report successful");
      } else {
        console.warn("Unexpected response structure:", data);
        showAlertModal("Report removed!");
        setIsModalVisible((prev) => !prev);
        closePopover();
      }
    } catch (error) {
      handleError(error);
      console.error("An error occurred while reporting:", error);
    }
  };

  return (
    <ReactNativeModal backdropColor={Colors.BackDropColor} isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton toggleModal={setIsModalVisible} />
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>Please tell us why you want to report this post! (optional)</Text>
            <Text style={styles.headingDescription}>Post Title: {post?.title}</Text>
          </View>

          {/* Replacing RadioGroup with globalRadio */}
          <GlobalRadioGroup
            options={itemList}
            selectedValue={report.reportReason}
            onSelect={(value) => setReport((prev) => ({ ...prev, reportReason: value }))}
          />

          <TextArea
            placeholderText={"Leave a note..."}
            setState={(text) => {
              setReport((pre) => ({ ...pre, note: text }));
            }}
            state={report.note}
          />
          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={setIsModalVisible}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            <ModalCustomButton toggleModal={handleReport} textColor={Colors.PureWhite} backgroundColor="#27ac1f" buttonText="Save" />
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
      width: responsiveScreenWidth(90),
      justifyContent: "center",
    },

    modalChild: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      maxHeight: responsiveScreenHeight(80),
    },
    modalHeading: {
      justifyContent: "flex-start",
      paddingTop: responsiveScreenHeight(1.7),
      gap: responsiveScreenWidth(2),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: "rgba(71, 71, 72, 1)",
    },
    modalHeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    headingDescription: {
      color: Colors.BodyText,
      width: "100%",
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    radioButton: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    buttonGroup: {
      borderBottomWidth: 1,
      borderColor: Colors.BorderColor,
      paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(2.5),
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
    },
    buttonContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(2.5),
      justifyContent: "center",
      paddingTop: responsiveScreenHeight(2.2),
    },
  });
