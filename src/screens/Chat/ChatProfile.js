import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import ImageViewing from 'react-native-image-viewing';

// If you're using React Navigation, import the necessary hooks
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {updateChats} from '../../store/reducer/chatReducer';
import ModalBackBtn from '../../components/ChatCom/Modal/ModalBackBtn';
import ModalNameStatus from '../../components/ChatCom/Modal/ModalNameStatus';
import MembersIcon from '../../assets/Icons/MembersIcon';
import PlusCircle from '../../assets/Icons/PlusCircle';
import AddMembers from '../../components/ChatCom/Modal/AddMembers';
import LinkIcon from '../../assets/Icons/LinkIcon';
import NotifyBell from '../../assets/Icons/NotifyBell';
import GroupModalTabView from '../../components/ChatCom/Modal/GroupModalTabView';
import ReportModal from '../../components/ChatCom/Modal/ReportModal';
import LeaveCrowdModal from '../../components/ChatCom/Modal/LeaveCrowdModal';
import CustomeFonts from '../../constants/CustomeFonts';
import Images from '../../constants/Images';
import CameraIcon from '../../assets/Icons/CameraIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GlobalBackButton from '../../components/SharedComponent/GlobalBackButton';
import Divider from '../../components/SharedComponent/Divider';
import {setCrowdMembers} from '../../store/reducer/chatSlice';

const ChatProfile = () => {
  const navigation = useNavigation(); // Initialize navigation
  const {top} = useSafeAreaInsets();
  const {singleChat: chat} = useSelector(state => state.chat);

  const [notificationSwitch, setNotificationSwitch] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  // --------------------------
  // ----------- Leave Crowd Modal Function -----------
  // --------------------------
  const [isLeaveCrowdModalVisible, setLeaveCrowdModalVisible] = useState(false);
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

  useEffect(() => {
    if (!chat.isChannel) {
      dispatch(setCrowdMembers([]));
      return;
    }
    axiosInstance
      .post(`/chat/members/${chat._id}`)
      .then(res => {
        dispatch(setCrowdMembers(res.data.results));
        console.log(
          'res.data.results',
          JSON.stringify(res.data.results, null, 1),
        );
      })
      .catch(error => {
        console.log(
          'getting error to fetch member',
          JSON.stringify(error, null, 1),
        );
      });
  }, [chat, chat.isChannel, dispatch]);

  // --------------------------
  // ----------- Invitation Link copy Function -----------
  // --------------------------
  const handleClipBoard = async () => {
    // try {
    //   await Clipboard.setStringAsync(
    //     `https://portal.schoolshub.ai/chat/${chat?._id}`,
    //   );
    //   showToast('Link copied...');
    // } catch (error) {
    //   console.error('Error while copying to clipboard:', error);
    // }
  };

  //   const uploadImage = async () => {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: 'image/*',
  //       copyToCacheDirectory: true,
  //     });
  //     if (result.type === 'cancel') {
  //       console.log('User canceled the document picker');
  //       return;
  //     }
  //     setIsLoading(true);
  //     const {uri, name, size} = result;
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri,
  //       name,
  //       type: 'image/jpeg',
  //     });

  //     const url = '/document/userdocumentfile';

  //     try {
  //       const res = await axiosInstance.post(url, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //       if (res?.data?.success) {
  //         updateChannelImage(res?.data?.fileUrl);
  //       }
  //     } catch (error) {
  //       console.log('Error, image not uploaded:', JSON.stringify(error, null, 1));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const updateChannelImage = async avatar => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        `chat/channel/update/${chat?._id}`,
        {avatar},
      );
      dispatch(updateChats(res?.data?.channel));
    } catch (error) {
      console.log(
        'Error updating channel image:',
        JSON.stringify(error, null, 1),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.Primary} size={40} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <GlobalBackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={() => setIsImageViewerVisible(true)}>
            <Image
              style={styles.profileImage}
              source={chat?.avatar ? {uri: chat?.avatar} : Images.DEFAULT_IMAGE}
            />
          </TouchableOpacity>
          {(chat?.myData?.role === 'owner' ||
            chat?.myData?.role === 'admin' ||
            chat?.myData?.role === 'moderator') && (
            <TouchableOpacity onPress={() => {}} style={styles.cameraIcon}>
              <CameraIcon />
            </TouchableOpacity>
          )}
        </View>

        {/* Name and Status */}
        <ModalNameStatus />

        {/* Member Section */}
        <View style={styles.memberContainer}>
          <View style={styles.memberNumberContainer}>
            <MembersIcon />
            <Text style={styles.memberNumberText}>
              {chat?.membersCount || 0} Members
            </Text>
          </View>
          {(chat?.myData?.role === 'owner' ||
            chat?.myData?.role === 'admin') && (
            <TouchableOpacity
              onPress={toggleAddMembersModal}
              style={styles.addMemberContainer}>
              <PlusCircle />
              <Text style={styles.addMemberText}>Add member</Text>
            </TouchableOpacity>
          )}
          <AddMembers
            toggleAddMembersModal={toggleAddMembersModal}
            isAddMembersModalVisible={isAddMembersModalVisible}
          />
        </View>

        {/* Invitation Link Section */}
        {/* {chat?.isPublic && (
          <TouchableOpacity
            onPress={handleClipBoard}
            style={styles.invitationLinkContainer}>
            <LinkIcon />
            <Text style={styles.invitationLinkText}>
              Click to copy invitation link
            </Text>
          </TouchableOpacity>
        )} */}

        {/* Notification Toggle */}
        <View style={styles.notificationContainer}>
          <View style={styles.notificationSubContainer}>
            <NotifyBell />
            <Text style={styles.notificationText}>Notification</Text>
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

        {/* Description Section */}
        <Divider marginBottom={1.5} marginTop={0.001} />
        <Text style={styles.descriptionTitle}>Crowds Description</Text>
        <Text style={styles.descriptionText}>
          {chat.description || 'No description added yet...'}
        </Text>
        <Divider marginBottom={1.5} marginTop={1.5} />

        <GroupModalTabView />

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Report Button */}
          <TouchableOpacity
            onPress={toggleReportMembersModal}
            style={styles.blockContainer}>
            {/* <Feather
              name="alert-triangle"
              size={responsiveScreenFontSize(2.5)}
              color={Colors.BodyText}
            /> */}
            <Text style={styles.containerText}>Report</Text>
          </TouchableOpacity>
          {/* <ReportModal
            toggleReportMembersModal={toggleReportMembersModal}
            isReportMembersModalVisible={isReportMembersModalVisible}
          /> */}

          {/* Archive Chat Button */}
          <TouchableOpacity
            onPress={() => {
              //   showAlert({
              //     title: 'Coming Soon...',
              //     type: 'warning',
              //     message: 'This feature is coming soon.',
              //   });
            }}
            style={styles.blockContainer}>
            {/* <Feather
              name="archive"
              size={responsiveScreenFontSize(2.5)}
              color={Colors.BodyText}
            /> */}
            <Text style={styles.containerText}>Archive Chat</Text>
          </TouchableOpacity>

          {/* Leave Chat Button */}
          <TouchableOpacity
            onPress={toggleLeaveCrowdModal}
            style={styles.blockContainer}>
            {/* <AntDesign
              name="delete"
              size={responsiveScreenFontSize(2)}
              color="rgba(244, 42, 65, 1)"
            /> */}
            <Text
              style={[styles.containerText, {color: 'rgba(244, 42, 65, 1)'}]}
              numberOfLines={1}
              ellipsizeMode="tail">
              Leave Crowds
            </Text>
          </TouchableOpacity>
          {/* <LeaveCrowdModal
            toggleLeaveCrowdModal={toggleLeaveCrowdModal}
            isLeaveCrowdModalVisible={isLeaveCrowdModalVisible}
          /> */}
        </View>
      </ScrollView>

      {/* Image Viewer */}
      <ImageViewing
        images={[{uri: chat?.avatar}]} // Array of images
        imageIndex={0} // Initial image index
        visible={isImageViewerVisible} // Visibility state
        onRequestClose={() => setIsImageViewerVisible(false)} // Close handler
      />
    </View>
  );
};

export default ChatProfile;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      // flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: Colors.BorderColor,
      backgroundColor: Colors.Red,
    },

    headerTitle: {
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomeFonts.BOLD,
      color: Colors.Heading,
    },
    scrollContent: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(2.5),
    },
    profileImageContainer: {
      position: 'relative',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
    },
    profileImage: {
      height: responsiveScreenHeight(30),
      width: responsiveScreenWidth(90),
      resizeMode: 'cover',
      borderRadius: responsiveScreenHeight(1),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    cameraIcon: {
      position: 'absolute',
      bottom: responsiveScreenHeight(1),
      right: responsiveScreenWidth(3),
      backgroundColor: 'rgba(255, 255,255, .7)',
      padding: 10,
      borderRadius: 100,
    },
    notificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: responsiveScreenHeight(2),
      // backgroundColor: 'red',
    },
    notificationSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    notificationText: {
      color: Colors.BodyText,
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
    },
    descriptionContainer: {},
    descriptionTitle: {
      fontSize: responsiveScreenFontSize(2.1),
      fontFamily: CustomeFonts.MEDIUM,
      paddingBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    descriptionText: {
      color: Colors.BodyText,
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    separator: {
      borderBottomWidth: 0.8,
      borderColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(2.7),
      marginBottom: responsiveScreenHeight(1.5),
    },
    memberContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginBottom: responsiveScreenHeight(2),
    },
    memberNumberContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    memberNumberText: {
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
    addMemberContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
    },
    addMemberText: {
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: '#17855F',
    },
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
      backgroundColor: 'red',
    },
    actionButtonsContainer: {
      marginTop: responsiveScreenHeight(2),
    },
    blockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      marginVertical: responsiveScreenHeight(1),
    },
    containerText: {
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
  });
