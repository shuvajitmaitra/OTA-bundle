import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import ThreedotIcon from '../../assets/Icons/ThreedotIcon';
import Popover, {usePopover} from 'react-native-modal-popover';
import CreateCrowdModal from './Modal/CreateCrowdModal';
import SearchAndFilter from './SearchAndFilter';
import SearchWhiteIcon from '../../assets/Icons/SearchWhiteIcon';
import CustomeBtn from '../AuthenticationCom/CustomeBtn';
import {useNavigation} from '@react-navigation/native';
import MenuIcon from '../../assets/Icons/MenuIcon';

const ChatTopPart = ({handleRadioChecked}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();
  const [isCreateCrowdModalVisible, setIsCreateCrowdModalVisible] =
    useState(false);
  const toggleCreateCrowdModal = () => {
    setIsCreateCrowdModalVisible(prev => !prev);
  };

  const navigation = useNavigation();
  // Updated data array with functions for each object
  const [searchUser, setSearchUser] = useState(true);
  const data = [
    {
      label: 'New chat',
      onPress: () => {
        navigation.navigate('HomeStack', {screen: 'CreateNewUser'});
        closePopover();
      },
    },
    {
      label: 'New crowd',
      onPress: () => {
        toggleCreateCrowdModal();
      },
    },
    {
      label: 'Archived chat',
      onPress: () => {
        handleRadioChecked('archived');
        closePopover();
      },
    },
    {
      label: 'Favorite chat',
      onPress: () => {
        handleRadioChecked('favorites');
        closePopover();
      },
    },
  ];

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <Text style={styles.popupContryText}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={styles.menuContainer}>
        <MenuIcon size={20} />
      </TouchableOpacity>
      <Text style={styles.headingText}>Chats</Text>
      {/* <TouchableOpacity ref={touchableRef} onPress={() => openPopover()} style={styles.threeDotContainer}>
        <ThreedotIcon />
      </TouchableOpacity>
      <Popover
        contentStyle={styles.popupContent}
        arrowStyle={styles.popupArrow}
        backgroundStyle={{ backgroundColor: Colors.BackDropColor }}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        supportedOrientations={["portrait", "landscape"]}
        placement="bottom"
      >
        {!isCreateCrowdModalVisible && <FlatList data={data} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />}
        <CreateCrowdModal
          isCreateCrowdModalVisible={isCreateCrowdModalVisible}
          toggleCreateCrowdModal={toggleCreateCrowdModal}
          setIsCreateCrowdModalVisible={setIsCreateCrowdModalVisible}
        />
      </Popover> */}
    </View>
  );
};

export default memo(ChatTopPart);

const getStyles = Colors =>
  StyleSheet.create({
    menuContainer: {
      // backgroundColor: 'red',
      padding: 5,
    },
    container: {
      paddingLeft: responsiveScreenWidth(3),
      // justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    headingText: {
      color: Colors.Heading,
      fontSize: RegularFonts.HXXL,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    threeDotContainer: {
      width: responsiveScreenWidth(8),
      //   backgroundColor: "red",
      alignItems: 'center',
      height: 30,
      justifyContent: 'center',
    },
    popupContent: {
      padding: 16,
      backgroundColor: Colors.White,
      borderRadius: 8,
      minWidth: responsiveScreenWidth(50),
    },
    popupArrow: {
      borderTopColor: Colors.White,
    },
    popupContryText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.REGULAR,
      marginVertical: 7,
      fontSize: responsiveScreenFontSize(1.9),
    },
  });
