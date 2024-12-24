import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import Popover from 'react-native-popover-view'; // Import Popover
import CrossIcon from '../../assets/Icons/CrossIcon';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import GlobalRadioGroup from '../../components/SharedComponent/GlobalRadioButton';
import CustomBottomSheet from '../../components/SharedComponent/CustomBottomSheet';

export default function SearchAndFilter({handleFilter}) {
  const Colors = useTheme();
  const SearchAndFilterStyles = getStyles(Colors);

  const [value, setValue] = React.useState('Focused');
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false);
  const filterButtonRef = React.useRef();

  const itemList = [
    {label: 'Focused', value: 'Focused'},
    {label: 'Pinned', value: 'Pinned'},
    {label: 'Newly Uploaded', value: 'Newly Uploaded'},
    {label: 'Complete', value: 'Complete'},
    {label: 'Incomplete', value: 'Incomplete'},
  ];

  const handleRadioChange = newValue => {
    setValue(newValue);
    Alert.alert('Selected filter: ' + newValue);
    setIsPopoverVisible(false); // Optionally close popover after selection
    handleFilter(newValue); // Pass the selected filter to parent if needed
  };

  const togglePopover = () => {
    setIsPopoverVisible(true);
  };

  const closePopover = () => {
    setIsPopoverVisible(false);
  };

  return (
    <View style={SearchAndFilterStyles.topContainer}>
      {/* Search Input Field */}
      <View style={SearchAndFilterStyles.inputField}>
        <TextInput
          keyboardAppearance={
            Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
          }
          style={SearchAndFilterStyles.textInput}
          placeholder="Search..."
          placeholderTextColor={Colors.BodyText}
          onChangeText={handleFilter}
        />
        <Feather style={SearchAndFilterStyles.inputFieldIcon} name="search" />
      </View>

      <Popover
        isVisible={isPopoverVisible}
        from={
          <TouchableOpacity
            ref={filterButtonRef}
            onPress={togglePopover}
            activeOpacity={0.8}
            style={SearchAndFilterStyles.filterButton}>
            <Feather
              name="filter"
              size={24}
              color={Colors.PureWhite}
              style={SearchAndFilterStyles.filterButtonIcon}
            />
            <Text style={SearchAndFilterStyles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
        }
        onRequestClose={closePopover}>
        <View style={SearchAndFilterStyles.container}>
          <View style={SearchAndFilterStyles.headerContainer}>
            <Text style={SearchAndFilterStyles.headerText}>Fsssilters</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={closePopover}>
              <View style={SearchAndFilterStyles.cancelButton}>
                <CrossIcon />
              </View>
            </TouchableOpacity>
          </View>

          <GlobalRadioGroup
            options={itemList}
            onSelect={handleRadioChange}
            selectedValue={value}
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
    },
    // --------------------------
    // ----------- Header of the popup -----------
    // --------------------------
    headerText: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Black,
    },
    cancelButton: {
      backgroundColor: '#D0D0D0',
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
      padding: responsiveScreenWidth(1.5),
      paddingHorizontal: responsiveScreenWidth(3.3),
      borderWidth: 1,
      overFlow: 'hidden',
      borderColor: Colors.BorderColor,
      flex: 1,
      borderRadius: responsiveScreenWidth(2),
    },
    inputFieldIcon: {
      fontSize: responsiveScreenFontSize(2.5),
      color: Colors.BodyText,
    },
    textInput: {
      fontFamily: CustomFonts.REGULAR,
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(1.6),
      flex: 1,
    },
    filterButtonIcon: {
      fontSize: responsiveScreenFontSize(2),
      color: Colors.White,
    },
    filterButtonText: {
      fontSize: responsiveScreenFontSize(1.8),
      fontFamily: CustomFonts.REGULAR,
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
    },
    popupArrow: {
      borderTopColor: Colors.White,
      // react-native-popover-view handles the arrow automatically
    },
    container: {
      minWidth: responsiveScreenWidth(50),
    },
  });
