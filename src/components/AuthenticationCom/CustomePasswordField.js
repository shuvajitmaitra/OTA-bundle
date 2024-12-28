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

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import RequireFieldStar from '../../constants/RequireFieldStar';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

export default function CustomePasswordField({
  title,
  setText,
  placeholder,
  iconName,
  buttomDetails,
  isValidPassword,
  isRequire,
  top = 8,
  left = -5,
  errorText,
}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  const [showPassword, setShowPassword] = useState(false);
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
          onChangeText={text => {
            setText(text.trim());
          }}
          style={styles.textInput}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          placeholderTextColor={Colors.BodyText}
        />
        <TouchableOpacity
          onPress={() => {
            setShowPassword(!showPassword);
          }}>
          {/* <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={responsiveScreenFontSize(2.4)}
            style={styles.eyeIcon}
          /> */}
        </TouchableOpacity>
      </View>
      {!errorText ? null : <Text style={styles.incorrectMsg}>{errorText}</Text>}
      <View style={styles.detailsContainer}>
        <Text style={styles.details}>{buttomDetails}</Text>
        <TouchableOpacity ref={touchableRef} onPress={openPopover}>
          <>
            {/* <MaterialCommunityIcons
              name="target"
              size={responsiveScreenFontSize(2)}
              style={styles.targetIcon}
            /> */}
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
                <Text style={styles.text}>1. Upper and lower case letters</Text>
                <Text style={styles.text}>2. A Symbol (@$&)</Text>
                <Text style={styles.text}>3. A longer password</Text>
              </>
            </Popover>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    background: {
      backgroundColor: Colors.BackDropColor,
    },
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
      overflow: 'hidden',
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
      width: responsiveScreenWidth(68),
      marginLeft: responsiveScreenWidth(3),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
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
      color: Colors.BodyText,
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
