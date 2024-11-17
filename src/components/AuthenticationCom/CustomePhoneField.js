import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {Popover, usePopover} from 'react-native-modal-popover';
import Checkbox from 'expo-checkbox';

import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import {ArrowDownTwo} from '../../assets/Icons/ArrowDownTwo';

export default function CustomePhoneField({title, setText, errorText}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  const options = [
    {
      name: 'Bangladesh',
      placeholder: '+880',
      flagImg: require('../../assets/ApplicationImage/BD_Flag.png'),
    },

    {
      name: 'USA',
      placeholder: '+1',
      flagImg: require('../../assets/ApplicationImage/US_Flag.png'),
    },
    {
      name: 'Canada',
      placeholder: '+1',
      flagImg: require('../../assets/ApplicationImage/canada_Flag.png'),
    },
  ];
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [phonePlaceholder, setPhonePlaceholder] = React.useState('+880');
  const [flag, setFlag] = React.useState(
    require('../../assets/ApplicationImage/BD_Flag.png'),
  );

  const handleOptionPress = index => {
    setPhonePlaceholder(
      index === selectedOption ? '+880' : options[index].placeholder,
    );
    setFlag(
      index === selectedOption
        ? require('../../assets/ApplicationImage/BD_Flag.png')
        : options[index].flagImg,
    );
    setSelectedOption(index === selectedOption ? null : index);
    closePopover();
  };

  const handleTextChange = text => {
    // Remove leading zero if present
    const newText = text?.startsWith('0') ? text.substring(1) : text;
    setText(`${phonePlaceholder + newText}`);
  };
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldText}>{title}</Text>
      <View
        style={[
          styles.inputContainer,
          {borderColor: !errorText ? Colors.BorderColor : Colors.Red},
        ]}>
        <TouchableOpacity ref={touchableRef} onPress={openPopover}>
          <View style={styles.countrySelectContainer}>
            <Image style={styles.flagStyle} source={flag} />
            <ArrowDownTwo />
            <>
              <Popover
                contentStyle={styles.popupContent}
                arrowStyle={styles.popupArrow}
                backgroundStyle={{backgroundColor: Colors.BackDropColor}}
                visible={popoverVisible}
                onClose={closePopover}
                fromRect={popoverAnchorRect}
                supportedOrientations={['portrait', 'landscape']}
                placement="bottom">
                <Text style={styles.popupContryText}>Country</Text>
                {options.map((option, index) => (
                  <View key={index} style={styles.popupOption}>
                    {/* <Checkbox
                      style={styles.popUpcheckbox}
                      value={index === selectedOption}
                      onValueChange={() => handleOptionPress(index)}
                      color={Colors.BodyText}
                    /> */}
                    <Text style={styles.popUpcheckboxText}>{option.name}</Text>
                  </View>
                ))}
              </Popover>
            </>
          </View>
        </TouchableOpacity>
        <Text
          style={{
            color: Colors.BodyText,
            marginLeft: responsiveScreenWidth(1),
            fontSize: responsiveScreenFontSize(1.8),
            fontFamily: CustomFonts.REGULAR,
          }}>
          {phonePlaceholder}
        </Text>
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          onChangeText={handleTextChange}
          style={styles.textInput}
          keyboardType="numeric"
          placeholderTextColor={Colors.BodyText}
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
      marginTop: responsiveScreenHeight(0.5),
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
      borderColor: Colors.BorderColor,
      marginTop: responsiveScreenHeight(1),
      flexDirection: 'row',
      alignItems: 'center',
      // paddingHorizontal: responsiveScreenWidth(4),
    },
    countrySelectContainer: {
      width: responsiveScreenWidth(20),
      height: responsiveScreenHeight(4),
      borderRightWidth: 1,
      // backgroundColor: "red",
      borderColor: Colors.BorderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      width: responsiveScreenWidth(73),
      marginLeft: responsiveScreenWidth(1),
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
    },
    flagStyle: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      resizeMode: 'contain',
      marginRight: responsiveScreenWidth(2),
    },
    arrowStyle: {
      color: Colors.BodyText,
      marginRight: responsiveScreenWidth(2),
    },
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      width: responsiveScreenWidth(40),
      height: responsiveScreenHeight(17),
      top: responsiveScreenHeight(-4),
    },
    popupArrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(-4),
    },
    popupContryText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      marginBottom: responsiveScreenHeight(0.4),
      fontSize: responsiveScreenFontSize(1.9),
      color: Colors.Heading,
    },
    popupOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: responsiveScreenHeight(0.8),
    },
    popUpcheckbox: {
      borderRadius: 50,
      marginRight: responsiveScreenWidth(2),
      width: responsiveScreenWidth(4.5),
      height: responsiveScreenWidth(4.5),
    },
    popUpcheckboxText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      color: Colors.BodyText,
    },
    incorrectMsg: {
      color: Colors.Red,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginLeft: responsiveScreenWidth(2),
      marginTop: responsiveScreenHeight(1),
    },
  });
