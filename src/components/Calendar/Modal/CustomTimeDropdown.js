import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../../context/ThemeContext';

const times = [
  '12:00 AM',
  '12:30 AM',
  '01:00 AM',
  '01:30 AM',
  '02:00 AM',
  '02:30 AM',
  '03:00 AM',
  '03:30 AM',
  '04:00 AM',
  '04:30 AM',
  '05:00 AM',
  '05:30 AM',
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
];

const CustomTimeDropdown = ({
  onSelect,
  selectedTime,
  setTimeDropdownClicked,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = time => {
    setTimeDropdownClicked(pre => !pre);
    onSelect(time);
    setIsOpen(false);
  };
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setIsOpen(false);
          setIsOpen(!isOpen);
          setTimeDropdownClicked(pre => !pre);
        }}
        style={styles.timePicker}>
        <Text style={styles.timeDateText}>{selectedTime}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled>
            {times.map((time, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(time)}
                style={styles.timeOption}>
                <Text style={styles.timeOptionText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      // position: "relative",
      // flex: 1,
    },
    timePicker: {
      backgroundColor: '#fff',
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 4,
      borderColor: '#ccc',
      borderWidth: 1,
      overflow: 'hidden',
    },
    timeDateText: {
      color: 'rgba(39, 172, 31, 1)',
    },
    dropdown: {
      position: 'absolute',
      top: responsiveScreenHeight(4),
      width: '100%',
      maxHeight: responsiveScreenHeight(20),
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      overflow: 'hidden',
      borderRadius: 4,
      zIndex: 1000,
    },
    timeOption: {
      paddingVertical: responsiveScreenHeight(1),
      paddingHorizontal: responsiveScreenWidth(2),
    },
    timeOptionText: {
      color: '#000',
    },
  });

export default CustomTimeDropdown;
