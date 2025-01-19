import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import Images from '../../constants/Images';
import {useNavigation} from '@react-navigation/native';
import PlayButtonCircle from '../../assets/Icons/PlayButtonCircle';
import AudioIcon from '../../assets/Icons/AudioIcon';
import {useTheme} from '../../context/ThemeContext';
import {formattingDate} from '../../utility/commonFunction';
import {
  responsiveScreenHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';

const AudioVideoCard = ({media, index}) => {
  const navigation = useNavigation();
  const Colors = useTheme();

  const styles = getStyles(Colors);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AudioVideoDetails', {index});
      }}
      key={media._id}
      style={styles.bgImgContainer}>
      <Image
        source={
          media?.thumbnail ? {uri: media?.thumbnail} : Images.DEFAULT_IMAGE
        }
        style={styles.bgImg}
      />
      {/* <View style={styles.play}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AudioVideoDetails', {index});
          }}
          style={styles.playBtn}>
          {media?.mediaType === 'video' ? (
            <PlayButtonCircle size={40} color={Colors.Primary} />
          ) : (
            <AudioIcon />
          )}
        </TouchableOpacity>
      </View> */}
      <View style={styles.info}>
        <Text style={styles.doc}>
          {media?.title?.length > 28
            ? media.title.slice(0, 28) + '...'
            : media.title}
        </Text>

        <View style={styles.userInfo}>
          <Text style={styles.title}>Uploaded By:</Text>
          <View style={styles.user}>
            <Image
              source={
                media?.createdBy?.profilePicture
                  ? {
                      uri: media?.createdBy?.profilePicture,
                    }
                  : Images.DEFAULT_IMAGE
              }
              style={styles.img}
            />
            <Text style={styles.name}>
              {media?.createdBy?.fullName || 'Name unavailable'}
            </Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.date}>
            Date: {formattingDate(media?.createdAt)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AudioVideoDetails', {
                index,
              });
            }}
            style={styles.btnArea}>
            <Text style={styles.normalText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = Colors =>
  StyleSheet.create({
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    btnArea: {
      flexDirection: 'row',
      // gap: 10,
      paddingVertical: responsiveScreenHeight(0.7),
      backgroundColor: Colors.PrimaryOpacityColor,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: 7,
    },
    normalText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
      fontSize: responsiveScreenFontSize(1.8),
      textTransform: 'capitalize',
    },
    userInfo: {
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
    },
    user: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    title: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
    },
    img: {
      height: 25,
      width: 25,
      borderRadius: 50,
    },
    name: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
    },
    bgImgContainer: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      justifyContent: 'flex-start',
      padding: 20,
    },
    bgImg: {
      height: 200,
      borderRadius: 10,
      resizeMode: 'contain',
      width: '100%',
      backgroundColor: Colors.Primary,
    },
    play: {
      position: 'absolute',
      top: 50,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'column',
      alignItems: 'center',
    },
    playBtn: {
      backgroundColor: Colors.White,
      padding: responsiveScreenWidth(5),
      height: 70,
      width: 70,
      borderRadius: 50,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      gap: 7,
      marginTop: 10,
    },
    doc: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HS,
      color: Colors.Heading,
    },
    date: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
  });

export default AudioVideoCard;
