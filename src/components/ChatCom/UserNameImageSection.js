import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Images from '../../constants/Images';
import {useTheme} from '../../context/ThemeContext';
import CustomeFonts from '../../constants/CustomeFonts';

const UserNameImageSection = ({image = '', name = 'N/A'}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={
          image
            ? {
                uri: image,
              }
            : Images.DEFAULT_IMAGE
        }
        style={styles.userImg}
      />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

export default UserNameImageSection;

const getStyles = Colors =>
  StyleSheet.create({
    name: {
      //   alignSelf: 'flex-end',
      color: Colors.Heading,
      // fontWeight: "500",
      fontFamily: CustomeFonts.MEDIUM,
      // marginBottom: responsiveScreenHeight(1),
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingLeft: 10,
      marginTop: 10,
    },
    userImg: {
      height: 35,
      width: 35,
      borderRadius: 45,
      // backgroundColor: Colors.LightGreen,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
    },
  });
