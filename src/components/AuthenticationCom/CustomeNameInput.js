import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';

export default function CustomeNameInput({
  title,
  setText,
  placeholder,
  iconName,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldText}>{title}</Text>
      <View style={styles.inputContainer}>
        {/* <Feather
          name={iconName}
          size={responsiveScreenWidth(5)}
          style={styles.icon}
        /> */}
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          onChangeText={text => {
            setText(text);
          }}
          style={styles.textInput}
          placeholder={placeholder}
        />
      </View>
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
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      overflow: 'hidden',
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
  });
