import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import {FontAwesome} from '@expo/vector-icons';
import {useTheme} from '../../context/ThemeContext';

export default function AllSignInPage() {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.socialBtnContainer}>
      {/* <TouchableOpacity onPress={() => {}} style={styles.socialBtn}>
        <FontAwesome
          name="facebook"
          size={responsiveScreenFontSize(3)}
          color={Colors.Primary}
        />
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => {}} style={styles.socialBtn}>
        <FontAwesome
          name="google"
          size={responsiveScreenFontSize(3)}
          color={Colors.Primary}
        />
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => {}} style={styles.socialBtn}>
        <FontAwesome
          name="apple"
          size={responsiveScreenFontSize(3)}
          color={Colors.Primary}
        />
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => {}} style={styles.socialBtn}>
        <FontAwesome
          name="github"
          size={responsiveScreenFontSize(3)}
          color={Colors.Primary}
        />
      </TouchableOpacity> */}
      {/* <TouchableOpacity onPress={() => {}} style={styles.socialBtn}>
        <FontAwesome
          name="linkedin"
          size={responsiveScreenFontSize(3)}
          color={Colors.Primary}
        />
      </TouchableOpacity> */}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    socialBtnContainer: {
      width: responsiveScreenWidth(80),
      height: responsiveScreenHeight(5.5),
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: responsiveScreenHeight(3),
    },
    socialBtn: {
      backgroundColor: Colors.White,
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
