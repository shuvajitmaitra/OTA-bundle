import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../context/ThemeContext';
import CustomFonts from '../../../constants/CustomFonts';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const TextArea = ({
  placeholderText,
  setState,
  state,
  readOnly = false,
  height,
  marginTop,
  style,
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View
      style={[
        {
          height: 'auto',
          marginTop: responsiveScreenHeight(marginTop || 1),
          width: '100%',
          backgroundColor: Colors.ModalBoxColor,
          borderRadius: 10,
          borderWidth: 1,
          overflow: 'hidden',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: responsiveScreenWidth(2),
          borderColor: Colors.BorderColor,
        },
        {...style},
      ]}>
      <TextInput
        keyboardAppearance={
          Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
        }
        readOnly={readOnly}
        style={[
          {
            minHeight: responsiveScreenHeight(height || 10),
            width: '100%',
            marginHorizontal: responsiveScreenWidth(1),
            paddingRight: responsiveScreenWidth(1),
            marginVertical: responsiveScreenHeight(0.5),
            fontSize: responsiveScreenFontSize(1.8),
            color: Colors.Heading,

            fontFamily: CustomFonts.REGULAR,
            // textAlign: "justify",
            paddingVertical: responsiveScreenHeight(0.5),
            textAlignVertical: 'top',
          },
        ]}
        multiline={true}
        onChangeText={text => setState(text)}
        placeholderTextColor={Colors.BodyText}
        placeholder={placeholderText ? placeholderText : 'Write something...'}
        value={state}
      />
    </View>
  );
};

export default TextArea;

const getStyles = Colors =>
  StyleSheet.create({
    inputContainer: {},
    textAreaInput: {
      // backgroundColor: "red",
      //   backgroundColor: "red",
    },
  });
