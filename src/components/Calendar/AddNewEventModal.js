import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import ReactNativeModal from 'react-native-modal';
import ModalBackAndCrossButton from '../ChatCom/Modal/ModalBackAndCrossButton';
import CustomDropDown from '../SharedComponent/CustomDropDown';
import BinIcon from '../../assets/Icons/BinIcon';
import CustomButton from './CustomButton';
import InviteMemberModal from './Modal/InviteMemberModal';
import moment from 'moment';
import axiosInstance from '../../utility/axiosInstance';
import {loadCalendarEvent} from '../../actions/chat-noti';
import {useDispatch, useSelector} from 'react-redux';
import CustomTimePicker from '../SharedComponent/CustomTimePicker';
import Loading from '../SharedComponent/Loading';
import {
  setEventNotification,
  setNewEvent,
  updatePickedDate,
} from '../../store/reducer/calendarReducer';
import UpdateEventNotificationContainer from './UpdateEventNotificationContainer';
import {
  combineDateAndTime,
  eventTypes,
  showAlertModal,
} from '../../utility/commonFunction';
import {eventTypeOptions} from '../../constants/CustomeData';
import DateTimeSection from './DateTimeSection';
import EventRepeatSection from './Modal/EventRepeatSection';
import Images from '../../constants/Images';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import RequireFieldStar from '../../constants/RequireFieldStar';

const AddNewEventModal = ({
  modalVisible,
  setModalVisible,
  event: eventData,
  setUpdateModalVisible,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {groupNameId} = useSelector(state => state.chat);

  const {pickedDate, eventNotification} = useSelector(state => state.calendar);

  const [event, setEvent] = useState({});
  // console.log("event////////////////", JSON.stringify(event, null, 1));

  const notifications = !eventNotification?.length
    ? [
        {
          timeBefore: 5,
          methods: ['push'],
          chatGroups: [],
        },
      ]
    : eventNotification;
  useEffect(() => {
    setEvent(pre => ({...pre, notifications}));
  }, [eventNotification]);
  const dispatch = useDispatch();
  useEffect(() => {
    setEvent(eventData);
    setEvent(pre => ({
      ...pre,
      start: pickedDate
        ? moment(pickedDate).add(15, 'minutes')
        : moment().add(15, 'minutes'),
      end: pickedDate
        ? moment(pickedDate).add(45, 'minutes')
        : moment().add(45, 'minutes'),
      isAllDay: false,
      timeRange: {
        turnOn: false,
        repeatIteration: 1,
        repeatPeriod: 'week',
        repeatDays: [],
      },
    }));
  }, [eventData]);

  const [isRepeatClicked, setIsRepeatClicked] = useState(false);
  const [isInviteMemberModalVisible, setIsInviteMemberModalVisible] =
    useState(false);
  const [invitations, setInvitations] = useState(
    eventData?.participants?.map(item => item.user),
  );

  // const [guestId, setGuestId] = useState([]);

  // console.log("invitations", JSON.stringify(invitations, null, 1));

  useEffect(() => {
    setInvitations(eventData?.participants?.map(item => item.user));
  }, [eventData?.participants]);
  const [weekDays, setWeekDays] = useState([
    {day: 'Su'},
    {day: 'Mo'},
    {day: 'Tu'},
    {day: 'We'},
    {day: 'Th'},
    {day: 'Fr'},
    {day: 'Sa'},
  ]);
  const [pickerState, setPickerState] = useState('date');
  const [timeMode, setTimeMode] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const toggleInviteMemberModal = useCallback(() => {
    setIsInviteMemberModalVisible(prev => !prev);
  }, []);

  useEffect(() => {
    if (event?._id && event?.timeRange?.repeatDays) {
      setWeekDays(
        weekDays.map((item, idx) =>
          event?.timeRange?.repeatDays?.includes(idx)
            ? {...item, checked: !item.checked}
            : item,
        ),
      );
    }
  }, []);

  const handleResetButton = () => {
    setEvent(pre => ({
      ...pre,
      timeRange: {
        ...pre.timeRange,
        repeatDays: [],
        turnOn: false,
        repeatPeriod: 'week',
      },
    }));
    setWeekDays([
      {day: 'Su'},
      {day: 'Mo'},
      {day: 'Tu'},
      {day: 'We'},
      {day: 'Th'},
      {day: 'Fr'},
      {day: 'Sa'},
    ]);
  };

  const handleCancelButton = () => {
    setIsRepeatClicked(false);
    handleResetButton();
  };

  const handleDoneButton = () => {
    setIsRepeatClicked(false);
  };

  const handleUncheck = id => {
    setInvitations(invitations?.filter(item => item?._id !== id));
  };
  const [isLoading, setIsLoading] = useState(false);
  // console.log("Add new event", JSON.stringify(event, null, 1));
  const handleAddNewEvent = () => {
    if (!event.title)
      return showAlertModal({
        title: 'Event title missing...',
        type: 'warning',
        message: 'Title cannot be empty.',
      });
    if (!event.eventType)
      return showAlertModal({
        title: 'Event type missing...',
        type: 'warning',
        message: 'Event type cannot be empty.',
      });

    if (!event.agenda)
      return showAlertModal({
        title: 'Event agenda missing...',
        type: 'warning',
        message: 'Agenda cannot be empty.',
      });

    const firstDate = new Date(event?.start);
    const secondDate = new Date(event?.end);

    // const now = moment();
    // if (firstDate > secondDate)
    //   return Alert.alert("Please select future date then start date...");
    // if (firstDate < now)
    //   return Alert.alert("Please select 5 minutes or newer time...");

    // if (secondDate < now)
    //   return Alert.alert("Please provide select present date or future date");
    // if (isValidUrl(meetingLink)) {
    //   return Alert.alert("Please provide a meeting link ");
    // }
    // const data = {
    //   title: eventTitle,
    //   start: start,
    //   end: end,
    //   agenda: eventAgenda,
    //   actionItems: actionItems,
    //   followUp: followUp,
    //   notifications: notifications,
    //   meetingLink: meetingLink ? `[${meetingLink}](${meetingLink})` : "",
    //   eventColor: "gray",
    //   eventType: eventType,
    //   attachments: [],
    //   invitations: invitations.map((item) => item?._id),
    //   isAllDay: isAllDay,
    //   timeRange: {
    //     turnOn: selectedDays?.length ? true : false,
    //     repeatPeriod: selectedRepeat.toLowerCase(),
    //     repeatDays: selectedDays,
    //   },
    //   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // };
    setIsLoading(true);
    axiosInstance
      .post('calendar/event/create', {
        ...event,
        notifications,
        invitations: invitations?.map(item => item._id) || [],
      })
      .then(res => {
        // const responseData = {title: moment(res.data.event.start).format("YYYY-m-d")}
        if (res.data.success) {
          loadCalendarEvent();
          if (event?._id) {
            setUpdateModalVisible(false);
          }
          dispatch(
            setNewEvent({
              event: res?.data?.event,
              time: moment(res?.date?.event?.start).format('YYYY-M-D'),
            }),
          );
          dispatch(setEventNotification([]));
          // clearState();
          setModalVisible(false);
          showAlertModal({
            title: 'New Event created',
            type: 'success',
          });

          // console.log("res.data........", JSON.stringify(res.data, null, 1));
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        console.log(
          'error you got from add new event modal',
          JSON.stringify(error.response.data, null, 1),
        );
        setIsLoading(false);
      });
  };

  return (
    <ReactNativeModal
      isVisible={modalVisible}
      backdropOpacity={isPickerVisible ? 0 : 0.5}
      onBackdropPress={() => setModalVisible(false)}>
      {!isLoading ? (
        <>
          {!isPickerVisible ? (
            <View style={styles.container}>
              <ModalBackAndCrossButton
                toggleModal={() => {
                  setModalVisible(false);
                  dispatch(updatePickedDate(''));
                  dispatch(setEventNotification([]));
                }}
              />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>Add New Event</Text>
                  <Text style={styles.headerDescriptionText}>
                    Kindly complete the form to initiate the creation of a new
                    event.
                  </Text>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.Text}>
                      Event Title
                      <RequireFieldStar />
                    </Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      placeholderTextColor={Colors.BodyText}
                      value={event?.title}
                      style={[
                        {
                          backgroundColor: Colors.ModalBoxColor,
                          borderWidth: 1,
                          borderColor: Colors.BorderColor,
                          borderRadius: 10,
                          paddingHorizontal: responsiveScreenWidth(4),
                          fontFamily: CustomFonts.REGULAR,
                          color: Colors.BodyText,
                          minHeight: responsiveScreenHeight(5),
                        },
                      ]}
                      placeholder="Enter event name"
                      onChangeText={text =>
                        setEvent(pre => ({...pre, title: text}))
                      }
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.Text}>
                      Event Type
                      <RequireFieldStar />
                    </Text>
                    <CustomDropDown
                      options={eventTypeOptions}
                      type={eventTypes(event?.eventType)}
                      setState={data => {
                        setEvent(pre => ({...pre, eventType: data}));
                      }}
                    />
                  </View>

                  <DateTimeSection
                    event={event}
                    setEvent={setEvent}
                    setPickerState={setPickerState}
                    setTimeMode={setTimeMode}
                    setIsPickerVisible={setIsPickerVisible}
                  />

                  <TouchableOpacity
                    style={styles.repeatButtonContainer}
                    onPress={() => setIsRepeatClicked(!isRepeatClicked)}>
                    <Text style={styles.repeatButtonText}>Repeat</Text>
                  </TouchableOpacity>
                  {isRepeatClicked && (
                    <EventRepeatSection
                      event={event}
                      setEvent={setEvent}
                      weekDays={weekDays}
                      handleCancelButton={handleCancelButton}
                      handleDoneButton={handleDoneButton}
                      handleResetButton={handleResetButton}
                    />
                  )}

                  <TouchableOpacity
                    onPress={toggleInviteMemberModal}
                    style={styles.invitationsButtonContainer}>
                    <Text style={styles.invitationsButtonText}>
                      Add Invitations
                    </Text>
                  </TouchableOpacity>
                  {invitations?.length > 0 && (
                    <View style={styles.invitedContainer}>
                      {invitations?.map(item => (
                        <View
                          style={styles.invitedMemberContainer}
                          key={item?._id}>
                          <View style={styles.nameProfile}>
                            <Image
                              source={
                                item.profilePicture
                                  ? {
                                      uri: item.profilePicture,
                                    }
                                  : Images.DEFAULT_IMAGE
                              }
                              style={styles.checkedImage}
                            />
                            <Text style={styles.profileNameText}>
                              {item.fullName}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleUncheck(item?._id)}>
                            <BinIcon color={Colors.Red} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.fieldContainer}>
                    <Text style={styles.Text}>
                      Meeting Agenda
                      <RequireFieldStar />
                    </Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      placeholderTextColor={Colors.BodyText}
                      style={[
                        styles.inputField,
                        {minHeight: responsiveScreenHeight(10)},
                      ]}
                      value={event.agenda}
                      placeholder="Write meeting agenda"
                      onChangeText={text =>
                        setEvent(pre => ({...pre, agenda: text}))
                      }
                      multiline
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.Text}>Follow Up Message</Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      placeholderTextColor={Colors.BodyText}
                      style={[
                        styles.inputField,
                        {minHeight: responsiveScreenHeight(8)},
                      ]}
                      value={event.followUp}
                      placeholder="Write follow up message"
                      multiline
                      onChangeText={text =>
                        setEvent(pre => ({...pre, followUp: text}))
                      }
                    />
                  </View>

                  <View style={styles.fieldContainer}>
                    <Text style={styles.Text}>Action Item</Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      value={event.actionItems}
                      placeholderTextColor={Colors.BodyText}
                      style={[
                        styles.inputField,
                        {minHeight: responsiveScreenHeight(8)},
                      ]}
                      placeholder="Write action item"
                      onChangeText={text =>
                        setEvent(pre => ({...pre, actionItems: text}))
                      }
                      multiline
                    />
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.Text}>Add Meeting Link</Text>
                    <TextInput
                      keyboardAppearance={
                        Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                      }
                      placeholderTextColor={Colors.BodyText}
                      style={[
                        styles.inputField,
                        {minHeight: responsiveScreenHeight(5)},
                      ]}
                      placeholder="Meeting link"
                      onChangeText={text =>
                        setEvent(pre => ({...pre, meetingLink: text}))
                      }
                      value={event.meetingLink}
                      multiline
                    />
                  </View>

                  <Text
                    style={{
                      color: Colors.Primary,
                      fontFamily: CustomFonts.MEDIUM,
                    }}>
                    Add Notification (Optional)
                  </Text>
                  <UpdateEventNotificationContainer />

                  <View style={styles.buttonContainer}>
                    <CustomButton
                      textColor="rgba(39, 172, 31, 1)"
                      backgroundColor="rgba(39, 172, 31, 0.1)"
                      buttonText="Cancel"
                      toggleModal={() => {
                        // if (event?._id) {
                        //   setUpdateModalVisible(false);
                        // }
                        setModalVisible(false);
                      }}
                    />
                    <CustomButton
                      toggleModal={handleAddNewEvent}
                      textColor="white"
                      backgroundColor="#27ac1f"
                      buttonText="Add"
                    />
                  </View>
                </View>
              </ScrollView>

              {isInviteMemberModalVisible && (
                <InviteMemberModal
                  from="add"
                  handleUncheck={handleUncheck}
                  invitations={invitations}
                  setInvitations={setInvitations}
                  toggleModal={toggleInviteMemberModal}
                  isModalVisible={isInviteMemberModalVisible}
                  setIsModalVisible={setIsInviteMemberModalVisible}
                />
              )}
            </View>
          ) : (
            <CustomTimePicker
              mode={pickerState}
              time={
                timeMode == 'startTime'
                  ? moment(event?.start)
                  : moment(event?.end)
              }
              date={
                timeMode == 'startDate'
                  ? event?.start || moment()
                  : event?.end || moment()
              }
              setDate={date => {
                timeMode === 'startDate'
                  ? setEvent(pre => ({
                      ...pre,
                      start: combineDateAndTime({
                        fullDate: event?.start,
                        date,
                      }),
                      end: combineDateAndTime({
                        fullDate: event?.start,
                        date,
                      }),
                      end: combineDateAndTime({
                        fullDate: event?.start,
                        time: moment(event?.start).add(30, 'minutes'),
                      }),
                    }))
                  : setEvent(pre => ({
                      ...pre,
                      end: combineDateAndTime({
                        fullDate: event?.end,
                        date,
                      }),
                    }));
              }}
              setTime={time => {
                timeMode === 'startTime'
                  ? setEvent(pre => ({
                      ...pre,
                      start: combineDateAndTime({
                        fullDate: event?.start,
                        time,
                      }),
                      end: combineDateAndTime({
                        fullDate: event?.start,
                        time: moment(time, 'hh:mm A').add(30, 'minutes'),
                      }),
                    }))
                  : setEvent(pre => ({
                      ...pre,
                      end: combineDateAndTime({
                        fullDate: event?.end,
                        time,
                      }),
                    }));
              }}
              setIsPickerVisible={setIsPickerVisible}
              isPickerVisible={isPickerVisible}
            />
          )}
        </>
      ) : (
        <Loading backgroundColor={'transparent'} />
      )}
      <GlobalAlertModal />
    </ReactNativeModal>
  );
};

export default React.memo(AddNewEventModal);

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      paddingHorizontal: responsiveScreenWidth(3),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(2),
      maxHeight: responsiveScreenHeight(70),
      paddingTop: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(1.5),
    },
    headerContainer: {
      marginVertical: responsiveScreenHeight(1.5),
    },
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.Heading,
    },
    headerDescriptionText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    subContainer: {
      minHeight: responsiveScreenHeight(30),
      minWidth: responsiveScreenWidth(80),
    },
    fieldContainer: {
      marginBottom: responsiveScreenHeight(2),
    },
    Text: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(3.5),
      fontFamily: CustomFonts.REGULAR,
      paddingTop: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(1),
      // height: responsiveScreenHeight(5),
      color: Colors.BodyText,
      textAlignVertical: 'top',
    },

    repeatButtonContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      marginBottom: responsiveScreenHeight(2),
    },
    repeatButtonText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },

    buttonContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2.5),
      justifyContent: 'center',
    },
    invitationsButtonContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.Primary,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1.5),
      marginBottom: responsiveScreenHeight(1.5),
    },
    invitationsButtonText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Primary,
    },
    invitedContainer: {
      backgroundColor: Colors.ModalBoxColor,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      paddingVertical: 15,
      paddingHorizontal: 20,
      gap: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
    },
    invitedMemberContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    nameProfile: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    checkedImage: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      borderRadius: 100,
      backgroundColor: Colors.MediumGreen,
    },
    profileNameText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
    notification: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor3,
      borderRadius: responsiveScreenWidth(3),
      padding: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'column',
      gap: 10,
      marginBottom: responsiveScreenHeight(2),
      zIndex: 3,
    },
    notificationRow: {
      flexDirection: 'row',
      gap: 10,
    },
    dropdownContainer: {
      flex: 1,
      gap: responsiveScreenHeight(1),
    },
    addNotificationContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: 5,
      width: responsiveScreenWidth(30),
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(0.5),
    },
    addNotificationText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
  });
