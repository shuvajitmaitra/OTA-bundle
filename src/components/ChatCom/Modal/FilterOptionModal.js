import React, {useCallback, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useTheme} from '../../../context/ThemeContext';
import CommentsIcon from '../../../assets/Icons/CommentsIcon';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import BinIcon from '../../../assets/Icons/BinIcon';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import Divider from '../../SharedComponent/Divider';
import CustomFonts from '../../../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import ArchiveIcon from '../../../assets/Icons/ArchiveIcon';

const {height: screenHeight} = Dimensions.get('window');
const FilterOptionModal = ({
  bottomSheetRef,
  handleRadioChecked,
  toggleCreateCrowdModal,
  setBottomSheetVisible,
}) => {
  // Get screen height to adjust modal height dynamically

  // Define snap points for the bottom sheet modal

  const navigation = useNavigation();

  // Function to handle closing the modal
  const closeBottomSheet = useCallback(() => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.dismiss();
  }, []);

  const Colors = useTheme();
  const styles = getStyles(Colors);

  const data = [
    {
      label: 'New chat',
      onPress: () => {
        navigation.navigate('CreateNewUser');
        closeBottomSheet();
      },
      icon: <CommentsIcon />,
    },
    {
      label: 'New crowd',
      onPress: () => {
        closeBottomSheet();
        toggleCreateCrowdModal();
      },
      icon: <CrowdIcon width={23} height={23} color={Colors.BodyText} />,
    },
    {
      label: 'Onlines',
      onPress: () => {
        handleRadioChecked('onlines');
        closeBottomSheet();
      },
      icon: (
        <MaterialIcons
          name="online-prediction"
          size={24}
          color={Colors.BodyText}
        />
      ),
    },
    {
      label: 'Favorite chat',
      onPress: () => {
        handleRadioChecked('favorites');
        closeBottomSheet();
      },
      icon: <NewPinIcon size={23} />,
    },
    {
      label: 'Archived chat',
      onPress: () => {
        handleRadioChecked('archived');
        closeBottomSheet();
      },
      icon: <ArchiveIcon size={23} />,
    },
  ];
  const snapPoints = [Math.min(data.length * 70, screenHeight * 0.5)];

  return (
    <BottomSheetModal
      opacity={0.1}
      ref={bottomSheetRef}
      index={0} // Default snap point index
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{backgroundColor: Colors.White}}
      handleIndicatorStyle={{backgroundColor: Colors.Primary}}
      animateOnMount={true}
      onDismiss={closeBottomSheet}>
      {/* Modal Content */}
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>Filter Options</Text>
        <ScrollView>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                onPress={item.onPress}
                style={styles.itemContainer}>
                <Text style={styles.popupContryText}>{item.label}</Text>
                {item.icon}
              </TouchableOpacity>
              {index < data.length - 1 && (
                <Divider
                  style={{borderTopColor: Colors.Gray}}
                  marginTop={0.8}
                  marginBottom={0.8}
                />
              )}
            </React.Fragment>
          ))}
        </ScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default FilterOptionModal;

const getStyles = Colors =>
  StyleSheet.create({
    popupContryText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      marginVertical: 7,
      fontSize: responsiveScreenFontSize(1.9),
    },
    itemContainer: {
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
    },
    contentContainer: {
      maxHeight: screenHeight * 0.5, // Limit height to half of the screen
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: 10,
    },
  });
