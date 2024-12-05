import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CustomWaveAnimation from '../components/SharedComponent/CustomWaveAnimation';
import Images from '../constants/Images';
import {useTheme} from '../context/ThemeContext';

const SplashScreen = ({navigation}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 20,
        }}>
        <CustomWaveAnimation />
      </View>
      <Image source={Images.DEFAULT_IMAGE} style={styles.logo} />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          zIndex: 20,
          right: 0,
        }}>
        <CustomWaveAnimation />
      </View>
    </View>
  );
};

export default SplashScreen;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.Primary,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      backgroundColor: Colors.Background_color,
    },
    logo: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
  });
