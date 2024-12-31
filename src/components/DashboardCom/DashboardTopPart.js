import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

import DrawerIcon from '../../assets/Icons/DrawerIcon';
import MessageNotificationContainer from '../MessageNotificationContainer';
import {useTheme} from '../../context/ThemeContext';
import SwapIcon from '../../assets/Icons/SwapIcon';
import ProgramSwitchModal from '../SharedComponent/ProgramSwitchModal';

export default function DashboardTopPart({
  statusSectionVisible,
  setStatusSectionVisible,
  switchAvailable,
}) {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [proSwitch, setProSwitch] = useState(false);
  const handleDrawer = () => {
    navigation.openDrawer();
    if (statusSectionVisible) {
      setStatusSectionVisible(prev => !prev);
    }
  };
  return (
    <View
      // animation={"slideInLeft"}
      // duration={1000}
      style={styles.container}>
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={handleDrawer}>
        <DrawerIcon />
      </TouchableOpacity>
      <View style={styles.messageNotificationContainer}>
        {switchAvailable && (
          <TouchableOpacity
            onPress={() => setProSwitch(pre => !pre)}
            style={styles.messageContainer}>
            <SwapIcon />
          </TouchableOpacity>
        )}
        <MessageNotificationContainer />
      </View>
      {proSwitch && (
        <ProgramSwitchModal
          onCancelPress={() => {
            setProSwitch(pre => !pre);
          }}
          modalOpen={proSwitch}
        />
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',

      marginTop: responsiveScreenHeight(0.5),
    },
    profileImageContainer: {
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1.5),
    },
    image: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
    },

    messageNotificationContainer: {
      flexDirection: 'row',
      marginRight: responsiveScreenWidth(3),
    },
    messageContainer: {
      width: 50,
      height: 50,
      borderRadius: 50,
      backgroundColor: Colors.White,
      marginRight: responsiveScreenWidth(4),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      position: 'relative',
    },
    messageIcon: {
      width: responsiveScreenWidth(7),
      height: responsiveScreenWidth(7),
      backgroundColor: Colors.White,
    },
  });
