import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import GreenDotSvgComponent from '../assets/Icons/GreenDotSvgComponent';
import OrangeDotSvgComponent from '../assets/Icons/OrangeDotSvgComponent';
import RedDotSvgComponent from '../assets/Icons/RedDotSvgComponent';
import BlueDotSvgComponent from '../assets/Icons/BlueDotSvgComponent';
import PurpleLightSvgComponent from '../assets/Icons/PurpleLightSvgComponent';
import {useTheme} from '../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  setEventStatus,
  setMonthViewData,
  updateCalendar,
} from '../store/reducer/calendarReducer';
import moment from 'moment';
import CustomFonts from '../constants/CustomFonts';
import {RegularFonts} from '../constants/Fonts';

const DotComponent2 = () => {
  const {events, eventStatus} = useSelector(state => state.calendar);
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleButtonPress = status => {
    console.log('status', JSON.stringify(status, null, 2));
    if (status === eventStatus) {
      return;
    }
    dispatch(setEventStatus(status));

    const filteredEvents =
      status === 'all'
        ? events
        : status === 'myEvents'
        ? events.filter(item => item.createdBy?._id === user._id)
        : events.filter(item => item.myParticipantData?.status === status);
    const formattedEvents = filteredEvents.map(e => ({
      title: moment(e.start).format('YYYY-M-D'),
      data: {...e},
    }));

    const groupedEvents = [
      ...formattedEvents
        .reduce((map, {title, data}) => {
          if (!map.has(title)) map.set(title, {title, data: []});
          map.get(title).data.push(data);
          return map;
        }, new Map())
        .values(),
    ];
    const monthViewData = groupedEvents.reduce((acc, item) => {
      acc[item.title] = item;
      return acc;
    }, {});
    dispatch(setMonthViewData(monthViewData));
    dispatch(updateCalendar(groupedEvents));
  };

  return (
    <View style={styles.dotContainer}>
      <TouchableOpacity
        onPress={() => handleButtonPress('all')}
        style={styles.dot}>
        <Text
          style={[
            styles.text,
            eventStatus === 'all' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          All Events
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('accepted')}
        style={styles.dot}>
        <GreenDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'accepted' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Accepted
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('myEvents')}
        style={styles.dot}>
        <PurpleLightSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'myEvents' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          My Events
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('pending')}
        style={styles.dot}>
        <OrangeDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'pending' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Pending
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('denied')}
        style={styles.dot}>
        <RedDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'denied' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Denied
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleButtonPress('proposedNewTime')}
        style={styles.dot}>
        <BlueDotSvgComponent />
        <Text
          style={[
            styles.text,
            eventStatus === 'proposedNewTime' && {
              color: Colors.Primary,
              textDecorationLine: 'underline',
            },
          ]}>
          Proposed New Time
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DotComponent2;

const getStyles = Colors =>
  StyleSheet.create({
    text: {
      color: Colors.Heading,
      // color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
    dotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
      flexWrap: 'wrap',
      gap: 10,
    },
    dotCon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(11),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1),
    },
    dot: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingBottom: 5,
    },
  });
