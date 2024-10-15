import {
  StyleSheet,
  Text,
  ToastAndroid,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import NotifyBell from '../../assets/Icons/NotifyBell';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import GroupModalTabView from './Modal/GroupModalTabView';
import CustomeFonts from '../../constants/CustomeFonts';
import * as Clipboard from 'expo-clipboard';
import MembersIcon from '../../assets/Icons/MembersIcon';
import PlusCircle from '../../assets/Icons/PlusCircle';
import LinkIcon from '../../assets/Icons/LinkIcon';
import ModalBackBtn from './Modal/ModalBackBtn';
import ModalNameStatus from './Modal/ModalNameStatus';
import LeaveCrowdModal from './Modal/LeaveCrowdModal';
import AddMembers from './Modal/AddMembers';
import ReportModal from './Modal/ReportModal';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../utility/axiosInstance';
import useChat from '../../hook/useChat';
import {useTheme} from '../../context/ThemeContext';
import CameraIcon from '../../assets/Icons/CameraIcon';
import * as DocumentPicker from 'expo-document-picker';
import {updateChats} from '../../store/reducer/chatReducer';
import {showToast} from '../HelperFunction';
import Images from '../../constants/Images';
import ImageViewing from 'react-native-image-viewing';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';

export default function GroupModal({}) {
  const {setIsGroupModalVisible, chat} = useChat();
  const [notificationSwitch, setNotificationSwitch] = React.useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  // console.log(JSON.stringify(chat, null, 1));
  // --------------------------
  // ----------- Leave Crowd Modal Function -----------
  // --------------------------
  const [isLeaveCrowdModalVisible, setLeaveCrowdModalVisible] =
    React.useState(false);
  const toggleLeaveCrowdModal = () => {
    setLeaveCrowdModalVisible(!isLeaveCrowdModalVisible);
  };

  // --------------------------
  // ----------- Add Member Modal Function -----------
  // --------------------------
  const [isAddMembersModalVisible, setAddMembersModalVisible] = useState(false);
  const toggleAddMembersModal = () => {
    setAddMembersModalVisible(!isAddMembersModalVisible);
  };

  // --------------------------
  // ----------- Report Modal Function -----------
  // --------------------------
  const [isReportMembersModalVisible, setReportMembersModalVisible] =
    useState(false);
  const toggleReportMembersModal = () => {
    setReportMembersModalVisible(!isReportMembersModalVisible);
  };

  // --------------------------
  // ----------- Invitation Link copy Function -----------
  // --------------------------
  const handleClipBoard = async () => {
    try {
      await Clipboard.setStringAsync(
        `https://portal.schoolshub.ai/chat/${chat?._id}`,
      );
      showToast('link copied...');
    } catch (error) {
      console.error('Error while copying to clipboard:', error);
    }
  };

  const uploadImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true,
    });
    if (result.canceled) {
      console.log('User canceled the document picker');
      return;
    }
    setIsLoading(true);
    const {uri, name, size} = result.assets[0];
    const formData = new FormData();
    formData.append('file', {
      uri,
      name,
      type: 'image/jpeg',
    });

    const url = '/document/userdocumentfile';

    await axiosInstance
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        if (res?.data?.success) {
          updateChannelImage(res?.data?.fileUrl);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log(
          'error, image not uploaded',
          JSON.stringify(error, null, 1),
        );
        setIsLoading(false);
      });
  };
  const updateChannelImage = avatar => {
    setIsLoading(true);
    axiosInstance
      .patch(`chat/channel/update/${chat?._id}`, {avatar})
      .then(res => {
        setIsLoading(false);
        dispatch(updateChats(res?.data?.channel));
      })
      .catch(error => {
        console.log(
          'error update channel image',
          JSON.stringify(error, null, 1),
        );
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: Colors.White,
        }}>
        <ActivityIndicator color={Colors.Primary} size={40} />
      </View>
    );
  }
  return (
    <View style={styles.modalContainer}>
      <ModalBackBtn setIsGroupModalVisible={setIsGroupModalVisible} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={{ position: "relative" }}>
          <Image
            style={styles.profileImage}
            source={
              chat?.avatar
                ? {
                    uri: chat?.avatar,
                  }
                : Images.DEFAULT_IMAGE
            }
          />
          {(chat?.myData?.role === "owner" ||
            chat?.myData?.role === "admin" ||
            chat?.myData?.role === "moderator") && (
            <TouchableOpacity onPress={uploadImage} style={styles.cameraIcon}>
              <CameraIcon />
            </TouchableOpacity>
          )}
        </View> */}

        <View style={{position: 'relative'}}>
          <TouchableOpacity onPress={() => setIsImageViewerVisible(true)}>
            <Image
              style={styles.profileImage}
              source={
                chat?.avatar
                  ? {
                      uri: chat?.avatar,
                    }
                  : Images.DEFAULT_IMAGE
              }
            />
          </TouchableOpacity>
          {(chat?.myData?.role === 'owner' ||
            chat?.myData?.role === 'admin' ||
            chat?.myData?.role === 'moderator') && (
            <TouchableOpacity onPress={uploadImage} style={styles.cameraIcon}>
              <CameraIcon />
            </TouchableOpacity>
          )}
        </View>
        <ModalNameStatus />
        {/* -------------------------- */}
        {/* ----------- Add Member container ----------- */}
        {/* -------------------------- */}

        <View style={styles.memberContainer}>
          <View style={styles.memberNumberContainer}>
            <MembersIcon />
            <Text style={styles.memberNumberText}>
              {chat?.membersCount || 0} Members
            </Text>
          </View>
          {/* -------------------------- */}
          {/* ----------- Add Member Button ----------- */}
          {/* -------------------------- */}
          {chat?.myData?.role === 'owner' || chat?.myData?.role === 'admin' ? (
            <TouchableOpacity
              onPress={() => toggleAddMembersModal()}
              style={styles.addMemberContainer}>
              <PlusCircle />
              <Text style={styles.addMemberText}>Add member</Text>
            </TouchableOpacity>
          ) : null}
          <AddMembers
            toggleAddMembersModal={toggleAddMembersModal}
            isAddMembersModalVisible={isAddMembersModalVisible}
          />
        </View>

        {/* -------------------------- */}
        {/* ----------- Copy Invitation link container ----------- */}
        {/* -------------------------- */}
        {/* {chat.isPublic ? (
          <TouchableOpacity
            onPress={() => handleClipBoard()}
            style={styles.invitationLinkContainer}
          >
            <LinkIcon />
            <Text style={styles.invitationLinkText}>
              Click to copy invitation link
            </Text>
          </TouchableOpacity>
        ) : null} */}

        <View style={styles.notificationContainer}>
          <View style={styles.notificationSubContainer}>
            <NotifyBell />
            <Text
              style={{
                color: Colors.BodyText,
                fontFamily: CustomeFonts.REGULAR,
                fontSize: responsiveScreenFontSize(2),
              }}>
              Notification
            </Text>
          </View>
          <Switch
            trackColor={{false: '#767577', true: Colors.Primary}}
            thumbColor={notificationSwitch ? Colors.Primary : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() =>
              setNotificationSwitch(previousState => !previousState)
            }
            value={notificationSwitch}
          />
        </View>

        {chat?.description && (
          <View style={styles.descriptionContainer}>
            <Text
              style={{
                fontSize: responsiveScreenFontSize(2.1),
                fontFamily: CustomeFonts.MEDIUM,
                paddingTop: responsiveScreenHeight(2),
                paddingBottom: responsiveScreenHeight(1.7),
                color: Colors.Heading,
              }}>
              Crowds Description
            </Text>
            <Text
              style={{
                color: Colors.BodyText,
                fontFamily: CustomeFonts.REGULAR,
                fontSize: responsiveScreenFontSize(1.7),
              }}>
              {chat.description || chat.name}
            </Text>
            <View
              style={{
                borderBottomWidth: 0.8,
                borderColor: Colors.BorderColor,
                marginTop: responsiveScreenHeight(2.7),
                marginBottom: responsiveScreenHeight(1.5),
              }}></View>
          </View>
        )}
        {/* -------------------------- */}
        {/* ----------- Group Modal Tab View ----------- */}
        {/* -------------------------- */}
        <GroupModalTabView />

        <View>
          <TouchableOpacity
            onPress={() => toggleReportMembersModal()}
            style={styles.blockContainer}>
            <Feather
              name="alert-triangle"
              size={responsiveScreenFontSize(2.5)}
              color={Colors.BodyText}
            />
            <Text style={styles.ContainerText}>Report</Text>
          </TouchableOpacity>
          <ReportModal
            toggleReportMembersModal={toggleReportMembersModal}
            isReportMembersModalVisible={isReportMembersModalVisible}
          />
          <TouchableOpacity
            onPress={() => {
              showAlert({
                title: 'Coming Soon...',
                type: 'warning',
                message: 'This feature is coming soon.',
              });
            }}
            style={styles.blockContainer}>
            <Feather
              name="archive"
              size={responsiveScreenFontSize(2.5)}
              color={Colors.BodyText}
            />
            <Text style={styles.ContainerText}>Archive Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleLeaveCrowdModal()}
            style={styles.blockContainer}>
            <AntDesign
              name="delete"
              size={responsiveScreenFontSize(2)}
              color="rgba(244, 42, 65, 1)"
            />
            <Text
              style={[styles.ContainerText, {color: 'rgba(244, 42, 65, 1)'}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              Leave Crowds
            </Text>
          </TouchableOpacity>
          <LeaveCrowdModal
            toggleLeaveCrowdModal={toggleLeaveCrowdModal}
            isLeaveCrowdModalVisible={isLeaveCrowdModalVisible}
          />
        </View>
      </ScrollView>
      <ImageViewing
        images={[{uri: chat?.avatar}]} // Array of images
        imageIndex={0} // Initial image index
        visible={isImageViewerVisible} // Visibility state
        onRequestClose={() => setIsImageViewerVisible(false)} // Close handler
      />
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingHorizontal: responsiveScreenWidth(2),
      paddingBottom: responsiveScreenHeight(2.5),
      paddingTop: responsiveScreenHeight(1),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(2),
      maxHeight: responsiveScreenHeight(80),
    },

    profileImage: {
      height: responsiveScreenHeight(30),
      width: responsiveScreenWidth(85),
      resizeMode: 'cover',
      borderRadius: responsiveScreenHeight(1),
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },

    notificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(0.5),
    },
    notificationSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    descriptionContainer: {
      borderTopWidth: 1,
      borderColor: Colors.BorderColor,
    },
    blockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginVertical: responsiveScreenHeight(1),
    },
    ContainerText: {
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },

    // --------------------------
    // ----------- Member Container -----------
    // --------------------------

    memberNumberText: {
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
    addMemberText: {
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: '#17855F',
    },
    memberNumberContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    addMemberContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
    },
    memberContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cameraIcon: {
      position: 'absolute',
      bottom: responsiveScreenHeight(1),
      right: responsiveScreenWidth(3),
      backgroundColor: 'rgba(255, 255,255, .7)',
      padding: 10,
      borderRadius: 100,
    },

    // --------------------------
    // ----------- Invitation Link Container -----------
    // --------------------------
    invitationLinkText: {
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: '#17855F',
    },
    invitationLinkContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(2),
    },
  });
