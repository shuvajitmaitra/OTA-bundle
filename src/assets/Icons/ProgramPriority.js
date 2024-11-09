import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import {Text} from 'react-native';
import MediumPriorityIcon from '../../assets/Icons/MediumPriorityIcon';
import PinIcon from '../../assets/Icons/PinIcon';
import CustomFonts from '../../constants/CustomFonts';
import LowPriorityIcon from '../../assets/Icons/LowPriorityIcon';
import HighPriorityIcon from '../../assets/Icons/HighPriorityIcon';
import CompleteIcon from '../../assets/Icons/CompleteIcon';
import TranscribeIcon from '../../assets/Icons/TranscribeIcon';
import IncompleteIcon from '../../assets/Icons/IncompleteIcon';
import Priority from './Priority';

export default function ProgramPriority() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <SafeAreaView style={{marginVertical: responsiveScreenHeight(1)}}>
      <View style={styles.container}>
        <View style={styles.priorityContainer}>
          <HighPriorityIcon />
          <Text style={styles.highText}>- High Priority</Text>
        </View>
        <View style={styles.priorityContainer}>
          <MediumPriorityIcon />
          <Text style={styles.mediumText}>- Medium Priority</Text>
        </View>
        <View style={styles.priorityContainer}>
          <LowPriorityIcon />
          <Text style={styles.lowText}>- Low Priority</Text>
        </View>
        <View style={styles.priorityContainer}>
          <PinIcon size={11} />
          <Text style={styles.text}>- Pinned</Text>
        </View>
      </View>
      <View style={styles.container2}>
        <View style={styles.priorityContainer}>
          <TranscribeIcon />
          <Text style={styles.text}>- Transcribe</Text>
        </View>
        <View style={styles.priorityContainer}>
          <CompleteIcon />
          <Text style={styles.text}>- Complete</Text>
        </View>

        <View style={styles.priorityContainer}>
          <IncompleteIcon />
          <Text style={styles.text}>- Incomplete</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container2: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginTop: responsiveScreenWidth(2),
    },
    priorityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    highText: {
      color: Colors.Red,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
    mediumText: {
      color: '#FFA500',
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
    lowText: {
      color: Colors.Primary,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
    text: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.2),
    },
  });
