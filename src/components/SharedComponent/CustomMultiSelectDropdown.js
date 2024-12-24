import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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
import CustomFonts from '../../constants/CustomFonts';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {useGlobalAlert} from './GlobalAlertContext';

export const CustomMultiSelectDropDown = ({
  options,
  initialSelections = [],
  setState,
}) => {
  const [clicked, setClicked] = useState(false);
  const [selectedItems, setSelectedItems] = useState(initialSelections);

  useEffect(() => {
    setSelectedItems(initialSelections);
  }, [initialSelections]);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {showAlert} = useGlobalAlert();

  const toggleSelection = item => {
    let updatedSelections;
    if (selectedItems.some(i => i.type === item.type)) {
      if (selectedItems?.length == 1) {
        showAlert({
          title: 'Selection Required',
          type: 'warning',
          message: 'Please select at least one option.',
        });
        return;
      }
      updatedSelections = selectedItems?.filter(i => i.type !== item.type);
    } else {
      if (selectedItems?.length >= 3) {
        showAlert({
          title: 'Limit Exceeded',
          type: 'warning',
          message: 'You cannot select more than three options.',
        });
        return;
      }
      updatedSelections = [...selectedItems, item];
    }
    setSelectedItems(updatedSelections);
    setState(updatedSelections);
  };

  const selectedTypes = selectedItems?.map(item => item.type);

  const handleOutsidePress = () => {
    if (clicked) {
      setClicked(false);
      Keyboard.dismiss(); // dismiss keyboard if open
    }
  };

  return (
    <TouchableWithoutFeedback
      style={{backgroundColor: 'red', padding: 100}}
      onPress={handleOutsidePress}>
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
          <View
            style={{flexDirection: 'row', flexWrap: 'wrap', gap: 5, flex: 0.9}}>
            {selectedItems.map((item, index) => (
              <TouchableOpacity
                onPress={() => toggleSelection(item)}
                style={styles.selectedItemsContainer}
                key={index}>
                <Text
                  style={{
                    paddingVertical: responsiveScreenHeight(0.5),
                    color: Colors.BodyText,
                  }}>
                  {item.type}
                </Text>
                <View style={[styles.crossContainer]}>
                  <CrossCircle size={15} color={Colors.Red} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View>{clicked ? <UpArrowIcon /> : <DownArrowIcon />}</View>
        </TouchableOpacity>

        {clicked ? (
          <View style={styles.dropdownOptions}>
            {options.map((item, index) => (
              <TouchableOpacity
                style={{
                  paddingRight: responsiveScreenWidth(2),
                }}
                key={index}
                onPress={() => toggleSelection(item)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.Text,
                      selectedItems.some(i => i.type === item.type) &&
                        styles.selectedText,
                    ]}>
                    {item.type}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.crossContainer,
                      selectedItems.some(i => i.type === item.type) && {
                        backgroundColor: Colors.LightRed,
                      },
                    ]}
                    onPress={() => toggleSelection(item)}>
                    <CrossCircle
                      size={15}
                      color={
                        selectedItems.some(i => i.type === item.type)
                          ? Colors.Red
                          : null
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderBottomWidth: options?.length === index + 1 ? 0 : 0.5,
                    borderBottomColor: Colors.BorderColor,
                  }}></View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CustomMultiSelectDropDown;

const getStyles = Colors =>
  StyleSheet.create({
    selectedItemsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: responsiveScreenWidth(1),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 4,
    },
    crossContainer: {
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownOptions: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overFlow: 'hidden',
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
    selectedText: {
      color: Colors.Primary,
    },
    inputField: {
      backgroundColor: Colors.ModalBoxColor,
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      fontFamily: CustomFonts.REGULAR,
      paddingVertical: responsiveScreenHeight(1),
    },
  });
