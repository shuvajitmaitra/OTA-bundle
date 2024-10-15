import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../../context/ThemeContext';
import Markdown from 'react-native-markdown-display';
import {TouchableOpacity} from 'react-native';
import CustomeFonts from '../../../constants/CustomeFonts';
import mime from 'mime';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {
  autoLinkify,
  bytesToSize,
  removeHtmlTags,
  transFormDate,
} from '../MessageHelper';
import CustomVideoPlayer from '../CustomVideoPlayer';
import FileIcon from './FileIcon';
import {VideoPlaybackProvider} from '../../../context/VideoPlaybackContext';
import AudioMessage from '../AudioMessage';

const ThreadMessageContent = ({message, downloadFile, setSelectedImages}) => {
  const [isSeeMoreClicked, setIsSeeMoreClicked] = useState(false);
  const messageText = isSeeMoreClicked
    ? message?.text
    : message?.text?.length > 500
    ? message?.text?.slice(0, 500) + '...'
    : message?.text;
  const Colors = useTheme();
  const styles = getStyles(Colors);

  const images = [
    'image/bmp',
    'image/cis-cod',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/pipeg',
    'image/x-xbitmap',
    'image/png',
  ];
  return (
    <>
      {message?.type === 'delete' ? (
        <View style={styles.deleteContainer}>
          <Text style={styles.deleteText}>This message has been deleted</Text>
        </View>
      ) : (
        <>
          {message?.text && (
            <View style={styles.textContainer}>
              <Markdown style={styles.markdownStyle}>
                {autoLinkify(transFormDate(removeHtmlTags(messageText)))}
              </Markdown>
            </View>
          )}
          {message?.text?.length > 500 && (
            <TouchableOpacity
              onPress={() => {
                setIsSeeMoreClicked(prev => !prev);
              }}>
              <Text
                style={{
                  color: Colors.Primary,
                  fontSize: responsiveScreenFontSize(1.65),
                  fontFamily: CustomeFonts.SEMI_BOLD,
                }}>
                {isSeeMoreClicked ? 'Read less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          )}
          {message?.files?.length > 0 && (
            <View
              style={{
                alignSelf: 'flex-start',
                overflow: 'hidden',
                gap: 10,
              }}>
              {message?.files.map((file, i) => (
                <View key={i}>
                  {file?.file?.type === 'audio/mp3' ||
                  file?.type?.startsWith('audio/') ? (
                    <View style={styles.audioContainer}>
                      <AudioMessage
                        background={Colors.White}
                        audioUrl={file?.url}
                      />
                    </View>
                  ) : file?.type?.startsWith('video/') ? (
                    <View style={{borderRadius: 10, overflow: 'hidden'}}>
                      <View
                        style={{
                          marginRight: -10,
                        }}>
                        <VideoPlaybackProvider>
                          {/* <CustomVideoPlayer
                            url={file?.url}
                            id={message?._id}
                          /> */}
                        </VideoPlaybackProvider>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => downloadFile(file)}
                      activeOpacity={0.5}
                      style={{
                        flexDirection: 'row',
                        borderRadius: 8,
                        maxWidth: '100%',
                        height: 'auto',
                        overflow: 'hidden',
                      }}>
                      {images.includes(file.type) ? (
                        <TouchableOpacity
                          //   ref={touchableRef}
                          //   onLongPress={() =>
                          //     message?.type !== "delete" ? openPopover() : null
                          //   }
                          onPress={() => setSelectedImages([{uri: file.url}])}
                          style={styles.imageContainer}>
                          <Image
                            width={responsiveScreenWidth(70)}
                            source={{uri: file.url}}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            padding: 8,
                            flexDirection: 'row',
                            gap: 8,
                          }}>
                          <FileIcon file={file.type} />

                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 10,
                              alignItems: 'flex-start',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontWeight: 'bold',
                                fontFamily: CustomeFonts.REGULAR,
                                flex: 1,
                                flexBasis: '40%',
                                color: Colors.Heading,
                                fontFamily: CustomeFonts.REGULAR,
                              }}>
                              {file?.name || 'N/A'}
                            </Text>
                            <AntIcons
                              style={{
                                color: Colors.BodyText,
                              }}
                              size={16}
                              name="download"
                            />
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                className="mime"
                                style={{
                                  color: Colors.BodyText,
                                  fontFamily: CustomeFonts.REGULAR,
                                }}>
                                {mime?.getExtension(file.type) || 'File'}
                              </Text>
                              <Text
                                style={{
                                  color: Colors.BodyText,
                                  fontFamily: CustomeFonts.REGULAR,
                                  fontSize: responsiveScreenFontSize(1.4),
                                }}>
                                ({bytesToSize(file.size || 0)})
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </>
  );
};

export default ThreadMessageContent;

const getStyles = (Colors, message) =>
  StyleSheet.create({
    imageContainer: {
      overflow: 'hidden',
      marginTop: responsiveScreenHeight(1),
      marginLeft: responsiveScreenWidth(3),
      borderRadius: 10,
    },
    audioContainer: {
      minWidth: responsiveScreenWidth(70),
      marginLeft: responsiveScreenWidth(3),
      marginTop: responsiveScreenHeight(1),
    },
    textContainer: {
      // marginTop: responsiveScreenHeight(1),
      borderRadius: 10,
      backgroundColor: Colors.White,
      // marginLeft: responsiveScreenWidth(3),
    },
    deleteContainer: {
      // padding: 10,
      borderRadius: 10,
      backgroundColor: Colors.White,
      marginTop: responsiveScreenHeight(0.5),
      // marginLeft: responsiveScreenWidth(3),
    },
    deleteText: {
      fontFamily: CustomeFonts.REGULAR,
      color: Colors.Red,
      //   marginLeft: responsiveScreenWidth(15),
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
      whiteSpace: 'pre',
      body: {
        marginBottom: -10,
        marginTop: -5,
        maxWidth: responsiveScreenWidth(80),
        fontFamily: CustomeFonts.REGULAR,
        color: Colors.Heading,
        // paddingHorizontal: responsiveScreenWidth(3),
        fontSize: 15,
      },
      code_inline: {
        color: Colors.BodyText,
      },
      hr: {
        backgroundColor: Colors.BodyText,
      },
      fence: {color: Colors.BodyText},
      code_block: {color: Colors.BodyText},
      blockquote: {color: Colors.BodyText},
      table: {
        borderColor: Colors.BorderColor,
      },
      thead: {
        borderColor: Colors.BorderColor,
      },
      tbody: {
        borderColor: Colors.BorderColor,
      },
      th: {
        borderColor: Colors.BorderColor,
      },
      tr: {
        borderColor: Colors.BorderColor,
      },
      td: {
        borderColor: Colors.BorderColor,
      },
      link: {
        // backgroundColor: message
        //   ? Colors.White
        //   : Colors.LightGreen,
        color: Colors.Primary,
        fontWeight: 'bold',
      },
    },
  });
