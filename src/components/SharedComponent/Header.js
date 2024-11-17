import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MessageNotificationContainer from '../MessageNotificationContainer';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../../assets/Icons/ArrowLeft';

const Header = ({navigation}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();
  // const navigation = useNavigation();
  // console.log("navigation", JSON.stringify(navigation, null, 1));

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: top,
            paddingHorizontal: responsiveScreenWidth(2),
            paddingBottom: 10,
          },
        ]}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.White,
            padding: 10,
            borderRadius: 100,
          }}
          onPress={() => navigation.goBack()}>
          <ArrowLeft />
        </TouchableOpacity>

        <View style={styles.MessageNotificationContainer}>
          <MessageNotificationContainer />
        </View>
      </View>
    </>
  );
};

export default Header;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.Background_color,
      alignItems: 'center',
    },
    MessageNotificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
