import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import SearchIcon from '../../../assets/Icons/SearchIcon';
import FilterIcon2 from '../../../assets/Icons/FilterIcon2';
import Popover, {usePopover} from 'react-native-modal-popover';

export default function SearchAndFilter({handleFilter, handleRadioButton}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  useEffect(() => {
    console.log('Popover Visible:', popoverVisible);
    console.log('Popover Anchor Rect:', popoverAnchorRect);
  }, [popoverVisible, popoverAnchorRect]);

  return (
    <>
      <View style={styles.topContainer}>
        <View style={styles.inputField}>
          <TextInput
            keyboardAppearance={
              Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
            }
            style={[
              styles.textInput,
              {
                paddingVertical:
                  Platform.OS === 'ios'
                    ? responsiveScreenHeight(1.5)
                    : responsiveScreenHeight(1),
              },
            ]}
            placeholder="Search..."
            placeholderTextColor={Colors.BodyText}
            onChangeText={handleFilter}
          />
          <SearchIcon />
        </View>

        <TouchableOpacity
          ref={touchableRef}
          onPress={openPopover}
          activeOpacity={0.8}
          style={styles.filterButton}>
          <FilterIcon2 size={18} color={Colors.PureWhite} />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <Popover
        contentStyle={styles.content}
        arrowStyle={styles.arrow}
        backgroundStyle={styles.background}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        supportedOrientations={['portrait', 'landscape']}>
        <View>
          <Text>Hello from inside popover!</Text>
          {/* Add more content or interactive elements here */}
        </View>
      </Popover>
    </>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    content: {
      padding: 16,
      backgroundColor: 'pink',
      borderRadius: 8,
      zIndex: 1000,
    },
    arrow: {
      borderTopColor: 'pink',
    },
    background: {
      backgroundColor: 'rgba(0, 0, 255, 0.5)',
      zIndex: 999,
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: responsiveScreenWidth(2.2),
      padding: responsiveScreenWidth(3),
    },
    inputField: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.ModalBoxColor,
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
    },
    textInput: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.6),
      flex: 1,
    },
    filterButton: {
      flexDirection: 'row',
      backgroundColor: '#27ac1f',
      alignItems: 'center',
      gap: responsiveScreenWidth(2.6),
      paddingVertical: responsiveScreenWidth(2.6),
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: responsiveScreenWidth(1.5),
      zIndex: 1000, // Ensure it's above other elements
    },
    filterButtonText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.PureWhite,
    },
  });
