import React, {useCallback, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useTheme} from '../../../context/ThemeContext';
import CommentsIcon from '../../../assets/Icons/CommentsIcon';
import CrowdIcon from '../../../assets/Icons/CrowedIcon';
import BinIcon from '../../../assets/Icons/BinIcon';
import NewPinIcon from '../../../assets/Icons/NewPinIcon';
import {FlatList} from 'react-native';
import Divider from '../../SharedComponent/Divider';
import CustomeFonts from '../../../constants/CustomeFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CreateCrowdModal from './CreateCrowdModal';
import {useNavigation} from '@react-navigation/native';

const FilterOptionModal = ({
  bottomSheetRef,
  openBottomSheet,
  handleRadioChecked,
  toggleCreateCrowdModal,
}) => {
  // Define snap points for the bottom sheet modal
  const snapPoints = useMemo(() => ['35%', '35%', '35%'], []);
  const navigation = useNavigation();
  // Function to handle closing the modal
  const closeBottomSheet = useCallback(() => {
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
        <BinIcon />
        // // <MaterialIcons
        //   name="online-prediction"
        //   size={24}
        //   color={Colors.BodyText}
        // />
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
      icon: <BinIcon size={23} />,
    },
  ];

  const threeDotRenderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.itemContainer}>
        <Text style={styles.popupContryText}>{item.label}</Text>
        {item.icon}
      </TouchableOpacity>
    );
  };
  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1} // default snap point index
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{backgroundColor: Colors.White}}
        handleIndicatorStyle={{backgroundColor: Colors.Primary}}
        // backdropComponent={() => (
        //   <TouchableWithoutFeedback onPress={closeBottomSheet}>
        //     <View style={styles.backdrop} />
        //   </TouchableWithoutFeedback>
        // )}
        animateOnMount={true}
        onDismiss={closeBottomSheet}>
        {/* Modal Content */}
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>Filter Options</Text>
          <FlatList
            data={data}
            renderItem={threeDotRenderItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => (
              <Divider
                style={{borderTopColor: Colors.Gray}}
                marginTop={0.8}
                marginBottom={0.8}
              />
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default FilterOptionModal;

const getStyles = Colors =>
  StyleSheet.create({
    popupContryText: {
      color: Colors.Heading,
      fontFamily: CustomeFonts.REGULAR,
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
      flex: 1,
      paddingHorizontal: 20,
      //   backgroundColor: Colors.Background_color,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.Heading,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginVertical: 10,
    },
  });
