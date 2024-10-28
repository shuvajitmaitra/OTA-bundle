import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import CustomeFonts from '../../constants/CustomeFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

const ScreenHeader = () => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButtonContainer}
        onPress={() => navigation.goBack()}>
        <ArrowLeft color={Colors.BodyText} />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeader;

const getStyles = Colors =>
  StyleSheet.create({
    headerContainer: {
      height: 50,
      justifyContent: 'center',
      paddingHorizontal: 10,
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 1,
    },
    backButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 10,
      fontFamily: CustomeFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.BodyText,
    },
  });
