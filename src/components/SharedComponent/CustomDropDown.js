import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import UpArrowIcon from '../../assets/Icons/UpArrowIcon';
import DownArrowIcon from '../../assets/Icons/DownArrowIcon';
import {useTheme} from '../../context/ThemeContext';
import useChat from '../../hook/useChat';
import CustomFonts from '../../constants/CustomFonts';
// import ArrowLeft from "../../../assets/svgs/ArrowLeft";
// import UpArrowIcon from "../../../assets/svgs/UpArrowIcon";
// import DownArrowIcon from "../../../assets/svgs/DownArrowIcon";

export const CustomDropDown = ({options, type = '', setState}) => {
  const [clicked, setClicked] = useState(false);
  const [crowdType, setCrowdType] = useState(type);
  useEffect(() => {
    setCrowdType(type);
  }, [type]);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={[
          styles.inputField,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          {borderBottomLeftRadius: clicked ? 0 : 10},
          {borderBottomRightRadius: clicked ? 0 : 10},
        ]}
        onPress={() => {
          setClicked(!clicked);
        }}>
        <Text
          style={{
            paddingVertical: responsiveScreenHeight(0.5),
            color: Colors.BodyText,
          }}>
          {crowdType == '' ? 'Select Type' : crowdType}
        </Text>
        {clicked ? <UpArrowIcon /> : <DownArrowIcon />}
      </TouchableOpacity>
      {clicked ? (
        <View style={styles.dropdownOptions}>
          {options?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCrowdType(item?.type);
                setState(item?.data);
                setClicked(!clicked);
              }}>
              <Text style={styles.Text}>{item.type}</Text>
              <View
                style={{
                  borderBottomWidth: options?.length == index + 1 ? 0 : 0.5,
                  borderBottomColor: Colors.BorderColor,
                }}></View>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default CustomDropDown;
const getStyles = Colors =>
  StyleSheet.create({
    dropdownOptions: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    Text: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.5),
      color: Colors.BodyText,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
    },
  });
