import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ArrowLeft from '../../../assets/Icons/ArrowLeft';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import ModalCustomButton from './ModalCustomButton';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {removeChat} from '../../../store/reducer/chatReducer';
import {showToast} from '../../HelperFunction';
import {useNavigation} from '@react-navigation/native';
import {setCurrentRoute} from '../../../store/reducer/authReducer';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';

const LeaveCrowdModal = ({toggleLeaveCrowdModal, isLeaveCrowdModalVisible}) => {
  const {singleChat: chat} = useSelector(state => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const handleLeaveCrowed = async () => {
    try {
      const res = await axiosInstance.patch(`/chat/channel/leave/${chat?._id}`);
      console.log('res.data', JSON.stringify(res.data, null, 1));
      if (res.data?.success) {
        toggleLeaveCrowdModal();
        dispatch(setCurrentRoute(null));
        navigation.navigate('HomeStack', {screen: 'NewChatScreen'});
        dispatch(removeChat(chat?._id));
        showToast('Leave successfully...');
      }
    } catch (error) {
      console.error('Error leaving crowd:', error);
      // Handle any errors that occurred during the request here
    }
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isLeaveCrowdModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          {/* Modal Back Button */}
          <View style={styles.topBarContainer}>
            <TouchableOpacity
              onPress={toggleLeaveCrowdModal}
              style={styles.arrow}>
              <ArrowLeft />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={toggleLeaveCrowdModal}>
              <CrossIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomBorder}></View>
          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.mainContentText}>
              Do you want to leave this crowd?
            </Text>
            <View>
              <Text style={styles.mainContentDescription}>
                Only Crowds admin will be notified that you left the Crowd.
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={toggleLeaveCrowdModal}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            <ModalCustomButton
              toggleModal={handleLeaveCrowed}
              textColor={Colors.PureWhite}
              backgroundColor="#27ac1f"
              buttonText="Leave"
            />
          </View>
        </View>
      </View>
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default LeaveCrowdModal;

const getStyles = Colors =>
  StyleSheet.create({
    // ------------------
    // Main Content
    mainContentText: {
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    mainContentDescription: {
      textAlign: 'center',
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(2),
      marginHorizontal: responsiveScreenWidth(5),
    },
    mainContent: {
      alignItems: 'center',
      gap: responsiveScreenHeight(1.5),
      paddingTop: responsiveScreenHeight(2.5),
    },
    // bottom border
    bottomBorder: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    // Cancel and the back button.................
    topBarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '100%',
      marginBottom: responsiveScreenHeight(2),
    },
    arrow: {
      paddingBottom: responsiveScreenHeight(0.8),
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      color: 'red',
    },
    backButtonText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    cancelButton: {
      backgroundColor: Colors.ModalBoxColor,
      padding: responsiveScreenWidth(2.5),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },

    //   Main container...............
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalChild: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingBottom: responsiveScreenHeight(0),
      paddingTop: responsiveScreenHeight(2),
    },

    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
      paddingVertical: responsiveScreenHeight(2.5),
    },
  });
