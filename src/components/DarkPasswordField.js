import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {Popover, usePopover} from 'react-native-modal-popover';

import CustomFonts from '../constants/CustomFonts';
import {useTheme} from '../context/ThemeContext';
import RequireFieldStar from '../constants/RequireFieldStar';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import EyeClose from '../assets/Icons/EyeClose';
import EyeIcon from '../assets/Icons/EyeIcon';
import TargetIcon from '../assets/Icons/TargetIcon';

export default function DarkPasswordField({
  title,
  setText,
  placeholder,
  iconName,
  bottomDetails,
  isRequire,
  isValidPassword,
  top = 8,
  left = -5,
  errorText,
}) {
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  const [showPassword, setShowPassword] = useState(false);
  const Colors = useTheme();
  const styles = getStyles(Colors);

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
          size={responsiveScreenWidth(4)}
          style={styles.icon}
        /> */}

        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'dark' : 'light'
          }
          onChangeText={text => {
            setText(text);
          }}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.BodyText}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => {
            setShowPassword(!showPassword);
          }}>
          {showPassword ? <EyeClose /> : <EyeIcon />}
        </TouchableOpacity>
      </View>
      {errorText ? (
        <Text style={styles.incorrectMsg}>{errorText}</Text>
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.details}>{bottomDetails}</Text>
          <TouchableOpacity ref={touchableRef} onPress={openPopover}>
            <>
              <TargetIcon />
              <Popover
                contentStyle={[
                  styles.popupContent,
                  {
                    left: responsiveScreenWidth(left),
                    top: responsiveScreenHeight(top),
                  },
                ]}
                arrowStyle={styles.popupArrow}
                backgroundStyle={{backgroundColor: Colors.BackDropColor}}
                visible={popoverVisible}
                onClose={closePopover}
                fromRect={popoverAnchorRect}
                supportedOrientations={['portrait', 'landscape']}
                placement="auto"
                fromTouchable={null}>
                <>
                  <View style={styles.popupTopTextContainer}>
                    <TouchableOpacity onPress={closePopover}>
                      <ArrowLeft />
                    </TouchableOpacity>
                    <Text style={styles.popupTopTitleText}>
                      Must be at least 8 characters
                    </Text>
                  </View>
                  <View style={styles.line} />
                  <Text style={styles.title}>It's better to have:</Text>
                  <Text style={styles.text}>
                    1. Upper and lower case letters
                  </Text>
                  <Text style={styles.text}>2. A Symbol (@$&)</Text>
                  <Text style={styles.text}>3. A longer password</Text>
                </>
              </Popover>
            </>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    fieldContainer: {
      width: responsiveScreenWidth(80),
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
      width: responsiveScreenWidth(80),
      height: responsiveScreenHeight(6),
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
    },
    icon: {
      color: Colors.BodyText,
    },
    textInput: {
      width: responsiveScreenWidth(60),
      // marginLeft: responsiveScreenWidth(3),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    eyeIcon: {
      color: Colors.BodyText,
    },
    detailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 2,
      marginTop: responsiveScreenHeight(1),
    },
    details: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.4),
      marginRight: 5,
    },
    targetIcon: {
      color: Colors.BodyText,
    },
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(73),
      height: responsiveScreenHeight(20),
      position: 'absolute',
    },
    popupArrow: {
      marginTop: responsiveScreenHeight(-1),
      borderTopColor: Colors.White,
      marginLeft: responsiveScreenWidth(2),
      zIndex: -1,
    },

    popupTopTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    popupTopTitleText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.7),
    },
    line: {
      width: responsiveScreenWidth(65),
      height: 1.5,
      backgroundColor: Colors.LineColor,
      alignSelf: 'center',
      marginVertical: responsiveScreenHeight(1.5),
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
    },
    text: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.7),
      marginLeft: responsiveScreenWidth(2),
    },
    incorrectMsg: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginLeft: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },
  });
