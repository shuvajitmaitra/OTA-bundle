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
import {ReactNativeModal} from 'react-native-modal';
import ModalBackAndCrossButton from '../../components/ChatCom/Modal/ModalBackAndCrossButton';
import ArrowLeftWhite from '../../assets/Icons/ArrowLeftWhite';
import ArrowRightWhite from '../../assets/Icons/ArrowRightWhite';
import VideoPlayer from '../ProgramCom/VideoPlayer';
import moment from 'moment';
import Markdown from 'react-native-markdown-display';
import CommentSection from '../CommentCom/CommentSection';
import Images from '../../constants/Images';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TrackPlayer from '../MockInterviewCom/TrackPlayer';
// import {Audio} from 'expo-av';

export default function PlayModal({
  setIsPlayModalVisible,
  togglePlayModal,
  isPlayModalVisible,
  medias,
  currentMediaIndex,
  setCurrentMediaIndex,
}) {
  const [activeButton, setActiveButton] = useState('summary');
  const [content, setContent] = useState('');
  const [sound, setSound] = useState();

  // useEffect(() => {
  //   async function loadSound() {
  //     const {sound} = await Audio.Sound.createAsync({
  //       uri: medias[currentMediaIndex]?.url,
  //     });
  //     setSound(sound);
  //   }

  //   if (medias[currentMediaIndex]?.mediaType === 'audio') {
  //     loadSound();
  //   }

  //   return () => {
  //     if (sound) {
  //       sound.unloadAsync();
  //     }
  //   };
  // }, [currentMediaIndex, medias]);

  useEffect(() => {
    if (!isPlayModalVisible && sound) {
      sound.pauseAsync().then(() => sound.unloadAsync());
    }
  }, [isPlayModalVisible, sound]);

  useEffect(() => {
    if (medias[currentMediaIndex] && medias[currentMediaIndex].data) {
      setContent(medias[currentMediaIndex].data[activeButton] || 'No Summary');
    } else {
      setContent('No Summary');
    }
  }, [activeButton, currentMediaIndex, medias]);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {top} = useSafeAreaInsets();

  return (
    <ReactNativeModal
      isVisible={isPlayModalVisible}
      onBackdropPress={() => setIsPlayModalVisible(false)}
      style={styles.modal}
      backdropColor={Colors.White}
      backdropOpacity={1}>
      <View style={[styles.modalContainer, {paddingTop: top / 2}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalTop}>
              <ModalBackAndCrossButton toggleModal={togglePlayModal} />
            </View>

            <View style={styles.btnContainer}>
              {currentMediaIndex > 0 && (
                <TouchableOpacity
                  onPress={() => setCurrentMediaIndex(currentMediaIndex - 1)}
                  style={styles.backBtn}>
                  <ArrowLeftWhite />
                  <Text style={styles.btnText}>Previous</Text>
                </TouchableOpacity>
              )}
              {currentMediaIndex < medias.length - 1 && (
                <TouchableOpacity
                  onPress={() => setCurrentMediaIndex(currentMediaIndex + 1)}
                  style={styles.nextBtn}>
                  <Text style={styles.btnText}>Next</Text>
                  <ArrowRightWhite />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.mediaContainer}>
              {medias[currentMediaIndex]?.mediaType === 'video' && (
                <VideoPlayer url={medias[currentMediaIndex]?.url} />
              )}
              {medias[currentMediaIndex]?.mediaType === 'audio' && (
                <TrackPlayer
                  recordedURI={medias[currentMediaIndex]?.url}
                  _id={medias[currentMediaIndex]?._id}
                  isActive={isPlayModalVisible}
                />
              )}
            </View>

            <Text style={styles.heading}>
              {medias[currentMediaIndex]?.title}
            </Text>

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
                  'MMM DD, YYYY',
                )}
              </Text>
            </View>
            <Text style={styles.title}>Resources</Text>

            {/* {medias[currentMediaIndex]?.data && (
              <ScrollView
                horizontal
                style={styles.resource}
                contentContainerStyle={styles.buttonContainer}
                showsHorizontalScrollIndicator={false}
              >
                {["summary", "implementation", "interview", "behavioral"]
                  ?.filter(
                    (buttonLabel) => medias[currentMediaIndex].data[buttonLabel]
                  )
                  .map((buttonLabel) => (
                    <TouchableOpacity
                      key={buttonLabel}
                      style={[
                        styles.btn,
                        activeButton === buttonLabel && styles.activeButton,
                      ]}
                      onPress={() => setActiveButton(buttonLabel)}
                    >
                      <Text
                        style={[
                          styles.resourceBtn,
                          activeButton === buttonLabel && styles.activeBtnText,
                        ]}
                      >
                        {buttonLabel}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )} */}
            <Markdown style={styles.markdownStyle}>{content}</Markdown>
            <CommentSection postId={medias[currentMediaIndex]?._id} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ReactNativeModal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    modal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    modalContainer: {
      flex: 1,
      width: responsiveScreenWidth(100),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(5),
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: responsiveScreenHeight(2),
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    btnContainer: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(2),
      height: responsiveScreenHeight(3.5),
      marginBottom: responsiveScreenHeight(2),
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
