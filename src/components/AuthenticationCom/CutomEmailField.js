import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import EmailIcon from '../../assets/Icons/EmailIcon';
import {useTheme} from '../../context/ThemeContext';

export default function CutomEmailField({
  title,
  setText,
  placeholder,
  value,
  onEndEditing,
  errorText,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldText}>{title}</Text>
      <View
        style={[
          styles.inputContainer,
          {borderColor: !errorText ? Colors.BorderColor : Colors.Red},
        ]}>
        <EmailIcon />
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          onChangeText={text => {
            setText(text);
          }}
          style={styles.textInput}
          placeholder={placeholder}
          onEndEditing={onEndEditing}
          placeholderTextColor={Colors.BodyText}
          value={value}
        />
      </View>
      {!errorText ? null : <Text style={styles.incorrectMsg}>{errorText}</Text>}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    fieldContainer: {
      width: responsiveScreenWidth(90),
      alignSelf: 'center',
      marginTop: responsiveScreenHeight(2),
    },
    fieldText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
      marginLeft: 2,
    },
    inputContainer: {
      width: responsiveScreenWidth(90),
      height: responsiveScreenHeight(6),
      backgroundColor: Colors.White,
      borderRadius: 10,
      borderWidth: 1,
      overFlow: 'hidden',
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
    },
    icon: {
      color: Colors.BodyText,
    },
    textInput: {
      width: responsiveScreenWidth(73),
      marginLeft: responsiveScreenWidth(3),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    incorrectMsg: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginLeft: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },
  });
