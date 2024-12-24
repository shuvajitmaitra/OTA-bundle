import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import UpDownIcon from '../../assets/Icons/UpDownIcon';
import CheckMarkIcon from '../../assets/Icons/CheckMarkIcon';
import CustomFonts from '../../constants/CustomFonts';

const CustomDropDownThree = ({
  containerStyle = {},
  data,
  state,
  setState,
  dropDownTextStyle = {},
}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [itemVisible, setItemVisible] = useState(false);

  return (
    <View style={[styles.mainContainer]}>
      <TouchableOpacity
        onPress={() => setItemVisible(pre => !pre)}
        style={[styles.container, containerStyle]}>
        <Text style={[styles.dropDownText, dropDownTextStyle]}>{state}</Text>
        <UpDownIcon size={15} />
      </TouchableOpacity>

      {itemVisible && (
        <View style={[styles.itemContainer]}>
          {data?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setState(item);
                setItemVisible(pre => !pre);
              }}
              style={[
                state === item ? styles.activeText : styles.itemDropDownText,
                ,
              ]}>
              {state === item ? <CheckMarkIcon /> : null}
              <Text
                style={{
                  fontFamily: CustomFonts.REGULAR,
                  color: state === item ? Colors.PureWhite : Colors.BodyText,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomDropDownThree;

const getStyles = Colors =>
  StyleSheet.create({
    activeText: {
      backgroundColor: Colors.Primary,
      color: Colors.PureWhite,
      minWidth: 100,
      paddingHorizontal: responsiveScreenWidth(1),
      paddingVertical: responsiveScreenHeight(0.5),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    mainContainer: {
      position: 'relative',
      zIndex: 100,
    },
    dropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      fontSize: responsiveFontSize(1.8),
      paddingVertical: responsiveScreenHeight(0.7),
    },
    itemDropDownText: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenHeight(0.3),
    },
    container: {
      minWidth: 120,
      minHeight: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(2),
      paddingVertical: responsiveScreenWidth(1.5),
      backgroundColor: Colors.White,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    itemContainer: {
      position: 'absolute',
      // zIndex: 999999999999999,
      top: responsiveScreenHeight(4),
      marginTop: responsiveScreenHeight(1.5),
      minWidth: responsiveScreenWidth(73),
      minHeight: responsiveScreenHeight(2),
      backgroundColor: Colors.White,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 5,
      justifyContent: 'space-between',
      //   gap: 10,
    },
  });
