import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useState } from "react";
// import ArrowLeft from "../../../assets/svgs/ArrowLeft";
// import CrossIcon from "../../../assets/svgs/CrossIcon";
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from "react-native-responsive-dimensions";
import Modal from "react-native-modal";
// import CrowdIcon from "../../../assets/svgs/CrowdIcon";
// import CustomButton from "../CustomButton";
// import CustomDropDown from "../SharedComponent/CustomDropDown";
import ArrowLeft from "../../../assets/Icons/ArrowLeft";
import CrossIcon from "../../../assets/Icons/CrossIcon";
import CrowdIcon from "../../../assets/Icons/CrowedIcon";
import ModalCustomButton from "./ModalCustomButton";
import CustomDropDown from "../../SharedComponent/CustomDropDown";
import ModalBackAndCrossButton from "./ModalBackAndCrossButton";
import { useTheme } from "../../../context/ThemeContext";
import CustomeFonts from "../../../constants/CustomeFonts";
import useChat from "../../../hook/useChat";
import axiosInstance from "../../../utility/axiosInstance";
import { useDispatch } from "react-redux";
import { updateChats } from "../../../store/reducer/chatReducer";
import AddMembers from "./AddMembers";
import CreateCrowdAddMember from "./CreateCrowdAddMember";

const CreateCrowdModal = ({
  isCreateCrowdModalVisible,
  toggleCreateCrowdModal,
  setIsCreateCrowdModalVisible,
}) => {
  const [chat, setChat] = useState(null);
  // const { chat, setIsGroupModalVisible } = useChat();
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const options = [{ type: "Public" }, { type: "Private" }];
  const modeOption = [{ type: "Yes" }, { type: "No" }];
  const [chatName, setChatName] = useState(chat?.name);
  const [chatDescription, setChatDescription] = useState(chat?.description);
  const [isReadOnly, setIsReadOnly] = useState(chat?.isReadOnly);
  const [isPublic, setIsPublic] = useState(chat?.isPublic);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();


  
  const [isAddMembersModalVisible, setIsAddMembersModalVisible] =
    useState(false);
  const toggleAddMembersModal = () => {
    setIsAddMembersModalVisible((pre) => !pre);
  };
  return (
    <Modal isVisible={isCreateCrowdModalVisible}>
      <View style={styles.container}>
        {/* -------------------------- */}
        {/* ----------- Back Arrow button ----------- */}
        {/* -------------------------- */}
        <ModalBackAndCrossButton toggleModal={toggleCreateCrowdModal} />
        {/* <View style={styles.bottomBorder}></View> */}
        {/* -------------------------- */}
        {/* ----------- Main View Start form here ----------- */}
        {/* -------------------------- */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            {/* -------------------------- */}
            {/* ----------- Header container ----------- */}
            {/* -------------------------- */}
            <View style={styles.headerContainer}>
              <CrowdIcon />
              <Text style={styles.headerText}>Create Crowd</Text>
            </View>
            {/* -------------------------- */}
            {/* ----------- Crowd Name Container ----------- */}
            {/* -------------------------- */}
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>Crowd Name*</Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === "#F5F5F5" ? "light" : "dark"
                }
                placeholderTextColor={Colors.BodyText}
                style={styles.inputField}
                placeholder={chat?.name ? chat?.name : "Write crowd name"}
                onChangeText={setChatName}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>Crowd Description</Text>
              <View style={[styles.inputContainer, { height: "auto" }]}>
                <TextInput
                  keyboardAppearance={
                    Colors.Background_color === "#F5F5F5" ? "light" : "dark"
                  }
                  style={[styles.textAreaInput]}
                  multiline={true}
                  onChangeText={setChatDescription}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={
                    chat?.description
                      ? chat?.description
                      : "Write crowd description"
                  }
                />
              </View>
            </View>
            {/* -------------------------- */}
            {/* ----------- Custom dropdown menu ----------- */}
            {/* -------------------------- */}
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>Crowd Type</Text>
              <CustomDropDown
                options={options}
                type={"Private"}
                setState={setIsPublic}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>Read Only</Text>
              <CustomDropDown
                options={modeOption}
                type={"No"}
                setState={setIsReadOnly}
              />
            </View>

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
            <View style={styles.buttonContainer}>
              <ModalCustomButton
                toggleModal={toggleCreateCrowdModal}
                textColor={Colors.Primary}
                backgroundColor={Colors.PrimaryOpacityColor}
                buttonText="Cancel"
              />
              <ModalCustomButton
                toggleModal={() => {
                  toggleAddMembersModal();
                  // toggleCreateCrowdModal();
                }}
                textColor={Colors.PureWhite}
                backgroundColor={Colors.Primary}
                buttonText="Next"
              />
            </View>
          </View>
        </ScrollView>
        <CreateCrowdAddMember
          chatName={chatName}
          setIsCreateCrowdModalVisible={setIsCreateCrowdModalVisible}
          setIsAddMembersModalVisible={setIsAddMembersModalVisible}
          chatDescription={chatDescription}
          isReadOnly={isReadOnly}
          isPublic={isPublic}
          toggleCreateCrowdModal={toggleCreateCrowdModal}
          toggleAddMembersModal={toggleAddMembersModal}
          isAddMembersModalVisible={isAddMembersModalVisible}
        />
      </View>
    </Modal>
  );
};

export default memo(CreateCrowdModal);

const getStyles = (Colors) =>
  StyleSheet.create({
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
      fontFamily: CustomeFonts.MEDIUM,
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
    },
    textAreaInput: {
      width: "100%",
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      // backgroundColor: "red",
      fontFamily: CustomeFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: "top",
      marginLeft: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(10),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      color: Colors.Heading,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomeFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
    },
    // --------------------------
    // ----------- Header Container -----------
    // --------------------------
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(1),
    },
    headerText: {
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
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
    },
    topBarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      minWidth: "100%",
    },
    subContainer: {
      minHeight: responsiveScreenHeight(30),
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
      fontFamily: CustomeFonts.REGULAR,
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
