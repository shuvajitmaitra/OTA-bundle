import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from "react-native-responsive-dimensions";
import * as DocumentPicker from "expo-document-picker";

import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import ModalBackAndCrossButton from "../ChatCom/Modal/ModalBackAndCrossButton";
import CrowdIcon from "../../assets/Icons/CrowedIcon";
import CustomDropDown from "../SharedComponent/CustomDropDown";
import ModalCustomButton from "../ChatCom/Modal/ModalCustomButton";
import CustomFonts from "../../constants/CustomFonts";
import moment from "moment";
import CalenderIcon from "../../assets/Icons/CalenderIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import axiosInstance from "../../utility/axiosInstance";
import { ActivityIndicator } from "react-native";
import { getFileTypeFromUri } from "../TechnicalTestCom/TestNow";
import CrossCircle from "../../assets/Icons/CrossCircle";
import { initialActivities } from "../../store/reducer/activitiesReducer";
import { showToast } from "../HelperFunction";
import { useGlobalAlert } from "../SharedComponent/GlobalAlertContext";
import FileUploader from "../SharedComponent/FileUploder";
import GlobalAlertModal from "../SharedComponent/GlobalAlertModal";
import { showAlertModal } from "../../utility/commonFunction";
import RequireFieldStar from "../../constants/RequireFieldStar";

const CreateActivitiesModal = ({ isCreateActivitiesModalVisible, toggleCreateActivitiesModal, action, activityId }) => {
  const { activities } = useSelector((state) => state?.activities);
  const activityData = activities.length && activities?.find((item) => item._id === activityId);
  const [title, setTitle] = useState(action ? activityData?.title : "");
  const [description, setDescription] = useState(action ? activityData?.description : "");
  const [attachments, setAttachments] = useState(action ? activityData?.attachments : []);
  const [isUploading, setIsUploading] = useState(false);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const data = {
    title,
    category: "day2day",
    description,
    attachments,
  };
  const handleCreateActivities = () => {
    if (!title) {
      return showAlertModal({
        title: "Empty Title",
        type: "warning",
        message: "Title field is required",
      });
    }
    if (!description) {
      return showAlertModal({
        title: "Empty Description",
        type: "warning",
        message: "Description field is required",
      });
    }
    axiosInstance
      .post("/communication/shout", data)
      .then((res) => {
        if (res.data.success) {
          dispatch(
            initialActivities({
              data: [res?.data?.post, ...activities],
              page: 1,
            })
          );
          setTitle("");
          setAttachments([]);
          setDescription("");
          toggleCreateActivitiesModal();
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log("Server error:", JSON.stringify(error.response.data, null, 1));
        } else if (error.request) {
          console.log("Network error:", JSON.stringify(error.request, null, 1));
        } else {
          console.log("Error:", JSON.stringify(error.message, null, 1));
        }
      });
  };

  const handleUpdateActivities = (id) => {
    if (!description) {
      return alert("Description field require");
    }
    axiosInstance
      .patch(`communication/update/${id}`, data)
      .then((res) => {
        if (res.data.success) {
          dispatch(
            initialActivities({
              data: activities?.map((item) => (item?._id === id ? res.data.post : item)),
              page: 1,
            })
          );
          showToast("Activities updated");
          toggleCreateActivitiesModal();
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("error communication update create activities modal", JSON.stringify(error, null, 1));
      });
  };

  const removeDocument = (uri) => {
    // console.log("uri", JSON.stringify(uri, null, 1));
    setAttachments(attachments?.filter((item) => item !== uri));
  };

  return (
    <Modal isVisible={isCreateActivitiesModalVisible}>
      {/* -------------------------- */}
      {/* ----------- Back Arrow button ----------- */}
      {/* -------------------------- */}
      <View style={styles.container}>
        <ModalBackAndCrossButton toggleModal={toggleCreateActivitiesModal} />
        {/* -------------------------- */}
        {/* ----------- Main View Start form here ----------- */}
        {/* -------------------------- */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            {/* -------------------------- */}
            {/* ----------- Header container ----------- */}
            {/* -------------------------- */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{action ? action : "create"} Activities</Text>
              <Text style={styles.headerDescription}>Please fill out the form to {action ? action : "create"} an activity.</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Title
                <RequireFieldStar />
              </Text>

              <TextInput
                keyboardAppearance={Colors.Background_color === "#F5F5F5" ? "light" : "dark"}
                placeholderTextColor={Colors.BodyText}
                style={styles.inputField}
                placeholder={"Enter title"}
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Description
                <RequireFieldStar />
              </Text>
              <View style={[styles.inputContainer, { height: "auto" }]}>
                <TextInput
                  keyboardAppearance={Colors.Background_color === "#F5F5F5" ? "light" : "dark"}
                  spellCheck={true}
                  style={[styles.textAreaInput]}
                  multiline={true}
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={"Enter description"}
                />
              </View>
            </View>

            <FileUploader setAttachments={setAttachments} attachments={attachments} />

            {/* -------------------------- */}
            {/* ----------- Border and button  ----------- */}
            {/* -------------------------- */}
            <View
              style={{
                borderBottomWidth: 1,
                marginBottom: responsiveScreenHeight(2),
                borderBottomColor: Colors.BorderColor,
              }}
            ></View>
            {/* <View style={styles.buttonContainer}>
              <ModalCustomButton
                toggleModal={toggleCreateActivitiesModal}
                textColor={Colors.Primary}
                backgroundColor={Colors.PrimaryOpacityColor}
                buttonText="Cancel"
              />
              {isLoading ? (
                <ModalCustomButton
                  textColor={Colors.Primary}
                  backgroundColor={Colors.BorderColor}
                  buttonText="Save"
                />
              ) : (
                <ModalCustomButton
                  toggleModal={() => {
                    action
                      ? handleUpdateActivities(activityId)
                      : handleCreateActivities();
                  }}
                  textColor={Colors.PureWhite}
                  backgroundColor={Colors.Primary}
                  buttonText={activityId ? "Update" : "Submit"}
                />
              )}
            </View> */}
            <View style={styles.buttonContainer}>
              <ModalCustomButton
                toggleModal={toggleCreateActivitiesModal}
                textColor={Colors.Primary}
                backgroundColor={Colors.PrimaryOpacityColor}
                buttonText="Cancel"
              />
              {isLoading ? (
                <ModalCustomButton
                  textColor={Colors.Primary}
                  backgroundColor={Colors.BorderColor}
                  buttonText="Save"
                  disabled={true} // Always disabled during loading
                />
              ) : (
                <ModalCustomButton
                  toggleModal={() => {
                    if (!isUploading) {
                      // Only allow submission if not uploading
                      action ? handleUpdateActivities(activityId) : handleCreateActivities();
                    }
                  }}
                  textColor={isUploading ? Colors.DisablePrimaryButtonTextColor : Colors.PureWhite}
                  backgroundColor={isUploading ? Colors.DisablePrimaryBackgroundColor : Colors.Primary}
                  buttonText={activityId ? "Update" : "Submit"}
                  disabled={isUploading} // Disable the button while uploading
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <GlobalAlertModal />
    </Modal>
  );
};

export default CreateActivitiesModal;

const getStyles = (Colors) =>
  StyleSheet.create({
    docPreview: {
      width: "100%",
      // backgroundColor: "red",
      flexDirection: "row",
      flexWrap: "wrap",
      flexBasis: 99,
      gap: 10,
    },
    CrossCircle: {
      backgroundColor: Colors.Primary,
      width: 20,
      justifyContent: "center",
      alignItems: "center",
      height: 20,
      borderRadius: 100,
      position: "absolute",
      top: -10,
      right: -10,
    },
    idStyle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    attachment: {
      height: responsiveScreenHeight(10),
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: responsiveScreenWidth(3),
      marginVertical: responsiveScreenHeight(1),
      borderStyle: "dashed",
      borderColor: Colors.Primary,
      borderWidth: 1.5,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    uploadText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    attachmentText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
    },
    buttonContainer: {
      flexDirection: "row",
      gap: responsiveScreenWidth(2.5),
      justifyContent: "center",
      // paddingVertical: responsiveScreenHeight(2.5),
    },
    // bottomBorder: {
    //   borderBottomWidth: 0.5,
    //   borderBottomColor: "rgba(0, 0, 0, 0.3)",
    // },
    // --------------------------
    // ----------- Crowd Name Container -----------
    // --------------------------
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
      // backgroundColor: "red",
    },
    inputFieldContainer: {
      // marginBottom: responsiveScreenHeight(1),
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      backgroundColor: Colors.ModalBoxColor,
      alignItems: "center",
      borderColor: Colors.BorderColor,
      paddingRight: responsiveScreenWidth(3),
    },
    textAreaInput: {
      width: "100%",
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.Heading,
      // backgroundColor: "red",
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: "top",
      marginLeft: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(10),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      // paddingVertical: responsiveScreenHeight(1),
      height: responsiveScreenHeight(5),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
    },
    // --------------------------
    // ----------- Header Container -----------
    // --------------------------
    headerContainer: {
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
      textTransform: "capitalize",
    },
    headerDescription: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      width: "80%",
    },
    // --------------------------
    // ----------- Main Container -----------
    // --------------------------
    container: {
      paddingTop: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(2),
      //   height: responsiveScreenHeight(80),
      maxHeight: responsiveScreenHeight(80),
    },
    topBarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      minWidth: "100%",
    },
    subContainer: {
      // maxHeight: responsiveScreenHeight(70),
      minWidth: responsiveScreenWidth(80),
    },
    modalArrowIcon: {
      paddingBottom: responsiveScreenHeight(0.8),
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(2),
      color: Colors.BodyText,
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    cancelButton: {
      backgroundColor: Colors.PrimaryOpacityColor,
      padding: responsiveScreenWidth(2.5),
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
    },
  });
