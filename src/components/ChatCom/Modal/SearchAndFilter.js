import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import {Popover, PopoverController} from 'react-native-modal-popover';
import {RadioButton} from 'react-native-paper';

import CustomeFonts from '../../../constants/CustomeFonts';
import CrossIcon from '../../../assets/Icons/CrossIcon';
import {useTheme} from '../../../context/ThemeContext';
import GlobalRadioGroup from '../../SharedComponent/GlobalRadioButton';

export default function SearchAndFilter({handleFilter, handleRadioButton}) {
  const [value, setValue] = React.useState(1);
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const filterOptions = [
    {label: 'Block user', value: 1},
    {label: 'Mute user', value: 2},
  ];

  return (
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
                Platform.OS == 'ios'
                  ? responsiveScreenHeight(1.5)
                  : responsiveScreenHeight(1),
            },
          ]}
          placeholder="Search..."
          placeholderTextColor={Colors.BodyText}
          onChangeText={handleFilter}
        />
        <Feather style={styles.inputFieldIcon} name="search" />
      </View>

      <PopoverController>
        {({
          openPopover,
          closePopover,
          popoverVisible,
          setPopoverAnchor,
          popoverAnchorRect,
        }) => (
          <React.Fragment>
            <TouchableOpacity
              ref={setPopoverAnchor}
              onPress={openPopover}
              activeOpacity={0.8}
              style={styles.filterButton}>
              <Feather
                name="filter"
                size={24}
                style={styles.filterButtonIcon}
              />
              <Text style={styles.filterButtonText}>Filters</Text>
            </TouchableOpacity>
            <Popover
              contentStyle={styles.content}
              arrowStyle={{borderTopColor: Colors.White}}
              backgroundStyle={{backgroundColor: Colors.BackDropColor}}
              visible={popoverVisible}
              onClose={closePopover}
              fromRect={popoverAnchorRect}
              placement="bottom"
              supportedOrientations={['portrait', 'landscape']}>
              <View style={styles.container}>
                {/* -------------------------- */}
                {/* ----------- Heading Text ----------- */}
                {/* -------------------------- */}
                <View style={styles.headerContainer}>
                  <Text style={styles.headerText}>Filters</Text>
                  <TouchableOpacity activeOpacity={0.8} onPress={closePopover}>
                    <View style={styles.cancelButton}>
                      <CrossIcon />
                    </View>
                  </TouchableOpacity>
                </View>
                {/* -------------------------- */}
                {/* ----------- Radio button ----------- */}
                {/* -------------------------- */}

                <GlobalRadioGroup
                  options={filterOptions}
                  selectedValue={value}
                  onSelect={newValue => {
                    setValue(newValue);
                    closePopover();
                    handleRadioButton(newValue);
                  }}
                />
              </View>
            </Popover>
          </React.Fragment>
        )}
      </PopoverController>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    // --------------------------
    // ----------- Radio Button -----------
    // --------------------------
    radioButton: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttonGroup: {
      marginHorizontal: responsiveScreenWidth(-1),
    },
    radioText: {
      fontSize: responsiveScreenFontSize(1.8),
    },
    // --------------------------
    // ----------- Header of the popup -----------
    // --------------------------
    headerText: {
      color: Colors.Heading,
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    cancelButton: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(2),
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(2.2),
      alignItems: 'center',
      // backgroundColor: "red",
    },

    filterButton: {
      flexDirection: 'row',
      backgroundColor: '#27ac1f',
      alignItems: 'center',
      gap: responsiveScreenWidth(2.6),
      paddingVertical: responsiveScreenWidth(2.6),
      paddingHorizontal: responsiveScreenWidth(4),
      borderRadius: responsiveScreenWidth(1.5),
    },
    inputField: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.ModalBoxColor,
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
    },
    inputFieldIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.BodyText,
    },
    textInput: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.6),
      // marginVertical: responsiveScreenHeight(1.3),
      flex: 1,
    },
    filterButtonIcon: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.PureWhite,
    },
    filterButtonText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomeFonts.REGULAR,
      color: Colors.PureWhite,
    },
    threeDotIcon: {
      paddingHorizontal: responsiveScreenWidth(1),
    },
    buttonText: {
      fontSize: responsiveScreenFontSize(2),
      color: '#666',
    },
    iconAndTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(3),
    },
    buttonContainer: {
      paddingVertical: responsiveScreenHeight(1.5),
      paddingHorizontal: responsiveScreenWidth(1.5),
      borderBottomWidth: 1,
      borderBottomColor: Colors.BorderColor,
    },
    // --------------------------
    // ----------- Popup Modal container -----------
    // --------------------------
    content: {
      borderRadius: 8,
      backgroundColor: Colors.White,
    },
    arrow: {
      color: Colors.White,
    },
    container: {
      backgroundColor: Colors.White,
      paddingVertical: responsiveScreenHeight(2),
      paddingHorizontal: responsiveScreenWidth(2),
      minWidth: responsiveScreenWidth(50),
    },
  });
