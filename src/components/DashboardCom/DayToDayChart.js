import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BarChart} from 'react-native-svg-charts';
import {Rect} from 'react-native-svg';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import axiosInstance from '../../utility/axiosInstance';
import moment from 'moment';

const DayToDayChart = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [timeFrame, setTimeFrame] = useState('week');
  const [dayToday, setDayToday] = useState([]);
  const option = ['week', 'month'];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .post('dashboard/portal', {
        dayToday: {
          timeFrame,
        },
      })
      .then(res => {
        setDayToday(res.data.data.dayToday.results);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(
          'error you got Day to day Cart',
          JSON.stringify(error.response.data, null, 1),
        );
        setIsLoading(false);
      });
  }, [timeFrame]);
  // console.log("day to day  data", JSON.stringify(dayToday, null, 2));
  const data = dayToday?.map(result => result?.count) || [];
  const day =
    dayToday?.map(result =>
      result.label.startsWith('Week')
        ? `W ${result.label.split(' ')[1]}`
        : moment(result?.label, 'MMMM YYYY').format('MMM YY'),
    ) || [];

  const CustomBar = ({x, y, bandwidth, data}) =>
    data.map((value, index) => (
      <Rect
        key={index}
        x={x(index)}
        y={y(value)}
        rx={5}
        ry={5}
        width={bandwidth}
        height={y(0) - y(value)}
        fill={Colors.Primary}
      />
    ));

  const Labels = ({x, y, bandwidth, data}) =>
    day.map((value, index) => (
      <Text key={index} style={[styles.level]}>
        {0}
      </Text>
    ));

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Day-to-Day Activities</Text>
        <CustomDropDownTwo
          flex={0.6}
          data={option}
          state={timeFrame}
          setState={setTimeFrame}
        />
      </View>
      <View>
        <BarChart
          style={{height: 200, width: '100%'}}
          data={data}
          contentInset={{top: 5, bottom: responsiveScreenHeight(1)}}
          spacingInner={0.5}
          spacingOuter={0.2}
          gridMin={0}
          svg={{fill: 'none'}}>
          <CustomBar />
        </BarChart>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: responsiveScreenWidth(73),
            marginHorizontal: responsiveScreenWidth(4.5),
            // backgroundColor: "green",
          }}>
          {day?.map((item, index) => (
            <Text style={styles.label} key={index}>
              {item}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    label: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
      color: Colors.BodyText,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: responsiveScreenHeight(2),
      zIndex: 2,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
  });

export default DayToDayChart;
