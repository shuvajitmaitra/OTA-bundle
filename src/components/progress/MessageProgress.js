import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import Divider from '../SharedComponent/Divider';
import ArrowTopRight from '../../assets/Icons/ArrowTopRight';
import CustomDropDownTwo from '../SharedComponent/CustomDropDownTwo';
import CustomFonts from '../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import {useNavigation} from '@react-navigation/native';

const MessageProgress = ({message}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.HeadingText}>Message</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('HomeStack', {screen: 'NewChatScreen'})
          }>
          <ArrowTopRight />
        </TouchableOpacity>
      </View>

      <Divider />
      <View style={styles.cartContainer}>
        <View style={styles.progress}>
          <AnimatedProgressWheel
            size={responsiveScreenWidth(40)}
            width={responsiveScreenWidth(5)}
            // rounded={false}
            color={Colors.Primary}
            progress={(message?.count / message?.limit) * 100 || 0}
            backgroundColor={Colors.PrimaryOpacityColor}
            rotation={'30deg'}
            showProgressLabel={true}
            rounded={true}
            labelStyle={styles.progressLabel}
            showPercentageSymbol={true}
          />
        </View>
        <View style={{flexGrow: 1}}></View>
        {
          <Text style={styles.details}>
            {message?.count} out of {message?.limit}
          </Text>
        }
      </View>
    </View>
  );
};

export default MessageProgress;

const getStyles = Colors =>
  StyleSheet.create({
    progress: {
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(1),
    },
    details: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      marginTop: responsiveScreenHeight(1.5),
      textAlign: 'center',
    },
    progressLabel: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(4),
      color: Colors.Primary,
    },
    container: {
      backgroundColor: Colors.White,
      marginVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      padding: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    HeadingText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2.5),
    },
    cartContainer: {
      minWidth: '100%',
      alignItems: 'center',
      // marginTop: responsiveScreenHeight(2),
    },
  });
