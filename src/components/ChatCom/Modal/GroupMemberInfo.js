import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  Popover,
  PopoverController,
  usePopover,
} from 'react-native-modal-popover';
import moment from 'moment';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import ThreeDotGrayIcon from '../../../assets/Icons/ThreeDotGrayIcon';
import AddUsers from '../../../assets/Icons/AddUser';
import VolumeMute from '../../../assets/Icons/VolumeMute';
import BlockIcon from '../../../assets/Icons/BlockIcon';
import BinIcon from '../../../assets/Icons/BinIcon';
import CustomeFonts from '../../../constants/CustomeFonts';
import RoleAssignModal from './RoleAssignModal';
import ChatMuteModal from './ChatMuteModal';
import BlockMemberModal from './BlockMemberModal';
import RemoveMemberModal from './RemoveMemberModal';
import ChatUnmuteModal from './ChatUnmuteModal';
import {useTheme} from '../../../context/ThemeContext';
import NewUserIcons from '../../../assets/Icons/NewUserIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedMembers} from '../../../store/reducer/chatSlice';

export default function GroupMemberInfo({
  item,
  index,
  setLoading,
  fetchMembers,
  chat,
}) {
  const [value, setValue] = React.useState(1);
  const [muteMessage, setMuteMessage] = useState('');
  const dispatch = useDispatch();
  // console.log('item', JSON.stringify(item, null, 1));

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);

  const name =
    item.user.fullName.split(' ')?.length > 3
      ? `${item.user.fullName.split(' ')[0]}  ${
          item.user.fullName.split(' ')[1]
        }`
      : `${item.user.fullName}`;
  // --------------------------
  // ----------- Toggle Role Assign Modal -----------
  // --------------------------
  const [isRoleAssignModalVisible, setRoleAssignModalVisible] = useState(false);
  const toggleRoleAssignModal = () => {
    setRoleAssignModalVisible(!isRoleAssignModalVisible);
  };

  // --------------------------
  // ----------- Chat Mute modal -----------
  // --------------------------
  const [isMuteModalVisible, setMuteModalVisible] = useState(false);
  const toggleMuteModal = () => {
    setMuteModalVisible(!isMuteModalVisible);
  };
  // --------------------------
  // ----------- Chat Mute modal -----------
  // --------------------------
  const [isChatUnmuteModalVisible, setChatUnmuteModalVisible] = useState(false);
  const toggleChatUnmuteModal = () => {
    setChatUnmuteModalVisible(!isChatUnmuteModalVisible);
  };

  // --------------------------
  // ----------- Toggle Block Member Modal -----------
  // --------------------------
  const [isBlockMemberModalVisible, setBlockMemberModalVisible] =
    useState(false);
  const toggleBlockMemberModal = () => {
    setBlockMemberModalVisible(!isBlockMemberModalVisible);
  };
  // --------------------------
  // ----------- Toggle Remove Member Modal -----------
  // --------------------------
  const [isRemoveMemberModalVisible, setRemoveMemberModalVisible] =
    useState(false);
  const toggleRemoveMemberModal = () => {
    setRemoveMemberModalVisible(!isRemoveMemberModalVisible);
  };

  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  return (
    <View
      style={[
        styles.container,
        {borderTopColor: index ? Colors.BorderColor : Colors.White},
      ]}>
      {/* -------------------------- */}
      {/* ----------- Profile Image ----------- */}
      {/* -------------------------- */}
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          {item?.user?.profilePicture ? (
            <Image
              style={styles.profileImage}
              source={
                {uri: item?.user?.profilePicture}
                // : require("../../../assets/Images/user.png")
              }
            />
          ) : (
            <NewUserIcons />
          )}
        </View>
        <View>
          <Text style={[styles.profileName]}>
            {name}
            {item?.role === 'member' || (
              <Text style={styles.roleText}>{` (${item.role})`}</Text>
            )}
            {item?.isBlocked ? (
              <Text style={styles.blockText}> (Blocked)</Text>
            ) : null}
            {item?.mute?.isMuted ? (
              <Text style={styles.blockText}> (Muted)</Text>
            ) : null}
          </Text>
          <Text
            style={[
              styles.status,
              {
                color:
                  new Date(item?.user?.lastActive) > new Date()
                    ? '#06AC6D'
                    : Colors.BodyText,
              },
            ]}>
            {item?.user?.lastActive
              ? moment(item?.user?.lastActive).fromNow()
              : 'N/A'}
          </Text>
        </View>
      </View>

      {true ? (
        <TouchableOpacity
          style={styles.threeDotIcon}
          // ref={touchableRef}
          // onPress={openPopover}
          onPress={() => {
            dispatch(setSelectedMembers(item));
          }}
          activeOpacity={0.5}>
          <View
            style={{
              paddingHorizontal: 1,
              borderRadius: 100,
            }}>
            <ThreeDotGrayIcon />
          </View>
        </TouchableOpacity>
      ) : null}

      <Popover
        contentStyle={styles.content}
        arrowStyle={styles.arrow}
        backgroundStyle={{backgroundColor: Colors.BackDropColor}}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        placement="auto"
        duration={0}
        supportedOrientations={['portrait', 'landscape']}>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                toggleRoleAssignModal();
                closePopover();
              }}>
              <View style={styles.iconAndTextContainer}>
                <AddUsers />
                <Text style={styles.buttonText}>Role</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* -------------------------- */}
          {/* ----------- Chat mute modal ----------- */}
          {/* -------------------------- */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() =>
                item?.mute?.isMuted
                  ? [toggleChatUnmuteModal(), closePopover()]
                  : [toggleMuteModal(), closePopover()]
              }>
              <View style={styles.iconAndTextContainer}>
                <VolumeMute />
                <Text style={styles.buttonText}>
                  {item?.mute?.isMuted ? 'Unmute' : 'Mute'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* -------------------------- */}
          {/* ----------- Block Member modal ----------- */}
          {/* -------------------------- */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                toggleBlockMemberModal();
                closePopover();
              }}>
              <View style={styles.iconAndTextContainer}>
                <BlockIcon />
                <Text style={styles.buttonText}>
                  {item.isBlocked ? 'Unblock' : 'Block'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonContainer, {borderBottomWidth: 0}]}>
            <TouchableOpacity
              onPress={() => {
                toggleRemoveMemberModal();
                closePopover();
              }}>
              <View style={styles.iconAndTextContainer}>
                <BinIcon />
                <Text style={styles.buttonText}>Remove</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Popover>

      {/* -------------------------- */}
      {/* ----------- Role Assign Modal ----------- */}
      {/* -------------------------- */}
      <RoleAssignModal
        fullName={name}
        item={item}
        fetchMembers={fetchMembers}
        toggleRoleAssignModal={toggleRoleAssignModal}
        isRoleAssignModalVisible={isRoleAssignModalVisible}
      />
      {/* -------------------------- */}
      {/* ----------- Chat mute and unmute modal ----------- */}
      {/* -------------------------- */}
      {/* Chat Mute modal */}
      {/* {item?.mute?.isMuted ? ( */}
      <ChatUnmuteModal
        fullName={name}
        toggleChatUnmuteModal={toggleChatUnmuteModal}
        isChatUnmuteModalVisible={isChatUnmuteModalVisible}
        item={item}
        fetchMembers={fetchMembers}
        muteMessage={muteMessage}
        value={value}
      />
      {/* // ) : ( */}
      <ChatMuteModal
        fullName={name}
        toggleMuteModal={toggleMuteModal}
        isMuteModalVisible={isMuteModalVisible}
        item={item}
        fetchMembers={fetchMembers}
        muteMessage={muteMessage}
        value={value}
        setMuteMessage={setMuteMessage}
        setValue={setValue}
      />
      {/* )} */}
      {/* -------------------------- */}
      {/* ----------- Block member modal ----------- */}
      {/* -------------------------- */}
      {/* Block Member Modal */}
      <BlockMemberModal
        toggleBlockMemberModal={toggleBlockMemberModal}
        isBlockMemberModalVisible={isBlockMemberModalVisible}
        item={item}
        fetchMembers={fetchMembers}
      />
      {/* -------------------------- */}
      {/* ----------- Remove member modal ----------- */}
      {/* -------------------------- */}
      {isRemoveMemberModalVisible && (
        <RemoveMemberModal
          toggleRemoveMemberModal={toggleRemoveMemberModal}
          isRemoveMemberModalVisible={isRemoveMemberModalVisible}
          item={item}
          chat={chat}
          fetchMembers={fetchMembers}
          setLoading={setLoading}
        />
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    roleText: {
      color: Colors.BodyText,
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    blockText: {
      color: Colors.PrimaryRed,
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      textTransform: 'capitalize',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1),
      borderTopWidth: 1,
      borderTopColor: Colors.BorderColor,
    },
    profileImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      backgroundColor: Colors.BodyText,
    },
    profileName: {
      fontSize: responsiveScreenFontSize(1.8),
      width: responsiveScreenWidth(60),
      fontFamily: CustomeFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    status: {
      color: 'rgba(11, 42, 70, 1)',
      fontSize: responsiveScreenFontSize(1.8),
      paddingVertical: responsiveScreenHeight(0.2),
      fontFamily: CustomeFonts.REGULAR,
    },
    commentsTime: {
      color: 'rgba(111, 116, 124, 1)',
      fontSize: responsiveScreenFontSize(1.9),
    },
    // --------------------------
    // ----------- Popup modal -----------
    // --------------------------
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      fontFamily: CustomeFonts.REGULAR,
    },
    iconAndTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    buttonContainer: {
      paddingVertical: responsiveScreenHeight(1.2),
      paddingHorizontal: responsiveScreenWidth(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },

    content: {
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
      backgroundColor: Colors.White,
    },
    arrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(9),
    },
  });
