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
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import ReactNativeModal from 'react-native-modal';
import CustomDropDown from '../SharedComponent/CustomDropDown';
import BinIcon from '../../assets/Icons/BinIcon';
import InviteMemberModal from './Modal/InviteMemberModal';
import moment from 'moment';
import axiosInstance from '../../utility/axiosInstance';
import {
  getEventDetails,
  handleError,
  loadCalendarEvent,
} from '../../actions/chat-noti';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteEvent,
  setEventNotification,
  setSingleEvent,
} from '../../store/reducer/calendarReducer';
import {removeMarkdown} from '../HelperFunction';
import Loading from '../SharedComponent/Loading';
import AddNewEventModal from './AddNewEventModal';
import ConfirmationModal from '../SharedComponent/ConfirmationModal';
import CustomTimePicker from '../SharedComponent/CustomTimePicker';
import UpdateEventNotificationContainer from './UpdateEventNotificationContainer';
import EventHistory from './EventHistory';
import {
  combineDateAndTime,
  eventTypes,
  showAlertModal,
} from '../../utility/commonFunction';
import {eventTypeOptions} from '../../constants/CustomeData';
import DateTimeSection from './DateTimeSection';
import EventRepeatSection from './Modal/EventRepeatSection';
import Images from '../../constants/Images';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import CrossCircle from '../../assets/Icons/CrossCircle';

const UpdateEventModal = ({modalVisible, setModalVisible, eventId}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getEventDetails(eventId);
  }, [eventId]);

  const {event: eventData, eventNotification} = useSelector(
    state => state.calendar,
  );
  const [event, setEvent] = useState({});

  useEffect(() => {
    setIsLoading(true);
    if (eventData?._id) {
      setIsLoading(false);
    }
    setEvent({...eventData});
  }, [eventData]);
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
  const currentDate = new Date().toISOString();
  const eventStart = event?.start;
  const notPastDate = currentDate < eventStart;

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const [isRepeatClicked, setIsRepeatClicked] = useState(false);
  const [isInviteMemberModalVisible, setIsInviteMemberModalVisible] =
    useState(false);

  const [invitations, setInvitations] = useState(
    eventData?.participants?.map(item => item.user),
  );
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

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerState, setPickerState] = useState('date');
  const [timeMode, setTimeMode] = useState('');

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

  const handleUncheck = (user, action) => {
    axiosInstance
      .patch(`/calendar/event/invitation/${event?._id}`, {action, user})
      .then(res => {
        console.log('res.data', JSON.stringify(res.data, null, 1));
        if (res.data.success) {
          setInvitations(res.data.event.participants.map(item => item.user));
        }
      })
      .catch(error => {
        console.log(
          'error from calender event invitation',
          JSON.stringify(error, null, 1),
        );
      });
  };

  const [addNewEventModalVisible, setAddNewEventModalVisible] = useState(false);
  const handleUpdateEvent = () => {
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

    // const start = combineDateAndTime(selectedStartDate, selectedStartTime);
    // const end = combineDateAndTime(selectedEndDate, selectedEndTime);
    // const firstDate = new Date(start);
    // const secondDate = new Date(end);
    setEvent(pre => ({...pre, notifications}));
    const now = moment();
    if (event.start > event.end)
      return showAlertModal({
        title: 'Invalid Date Order',
        type: 'warning',
        message: 'Please select future date then start date.',
      });

    if (event.start < now)
      return showAlertModal({
        title: 'Invalid Time Selection',
        type: 'warning',
        message: 'Please select 5 minutes or newer time.',
      });

    if (event?.end < now)
      return showAlertModal({
        title: 'Invalid Date Selection',
        type: 'warning',
        message: 'Please provide select present date or future date.',
      });

    // const data = {
    //   title: eventTitle,
    //   start: start,
    //   end: end,
    //   agenda: eventAgenda,
    //   actionItems: actionItems,
    //   followUp: followUp,
    //   meetingLink: meetingLink,
    //   eventColor: "gray",
    //   eventType: eventType,
    //   attachments: [],
    //   timeRange: {
    //     turnOn: selectedDays?.length ? true : false,
    //     repeatIteration: 1,
    //     repeatPeriod: selectedRepeat.toLowerCase(),
    //     repeatDays: selectedDays,
    //   },
    //   isAllDay: isAllDay,
    //   notifications: notifications,
    //   timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    // };
    // console.log("data", JSON.stringify(data, null, 1));
    // console.log("update event: !!!", JSON.stringify(event, null, 1));
    setIsLoading(true);
    axiosInstance
      .patch(`/calendar/event/update/${event._id}`, event)
      .then(res => {
        if (res.data.success) {
          loadCalendarEvent();
          // clearState();
          setModalVisible(false);
          showAlertModal({
            title: 'Event updated',
          });
          dispatch(setSingleEvent(event));
          dispatch(setEventNotification([]));
        }
        // console.log("res.data", JSON.stringify(res.data, null, 1));
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error while event update', JSON.stringify(error, null, 1));
      });
  };
  const dispatch = useDispatch();
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const handleDeleteEvent = () => {
    axiosInstance
      .delete(`calendar/event/delete/${event._id}`)
      .then(res => {
        if (res.data.success) {
          dispatch(
            deleteEvent({
              eventId: event._id,
              time: moment(event?.start).format('YYYY-M-D'),
            }),
          );
          loadCalendarEvent();
          setIsConfirmationModalVisible(false);
          setModalVisible(false);
        }
      })
      .catch(error => {
        handleError(error);
        setIsConfirmationModalVisible(false);
        setModalVisible(false);
        showAlertModal({
          title: 'Something wrong',
          type: 'error',
        });
      });
  };
  // console.log("invitations", JSON.stringify(invitations, null, 1));
  return (
    <ReactNativeModal
      isVisible={modalVisible}
      onBackdropPress={() => {
        setModalVisible(false);
        dispatch(setSingleEvent(null));
      }}>
      {isLoading ? (
        <Loading />
      ) : (
        <View style={styles.container}>
          {/* <ModalBackAndCrossButton
            toggleModal={() => {
              dispatch(setSingleEvent(null));
              dispatch(
                setEventNotification([
                  {
                    timeBefore: 5,
                    methods: ["push"],
                    chatGroups: [],
                  },
                ])
              );
              setModalVisible(false);
            }}
          /> */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.headerText}>
                {notPastDate || event.isAllDay
                  ? 'Update Event'
                  : 'Event Details'}
              </Text>
              <Text style={styles.headerDescriptionText}>
                {notPastDate || event.isAllDay
                  ? 'Kindly complete the form to initiate the update event.'
                  : 'View your event details'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
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
                setModalVisible(false);
              }}>
              <CrossCircle size={30} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                {notPastDate || event.isAllDay
                  ? "Update Event"
                  : "Event Details"}
              </Text>
              <Text style={styles.headerDescriptionText}>
                {notPastDate || event.isAllDay
                  ? "Kindly complete the form to initiate the update event."
                  : "View your event details"}
              </Text>
            </View> */}

            <View style={styles.subContainer}>
              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Event Title*</Text>
                <TextInput
                  keyboardAppearance={
                    Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                  }
                  placeholderTextColor={Colors.BodyText}
                  value={event.title}
                  style={styles.inputField}
                  placeholder={'Enter event name'}
                  onChangeText={text =>
                    setEvent(pre => ({...pre, title: text}))
                  }
                  multiline
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Event Type *</Text>
                <CustomDropDown
                  options={eventTypeOptions}
                  type={eventTypes(event.eventType)}
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
                  {invitations?.map(item => {
                    return (
                      <View
                        style={styles.invitedMemberContainer}
                        key={item._id}>
                        <View style={styles.nameProfile}>
                          <Image
                            source={
                              item?.profilePicture
                                ? {
                                    uri: item?.profilePicture,
                                  }
                                : Images.DEFAULT_IMAGE
                            }
                            style={styles.checkedImage}
                          />
                          <Text
                            numberOfLines={1}
                            style={styles.profileNameText}>
                            {item?.fullName}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleUncheck(item?._id, 'remove')}>
                          <BinIcon color={Colors.Red} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Meeting Agenda*</Text>
                <TextInput
                  keyboardAppearance={
                    Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                  }
                  placeholderTextColor={Colors.BodyText}
                  style={[styles.inputField, {height: 80}]}
                  placeholder="Add Meeting Agenda"
                  onChangeText={text =>
                    setEvent(pre => ({...pre, agenda: text}))
                  }
                  multiline
                  value={event.agenda || event.description}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Follow Up Message</Text>
                <TextInput
                  keyboardAppearance={
                    Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                  }
                  placeholderTextColor={Colors.BodyText}
                  style={[styles.inputField, {height: 80}]}
                  placeholder="Add follow up message"
                  multiline
                  onChangeText={text =>
                    setEvent(pre => ({...pre, followUp: text}))
                  }
                  value={event.followUp}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.Text}>Action Item</Text>
                <TextInput
                  keyboardAppearance={
                    Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                  }
                  placeholderTextColor={Colors.BodyText}
                  style={[styles.inputField, {height: 80}]}
                  value={event.actionItems}
                  placeholder="Add action item"
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
                  style={styles.inputField}
                  placeholder="Meeting link"
                  onChangeText={text =>
                    setEvent(pre => ({
                      ...pre,
                      meetingLink: `[${text}](${text})`,
                    }))
                  }
                  value={removeMarkdown(event.meetingLink)?.split(']')[0]}
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
              <View style={{}}>
                <Text style={styles.Text}>Event change history</Text>
                <EventHistory event={event} />
              </View>
              <View style={styles.buttonParenCom}>
                {notPastDate && (
                  <TouchableOpacity
                    onPress={() => {
                      handleUpdateEvent();
                    }}
                    style={[
                      styles.buttonContainer,
                      {backgroundColor: Colors.Primary},
                    ]}>
                    <Text
                      style={[styles.buttonText, {color: Colors.PureWhite}]}>
                      Update
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setAddNewEventModalVisible(true);
                  }}
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: Colors.PrimaryOpacityColor},
                  ]}>
                  <Text style={[styles.buttonText, {color: Colors.Primary}]}>
                    Copy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsConfirmationModalVisible(true);
                  }}
                  style={[
                    styles.buttonContainer,
                    {backgroundColor: Colors.LightRed},
                  ]}>
                  <Text style={[styles.buttonText, {color: Colors.Red}]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          {isPickerVisible && (
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

          {isInviteMemberModalVisible && (
            <InviteMemberModal
              handleUncheck={handleUncheck}
              invitations={invitations}
              setInvitations={setInvitations}
              toggleModal={toggleInviteMemberModal}
              isModalVisible={isInviteMemberModalVisible}
              setIsModalVisible={setIsInviteMemberModalVisible}
            />
          )}
          {modalVisible && (
            <AddNewEventModal
              setUpdateModalVisible={setModalVisible}
              modalVisible={addNewEventModalVisible}
              setModalVisible={setAddNewEventModalVisible}
              event={event}
              eventNotification={eventNotification}
            />
          )}
        </View>
      )}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        tittle={'Delete'}
        description={'Do you want to delete it?'}
        okPress={() => handleDeleteEvent()}
        cancelPress={() => setIsConfirmationModalVisible(false)}
      />
      <GlobalAlertModal />
    </ReactNativeModal>
  );
};

export default UpdateEventModal;

const getStyles = Colors =>
  StyleSheet.create({
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    buttonContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: 4,
      paddingVertical: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(2),
      flex: 1,
      alignItems: 'center',
    },
    buttonParenCom: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
      justifyContent: 'center',
    },
    container: {
      paddingHorizontal: responsiveScreenWidth(5),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(2),
      maxHeight: responsiveScreenHeight(80),
      paddingTop: responsiveScreenHeight(1),
      paddingBottom: responsiveScreenHeight(2),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: responsiveScreenHeight(1.5),
      gap: 5,
      paddingBottom: 10,
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
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingTop: 15,
      color: Colors.BodyText,
      minHeight: 50,
      textAlignVertical: 'top',
      paddingBottom: 15,
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
      flexBasis: '75%',
    },
  });
