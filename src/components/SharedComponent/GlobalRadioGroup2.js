// GlobalRadioGroup2.js
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';

// GlobalRadioGroup2 component supporting multiple selections
const GlobalRadioGroup2 = ({options, onSelect, selected = []}) => {
  const [localSelected, setLocalSelected] = useState(selected); // Track multiple selections

  useEffect(() => {
    setLocalSelected(selected); // Sync with parent state if `selected` prop changes
  }, [selected]);

  // Handle selecting and deselecting items
  const handleSelect = value => {
    const updatedSelections = localSelected.includes(value)
      ? localSelected.filter(item => item !== value) // Deselect if already selected
      : [...localSelected, value]; // Select if not already selected

    setLocalSelected(updatedSelections); // Update local state
    if (onSelect) {
      onSelect(updatedSelections); // Notify parent component
    }
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioButtonContainer}
          onPress={() => handleSelect(option.value)}>
          <View
            style={[
              styles.radioCircle,
              {
                borderColor: localSelected.includes(option.value)
                  ? Colors.Primary
                  : Colors.BodyText,
              },
            ]}>
            {localSelected.includes(option.value) && (
              <View style={styles.selectedRb} />
            )}
          </View>
          <Text
            style={[
              styles.radioText,
              {
                color: localSelected.includes(option.value)
                  ? Colors.Primary
                  : Colors.BodyText,
              },
            ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    radioButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    selectedRb: {
      width: 12,
      height: 12,
      borderRadius: 4,
      backgroundColor: Colors.Primary,
    },
    radioText: {
      fontSize: RegularFonts.BR,
      fontFamily: CustomFonts.REGULAR,
    },
  });

export default React.memo(GlobalRadioGroup2);
