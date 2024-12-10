import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import PlayButtonCircle from '../../assets/Icons/PlayButtonCircle';
import AudioIcon from '../../assets/Icons/AudioIcon';
import axiosInstance from '../../utility/axiosInstance';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/SharedComponent/Loading';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';
import {setMedias} from '../../store/reducer/audioVideoReducer';
import Images from '../../constants/Images';
import Divider from '../../components/SharedComponent/Divider';
import {formattingDate} from '../../utility/commonFunction';
import {useNavigation} from '@react-navigation/native';

export default function AudioVideoScreen() {
  // Hooks - moved all to top level
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isPlayModalVisible, setIsPlayModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(null); // Ensure it's not inside conditionals
  const dispatch = useDispatch();
  const {medias} = useSelector(state => state.medias);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true);
    axiosInstance
      .get('/media/mymedia')
      .then(res => {
        setIsLoading(false);
        // console.log("res.data", JSON.stringify(res.data, null, 1));
        if (res.data.success) {
          // Handle media data
          dispatch(setMedias(res.data.medias));
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log('error', JSON.stringify(error.response.data, null, 1));
        dispatch(setMedias([]));
      });
  }, [dispatch]);

  const togglePlayModal = mediaId => {
    const mediaIndex = medias.findIndex(media => media._id === mediaId);
    setSelectedMedia(mediaIndex !== -1 ? medias[mediaIndex] : null);
    setIsPlayModalVisible(prev => !prev);
    // navigation.navigate("PlayModal");
    setCurrentMediaIndex(mediaIndex); // Update currentMediaIndex safely
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.White}}>
        <Loading />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Background_color,
        // paddingTop: top,
      }}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <Text style={styles.heading}>Audios & Videos</Text>
      <View style={{paddingHorizontal: responsiveScreenWidth(4)}}>
        <Divider marginBottom={0.2} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mediaContainer}>
          {medias?.length > 0 && medias[0]?._id && (
            <Text style={styles.title}>
              These Audios and videos are only shared with you
            </Text>
          )}

          {medias?.length > 0 ? (
            medias?.map((media, index) => (
              <View key={media._id} style={styles.bgImgContainer}>
                <Image
                  source={
                    media?.thumbnail
                      ? {uri: media?.thumbnail}
                      : Images.DEFAULT_IMAGE
                  }
                  style={styles.bgImg}
                />
                <View style={styles.overlay}></View>
                <View style={styles.play}>
                  <TouchableOpacity
                    onPress={() => {
                      // getComments(media._id);
                      // togglePlayModal(media._id);
                      navigation.navigate('AudioVideoDetails', {index});
                    }}
                    style={styles.playBtn}>
                    {media?.mediaType === 'video' ? (
                      <PlayButtonCircle size={40} color={Colors.Primary} />
                    ) : (
                      <AudioIcon />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.info}>
                    <Text style={styles.doc}>
                      {media?.title?.length > 28
                        ? media.title.slice(0, 28) + '...'
                        : media.title}
                    </Text>
                    <Text style={styles.date}>
                      Date: {formattingDate(media?.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <NoDataAvailable height={70} />
          )}
        </View>

        {/* {selectedMedia !== null && (
          <PlayModal
            setIsPlayModalVisible={setIsPlayModalVisible}
            isPlayModalVisible={isPlayModalVisible}
            togglePlayModal={togglePlayModal}
            medias={medias}
            currentMediaIndex={currentMediaIndex}
            setCurrentMediaIndex={setCurrentMediaIndex}
          />
        )} */}
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    scrollViewContainer: {
      flexGrow: 1,
      backgroundColor: Colors.Background_color,
      paddingTop: responsiveScreenHeight(1.5),
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      paddingHorizontal: responsiveScreenWidth(4),
    },
    mediaContainer: {
      backgroundColor: Colors.Background_color,
      // backgroundColor: "green",
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingBottom: responsiveScreenHeight(2),
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    bgImgContainer: {
      position: 'relative',
      height: responsiveScreenHeight(32),
      overflow: 'hidden',
      marginTop: responsiveScreenHeight(2),
    },
    bgImg: {
      height: responsiveScreenHeight(32),
      borderRadius: 10,
      resizeMode: 'contain',
      width: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.40)',
      borderRadius: 10,
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
    infoContainer: {
      position: 'absolute',
      bottom: 20,
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: 10,
      flexDirection: 'column',
      alignSelf: 'center',
    },
    info: {
      padding: responsiveScreenWidth(2),
      minHeight: responsiveScreenHeight(8),
      width: responsiveScreenWidth(80),
      borderWidth: 1,
      borderColor: Colors.WhiteOpacityColor,
      borderRadius: 10,
      backgroundColor: Colors.Blur_Background,
    },
    doc: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
    },
    date: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
    },
  });
