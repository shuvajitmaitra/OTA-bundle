import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {ProgressBar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';

export default function ProgramTimeTracker() {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [myProgressMetrics, setMyProgressMetrics] = React.useState(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      try {
        let myprogress = await axiosInstance.get('/progress/myprogress');
        setMyProgressMetrics(myprogress.data?.metrics || []);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate('Prograss');
      }}
      style={styles.container}>
      <Text style={styles.time}>Progress</Text>
      <ProgressBar
        progress={myProgressMetrics?.overallPercentageAllItems || 0}
        style={styles.progress}
        color={Colors.BodyText}
      />
      <Text style={styles.dueText}>
        Overall Precentage {myProgressMetrics?.overallPercentageAllItems}%
      </Text>
    </TouchableOpacity>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      width: responsiveScreenWidth(90),
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(2),
      marginTop: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      alignSelf: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    time: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    progress: {
      width: '100%',
      height: 10,
      borderRadius: 10,
      marginTop: responsiveScreenHeight(1.5),
    },
    dueText: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginTop: responsiveScreenHeight(2),
    },
  });
