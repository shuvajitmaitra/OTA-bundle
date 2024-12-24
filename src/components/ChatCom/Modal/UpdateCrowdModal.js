import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import ModalCustomButton from './ModalCustomButton';
import CustomDropDown from '../../SharedComponent/CustomDropDown';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateChats,
  updateSingleChatProfile,
} from '../../../store/reducer/chatReducer';
import {showToast} from '../../HelperFunction';
import axiosInstance from '../../../utility/axiosInstance';
import RequireFieldStar from '../../../constants/RequireFieldStar';

const UpdateCrowdModal = ({
  isUpdateCrowdModalVisible,
  toggleUpdateCrowdModal,
}) => {
  const {singleChat: chat} = useSelector(state => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const options = [{type: 'Public'}, {type: 'Private'}];
  const modeOption = [{type: 'Yes'}, {type: 'No'}];
  const [chatName, setChatName] = useState(chat?.name);
  const [chatDescription, setChatDescription] = useState(chat?.description);
  const [isReadOnly, setIsReadOnly] = useState(chat?.isReadOnly);
  const [isPublic, setIsPublic] = useState(chat?.isPublic);

  const dispatch = useDispatch();

  const handleUpdateCrowd = () => {
    if (!chatName) {
      return;
    }
    axiosInstance
      .patch(`/chat/channel/update/${chat?._id}`, {
        name: chatName,
        description: chatDescription,
        isReadOnly: isReadOnly === 'Yes' ? true : false,
        isPublic: isPublic === 'Public' ? true : false,
      })
      .then(res => {
        if (res.data.success) {
          dispatch(updateChats(res?.data?.channel));
          dispatch(updateSingleChatProfile(res?.data?.channel));
          toggleUpdateCrowdModal();
          showToast('Crowd updated');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Modal isVisible={isUpdateCrowdModalVisible}>
      <View style={styles.container}>
        <ModalBackAndCrossButton toggleModal={toggleUpdateCrowdModal} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.headerContainer}>
              <CrowdIcon />
              <Text style={styles.headerText}>Update Crowd</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>
                Crowd Name
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                placeholderTextColor={Colors.BodyText}
                style={styles.inputField}
                value={chatName}
                placeholder={chat?.name}
                onChangeText={text => setChatName(text)}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.Text}>Crowd Description</Text>
              <View style={[styles.inputContainer, {height: 'auto'}]}>
                <TextInput
                  keyboardAppearance={
                    Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                  }
                  style={[styles.textAreaInput]}
                  multiline={true}
                  value={chatDescription}
                  onChangeText={setChatDescription}
                  placeholderTextColor={Colors.BodyText}
                  placeholder={
                    chat?.description
                      ? chat?.description
                      : 'Write crowd description'
                  }
                />
              </View>
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.Text}>Crowd Type</Text>
              <CustomDropDown
                options={options}
                type={chat?.isPublic ? 'Public' : 'Private'}
                setState={setIsPublic}
              />
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.Text}>Read Only</Text>
              <CustomDropDown
                options={modeOption}
                type={chat?.isReadOnly ? 'Yes' : 'No'}
                setState={setIsReadOnly}
              />
            </View>
            <View style={styles.buttonContainer}>
              <ModalCustomButton
                toggleModal={toggleUpdateCrowdModal}
                textColor={Colors.Primary}
                backgroundColor={Colors.PrimaryOpacityColor}
                buttonText="Cancel"
              />
              <ModalCustomButton
                toggleModal={handleUpdateCrowd}
                textColor={Colors.PureWhite}
                backgroundColor={Colors.Primary}
                buttonText="Update"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default UpdateCrowdModal;

const getStyles = Colors =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingTop: responsiveScreenHeight(1.5),
    },
    fieldContainer: {
      // marginBottom: responsiveScreenHeight(2),
      // backgroundColor: 'red',
    },
    inputFieldContainer: {
      marginBottom: responsiveScreenHeight(1),
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      // width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(6),
      borderRadius: 10,
      borderWidth: 1,
      overFlow: 'hidden',
      flexDirection: 'row',
      backgroundColor: Colors.ModalBoxColor,
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2),
      borderColor: Colors.BorderColor,
      marginBottom: responsiveScreenWidth(3),
    },
    textAreaInput: {
      width: '100%',
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      // backgroundColor: "red",
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      textAlignVertical: 'top',
      minHeight: responsiveScreenHeight(10),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      color: Colors.Heading,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(1.5),
      height: 50,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(1.5),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    container: {
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(2),
    },
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
    },
    subContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: responsiveScreenWidth(80),
      // backgroundColor: "red",
    },
    modalArrowIcon: {
      paddingBottom: responsiveScreenHeight(0.8),
      flexDirection: 'row',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
