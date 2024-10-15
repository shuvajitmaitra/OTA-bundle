import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import {Popover, usePopover} from 'react-native-modal-popover';
import {RadioButton} from 'react-native-paper';
import CrossIcon from '../../assets/Icons/CrossIcon';
import CustomeFonts from '../../constants/CustomeFonts';
import {useTheme} from '../../context/ThemeContext';
import GlobalRadioGroup from './GlobalRadioButton';

export default function SearchAndFilter({
  setSearchText,
  handleFilter,
  filterValue,
  setFilterValue,
  itemList = [],
  searchText,
  placeholderText = 'Search...',
  handleSearch = () => {},
}) {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------

  const [selectedId, setSelectedId] = useState(1);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [searchValue, setSearchValue] = useState('');
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  return (
    <View style={styles.topContainer}>
      <View style={styles.inputField}>
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          value={searchText}
          style={[
            styles.textInput,
            {
              paddingVertical:
                Platform.OS == 'ios'
                  ? responsiveScreenHeight(1.5)
                  : responsiveScreenHeight(1),
            },
          ]}
          placeholder={placeholderText}
          placeholderTextColor={Colors.BodyText}
          onChangeText={text => setSearchText(text)}
        />
        <TouchableOpacity onPress={() => handleSearch()}>
          <Feather style={styles.inputFieldIcon} name="search" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        ref={touchableRef}
        onPress={openPopover}
        activeOpacity={0.8}
        style={styles.filterButton}>
        <Feather
          name="filter"
          size={24}
          color={Colors.PureWhite}
          style={styles.filterButtonIcon}
        />
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

      <Popover
        contentStyle={styles.popupContent}
        arrowStyle={styles.popupArrow}
        backgroundStyle={{backgroundColor: Colors.BackDropColor}}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        placement="bottom"
        supportedOrientations={['portrait', 'landscape']}>
        {/* -------------------------- */}
        {/* ----------- Heading Text ----------- */}
        {/* -------------------------- */}

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Filters</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={closePopover}>
              <View style={styles.cancelButton}>
                <CrossIcon />
              </View>
            </TouchableOpacity>
          </View>

          {/* --- Radio button -------------------------------------------------------------------------------------------- */}

          <GlobalRadioGroup
            options={itemList}
            onSelect={value => {
              handleFilter(value);
              closePopover();
            }}
            selectedValue={filterValue}
          />
        </View>
      </Popover>
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
      fontFamily: CustomeFonts.REGULAR,
    },
    // --------------------------
    // ----------- Header of the popup -----------
    // --------------------------
    headerText: {
      fontFamily: CustomeFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
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
      backgroundColor: Colors.ScreenBoxColor,
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
      flex: 1,
      fontFamily: CustomeFonts.REGULAR,

      // backgroundColor: "red",
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
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
      minHeight: responsiveScreenHeight(19),
      // top: responsiveScreenHeight(-3),
    },
    popupArrow: {
      borderTopColor: Colors.White,
      // marginTop: responsiveScreenHeight(-3),
    },
    container: {
      // paddingVertical: responsiveScreenHeight(2),
      // paddingHorizontal: responsiveScreenWidth(2),
      minWidth: responsiveScreenWidth(50),
    },
  });
