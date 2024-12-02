import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {useTheme} from '../../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import NotifyBell from '../../../assets/Icons/NotifyBell';
import CustomFonts from '../../../constants/CustomFonts';
import ShareIcon from '../../../assets/Icons/ShareIcon';
import UsersIconsTwo from '../../../assets/Icons/UsersIconTwo';
import UserIconTwo from '../../../assets/Icons/UserIconTwo';
import {handleOpenLink} from '../../HelperFunction';
import Markdown from 'react-native-markdown-display';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setEventNotification,
  setSingleEvent,
} from '../../../store/reducer/calendarReducer';
import {eventTypes, onShare} from '../../../utility/commonFunction';
import Images from '../../../constants/Images';
import {getEventDetails, getNotificationData} from '../../../actions/chat-noti';
import LoadingSmall from '../../SharedComponent/LoadingSmall';
import EventHistory from '../EventHistory';

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
  if (!markdownText) return markdownText;

  // Define a regular expression to match markdown links
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Loop until all markdown links are replaced
  let match;
  while ((match = markdownLinkRegex.exec(markdownText)) !== null) {
    markdownText = markdownText.replace(markdownLinkRegex, '$2');
  }

  return markdownText.split('](')[0];
}

const EventDetailsModal = ({
  isEventDetailsModalVisible,
  toggleEventDetailsModal,
  eventId,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const {event: item, eventNotification} = useSelector(state => state.calendar);
  useEffect(() => {
    getEventDetails(eventId, setIsLoading);
    getNotificationData(eventId);
  }, []);

  const dispatch = useDispatch();
  // console.log("item", JSON.stringify(item, null, 1));
  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isEventDetailsModalVisible}
      onBackdropPress={() => {
        toggleEventDetailsModal();
        dispatch(
          setEventNotification([
            {
              timeBefore: 5,
              methods: ['push'],
              chatGroups: [],
            },
          ]),
        );
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalStyle}>
          <ModalBackAndCrossButton
            toggleModal={() => {
              dispatch(setSingleEvent(null));
              dispatch(
                setEventNotification([
                  {
                    timeBefore: 5,
                    methods: ['push'],
                    chatGroups: [],
                  },
                ]),
              );
              toggleEventDetailsModal();
            }}
          />

          {isLoading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LoadingSmall />
            </View>
          ) : (
            <ScrollView>
              <Text style={styles.EventDetailsHeadingTitle}>Event Details</Text>
              <Text style={styles.EventHeading}>{item?.title}</Text>
              <Text style={styles.eventType}>
                Event Type: {eventTypes(item?.eventType)}
              </Text>
              <Text style={styles.time}>
                Start Time: {moment(item?.start).format('MMM DD, YYYY h:mm A')}
              </Text>
              <Text style={styles.time}>
                End Time: {moment(item?.end).format('MMM DD, YYYY h:mm A')}
              </Text>
              <Text style={styles.joinLinkHeading}>Meeting Join Link</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                  // backgroundColor: "red",
                  width: '100%',
                }}>
                {item?.meetingLink ? (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        handleOpenLink(removeMarkdown(item?.meetingLink))
                      }>
                      <Text style={styles.meetingLinkText}>
                        {removeMarkdown(item?.meetingLink)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginRight: responsiveScreenWidth(3)}}
                      onPress={() =>
                        onShare(removeMarkdown(item?.meetingLink))
                      }>
                      <ShareIcon />
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.time}>No Meeting link available</Text>
                )}
              </View>
              <View
                style={[
                  styles.smallContainer,
                  {marginVertical: responsiveScreenHeight(2)},
                ]}>
                <NotifyBell color={Colors.Heading} />
                <Text style={styles.NoReaminder}>
                  {eventNotification[0]?.timeBefore
                    ? `Remainder before ${eventNotification[0]?.timeBefore} minutes`
                    : `Remainder before 5 minutes`}
                </Text>
              </View>
              <View
                style={[
                  styles.smallContainer,
                  {marginBottom: responsiveScreenHeight(1.5)},
                ]}>
                <UsersIconsTwo color={Colors.Heading} />
                <Text style={styles.NoReaminder}>
                  {item?.participants?.length} Invited Guest
                </Text>
              </View>
              {item?.participants?.map((singleItem, index) => (
                <View
                  key={index}
                  style={[
                    styles.smallContainer,
                    {marginBottom: responsiveScreenHeight(1)},
                  ]}>
                  {(
                    <Image
                      source={
                        singleItem?.user?.profilePicture
                          ? {
                              uri: singleItem?.user?.profilePicture,
                            }
                          : Images.DEFAULT_IMAGE
                      }
                      // height={10}
                      // width={10}
                      style={styles.images}
                    />
                  ) || <UserIconTwo />}
                  <Text style={styles.meetingLinkText}>
                    {singleItem?.user?.fullName}
                  </Text>
                </View>
              ))}

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
                  {item?.createdBy?.fullName}
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
              {/* <TextArea
              readOnly={true}
              placeholderText={item?.description || "Meeting Agenda"}
              setState={setMeetingAgenda}
            /> */}
              <View style={[styles.inputContainer]}>
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
              {/* <TextArea
              readOnly={true}
              placeholderText={item?.followUp || "Follow Up Message"}
              setState={setFollowUpMessage}
            /> */}
              <Text style={[styles.textAreaHeading]}>Action Item</Text>
              <View style={styles.inputContainer}>
                <Markdown style={styles.markdownStyle}>
                  {item?.actionItems || 'Action Item'}
                </Markdown>
              </View>
              {/* <TextArea
              readOnly={true}
              placeholderText={item?.actionItems || "Action Item"}
              setState={setActionItem}
            /> */}
              <Text style={styles.Text}>Event Changed History</Text>
              <EventHistory event={item} />
            </ScrollView>
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default EventDetailsModal;
const getStyles = Colors =>
  StyleSheet.create({
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginVertical: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputContainer: {
      flex: 1,
      width: '100%',
      // height: responsiveScreenHeight(6),
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      borderWidth: 1,
      marginTop: responsiveScreenHeight(1),
      // flexDirection: "row",
      alignItems: 'flex-start',
      paddingLeft: responsiveScreenWidth(3),
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
        width: responsiveScreenWidth(75),
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
        // backgroundColor: "yellow",
      },
      heading1: {
        flex: 1,
        width: responsiveScreenWidth(75),
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        flex: 1,
        width: responsiveScreenWidth(75),
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        flex: 1,
        width: responsiveScreenWidth(75),
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        flex: 1,
        width: responsiveScreenWidth(75),
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        flex: 1,
        width: responsiveScreenWidth(75),
        color: Colors.Primary,
        // marginBottom: 100,
      },
      blockquote: {
        flex: 1,
        width: responsiveScreenWidth(75),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        flex: 1,
        width: responsiveScreenWidth(75),
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        flex: 1,
        width: responsiveScreenWidth(75),
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
      textTransform: 'capitalize',
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
