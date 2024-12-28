import {Image, Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';
import Images from '../../constants/Images';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import {useSelector} from 'react-redux';

const UserNameImageSection = ({image = '', name = 'N/A', handleCreateChat}) => {
  const {singleChat} = useSelector(state => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  return (
    <Pressable
      disabled={!singleChat.isChannel}
      onPress={handleCreateChat}
      style={styles.container}>
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
    </Pressable>
  );
};

export default UserNameImageSection;

const getStyles = Colors =>
  StyleSheet.create({
    name: {
      //   alignSelf: 'flex-end',
      color: Colors.Heading,
      // fontWeight: "500",
      fontFamily: CustomFonts.MEDIUM,
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
      overflow: 'hidden',
      borderColor: Colors.BorderColor,
      resizeMode: 'cover',
      position: 'relative',
    },
  });
