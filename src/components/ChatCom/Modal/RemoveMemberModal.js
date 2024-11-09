import {View, Text, StyleSheet, ToastAndroid, Alert} from 'react-native';
import React, {memo, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';

import ModalCustomButton from './ModalCustomButton';
import CustomFonts from '../../../constants/CustomFonts';
import ModalBackAndCrossButton from './ModalBackAndCrossButton';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {useDispatch} from 'react-redux';
import {updateMembersCount} from '../../../store/reducer/chatReducer';
import {useGlobalAlert} from '../../SharedComponent/GlobalAlertContext';

const RemoveMemberModal = ({
  toggleRemoveMemberModal,
  isRemoveMemberModalVisible,
  item,
  fetchMembers,
  chat,
  setLoading,
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  const handleRemoveUser = () => {
    setLoading(true);
    toggleRemoveMemberModal();
    axiosInstance
      .patch(`/chat/channel/remove-user/${item?.chat}`, {
        member: item?._id,
      })
      .then(res => {
        if (res.data?.success) {
          setLoading(false);
          showAlert({
            title: 'Removed successfully',
            type: 'success',
          });
          fetchMembers();
          dispatch(
            updateMembersCount({
              _id: chat._id,
              membersCount: chat.membersCount - 1,
            }),
          );
        }
      })
      .catch(error => {
        setLoading(false);
        showAlert({
          title: 'Warning',
          type: 'warning',
          message: 'Something went wrong...',
        });
        console.log('🚀 ~ handleRemoveUser ~ error', error);
      });
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={Boolean(isRemoveMemberModalVisible)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton
            toggleModal={() => toggleRemoveMemberModal()}
          />
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>
              Would you like to remove this member?
            </Text>
            <Text style={styles.headingDescription}>
              Only Crowd admin can remove this member.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={toggleRemoveMemberModal}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            <ModalCustomButton
              toggleModal={handleRemoveUser}
              textColor={Colors.PureWhite}
              backgroundColor="#27ac1f"
              buttonText="Ok"
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default memo(RemoveMemberModal);

const getStyles = Colors =>
  StyleSheet.create({
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },

    modalChild: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      alignItems: 'center',
    },
    modalHeading: {
      alignItems: 'center',
      paddingTop: responsiveScreenHeight(1.7),
      gap: responsiveScreenWidth(2),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: 'rgba(71, 71, 72, 1)',
    },
    modalHeadingText: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      textAlign: 'center',
    },
    headingDescription: {
      color: Colors.BodyText,
      paddingHorizontal: responsiveScreenWidth(5),
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.7),
      fontFamily: CustomFonts.REGULAR,
    },
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingTop: responsiveScreenHeight(2.5),
    },
  });
