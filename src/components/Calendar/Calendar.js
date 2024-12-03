import React, {useState, useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import RightArrowButtonWithoutTail from '../../assets/Icons/RightArrowButtonWithoutTail';
import LeftArrowButtonWithoutTail from '../../assets/Icons/LeftArrowButtonWithoutTail';
import WeekView from './WeekView';
import moment from 'moment';
import EventDetailsModal from './Modal/EventDetailsModal';
import DayView from './DayView';
import {useDispatch, useSelector} from 'react-redux';
import {createIsoTimestamp} from '../HelperFunction';
import {updatePickedDate} from '../../store/reducer/calendarReducer';
import ReactNativeModal from 'react-native-modal';
import {getEventDetails, getNotificationData} from '../../actions/chat-noti';
import DayEvent from './DayEvent';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import NotificationEventDetails from './Modal/NotificationEventDetails';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isLeapYear = year => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const monthDays = year => [
  31,
  isLeapYear(year) ? 29 : 28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

const generateMonthCalendar = (month, year) => {
  const daysInMonth = monthDays(year);
  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(daysInMonth[prevMonth] - firstDayOfMonth + i + 1);
  }
  for (let i = 1; i <= daysInMonth[month]; i++) {
    days.push(i);
  }
  for (let i = 1; days?.length % 7 !== 0; i++) {
    days.push(i);
  }

  const weeks = [];
  while (days?.length) {
    weeks.push(days.splice(0, 7));
  }

  return {weeks, prevMonth, nextMonth, prevYear, nextYear};
};

const isHolidayMarked = (day, month, year, markedDates) => {
  const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
    .toString()
    .padStart(2, '0')}`;
  const value = markedDates?.find(item => item === dateString);

  return {isHoliMarked: Boolean(value)};
};

const Calendar = ({
  markedDates = [],
  setMonthData,
  toggleModal,
  toggleUpdateModal,
  seeMoreClicked,
  handleSeeMore,
}) => {
  const [month, setMonth] = useState(new Date().getMonth());
  const {holidays, monthViewData} = useSelector(state => state.calendar);
  const {user} = useSelector(state => state.auth);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selected, setSelected] = useState('day');
  const [eventData, setEventData] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [DayOffset, setDayOffset] = useState(0);
  const dispatch = useDispatch();

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();
  const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] =
    useState(false);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const toggleEventDetailsModal = item => {
    setEventData(item);
    setIsEventDetailsModalVisible(pre => !pre);

    if (isEventDetailsModalVisible) {
      setEventData({});
    }
  };

  const today = new Date();
  const todayString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  const {weeks, prevMonth, nextMonth, prevYear, nextYear} = useMemo(
    () => generateMonthCalendar(month, year),
    [month, year],
  );

  const monthName = new Date(year, month).toLocaleString('default', {
    month: 'long',
  });

  useEffect(() => {
    const newMonthData = [];
    weeks.forEach((week, index) => {
      week.forEach((day, dayIndex) => {
        const isCurrentMonth =
          (index === 0 && day > 7) || (index >= 4 && day <= 7) ? false : true;
        const displayMonth = isCurrentMonth
          ? month
          : day > 7
          ? prevMonth
          : nextMonth;
        const displayYear = isCurrentMonth
          ? year
          : day > 7
          ? prevYear
          : nextYear;
        newMonthData.push(`${displayYear}-${displayMonth + 1}-${day}`);
      });
    });
    setMonthData(newMonthData);
  }, [weeks, month, year]);

  const handlePrevMonth = () => {
    setMonth(prevMonth);
    setYear(prevMonth === 11 ? year - 1 : year);
    setWeekOffset(0);
  };

  const handleNextMonth = () => {
    setMonth(nextMonth);
    setYear(nextMonth === 0 ? year + 1 : year);
    setWeekOffset(0);
  };

  const handlePrevWeek = () => {
    setWeekOffset(pre => pre - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(pre => pre + 1);
  };
  const handlePrevDay = () => {
    setDayOffset(pre => pre - 1);
  };

  const handleNextDay = () => {
    setDayOffset(pre => pre + 1);
  };

  const eventType = type => {
    return (
      (type === 'showNTell' && '#619dcc') ||
      (type === 'mockInterview' && '#f59f9f') ||
      (type === 'orientation' && '#379793') ||
      (type === 'technicalInterview' && '#f8a579') ||
      (type === 'behavioralInterview' && '#0091b9') ||
      (type === 'reviewMeeting' && '#7ccc84') ||
      (type === 'syncUp' && '#ff6502') ||
      (type === 'other' && Colors.OthersColor) ||
      Colors.PrimaryOpacityColor
    );
  };

  const eventStatus = status => {
    return (
      (status === 'accepted' && Colors.ThemeSecondaryColor2) ||
      (status === 'pending' && Colors.ThemeSecondaryColor) ||
      (status === 'rejected' && Colors.ThemeWarningColor) ||
      (status === 'denied' && '#daee8d') ||
      (status === 'finished' && Colors.ThemeAnotherButtonColor) ||
      '#e702d0'
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(year, month, today.getDate() - today.getDay());
    const weekDays = Array.from({length: 7}).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <WeekView
        eventType={eventType}
        eventStatus={eventStatus}
        weekOffset={weekOffset}
        weekDays={weekDays}
        markedDates={markedDates}
        toggleEventDetailsModal={toggleEventDetailsModal}
        toggleUpdateModal={toggleUpdateModal}
        toggleModal={toggleModal}
        seeMoreClicked={seeMoreClicked}
        handleSeeMore={handleSeeMore}
      />
    );
  };
  const renderDayView = () => {
    return (
      <DayView
        eventType={eventType}
        eventStatus={eventStatus}
        DayOffset={DayOffset}
        markedDates={markedDates}
        toggleEventDetailsModal={toggleEventDetailsModal}
        toggleUpdateModal={toggleUpdateModal}
        toggleModal={toggleModal}
        seeMoreClicked={seeMoreClicked}
        handleSeeMore={handleSeeMore}
      />
    );
  };
  const [numberOfEvent, setNumberOfEvent] = useState([]);

  return (
    <View style={styles.container}>
      {selected === 'day' && (
        <DayEvent
          DayOffset={DayOffset}
          user={user}
          eventType={eventType}
          toggleEventDetailsModal={toggleEventDetailsModal}
          toggleUpdateModal={toggleUpdateModal}
        />
      )}
      <View style={styles.navigation}>
        <View style={styles.navigationButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              selected === 'week'
                ? handlePrevWeek
                : selected === 'day'
                ? handlePrevDay
                : handlePrevMonth
            }>
            <LeftArrowButtonWithoutTail />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              selected === 'week'
                ? handleNextWeek
                : selected === 'day'
                ? handleNextDay
                : handleNextMonth
            }>
            <RightArrowButtonWithoutTail />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.holidayButtonContainer,
              selected === 'month' && styles.clickedStyle,
            ]}
            onPress={() => setSelected('month')}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'month' && styles.clickedStyle,
              ]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.holidayButtonContainer,
              selected === 'week' && styles.clickedStyle,
            ]}
            onPress={() => setSelected('week')}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'week' && styles.clickedStyle,
              ]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.holidayButtonContainer,
              selected === 'day' && styles.clickedStyle,
            ]}
            onPress={() => {
              setSelected('day');
            }}>
            <Text
              style={[
                styles.holidayButton,
                selected === 'day' && styles.clickedStyle,
              ]}>
              Day
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {selected === 'month' && (
        <>
          <Text style={styles.monthHeader}>
            {monthName} {year}
          </Text>
          <View style={styles.weekContainer}>
            {daysOfWeek.map((day, index) => (
              <Text
                key={index}
                style={[styles.weekday, day === 'Fri' && {color: Colors.Red}]}>
                {day}
              </Text>
            ))}
          </View>
          {weeks.map((week, index) => (
            <View key={index} style={styles.weekContainer}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth =
                  (index === 0 && day > 7) || (index >= 4 && day <= 7)
                    ? false
                    : true;
                const displayMonth = isCurrentMonth
                  ? month
                  : day > 7
                  ? prevMonth
                  : nextMonth;
                const displayYear = isCurrentMonth
                  ? year
                  : day > 7
                  ? prevYear
                  : nextYear;
                const {isHoliMarked} = isHolidayMarked(
                  day,
                  displayMonth,
                  displayYear,
                  holidays.map(item => item.date.start),
                );

                const data =
                  monthViewData[
                    moment(
                      `${displayYear}-${displayMonth + 1}-${day}`,
                      'YYYY-MM-DD',
                    ).format('YYYY-M-D')
                  ];
                const isToday =
                  todayString === `${displayYear}-${displayMonth + 1}-${day}`;
                const notPastDate =
                  new Date(todayString) <=
                  new Date(`${displayYear}-${displayMonth + 1}-${day}`);

                return (
                  <TouchableOpacity
                    onPress={() =>
                      notPastDate
                        ? (dispatch(
                            updatePickedDate({
                              day: createIsoTimestamp(
                                day,
                                displayMonth + 1,
                                displayYear,
                              ),
                              hour:
                                new Date().getMinutes() >= 45
                                  ? new Date().getUTCHours() + 1
                                  : new Date().getUTCHours(),
                              minutes: new Date().getMinutes() + 15,
                              from: 'month',
                            }),
                          ),
                          toggleModal())
                        : showAlert({
                            title: 'Invalid Date Selection',
                            type: 'warning',
                            message: 'Please select present or future date',
                          })
                    }
                    key={dayIndex}
                    style={[
                      styles.day,
                      !isCurrentMonth && styles.nonCurrentMonthDay,
                      isHoliMarked && {
                        backgroundColor: Colors.calendarHolidayBackgroundColor,
                      },
                    ]}>
                    {isToday ? (
                      <View style={styles.todayHighlight}>
                        <Text style={styles.todayText}>{day}</Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.dateText,
                          isHoliMarked && {
                            color: Colors.calendarHolidayTextColor,
                          },
                          dayIndex === 5 && {color: Colors.Red},
                        ]}>
                        {day}
                      </Text>
                    )}
                    {data?.data?.length > 3 ? (
                      <>
                        {data?.data?.slice(0, 2)?.map((item, itemIndex) => (
                          <TouchableOpacity
                            onPress={() => {
                              getEventDetails(item._id);
                              getNotificationData(item._id);

                              user._id === item?.createdBy
                                ? toggleUpdateModal(item)
                                : toggleEventDetailsModal(item);
                            }}
                            key={itemIndex}
                            style={[
                              styles?.eventTypeContainer,
                              {backgroundColor: eventType(item)},
                            ]}>
                            <View
                              style={[
                                styles?.circle,
                                {
                                  backgroundColor: eventStatus(item?.status),
                                },
                              ]}></View>
                          </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                          onPress={() => {
                            setIsPopupVisible(true);
                            setNumberOfEvent(data?.data);
                          }}>
                          <Text style={styles.seeMoreText}>
                            {data?.data?.length - 2} more
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      data?.data?.map((item, itemIndex) => (
                        <TouchableOpacity
                          onPress={() => {
                            getNotificationData(item._id);
                            getEventDetails(item._id);
                            user._id === item?.createdBy
                              ? toggleUpdateModal(item)
                              : toggleEventDetailsModal(item);
                          }}
                          key={itemIndex}
                          style={[
                            styles?.eventTypeContainer,
                            {backgroundColor: eventType(item?.eventType)},
                          ]}>
                          <View
                            style={[
                              styles.circle,
                              // { backgroundColor: eventStatus(item.status) },
                            ]}></View>
                        </TouchableOpacity>
                      ))
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </>
      )}
      {selected === 'week' && renderWeekView()}
      {selected === 'day' && renderDayView()}
      {isEventDetailsModalVisible && (
        <EventDetailsModal
          eventId={eventData._id}
          isEventDetailsModalVisible={isEventDetailsModalVisible}
          toggleEventDetailsModal={toggleEventDetailsModal}
        />
      )}
      {isPopupVisible && (
        <ReactNativeModal
          onBackdropPress={() => setIsPopupVisible(false)}
          isVisible={isPopupVisible}>
          <View style={styles.popupContainer}>
            <Text style={styles.eventDateDay}>
              {moment(numberOfEvent[0]?.start).format('dddd D')}
            </Text>
            {numberOfEvent?.map((item, itemIndex) => (
              <TouchableOpacity
                onPress={() => {
                  setIsPopupVisible(false);
                  // if (Platform.OS == "ios") {
                  //   return Alert.alert("Coming soon...");
                  // }
                  user?._id === item?.createdBy
                    ? (getEventDetails(item?._id), toggleUpdateModal(item))
                    : toggleEventDetailsModal(item);
                }}
                key={itemIndex}
                style={[
                  // styles?.eventTypeContainer,
                  {
                    backgroundColor: eventType(item?.eventType),
                    width: '100%',
                    flexDirection: 'row',
                    borderRadius: 100,
                    marginBottom: 5,
                    alignItems: 'center',
                    paddingHorizontal: responsiveScreenWidth(4),
                  },
                ]}>
                <View
                  style={{
                    width: '95%',
                    paddingVertical: responsiveScreenHeight(0.2),
                  }}>
                  <Text numberOfLines={1} style={styles.itemText}>
                    {item?.title.slice(0, 20)}
                  </Text>
                </View>
                <View style={{flexGrow: 1}}></View>

                <View
                  style={[
                    styles?.circle,
                    {
                      // backgroundColor: eventStatus(item?.status),
                      // width: 10,
                      // height: 10,
                    },
                  ]}></View>
              </TouchableOpacity>
            ))}
          </View>
          {isEventDetailsModalVisible && (
            <EventDetailsModal
              eventId={eventData._id}
              isEventDetailsModalVisible={isEventDetailsModalVisible}
              toggleEventDetailsModal={toggleEventDetailsModal}
            />
          )}
        </ReactNativeModal>
      )}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    eventDateDay: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginBottom: responsiveScreenHeight(0.5),
    },
    popupContent: {
      padding: 16,
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      borderRadius: 8,
      // minWidth: responsiveScreenWidth(50),
      //   minHeight: responsiveScreenHeight(19),
      top: responsiveScreenHeight(10),
      zIndex: 1,
    },
    popupArrow: {
      borderTopColor: 'transparent',
      // marginTop: responsiveScreenHeight(-15),
      // marginLeft: responsiveScreenHeight(-5),
    },
    popupContainer: {
      // paddingVertical: responsiveScreenHeight(2),
      // paddingHorizontal: responsiveScreenWidth(2),
      //   minWidth: responsiveScreenWidth(50),
      alignItems: 'center',
      backgroundColor: Colors.White,
      padding: 20,
      borderRadius: 10,
    },
    clickedStyle: {
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
    },
    holidayButtonContainer: {
      alignItems: 'center',
      borderRadius: 5,
      paddingVertical: responsiveScreenHeight(0.5),
      paddingHorizontal: responsiveScreenHeight(1),
    },
    holidayButton: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: Colors.White,
      paddingVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
      gap: 10,
      borderRadius: 7,
    },
    navigationButtonContainer: {
      flexDirection: 'row',
      gap: 5,
    },
    dateText: {
      height: responsiveScreenHeight(2),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(0.5),
      // backgroundColor: "red",
    },
    todayText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    eventTypeContainer: {
      width: '60%',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
      minHeight: 10,
    },
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    circle: {
      // width: 5,
      // height: 5,
      marginVertical: 2,
      backgroundColor: 'white',
      borderRadius: 100,
    },
    seeMoreText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
    container: {
      // padding: 10,
      paddingVertical: 10,
      backgroundColor: Colors.Background_color,
    },
    navigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      paddingHorizontal: 5,
    },
    monthHeader: {
      fontSize: responsiveScreenFontSize(2.2),
      textAlign: 'center',
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    weekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.White,
      // height: 40,
    },
    weekday: {
      width: '14.28%',
      textAlign: 'center',
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      textTransform: 'uppercase',
      fontSize: responsiveScreenFontSize(1.5),
      height: 30,
    },
    day: {
      width: '14.28%',
      height: responsiveScreenHeight(10),
      textAlign: 'center',
      borderWidth: 0.5,
      borderColor: Colors.BorderColor,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },

    nonCurrentMonthDay: {
      backgroundColor: Colors.Background_color,
    },
    todayHighlight: {
      width: 20,
      height: 20,
      backgroundColor: Colors.Primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      marginVertical: responsiveScreenHeight(1),
    },
  });

export default React.memo(Calendar);
