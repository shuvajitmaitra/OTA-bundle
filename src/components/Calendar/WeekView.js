import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {updatePickedDate} from '../../store/reducer/calendarReducer';
import {getEventDetails, getNotificationData} from '../../actions/chat-noti';
import ReactNativeModal from 'react-native-modal';
import ArrowRight from '../../assets/Icons/ArrowRight';

export const hours = Array.from({length: 24}, (_, i) => {
  const time =
    i === 0
      ? '12 AM'
      : i < 12
      ? `${i} AM`
      : i === 12
      ? '12 PM'
      : `${i - 12} PM`;
  return {label: time, hour: i};
});

const WeekView = ({
  markedDates,
  weekOffset,
  eventType,
  eventStatus,
  toggleEventDetailsModal,
  toggleUpdateModal,
  toggleModal,
  seeMoreClicked,
  handleSeeMore,
}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const startOfWeek = useMemo(
    () => moment().add(weekOffset, 'weeks').startOf('week'),
    [weekOffset],
  );
  const endOfWeek = useMemo(
    () => moment().add(weekOffset, 'weeks').endOf('week'),
    [weekOffset],
  );

  const days = useMemo(() => {
    const daysArray = [];
    let day = startOfWeek;
    while (day <= endOfWeek) {
      daysArray.push(day.toDate());
      day = day.clone().add(1, 'd');
    }
    return daysArray;
  }, [startOfWeek, endOfWeek]);

  const eventsByDayAndHour = useMemo(() => {
    const eventsMap = {};
    markedDates.forEach(dayEvent => {
      const date = moment(dayEvent.title).format('YYYY-MM-DD');
      dayEvent.data.forEach(event => {
        const hour = moment(event.start).hour();
        if (!eventsMap[date]) {
          eventsMap[date] = {};
        }
        if (!eventsMap[date][hour]) {
          eventsMap[date][hour] = [];
        }
        eventsMap[date][hour].push(event);
      });
    });
    return eventsMap;
  }, [markedDates]);

  const getEventsForDayAndHour = (day, hour) => {
    const dateString = moment(day).format('YYYY-MM-DD');
    return eventsByDayAndHour[dateString]?.[hour] || [];
  };
  const newHours = seeMoreClicked ? hours : hours.slice(0, 7);
  return (
    <ScrollView>
      <Text style={styles.monthHeader}>{`${moment(startOfWeek).format(
        'MMMM DD',
      )} - ${moment(endOfWeek).format('MMMM DD')}`}</Text>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Text style={[styles.hourText, styles.timeText]}>Time</Text>
          {newHours?.map((hour, index) => (
            <View key={index} style={[styles.hourRow]}>
              <Text style={[styles.hourText]}>{hour.label}</Text>
            </View>
          ))}
        </View>
        <ScrollView horizontal>
          <View style={styles.weekHeader}>
            {days.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={{
                  width: responsiveScreenWidth(12.5),
                  borderTopWidth: 1,
                  borderTopColor: Colors.BorderColor,
                  borderRightWidth: 1,
                  borderRightColor: Colors.BorderColor,
                }}>
                <Text style={[styles.weekday]}>{moment(day).format('DD')}</Text>
                <Text style={[styles.weekday, {marginBottom: 8}]}>
                  {moment(day).format('ddd')}
                </Text>
                {newHours?.map((hour, hourIndex) => {
                  const events = getEventsForDayAndHour(day, hour.hour);
                  const newEvents =
                    events?.length > 2 ? events.slice(0, 2) : events;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(updatePickedDate({day, hour: hour.hour}));
                        toggleModal();
                      }}
                      key={hourIndex}
                      style={styles.hourRow}>
                      {events?.length > 0 ? (
                        <>
                          {newEvents.map((item, itemIndex) => (
                            <TouchableOpacity
                              onPress={() => {
                                getEventDetails(item?._id);
                                getNotificationData(item?._id);
                                user._id === item?.createdBy?._id
                                  ? toggleUpdateModal(item)
                                  : toggleEventDetailsModal(item);
                              }}
                              key={itemIndex}
                              style={[
                                styles.eventTypeContainer,
                                {backgroundColor: eventType(item.eventType)},
                              ]}>
                              <View
                                style={[
                                  styles.circle,
                                  {
                                    backgroundColor: eventStatus(item.status),
                                  },
                                ]}></View>
                            </TouchableOpacity>
                          ))}
                          {events?.length > 2 && (
                            <TouchableOpacity
                              onPress={() => {
                                setEvents(events);
                                setIsPopupVisible(true);
                              }}>
                              <Text style={styles.seeMoreText}>
                                {events?.length - 2} More
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      ) : (
                        <Text style={styles.noMarker}></Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      {isPopupVisible && (
        <ReactNativeModal
          onBackdropPress={() => setIsPopupVisible(false)}
          isVisible={isPopupVisible}>
          <View style={styles.popupContainer}>
            <Text style={styles.eventDateDay}>
              {moment(events[0]?.start).format('dddd D')}
            </Text>
            {events?.map((item, itemIndex) => (
              <TouchableOpacity
                onPress={() => {
                  setIsPopupVisible(false);
                  user?._id === item?.createdBy?._id
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
          {/* {isEventDetailsModalVisible && (
                            <EventDetailsModal
                              item={eventData}
                              isEventDetailsModalVisible={
                                isEventDetailsModalVisible
                              }
                              toggleEventDetailsModal={toggleEventDetailsModal}
                            />
                          )} */}
        </ReactNativeModal>
      )}
      <TouchableOpacity
        onPress={() => handleSeeMore()}
        style={styles.moreButtonContainer}>
        <Text style={styles.moreButtonText}>
          {seeMoreClicked ? 'Less' : 'More'}
        </Text>
        <ArrowRight />
      </TouchableOpacity>
    </ScrollView>
  );
};

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
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    seeMoreText: {
      color: Colors.BodyText,
      textAlign: 'center',
      fontSize: responsiveScreenFontSize(1.2),
      fontFamily: CustomFonts.REGULAR,
    },
    eventTypeContainer: {
      width: '60%',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 3,
      minHeight: responsiveScreenHeight(1),
    },
    circle: {
      marginVertical: 2,
      backgroundColor: 'white',
      borderRadius: 100,
    },
    monthHeader: {
      fontSize: responsiveScreenFontSize(2.2),
      textAlign: 'center',
      marginBottom: responsiveScreenHeight(1),
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: Colors.White,
    },
    leftColumn: {
      width: responsiveScreenWidth(10),
      backgroundColor: Colors.Background_color,
      borderLeftColor: Colors.BorderColor,
      borderLeftWidth: 1,
      // minHeight: responsiveScreenHeight(70),
    },
    hourRow: {
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: Colors.BorderColor,
      // backgroundColor: "red",
    },
    hourText: {
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
    },
    timeText: {
      paddingVertical: 5,
      paddingTop: responsiveScreenHeight(1.5),
      height: 49,
      color: 'green',
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
    },
    rightColumn: {
      flexDirection: 'column',
    },
    weekHeader: {
      flexDirection: 'row',
    },
    weekday: {
      textAlign: 'center',
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
      textTransform: 'uppercase',
      height: 20,
    },
    marker: {
      width: 10,
      height: 10,
      backgroundColor: Colors.ThemeSecondaryColor2,
      borderRadius: 5,
    },
    noMarker: {
      width: 10,
      height: 10,
      backgroundColor: 'transparent',
    },
  });

export default WeekView;
