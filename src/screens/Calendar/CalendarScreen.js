import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import DotComponent from '../../components/DotComponent';

import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import AddNewEventModal from '../../components/Calendar/AddNewEventModal';
import EventDetailsModal from '../../components/Calendar/Modal/EventDetailsModal';
import {CalendarData} from '../../components/Calendar/CalendarData';
import axiosInstance from '../../utility/axiosInstance';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAvailabilities,
  setAvailabilityData,
  setSpecificHoursData,
} from '../../store/reducer/calendarReducer';
import Images from '../../constants/Images';
import HolidayIcon from '../../assets/Icons/HolidayIcon';
import TickCircleIcon from '../../assets/Icons/TickCircleIcon';
import HolidayModal from '../../components/Calendar/Modal/HolidayModal';
import Calendar from '../../components/Calendar/Calendar';
import AvailabilityModal from '../../components/Calendar/Modal/AvailabilityModal';
import UpdateEventModal from '../../components/Calendar/UpdateEventModal';
import InvitationsDetailsModal from '../../components/Calendar/Modal/InvitationsDetailsModal';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import MarqueeText from '../../components/Calendar/MarqueeText';
import DotComponent2 from '../../components/DotComponent2';
import {RegularFonts} from '../../constants/Fonts';
import CalendarHeader from '../../components/Calendar/CalendarHeader';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRight from '../../assets/Icons/ArrowRight';

export function numberToMonth(monthNumber) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return months[monthNumber - 1];
}

const CalendarScreen = props => {
  const {calendarEvent, invitations, holidays, weekends, availabilities} =
    useSelector(state => state.calendar);
  const isHolidays = holidays?.find(
    item => item.date.start === moment().format('YYYY-MM-DD'),
  )?.length;
  const isWeekends = weekends?.find(
    item => item.date.start === moment().format('YYYY-MM-DD'),
  )?.length;

  const [monthData, setMonthData] = useState([]);
  const [selected, setSelected] = useState('invitation');

  const Colors = useTheme();

  const [eventData, setEventData] = useState({});

  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const toggleUpdateModal = useCallback(item => {
    setEventData(item);
    setUpdateModalVisible(prevState => !prevState);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = useCallback(() => {
    setModalVisible(prevState => !prevState);
  }, []);

  const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] =
    useState(false);

  const toggleEventDetailsModal = () => {
    setIsEventDetailsModalVisible(prevState => !prevState);
  };

  const [isHolidayModalVisible, setIsHolidayModalVisible] = useState(false);
  const toggleHolidayModal = useCallback(() => {
    setIsHolidayModalVisible(prevState => !prevState);
  }, []);

  const [isAvailabilityVisible, setIsAvailabilityVisible] = useState(false);
  const toggleAvailability = useCallback(() => {
    if (!availabilities) {
      return Alert.alert(
        'Please at first create your availability schedule from website. \n This feature will available soon on app...',
      );
    }
    setIsAvailabilityVisible(prevState => !prevState);
  }, []);
  const [
    isInvitationsDetailsModalVisible,
    setIsInvitationsDetailsModalVisible,
  ] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState({});
  const toggleInvitationsDetailsModal = () => {
    setIsInvitationsDetailsModalVisible(pre => !pre);
  };

  const compareData = useCallback((mntData, eData = []) => {
    if (!eData) {
      return [];
    }
    return mntData
      ?.map(date => eData?.find(event => event.title === date))
      ?.filter(event => event !== undefined);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance
      .get('calendar/schedule/all')
      .then(res => {
        dispatch(setAvailabilityData(res?.data?.schedules[0]));

        dispatch(
          setAvailabilities({data: res?.data?.schedules[0]?.availability}),
        );

        dispatch(setSpecificHoursData(res?.data?.schedules[0]?.availability));
      })
      .catch(error => {
        if (error.response) {
          console.log(
            'Server error:',
            JSON.stringify(error.response.data, null, 1),
          );
        } else if (error.request) {
          console.log('Network error:', JSON.stringify(error.request, null, 1));
        } else {
          console.log('Error:', JSON.stringify(error.message, null, 1));
        }
      });
  }, []);

  const handleDetails = useCallback(
    item => {
      setInvitationDetails(item);
      toggleInvitationsDetailsModal();
    },
    [isInvitationsDetailsModalVisible],
  );
  // console.log("invitations", JSON.stringify(invitations, null, 1));

  const [seeMoreClicked, setSeeMoreClicked] = useState(false);
  const timeRef = useRef();
  const handleSeeMore = () => {
    setSeeMoreClicked(!seeMoreClicked);
    if (seeMoreClicked) {
      timeRef.current.scrollTo({
        offset: 0,
        animated: true,
      });
    }
  };
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);
  let newInvitations = [];
  if (loadMoreClicked) {
    newInvitations = invitations;
  } else {
    newInvitations =
      invitations.length > 3 ? invitations.slice(0, 3) : invitations;
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Background_color,
        // paddingTop: insets.top,
      }}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <CalendarHeader toggleModal={toggleModal} />
      <ScrollView ref={timeRef} style={styles.container}>
        <View>
          {/* <View style={styles.headerContainer}>
            <Text style={styles.title}>Calendar</Text>
            <Text style={styles.SubHeading}>Create Events and Schedule Meetings</Text>
          </View> */}
          {/* <Divider /> */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.holidayButtonContainer,
                {backgroundColor: Colors.CyanOpacity},
              ]}
              onPress={toggleAvailability}>
              <TickCircleIcon color={Colors.PureCyan} />
              <Text
                style={[styles.holidayButtonText, {color: Colors.PureCyan}]}>
                Availability
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.holidayButtonContainer,
                {backgroundColor: Colors.YellowOpacity},
              ]}
              onPress={toggleHolidayModal}>
              <HolidayIcon fill={Colors.PureYellow} />
              <Text
                style={[styles.holidayButtonText, {color: Colors.PureYellow}]}>
                Holidays
              </Text>
            </TouchableOpacity>
          </View>
          <DotComponent2 />
          {(isWeekends || isHolidays) && (
            <View style={styles.marqueeContainer}>
              <MarqueeText
                text={
                  'Holiday - Attendees might decline due to holidays or weekends.'
                }
              />
            </View>
          )}
          <View style={styles.viewContainer}>
            <Calendar
              toggleUpdateModal={toggleUpdateModal}
              toggleModal={toggleModal}
              markedDates={calendarEvent}
              setMonthData={setMonthData}
              seeMoreClicked={seeMoreClicked}
              handleSeeMore={handleSeeMore}
            />

            {selected === 'event' && <DotComponent />}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flex: 0.5,
                  backgroundColor:
                    selected === 'invitation' ? Colors.Primary : Colors.White,
                  borderRadius: selected === 'invitation' ? 7 : 0,
                  paddingVertical: responsiveScreenHeight(0.5),
                }}
                onPress={() => {
                  setSelected('invitation');
                }}>
                <Text
                  style={[
                    styles.holidayButton,
                    selected === 'invitation' && styles.clickedStyle,
                  ]}>
                  My Invitations
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  flex: 0.5,
                  backgroundColor:
                    selected === 'event' ? Colors.Primary : Colors.White,
                  borderRadius: selected === 'event' ? 7 : 0,
                  paddingVertical: responsiveScreenHeight(0.5),
                }}
                onPress={() => setSelected('event')}>
                <Text
                  style={[
                    styles.holidayButton,
                    selected === 'event' && styles.clickedStyle,
                  ]}>
                  My Events
                </Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.line}></View> */}
            {/* <View style={styles.line}></View> */}
            {selected === 'event' ? (
              <CalendarData
                monthData={monthData}
                data={compareData(monthData, calendarEvent)}
                toggleUpdateModal={toggleUpdateModal}
              />
            ) : invitations?.length === 0 ? (
              <NoDataAvailable />
            ) : (
              <View style={styles.invitationsContainer}>
                <Text style={styles.title}>My Invitations</Text>
                <View style={[styles.dataHeading, styles.HeadingText]}>
                  <Text style={[styles.firstCol, styles.HeadingText]}>#</Text>
                  <Text style={[styles.secondCol, styles.HeadingText]}>
                    Title
                  </Text>
                  <Text style={[styles.thirdCol, styles.HeadingText]}>
                    Creator
                  </Text>
                  <Text style={[styles.fourthCol, styles.HeadingText]}>
                    Date
                  </Text>
                  <Text style={[styles.fifthCol, styles.HeadingText]}>
                    Action
                  </Text>
                </View>
                <View style={{gap: 10, marginTop: responsiveScreenHeight(1)}}>
                  {newInvitations?.map((item, index) => (
                    <View style={styles.singleInvite} key={index}>
                      <Text style={styles.firstCol}>{index + 1}</Text>
                      <View style={styles.inviteFirstCol}>
                        <Text numberOfLines={1} style={styles.inviteTitle}>
                          {item?.title}
                        </Text>
                      </View>
                      <View style={styles.inviteLastCol}>
                        <View style={styles.creatorFirsContainer}>
                          <Image
                            source={
                              item?.createdBy?.profilePicture
                                ? {
                                    uri: item?.createdBy?.profilePicture,
                                  }
                                : Images.DEFAULT_IMAGE
                            }
                            height={15}
                            width={15}
                            borderRadius={50}
                            style={styles.invitationImage}
                          />

                          <Text style={styles.inviteTitle} numberOfLines={1}>
                            {item?.createdBy?.firstName
                              ? item?.createdBy?.firstName.split(' ')[0]
                              : 'N/A'}
                          </Text>
                        </View>
                        {/* <Text
                          numberOfLines={1}
                          style={[
                            styles.inviteTitle,
                            {
                              fontSize: responsiveScreenFontSize(1),
                              textTransform: "capitalize",
                            },
                          ]}
                        >
                          member of BootcampsHub
                        </Text> */}
                      </View>

                      <View style={styles.inviteSecondCol}>
                        <Text style={styles.eventTime}>
                          {moment(item?.start).format('MMM DD, YYYY')}
                        </Text>
                        <Text style={styles.eventTime}>
                          {moment(item?.start).format('hh:mm A')}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDetails(item)}
                        style={styles.seeDetailsButton}>
                        <Text style={styles.seeDetailsText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => setLoadMoreClicked(!loadMoreClicked)}
                  style={styles.moreButtonContainer}>
                  {loadMoreClicked ? (
                    <>
                      <ArrowLeftWhite size={20} color={Colors.Primary} />
                      <Text style={styles.moreButtonText}>See Less</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.moreButtonText}>See More</Text>
                      <ArrowRight />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <InvitationsDetailsModal
        isInvitationsDetailsModalVisible={isInvitationsDetailsModalVisible}
        toggleInvitationsDetailsModal={toggleInvitationsDetailsModal}
        item={invitationDetails}
      />

      {isEventDetailsModalVisible && props.route.params && (
        <EventDetailsModal
          eventId={eventData._id}
          isEventDetailsModalVisible={isEventDetailsModalVisible}
          toggleEventDetailsModal={toggleEventDetailsModal}
        />
      )}

      {modalVisible && (
        <AddNewEventModal
          toggleModal={toggleModal}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      {updateModalVisible && (
        <UpdateEventModal
          event={eventData}
          setEventData={setEventData}
          toggleModal={toggleUpdateModal}
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
        />
      )}
      {isHolidayModalVisible && (
        <HolidayModal
          toggleHoliday={toggleHolidayModal}
          setIsHolidayVisible={setIsHolidayModalVisible}
          isHolidayVisible={isHolidayModalVisible}
        />
      )}
      {isAvailabilityVisible && (
        <AvailabilityModal
          toggleAvailability={toggleAvailability}
          setIsAvailabilityVisible={setIsAvailabilityVisible}
          isAvailabilityVisible={isAvailabilityVisible}
        />
      )}
    </View>
  );
};

export default CalendarScreen;

const getStyles = Colors =>
  StyleSheet.create({
    moreButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
    },
    moreButtonContainer: {
      alignSelf: 'flex-start',
      // backgroundColor: Colors.Primary,
      padding: 5,
      flexDirection: 'row',
      gap: 5,
    },
    marqueeContainer: {
      marginLeft: ' -20%',
      marginTop: responsiveScreenHeight(2),
    },
    invitationImage: {
      borderRadius: 50,
      maxHeight: 20,
      maxWidth: 20,
    },
    creatorFirsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      gap: 5,
      alignItems: 'center',
      // backgroundColor: "cyan"
    },
    HeadingText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.Heading,
    },
    SubHeading: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      // paddingHorizontal: responsiveScreenWidth(2),
    },
    fifthCol: {
      // backgroundColor: "red",
      width: '20%',
      textAlign: 'center',
    },
    fourthCol: {
      // backgroundColor: "blue",
      width: '20%',
    },
    thirdCol: {
      // backgroundColor: "red",
      width: '20%',
    },
    secondCol: {
      width: '30%',
      // backgroundColor: "blue",
    },
    firstCol: {
      width: '4%',
      fontSize: responsiveScreenFontSize(1.2),
      color: Colors.BodyText,

      // backgroundColor: "red",
      fontFamily: CustomFonts.REGULAR,
    },
    dataHeading: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      gap: 2,
      marginTop: responsiveScreenHeight(2),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    seeDetailsText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
    },
    seeDetailsButton: {
      backgroundColor: Colors.Primary,
      borderRadius: 4,
      alignItems: 'center',
      width: '18%',
      height: responsiveScreenHeight(2.5),
      justifyContent: 'center',
      alignSelf: 'center',
    },
    inviteTitle: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.MEDIUM,
      // backgroundColor: "red",
      // textAlign: "center",
    },
    eventTime: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
    inviteLastCol: {
      // backgroundColor: "blue",
      width: '20%',
      justifyContent: 'flex-start',
    },

    inviteFirstCol: {
      width: '30%',
      // backgroundColor: "red",
      justifyContent: 'center',
    },
    inviteSecondCol: {
      // backgroundColor: "yellow",
      width: '20%',
      justifyContent: 'center',
    },
    creatorCol: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      backgroundColor: 'red',
    },
    singleInvite: {
      backgroundColor: Colors.White,
      flexDirection: 'row',
      borderRadius: 7,
      padding: responsiveScreenFontSize(1),
      gap: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      maxHeight: 40,
    },
    invitationsContainer: {
      marginHorizontal: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(1),
    },
    clickedStyle: {
      color: Colors.PureWhite,
    },
    holidayButton: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenHeight(1),
      borderRadius: 7,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: Colors.White,
      paddingVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      gap: 10,
      borderRadius: 7,
      marginTop: responsiveScreenHeight(2),
      marginHorizontal: responsiveScreenWidth(2),
    },
    headerContainer: {
      // flexDirection: "row",
      // justifyContent: "space-between",
      // alignItems: "center",
      // marginTop: responsiveScreenHeight(2),
      paddingHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // marginBottom: responsiveScreenHeight(2),
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    imagesStyle: {
      width: 20,
      height: 20,
    },
    btn: {
      width: responsiveScreenWidth(30),
      height: responsiveScreenHeight(4),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(2.5),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
    },
    holidayButtonContainer: {
      width: responsiveScreenWidth(30),
      height: responsiveScreenHeight(4),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
    },
    holidayButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
    title: {
      fontSize: RegularFonts.HXL,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    CalendarContainer: {
      height: responsiveScreenHeight(40),
      backgroundColor: Colors.White,
    },
    container: {
      backgroundColor: Colors.Background_color,
      // paddingHorizontal: responsiveScreenWidth(5),
    },
    viewContainer: {
      backgroundColor: Colors.Background_color,
      // borderRadius: 5,
      // // borderWidth: 1,
      padding: 4,
      // borderColor: Colors.BorderColor,
      // marginVertical: responsiveScreenHeight(2),
    },
    dotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(14),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
    },
    dotCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(11),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
    },
    dot: {flexDirection: 'row', alignItems: 'center', gap: 8},
    // line: {
    //   width: "100%",
    //   height: 1,
    //   backgroundColor: Colors.LineColor,
    //   marginVertical: responsiveScreenWidth(4),
    // },
  });
