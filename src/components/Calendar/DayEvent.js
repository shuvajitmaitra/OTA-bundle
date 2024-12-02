import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {getNotificationData} from '../../actions/chat-noti';
import EventDetailsModal from './Modal/EventDetailsModal';
import UpdateEventModal from './UpdateEventModal';

const DayEvent = ({DayOffset, user, eventType}) => {
  const {monthViewData} = useSelector(state => state.calendar);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  var startOfDay = moment().add(DayOffset, 'days').startOf('day');
  const dayEvent = monthViewData[moment(startOfDay).format('YYYY-M-D')];
  const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] =
    useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [eventId, setEventId] = useState('');
  if (!dayEvent?.data?.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      {dayEvent?.data?.length > 0 ? (
        dayEvent?.data?.map(item => (
          <TouchableOpacity
            onPress={() => {
              setEventId(item._id);
              // getEventDetails(item._id);
              getNotificationData(item._id);
              user._id === item?.createdBy
                ? setIsUpdateModalVisible(!isUpdateModalVisible)
                : setIsEventDetailsModalVisible(!isEventDetailsModalVisible);
            }}
            key={item._id}
            style={[
              // styles?.eventTypeContainer,
              {
                backgroundColor: eventType(item?.eventType),
                // width: "70%",
                flexDirection: 'row',
                borderRadius: 100,
                alignItems: 'center',
                paddingHorizontal: responsiveScreenWidth(2),
                marginRight: 10,
              },
            ]}>
            <View
              style={{
                // width: "95%",
                paddingVertical: responsiveScreenHeight(0.2),
                marginRight: 5,
              }}>
              <Text numberOfLines={1} style={styles.itemText}>
                {item?.title.slice(0, 10)}
              </Text>
            </View>
            {/* <View style={{ flexGrow: 1 }}></View> */}
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{
            width: '100%',
          }}>
          <Text style={styles.notAvailable}>No Event Available</Text>
        </View>
      )}
      <EventDetailsModal
        isEventDetailsModalVisible={isEventDetailsModalVisible}
        toggleEventDetailsModal={() =>
          setIsEventDetailsModalVisible(!isEventDetailsModalVisible)
        }
        eventId={eventId}
      />
      <UpdateEventModal
        eventId={eventId}
        modalVisible={isUpdateModalVisible}
        setModalVisible={setIsUpdateModalVisible}
      />
    </View>
  );
};

export default DayEvent;

const getStyles = Colors =>
  StyleSheet.create({
    itemText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    container: {
      backgroundColor: Colors.White,
      marginBottom: 10,
      paddingVertical: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    notAvailable: {
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      textAlign: 'center',
    },
  });
