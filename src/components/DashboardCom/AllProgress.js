import React, {useEffect, useMemo, useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import CustomPieChart from '../SharedComponent/CustomPieChart';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import axiosInstance from '../../utility/axiosInstance';
import {useSelector} from 'react-redux';

function AllProgress() {
  const [value, setValue] = useState('This Year');

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {pieData = [], progressData = []} = useSelector(
    state => state.dashboard,
  );
  // console.log(JSON.stringify(progressData, null, 2));
  // Handle cases where progressData is undefined or empty
  const totalValue = progressData.reduce((sum, item) => sum + item.value, 0);

  const Legend = () => (
    <View style={styles.legendContainer}>
      {progressData.map(item => {
        const percentage =
          totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(0) : 0; // Calculate percentage
        return (
          <View key={item.key} style={styles.legendItem}>
            <View
              style={[styles.legendColor, {backgroundColor: item.svg.fill}]}
            />
            <View style={styles.legendData}>
              {/* Wrap all text in <Text> components */}
              <Text style={styles.legendLabel}>
                {item.label}:{' '}
                <Text style={styles.legendValue}>{percentage}%</Text>
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Overall Progress</Text>
        {/* Uncomment this only if CustomDropDownTwo is correctly handling text */}
        {/* <CustomDropDownTwo data={data} state={value} setState={setValue} /> */}
      </View>

      {pieData.length === 0 || totalValue === 0 ? (
        <CustomPieChart
          pieData={[
            {
              key: 'empty',
              value: 100,
              svg: {fill: '#d3d3d3'},
            },
          ]}
          showPercentage={false} // Add this to hide the central percentage
        />
      ) : (
        <>
          <CustomPieChart pieData={pieData} />
          <View style={styles.legendWrapper}>
            {pieData.map(item => (
              <View key={item.key} style={styles.legendRow}>
                <View
                  style={[
                    styles.legendSquare,
                    {backgroundColor: item.svg.fill},
                  ]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
          <Legend />
        </>
      )}
    </ScrollView>
  );
}

export default React.memo(AllProgress);

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      // paddingHorizontal: responsiveScreenWidth(2),
    },

    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: responsiveScreenHeight(2),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
      marginBottom: responsiveScreenHeight(2),
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    legendWrapper: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(2),
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      // backgroundColor: 'red',
    },
    legendSquare: {
      width: responsiveScreenFontSize(2.5),
      height: responsiveScreenFontSize(2.5),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 4,
      overflow: 'hidden',
    },
    legendText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
    },
    legendContainer: {
      marginTop: responsiveScreenHeight(3),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1.5),
    },
    legendData: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    legendColor: {
      width: responsiveScreenWidth(5),
      height: responsiveScreenHeight(2.5),
      marginRight: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(1),
    },
    legendLabel: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    legendValue: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
  });
