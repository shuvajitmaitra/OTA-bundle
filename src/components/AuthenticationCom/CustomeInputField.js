import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import RequireFieldStar from '../../constants/RequireFieldStar';

export default function CustomeInputField({
  title,
  setText,
  text,
  placeholder,
  iconName,
  onEndEditing,
  errorText,
  isRequire,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const handleTextChange = text => {
    const capitalizedText = text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setText(capitalizedText);
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldText}>
        {title}
        {isRequire && <RequireFieldStar />}
      </Text>
      <View
        style={[
          styles.inputContainer,
          {borderColor: !errorText ? Colors.BorderColor : Colors.Red},
        ]}>
        {/* <Feather
          name={iconName}
          size={responsiveScreenWidth(5)}
          style={styles.icon}
        /> */}
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          onChangeText={handleTextChange}
          style={styles.textInput}
          value={text}
          placeholder={placeholder}
          onEndEditing={onEndEditing}
          placeholderTextColor={Colors.BodyText}
          autoCapitalize="none"
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
      textTransform: 'lowercase',
    },
    incorrectMsg: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginLeft: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },
  });
