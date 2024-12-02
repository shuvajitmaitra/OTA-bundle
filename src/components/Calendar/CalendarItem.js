import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useCallback, useEffect, useState} from 'react';
import RightArrowLong from '../../assets/Icons/RightArrowLong';
import CustomFonts from '../../constants/CustomFonts';
import EventDetailsModal from './Modal/EventDetailsModal';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import UpdateEventModal from './UpdateEventModal';
import {getEventDetails, getNotificationData} from '../../actions/chat-noti';

export const CalendarItems = item => {
  const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] =
    useState(false);
  const [modalData, setModalData] = useState({});

  const toggleEventDetailsModal = useCallback(() => {
    setIsEventDetailsModalVisible(pre => !pre);
  }, [isEventDetailsModalVisible]);
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const toggleUpdateModal = useCallback(() => {
    // setEventData(item);
    setUpdateModalVisible(prevState => !prevState);
  }, []);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const eventsDate = item.item.title.split('-')[2];

  function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {weekday: 'short'});
  }
  return (
    <View style={styles.eventTopicContainer}>
      <View style={styles.eventDateContainer}>
        <View>
          <Text style={styles.eventDay}>{getDayOfWeek(item.item.title)}</Text>
          <Text style={styles.eventDateNumber}>{eventsDate}</Text>
        </View>
        <RightArrowLong />
      </View>
      <View style={{width: '5%'}}></View>
      <View style={{width: '70%'}}>
        {item?.item?.data?.map((singleItem, index) => {
          return (
            <View key={singleItem?._id} style={styles.viewWidth}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setModalData(singleItem);

                  user._id === singleItem?.createdBy
                    ? (getEventDetails(singleItem?._id),
                      getNotificationData(singleItem?._id),
                      toggleUpdateModal())
                    : toggleEventDetailsModal(singleItem);
                }}
                style={[
                  styles.eventTitleAndDateContainer,
                  {
                    backgroundColor:
                      (singleItem?.eventType === 'showNTell' && '#619dcc') ||
                      (singleItem?.eventType === 'mockInterview' &&
                        '#f59f9f') ||
                      (singleItem?.eventType === 'orientation' && '#379793') ||
                      (singleItem?.eventType === 'technicalInterview' &&
                        '#f8a579') ||
                      (singleItem?.eventType === 'behavioralInterview' &&
                        '#0091b9') ||
                      (singleItem?.eventType === 'reviewMeeting' &&
                        '#7ccc84') ||
                      (singleItem?.eventType === 'syncUp' && '#ff6502') ||
                      (singleItem?.eventType === 'other' && Colors.OthersColor),
                  },
                ]}>
                <Text
                  style={{
                    color: Colors.PureWhite,
                    fontFamily: CustomFonts.MEDIUM,
                  }}>
                  {singleItem?.title}
                  {/* {(singleItem?.eventType === "showNTell" && "Show N Tell") ||
                    (singleItem?.eventType === "mockInterview" &&
                      "Mock Interview") ||
                    (singleItem?.eventType === "orientation" &&
                      "Orientation Meeting") ||
                    (singleItem?.eventType === "technicalInterview" &&
                      "Technical Interview") ||
                    (singleItem?.eventType === "behavioralInterview" &&
                      "Behavioral Interview") ||
                    (singleItem?.eventType === "reviewMeeting" &&
                      "Review Meeting") ||
                    (singleItem?.eventType === "syncUp" && "Sync up Call") ||
                    (singleItem?.eventType === "other" && "Others")} */}
                </Text>
                <Text
                  style={{
                    color: Colors.PureWhite,
                    fontFamily: CustomFonts.REGULAR,
                    fontSize: responsiveScreenFontSize(1.5),
                  }}>
                  {moment(singleItem?.start).format('h:mm A') +
                    ' - ' +
                    moment(singleItem?.end).format('h:mm A')}
                </Text>
              </TouchableOpacity>
              {/* <Text style={styles.EditorNameDate}>
                <Text style={{ color: "black", fontWeight: "500" }}>
                  Edited:
                </Text>{" "}
                Abdullah Noman - Feb 20, 2024
              </Text> */}
            </View>
          );
        })}
        {isEventDetailsModalVisible && (
          <EventDetailsModal
            eventId={modalData._id}
            isEventDetailsModalVisible={isEventDetailsModalVisible}
            toggleEventDetailsModal={toggleEventDetailsModal}
          />
        )}
        {updateModalVisible && (
          <UpdateEventModal
            modalVisible={updateModalVisible}
            setModalVisible={setUpdateModalVisible}
          />
        )}
      </View>
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    EditorNameDate: {
      fontSize: responsiveScreenFontSize(1.4),
      paddingTop: responsiveScreenHeight(0.5),
      color: '#546A7E',
      width: '100%',
    },
    eventTitleAndDateContainer: {
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(0.5),
      marginBottom: 8,
      borderRadius: 10,
      width: '100%',
    },
    viewWidth: {
      // backgroundColor: "salmon",
      width: responsiveScreenWidth(65),
      flex: 1,
      flexDirection: 'column',
    },
    eventDateNumber: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.7),
      color: Colors.Heading,
    },
    eventDay: {
      color: Colors.BodyText,
    },
    eventTopicContainer: {
      flexDirection: 'row',
      // gap: responsiveScreenWidth(4),
      // justifyContent: "space-between",
      // backgroundColor: "blue",
    },
    eventDateContainer: {
      // backgroundColor: "red",
      width: '15%',
      flexDirection: 'row',
      // alignItems: "center",
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(1),
      // width: "100%",
    },
  });
