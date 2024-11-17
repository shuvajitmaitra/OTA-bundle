// AudioVideoDetails.js
import React, {useEffect, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import moment from 'moment';
import Markdown from 'react-native-markdown-display';
import Images from '../../constants/Images';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Audio} from 'expo-av';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import VideoPlayer from '../../components/ProgramCom/VideoPlayer';
import CommentSection from '../../components/CommentCom/CommentSection';
import TrackPlayer from '../../components/MockInterviewCom/TrackPlayer';

const AudioVideoDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {medias} = useSelector(state => state.medias);

  // Assuming route.params contains the initial media index
  const initialMediaIndex = route.params?.initialMediaIndex || 0;
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialMediaIndex);
  const [activeButton, setActiveButton] = useState('summary');
  const [content, setContent] = useState('');
  const [sound, setSound] = useState();

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    async function loadSound() {
      const {sound} = await Audio.Sound.createAsync({
        uri: medias[currentMediaIndex]?.url,
      });
      setSound(sound);
      await sound.playAsync();
    }

    if (medias[currentMediaIndex]?.mediaType === 'audio') {
      loadSound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentMediaIndex, medias]);

  useEffect(() => {
    if (sound) {
      sound.pauseAsync().then(() => sound.unloadAsync());
      setSound(null);
    }
  }, [currentMediaIndex]);

  useEffect(() => {
    if (medias[currentMediaIndex] && medias[currentMediaIndex].data) {
      setContent(medias[currentMediaIndex].data[activeButton] || 'No Summary');
    } else {
      setContent('No Summary');
    }
  }, [activeButton, currentMediaIndex, medias]);

  const handleGoBack = () => {
    // Stop any playing sound
    if (sound) {
      sound.pauseAsync().then(() => sound.unloadAsync());
    }
    navigation.goBack();
  };

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentMediaIndex < medias.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {medias.length > 1 && (
            <View style={styles.btnContainer}>
              {currentMediaIndex > 0 && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.backBtn}>
                  <ArrowLeftWhite />
                  <Text style={styles.btnText}>Previous</Text>
                </TouchableOpacity>
              )}
              {currentMediaIndex < medias.length - 1 && (
                <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                  <Text style={styles.btnText}>Next</Text>
                  <ArrowRightWhite />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Media Player */}
          <View style={styles.mediaContainer}>
            {medias[currentMediaIndex]?.mediaType === 'video' && (
              <VideoPlayer url={medias[currentMediaIndex]?.url} />
            )}
            {medias[currentMediaIndex]?.mediaType === 'audio' && (
              <TrackPlayer
                recordedURI={medias[currentMediaIndex]?.url}
                _id={medias[currentMediaIndex]?._id}
                isActive={true}
              />
            )}
          </View>

          {/* Media Details */}
          <Text style={styles.heading}>{medias[currentMediaIndex]?.title}</Text>

          <View style={styles.userInfo}>
            <Text style={styles.title}>Uploaded By:</Text>
            <View style={styles.user}>
              <Image
                source={
                  medias[currentMediaIndex]?.createdBy?.profilePicture
                    ? {
                        uri: medias[currentMediaIndex]?.createdBy
                          ?.profilePicture,
                      }
                    : Images.DEFAULT_IMAGE
                }
                style={styles.img}
              />
              <Text style={styles.name}>
                {medias[currentMediaIndex]?.createdBy?.fullName ||
                  'Name unavailable'}
              </Text>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateTitle}>Uploaded Date: </Text>
            <Text style={styles.date}>
              {moment(medias[currentMediaIndex]?.createdAt).format(
                'D MMM, YYYY',
              )}
            </Text>
          </View>

          <Text style={styles.title}>Resources</Text>

          {/* Resource Buttons */}
          {medias[currentMediaIndex]?.data && (
            <ScrollView
              horizontal
              style={styles.resource}
              contentContainerStyle={styles.buttonContainer}
              showsHorizontalScrollIndicator={false}>
              {['summary', 'implementation', 'interview', 'behavioral']
                ?.filter(
                  buttonLabel => medias[currentMediaIndex].data[buttonLabel],
                )
                .map(buttonLabel => (
                  <TouchableOpacity
                    key={buttonLabel}
                    style={[
                      styles.btn,
                      activeButton === buttonLabel && styles.activeButton,
                    ]}
                    onPress={() => setActiveButton(buttonLabel)}>
                    <Text
                      style={[
                        styles.resourceBtn,
                        activeButton === buttonLabel && styles.activeBtnText,
                      ]}>
                      {buttonLabel}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}

          {/* Content */}
          <Markdown style={styles.markdownStyle}>{content}</Markdown>

          {/* Comment Section */}
          <CommentSection postId={medias[currentMediaIndex]?._id} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AudioVideoDetails;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.White,
    },
    keyboardAvoidingView: {
      //   flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: responsiveScreenWidth(5),
      paddingBottom: responsiveScreenHeight(2),
    },
    header: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Primary,
      marginLeft: 5,
    },
    btnContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      height: 35,
      marginVertical: 10,
    },
    btnText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.PureWhite,
      textAlign: 'center',
    },
    backBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    nextBtn: {
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.BodyText,
      flexDirection: 'row',
      gap: responsiveScreenWidth(1),
      alignItems: 'center',
    },
    mediaContainer: {
      marginBottom: responsiveScreenHeight(1),
    },
    userInfo: {
      flexDirection: 'row',
      gap: 15,
      alignItems: 'center',
      marginTop: responsiveScreenHeight(1),
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
    dateContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginTop: responsiveScreenHeight(0.5),
    },
    dateTitle: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.Heading,
    },
    date: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.6),
      color: Colors.BodyText,
      paddingVertical: responsiveScreenHeight(1),
    },
    heading: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Primary,
      marginBottom: responsiveScreenHeight(1),
      marginTop: responsiveScreenHeight(1),
    },
    resource: {
      marginTop: responsiveScreenHeight(1),
      marginBottom: responsiveScreenHeight(2),
    },
    btn: {
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    resourceBtn: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Primary,
      textTransform: 'capitalize',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },
    activeButton: {
      paddingHorizontal: responsiveScreenWidth(3),
      paddingVertical: responsiveScreenHeight(1.5),
      borderRadius: responsiveScreenWidth(2),
      backgroundColor: Colors.Primary,
    },
    activeBtnText: {
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.PureWhite,
    },
    markdownStyle: {
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
      body: {
        flex: 1,
        color: Colors.BodyText,
        fontFamily: CustomFonts.REGULAR,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: responsiveScreenHeight(1.5),
      },
      heading1: {
        fontSize: 24,
        color: Colors.Heading,
        marginBottom: 10,
      },
      heading2: {
        fontSize: 20,
        color: Colors.Heading,
        marginBottom: 8,
      },
      heading3: {
        fontSize: 18,
        color: Colors.Heading,
        marginBottom: 6,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'justify',
      },
      link: {
        color: Colors.Primary,
      },
      blockquote: {
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_block: {
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 8,
        fontFamily: 'monospace',
      },
      code_inline: {
        backgroundColor: Colors.White,
        borderRadius: 4,
        padding: 4,
        fontFamily: 'monospace',
      },
    },
  });
