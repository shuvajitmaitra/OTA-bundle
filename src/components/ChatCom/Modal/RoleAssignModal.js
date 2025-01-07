import {StyleSheet, Text, ToastAndroid, View} from 'react-native';
import React from 'react';
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
import {showToast} from '../../HelperFunction';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';

export default function RoleAssignModal({
  toggleRoleAssignModal,
  isRoleAssignModalVisible,
  fullName,
  item,
  fetchMembers,
}) {
  const [value, setValue] = React.useState('admin');

  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const roleOptions = [
    {label: 'Admin', value: 'admin'},
    {label: 'Moderator', value: 'moderator'},
    {label: 'Member', value: 'member'},
  ];

  const handleRoleAssignModal = () => {
    toggleRoleAssignModal();
    axiosInstance
      .post(`/chat/member/update`, {
        actionType: 'role',
        member: item?._id,
        chat: item?.chat,
        role: value,
      })
      .then(res => {
        if (res.data?.success) {
          showToast({message: `Assigned as ${value}`});
          fetchMembers();
          //   console.log("item", item);
        }
      });
  };
  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isRoleAssignModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton toggleModal={toggleRoleAssignModal} />
          <View style={styles.modalHeading}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.modalHeadingText}>
              Role Options for {fullName}
            </Text>
            <Text style={styles.headingDescription}>
              Choose the role you wish to give to {fullName}.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <GlobalRadioGroup
              options={roleOptions}
              selectedValue={value}
              onSelect={setValue}
            />
          </View>
          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={toggleRoleAssignModal}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            <ModalCustomButton
              toggleModal={handleRoleAssignModal}
              textColor={Colors.PureWhite}
              backgroundColor="#27ac1f"
              buttonText="Save"
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      width: responsiveScreenWidth(90),
      justifyContent: 'center',
    },

    modalChild: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      maxHeight: responsiveScreenHeight(80),
    },
    modalHeading: {
      justifyContent: 'flex-start',
      paddingTop: responsiveScreenHeight(1.7),
      gap: responsiveScreenWidth(2),
    },
    modalArrowIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: 'rgba(71, 71, 72, 1)',
    },
    modalHeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    headingDescription: {
      color: Colors.BodyText,
      width: '100%',
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
    },
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonGroup: {
      borderBottomWidth: 1,
      borderColor: Colors.BorderColor,
      paddingTop: responsiveScreenHeight(2),
      paddingBottom: responsiveScreenHeight(2.5),
      paddingLeft: responsiveScreenWidth(2),
    },
    radioText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.9),
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingTop: responsiveScreenHeight(2.2),
    },
  });
