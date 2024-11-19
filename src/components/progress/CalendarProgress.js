import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CalendarProgressCart from './CalendarProgressCart';
import {useTheme} from '../../context/ThemeContext';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import Divider from '../SharedComponent/Divider';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

function transformCalendarDataDynamic(calendar) {
  // Define a mapping of keys to their descriptions
  const keyDescriptions = {
    total: 'Total Event',
    totalAccepted: 'Accepted',
    totalPending: 'Pending',
    totalDenied: 'Denied',
    totalFinished: 'Total Finished',
    totalProposedTime: 'Proposed Times',
  };

  const keys = Object.keys(calendar).slice(1, -1);

  return keys.map(key => ({
    name: keyDescriptions[key] || key, // Default to the key name if no description is found
    key: key,
    value: calendar[key],
  }));
}

const CalendarProgress = () => {
  const {calendar} = useSelector(state => state.dashboard);
  const [value, setValue] = useState('Year');
  const navigation = useNavigation();
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const data = ['Day', 'Week', 'Month', 'Year'];
  // console.log("calendar.results", JSON.stringify(calendar.results, null, 1));
  const progressData = [
    {
      title: 'Accepted',
      value:
        (calendar?.total ?? 0) -
        (calendar?.upcoming ?? 0) -
        (calendar?.recurrent ?? 0),
      percentage:
        ((calendar?.total -
          (calendar?.upcoming ?? 0) -
          (calendar?.recurrent ?? 0)) /
          calendar?.total) *
          100 || 0,
      color: Colors.Primary,
    },
    {
      title: 'Denied',
      value: calendar?.recurrent ?? 0,
      percentage: (calendar?.recurrent / calendar?.total) * 100 || 0,
      color: Colors.Red,
    },
    {
      title: 'Pending',
      value: calendar?.upcoming ?? 0,
      percentage: (calendar?.upcoming / calendar?.total) * 100 || 0,
      color: '#FFB800',
    },
    {
      title: 'Total Finished',
      value: calendar?.finished ?? 0,
      percentage: (calendar?.finished / calendar?.total) * 100 || 0,
      color: Colors.Primary,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <Text style={styles.HeadingText}>Calendar</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('MyCalenderStack', {screen: 'MyCalender'})
            }>
            <ArrowTopRight />
          </TouchableOpacity>
        </View>
        {/* <CustomDropDownTwo data={data} state={value} setState={setValue} /> */}
      </View>

      <Divider />
      <View>
        <View style={styles.container2}>
          {progressData.slice(0, 2).map((item, index) => (
            <View key={index} style={styles.box}>
              <CalendarProgressCart
                title={item.title}
                value={item.value.toString()}
                percentage={item.percentage}
                color={item.color}
              />
            </View>
          ))}
        </View>

        <View style={[styles.container2, styles.bottom]}>
          {progressData.slice(2, 4).map((item, index) => (
            <View key={index} style={styles.box}>
              <CalendarProgressCart
                title={item.title}
                value={item.value.toString()}
                percentage={item.percentage}
                color={item.color}
              />
            </View>
          ))}
        </View>
        {/* <View style={{ flexDirection: "row", gap: 20, marginBottom: 20 }}>
          <CalendarProgressCart
            color={Colors.Primary}
            title={"Total Accepted"}
            value={86}
            percentage={57}
          />
          <CalendarProgressCart
            color={Colors.Red}
            title={"Denied"}
            value={14}
            percentage={10}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <CalendarProgressCart
            color={Colors.ThemeSecondaryColor}
            title={"Pending"}
            value={44}
            percentage={57}
          />
          <CalendarProgressCart
            color={Colors.Primary}
            title={"Finished"}
            value={86}
            percentage={57}
          />
        </View> */}
      </View>
    </View>
  );
};

export default CalendarProgress;

const getStyles = Colors =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 10,
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    cartContainer: {
      minWidth: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    container: {
      backgroundColor: Colors.White,
      marginVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      padding: 20,
      // zIndex: -10,
    },
    container2: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenHeight(2),
    },
    bottom: {
      marginTop: responsiveScreenHeight(2),
    },
  });
