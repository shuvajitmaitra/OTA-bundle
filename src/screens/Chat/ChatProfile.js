import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import ImageViewing from 'react-native-image-viewing';

import {useTheme} from '../../context/ThemeContext';
import axiosInstance from '../../utility/axiosInstance';
import {
  updateChats,
  updateSingleChatProfile,
} from '../../store/reducer/chatReducer';
import ModalNameStatus from '../../components/ChatCom/Modal/ModalNameStatus';
import MembersIcon from '../../assets/Icons/MembersIcon';
import PlusCircle from '../../assets/Icons/PlusCircle';
import AddMembers from '../../components/ChatCom/Modal/AddMembers';
import LeaveCrowdModal from '../../components/ChatCom/Modal/LeaveCrowdModal';
import CustomFonts from '../../constants/CustomFonts';
import Images from '../../constants/Images';
import CameraIcon from '../../assets/Icons/CameraIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GlobalBackButton from '../../components/SharedComponent/GlobalBackButton';
import Divider from '../../components/SharedComponent/Divider';
import {setCrowdMembers} from '../../store/reducer/chatSlice';
import BlockIcon from '../../assets/Icons/BlockIcon';
import BinIcon from '../../assets/Icons/BinIcon';
import MemberManageSheet from '../../components/ChatCom/Sheet/MemberManageSheet';
import {fetchMembers} from '../../actions/apiCall';
import {launchImageLibrary} from 'react-native-image-picker';
import GroupModalTabView from '../../components/ChatCom/Modal/GroupModalTabView';
import CrowdIcon from '../../assets/Icons/CrowedIcon';
import AiBotIcon from '../../assets/Icons/AiBotIcon';
import UserIcon from '../../assets/Icons/UserIcon';

const ChatProfile = () => {
  const {top} = useSafeAreaInsets();
  const {singleChat: chat} = useSelector(state => state.chat);

  const {selectedMember} = useSelector(state => state.chatSlice);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [ImageView, setImageView] = useState(null);
  const [blockConfirm, setBlockConfirm] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);

  const [isLeaveCrowdModalVisible, setLeaveCrowdModalVisible] = useState(false);
  const toggleLeaveCrowdModal = () => {
    setLeaveCrowdModalVisible(!isLeaveCrowdModalVisible);
  };

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
  console.log('rerendering');
  useEffect(() => {
    if (!chat.isChannel) {
      return;
    }
    fetchMembers(chat?._id);
    return () => {
      dispatch(setCrowdMembers([]));
    };
  }, [chat?._id, chat.isChannel, dispatch]);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        uploadImagesAndSend(response.assets);
      }
    });
  };

  const uploadImagesAndSend = async selectedImages => {
    setIsLoading(true);
    try {
      const uploadedFiles = await Promise.all(
        selectedImages.map(async item => {
          const formData = new FormData();
          formData.append('file', {
            uri: item.uri,
            name: item.fileName || 'uploaded_image',
            type: item.type || 'image/jpeg',
          });

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          };

          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        }),
      );

      updateChannelImage(uploadedFiles[0].location);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to upload images.');
    }
  };
  const updateChannelImage = async avatar => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.patch(
        `chat/channel/update/${chat?._id}`,
        {avatar},
      );
      dispatch(updateChats(res?.data?.channel));
      dispatch(updateSingleChatProfile(res?.data?.channel));
    } catch (error) {
      console.log(
        'Error updating channel image:',
        JSON.stringify(error.response.data, null, 1),
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

  const option = [
    {
      label: selectedMember.isBlocked ? 'Unblock user' : 'Block user',
      icon: <BlockIcon />,
      function: () => setBlockConfirm(true),
    },
    // {
    //   label: 'Mute user',
    //   icon: <VolumeMute />,
    //   function: () =>
    //     handleUpdateMember({
    //       member: selectedMember?._id,
    //       chat: selectedMember?.chat,
    //       actionType: 'block',
    //     }),
    // },
    {
      label: 'Remove user',
      icon: <BinIcon />,
      function: () => setRemoveConfirm(true),
    },
  ];

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.White}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <GlobalBackButton />

      <MemberManageSheet
        option={option}
        blockConfirm={blockConfirm}
        setBlockConfirm={setBlockConfirm}
        setRemoveConfirm={setRemoveConfirm}
        removeConfirm={removeConfirm}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={() =>
              setImageView([
                {
                  uri:
                    chat.avatar ||
                    chat?.otherUser?.profilePicture ||
                    Images.DEFAULT_IMAGE,
                },
              ])
            }>
            {chat?.isChannel && chat?.avatar ? (
              <Image
                style={styles.profileImage}
                size={35}
                source={{uri: chat.avatar}}
              />
            ) : chat?.isChannel && !chat?.avatar ? (
              <View style={styles.iconContainer}>
                <CrowdIcon color={Colors.BodyTextOpacity} size={200} />
              </View>
            ) : chat?.otherUser?.type === 'bot' ? (
              <View style={styles.iconContainer}>
                <AiBotIcon color={Colors.BodyTextOpacity} size={200} />
              </View>
            ) : !chat.isChannel && chat?.otherUser?.profilePicture ? (
              <Image
                style={styles.profileImage}
                size={35}
                source={
                  chat?.otherUser?.profilePicture
                    ? {uri: chat.otherUser.profilePicture}
                    : require('../../assets/Images/user.png')
                }
              />
            ) : (
              <View style={styles.iconContainer}>
                <UserIcon color={Colors.BodyTextOpacity} size={200} />
              </View>
            )}
          </TouchableOpacity>
          {chat.isChannel &&
            (chat?.myData?.role === 'owner' ||
              chat?.myData?.role === 'admin' ||
              chat?.myData?.role === 'moderator') && (
              <TouchableOpacity
                onPress={() => {
                  selectImage();
                }}
                style={styles.cameraIcon}>
                <CameraIcon />
              </TouchableOpacity>
            )}
        </View>

        {/* Name and Status */}
        <ModalNameStatus />

        {/* Member Section */}
        {chat.isChannel && (
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
        )}

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
        {/* <View style={styles.notificationContainer}>
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
        </View> */}

        {/* Description Section */}
        {/* <Divider marginBottom={1.5} marginTop={0.001} />
        <Text style={styles.descriptionTitle}>Crowds Description</Text>
        <Text style={styles.descriptionText}>
          {chat.description || 'No description added yet...'}
        </Text> */}
        <Divider marginBottom={1.5} marginTop={0.001} />

        <GroupModalTabView />

        {/* Action Buttons */}
        {chat.isChannel && (
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
            <LeaveCrowdModal
              toggleLeaveCrowdModal={toggleLeaveCrowdModal}
              isLeaveCrowdModalVisible={isLeaveCrowdModalVisible}
            />
          </View>
        )}
      </ScrollView>

      {/* Image Viewer */}
      <ImageViewing
        images={ImageView} // Array of images
        imageIndex={0} // Initial image index
        visible={Boolean(ImageView)} // Visibility state
        onRequestClose={() => setImageView(null)} // Close handler
      />
    </View>
  );
};

export default ChatProfile;

const getStyles = Colors =>
  StyleSheet.create({
    listText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.White,
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
      fontFamily: CustomFonts.BOLD,
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
      backgroundColor: Colors.PrimaryOpacityColor,
      borderRadius: 10,
    },
    iconContainer: {
      // backgroundColor: 'red',
      height: 250,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center',
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
      backgroundColor: Colors.CyanOpacity,
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
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
    },
    descriptionContainer: {},
    descriptionTitle: {
      fontSize: responsiveScreenFontSize(2.1),
      fontFamily: CustomFonts.MEDIUM,
      paddingBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    descriptionText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
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
      marginBottom: responsiveScreenHeight(2),
    },
    memberNumberContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    memberNumberText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
    addMemberContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
    },
    addMemberText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: '#17855F',
    },
    invitationLinkText: {
      fontFamily: CustomFonts.REGULAR,
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
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
  });
