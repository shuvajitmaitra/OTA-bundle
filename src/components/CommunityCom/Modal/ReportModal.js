import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';

import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import ModalCustomButton from '../../ChatCom/Modal/ModalCustomButton';
import TextArea from '../../Calendar/Modal/TextArea';
import {handleError} from '../../../actions/chat-noti';
import {useDispatch, useSelector} from 'react-redux';
import {
  filterPosts,
  setReported,
  setSinglePost,
} from '../../../store/reducer/communityReducer';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';
import {showAlertModal} from '../../../utility/commonFunction';
import {showToast} from '../../HelperFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import {RegularFonts} from '../../../constants/Fonts';

export default function ReportModal({setIsModalVisible, isModalVisible, post}) {
  const {filterValue} = useSelector(state => state.community);
  const [report, setReport] = useState({
    post: post._id,
    action: 'report',
    reportReason: 'spam',
    note: '',
  });

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const itemList = [
    {id: 1, label: 'Spam or Scam', value: 'spam'},
    {id: 2, label: 'Bullying or Harassment', value: 'harassment'},
    {id: 3, label: 'Impersonation', value: 'impersonation'},
    {id: 4, label: 'Privacy Violation', value: 'privacyViolation'},
    {id: 5, label: 'Hate Speech or Discrimination', value: 'hateSpeech'},
    {id: 6, label: 'Other', value: 'other'},
  ];

  // const [selectedId, setSelectedId] = useState(1);
  const dispatch = useDispatch();

  const handleReport = async () => {
    // showToast({message: 'Reported successfully'});
    // console.log("post._id", JSON.stringify(post._id, null, 1));
    // dispatch(filterPosts(post._id));
    try {
      await axiosInstance
        .post('/content/community/post/option/save', report)
        .then(res => {
          // console.log('res.data', JSON.stringify(res.data, null, 1));
          if (!res.data.postOption) {
            setIsModalVisible(prev => !prev);
            dispatch(setSinglePost(null));
            return;
          }
          if (res.data?.postOption?._id) {
            showToast({message: 'Reported successfully'});
            // dispatch(setReported(post._id));
            setIsModalVisible(prev => !prev);
            dispatch(setSinglePost(null));
            // showAlertModal('Reported successfully');
            console.log('Report successful');
          } else {
            console.warn('Unexpected response structure:', res.data);
            showAlertModal('Report removed!');
            setIsModalVisible(prev => !prev);
            dispatch(setSinglePost(null));
          }
        })
        .catch(error => {
          console.log(
            'error to report',
            JSON.stringify(error.response.data, null, 1),
          );
        });
    } catch (error) {
      handleError(error);
      console.error('An error occurred while reporting:', error);
    }
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: Colors.BorderColor,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                fontSize: RegularFonts.HS,
                fontFamily: CustomFonts.SEMI_BOLD,
                color: Colors.Heading,
              }}>
              Report post
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <CrossCircle size={35} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalHeading}>
            <Text style={styles.modalHeadingText}>
              Please tell us why you want to report this post! (optional)
            </Text>
            <Text style={styles.headingDescription}>
              Post Title: {post?.title}
            </Text>
          </View>

          {/* Replacing RadioGroup with globalRadio */}
          <GlobalRadioGroup
            options={itemList}
            selectedValue={report.reportReason}
            onSelect={value =>
              setReport(prev => ({...prev, reportReason: value}))
            }
          />

          <TextArea
            placeholderText={'Leave a note...'}
            setState={text => {
              setReport(pre => ({...pre, note: text}));
            }}
            state={report.note}
          />
          <View style={styles.buttonContainer}>
            <ModalCustomButton
              toggleModal={setIsModalVisible}
              textColor="#27ac1f"
              backgroundColor="rgba(39, 172, 31, 0.1)"
              buttonText="Cancel"
            />
            <ModalCustomButton
              toggleModal={handleReport}
              textColor={Colors.PureWhite}
              backgroundColor="#27ac1f"
              buttonText="Submit!"
            />
          </View>
        </View>
        <Toast config={toastConfig} />
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
