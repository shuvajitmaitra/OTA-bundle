import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import Markdown from 'react-native-markdown-display';
import moment from 'moment';
import axiosInstance from '../../../utility/axiosInstance';
import {useDispatch} from 'react-redux';
import {
  setNewEvent,
  updateInvitations,
} from '../../../store/reducer/calendarReducer';
import InvitationDeniedModal from './InvitationDeniedModal';
import ProposeNewTimeModal from './ProposeNewTimeModal';
import Images from '../../../constants/Images';
import {showToast} from '../../HelperFunction';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../../../constants/ToastConfig';

export function EventDetailsFormatDate(dateString) {
  const options = {
    month: 'short',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

function removeMarkdown(markdownText) {
  return markdownText?.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2');
}

const InvitationsDetailsModal = ({
  item,
  isInvitationsDetailsModalVisible,
  toggleInvitationsDetailsModal,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const [isDeniedModalVisible, setIsDeniedModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [isProposeNewTimeVisible, setIsProposeNewTimeVisible] = useState(false);
  const toggleProposeNewTime = useCallback(() => {
    setIsProposeNewTimeVisible(!isProposeNewTimeVisible);
  }, [isProposeNewTimeVisible]);

  const handleEvent = payload => {
    axiosInstance
      .patch(`/calendar/event/invitation/${item._id}`, payload)
      .then(res => {
        if (res.data.success) {
          dispatch(
            setNewEvent({
              event: item,
              time: moment(item?.start).format('YYYY-M-D'),
            }),
          );
          dispatch(updateInvitations({id: item._id}));
          toggleInvitationsDetailsModal();
          showToast({message: 'Event accepted'});
        }
      })
      .catch(error => {
        console.log('error accept invitation', JSON.stringify(error, null, 1));
      });
  };

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isInvitationsDetailsModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          <ModalBackAndCrossButton
            toggleModal={toggleInvitationsDetailsModal}
          />

          <ScrollView>
            <Text style={styles.EventDetailsHeadingTitle}>
              Invited Event Details
            </Text>
            <Text style={styles.EventHeading}>{item?.title}</Text>
            <Text style={styles.eventType}>
              Event Type:{' '}
              {(item?.eventType === 'showNTell' && 'Show N Tell') ||
                (item?.eventType === 'mockInterview' && 'Mock Interview') ||
                (item?.eventType === 'orientation' && 'Orientation Meeting') ||
                (item?.eventType === 'technicalInterview' &&
                  'Technical Interview') ||
                (item?.eventType === 'behavioralInterview' &&
                  'Behavioral Interview') ||
                (item?.eventType === 'reviewMeeting' && 'Review Meeting') ||
                (item?.eventType === 'syncUp' && 'Sync up Call') ||
                (item?.eventType === 'other' && 'Others')}
            </Text>
            <Text style={styles.time}>
              Start Time: {moment(item?.start).format('MMM DD, YYYY h:mm A')}
            </Text>
            <Text style={styles.time}>
              End Time: {moment(item?.end).format('MMM DD, YYYY h:mm A')}
            </Text>

            <Text style={styles.joinLinkHeading}>Organizer</Text>
            <View
              style={[
                styles.smallContainer,
                {
                  marginBottom: responsiveScreenHeight(1),
                  marginTop: responsiveScreenHeight(1),
                },
              ]}>
              <Image
                source={
                  item?.createdBy?.profilePicture
                    ? {
                        uri: item?.createdBy?.profilePicture,
                      }
                    : Images.DEFAULT_IMAGE
                }
                // height={25}
                // width={25}
                style={styles.images}
              />
              <Text style={styles.meetingLinkText}>
                {item?.createdBy?.fullName || 'N/A'}
              </Text>
            </View>
            <Text style={styles.textAreaHeading}>My Response</Text>
            <Text
              style={[
                styles.meetingLinkText,
                {
                  color:
                    item?.myParticipantData?.status === 'accepted'
                      ? Colors.Primary
                      : item?.myParticipantData?.status === 'pending'
                      ? Colors.ThemeSecondaryColor
                      : Colors.Red,
                },
              ]}>
              {item?.myParticipantData?.status}
            </Text>

            <Text style={[styles.textAreaHeading]}>Meeting Agenda</Text>
            <View style={styles.inputContainer}>
              <Markdown style={styles.markdownStyle}>
                {item?.agenda || 'Meeting Agenda'}
              </Markdown>
            </View>
            <Text style={[styles.textAreaHeading]}>Follow Up Message</Text>
            <View style={styles.inputContainer}>
              <Markdown style={styles.markdownStyle}>
                {item?.followUp || 'Follow Up Message'}
              </Markdown>
            </View>
            <Text style={[styles.textAreaHeading]}>Action Item</Text>
            <View style={styles.inputContainer}>
              <Markdown style={styles.markdownStyle}>
                {item?.actionItems || 'Action Item'}
              </Markdown>
            </View>
            <View style={styles.buttonParenCom}>
              <TouchableOpacity
                onPress={() =>
                  handleEvent({
                    action: 'status',
                    participantId: item?.myParticipantData?._id,
                    status: 'accepted',
                  })
                }
                style={[
                  styles.buttonContainer,
                  {flex: 0.25, backgroundColor: Colors.PrimaryOpacityColor},
                ]}>
                <Text style={[styles.buttonText, {color: Colors.Primary}]}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsDeniedModalVisible(true);
                  setId(item._id);
                }}
                style={[
                  styles.buttonContainer,
                  {flex: 0.25, backgroundColor: Colors.LightRed},
                ]}>
                <Text style={[styles.buttonText, {color: Colors.Red}]}>
                  Denied
                </Text>
              </TouchableOpacity>
              <Pressable
                onPress={() => {
                  toggleProposeNewTime();
                  setId(item._id);
                }}
                style={[
                  styles.buttonContainer,
                  {flex: 0.5, backgroundColor: Colors.CyanOpacity},
                ]}>
                <Text style={[styles.buttonText, {color: Colors.PureCyan}]}>
                  Proposed new time
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
      <InvitationDeniedModal
        id={id}
        participantId={item?.myParticipantData?._id}
        toggleInvitationsDetailsModal={toggleInvitationsDetailsModal}
        isDeniedModalVisible={isDeniedModalVisible}
        setIsDeniedModalVisible={setIsDeniedModalVisible}
      />
      <ProposeNewTimeModal
        id={id}
        participantId={item?.myParticipantData?._id}
        toggleInvitationsDetailsModal={toggleInvitationsDetailsModal}
        isProposeNewTimeVisible={isProposeNewTimeVisible}
        toggleProposeNewTime={toggleProposeNewTime}
      />
      <Toast config={toastConfig} />
    </ReactNativeModal>
  );
};

export default InvitationsDetailsModal;
const getStyles = Colors =>
  StyleSheet.create({
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    buttonContainer: {
      backgroundColor: 'red',
      // paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 4,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonParenCom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      justifyContent: 'center',
    },
    inputContainer: {
      width: '100%',
      // height: responsiveScreenHeight(6),
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      // flexDirection: "row",
      alignItems: 'flex-start',
      paddingHorizontal: responsiveScreenWidth(4),
      borderColor: Colors.BorderColor,
      minHeight: responsiveScreenHeight(10),
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
        // backgroundColor: "yellow",
      },
      heading1: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        width: responsiveScreenWidth(73),
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        width: responsiveScreenWidth(73),
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        width: responsiveScreenWidth(73),
        color: Colors.Primary,
        // marginBottom: 100,
      },
      blockquote: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        width: responsiveScreenWidth(73),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    },
    textAreaHeading: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.MEDIUM,
      marginTop: responsiveScreenHeight(2),
    },
    NoReaminder: {
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    noteTitle: {
      fontSize: responsiveScreenFontSize(1.9),
      paddingVertical: responsiveScreenWidth(4),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    noteTextArea: {
      backgroundColor: Colors.ModalBoxColor,
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(0.6),
      paddingBottom: responsiveScreenHeight(7),
      marginBottom: responsiveScreenHeight(1.4),
      borderRadius: responsiveScreenWidth(3),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      fontSize: responsiveScreenFontSize(1.9),
    },
    images: {
      borderRadius: 100,
      height: responsiveScreenWidth(7),
      width: responsiveScreenWidth(7),
    },
    smallContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 5,
      alignItems: 'center',
    },
    meetingLinkText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      maxWidth: '90%',
      // backgroundColor: "red",
      //   fontSize: responsiveScreenFontSize(2),
    },

    joinLinkHeading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      marginTop: responsiveScreenHeight(3),
      marginBottom: responsiveScreenHeight(0.5),
      fontSize: responsiveScreenFontSize(2),
    },
    time: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(-0.5),
    },
    eventType: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: responsiveScreenHeight(1),
    },
    EventHeading: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(1.5),
    },
    EventDetailsHeadingTitle: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.7),
      fontFamily: CustomFonts.SEMI_BOLD,
      marginTop: responsiveScreenHeight(1),
    },
    modalContainer: {
      marginTop: responsiveScreenHeight(6),
      maxHeight: responsiveScreenHeight(80),
    },
    modalStyle: {
      borderRadius: 15,
      backgroundColor: Colors.White,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      marginBottom: responsiveScreenHeight(3),
      width: responsiveScreenWidth(90),
      minHeight: responsiveScreenHeight(69.5),
      maxHeight: responsiveScreenHeight(80),
    },
  });
