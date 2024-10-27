import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import userIcon from '../../assets/Images/user.png';
import CustomeFonts from '../../constants/CustomeFonts';
import Markdown from 'react-native-markdown-display';
import {removeHtmlTags, transFormDate} from './MessageHelper';
import {useTheme} from '../../context/ThemeContext';
import moment from 'moment';
// import AudioMessage from './AudioMessage';
// import ImageViewing from 'react-native-image-viewing';
// import VideoPlayer from '../SharedComponent/VideoPlayer';

export default function ThreadMessageItem({message}) {
  const {onlineUsers} = useSelector(state => state.chat);
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // State to control the visibility of the image viewer
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  // Extract the first file URL if any
  const file =
    message.files && message.files.length > 0 ? message.files[0] : null;
  const imageUrl = file && file.type.startsWith('image/') ? file.url : null;
  const audioUrl = file && file.type.startsWith('audio/') ? file.url : null;
  const videoUrl = file && file.type.startsWith('video/') ? file.url : null;

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <View>
          <Image
            style={styles.profileImage}
            source={
              message.sender?.profilePicture
                ? {uri: message.sender?.profilePicture}
                : userIcon
            }
          />

          {onlineUsers?.find(x => x?._id === message?.sender?._id) ? (
            <View style={styles.activeStatus}></View>
          ) : null}
        </View>
        <View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.profileName}>
            {message.sender?.fullName}
          </Text>
          <Text style={styles.messageTime}>
            {moment(message?.createdAt).format('MMM DD, YYYY h:mm A')}
          </Text>
        </View>
      </View>
      <View
        style={{
          // paddingHorizontal: responsiveScreenWidth(2),
          marginTop: responsiveScreenHeight(1),
          backgroundColor: Colors.White,
          borderRadius: 10,
        }}>
        {/* Render Markdown text if available */}
        {message.text ? (
          <Markdown style={styles.markdownStyle}>
            {transFormDate(removeHtmlTags(message.text))}
          </Markdown>
        ) : null}

        {/* Render Image if URL exists */}
        {/* {imageUrl && (
          <TouchableOpacity style={styles.img} onPress={() => setIsViewerVisible(true)}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.messageImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )} */}
        {imageUrl && (
          <TouchableOpacity
            style={styles.img}
            onPress={() => setIsViewerVisible(true)}>
            <Image
              source={{uri: imageUrl}}
              style={styles.messageImage}
              // resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {/* 
        {audioUrl && (
          <AudioMessage background={Colors.White} audioUrl={audioUrl} />
        )} */}
        {/* 
        {videoUrl && <VideoPlayer url={videoUrl} />} */}

        {/* {imageUrl && (
          <ImageViewing
            images={[{uri: imageUrl}]}
            imageIndex={0}
            visible={isViewerVisible}
            onRequestClose={() => setIsViewerVisible(false)}
          />
        )} */}
      </View>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.Background_color,
      padding: responsiveScreenWidth(3),
    },
    profileImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(4),
    },
    profileImage: {
      width: responsiveScreenWidth(10),
      height: responsiveScreenWidth(10),
      borderRadius: responsiveScreenWidth(100),
      resizeMode: 'cover',
      position: 'relative',
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    activeStatus: {
      width: 8,
      height: 8,
      borderRadius: 8,
      backgroundColor: Colors.Primary,
      position: 'absolute',
      right: responsiveScreenWidth(0),
      bottom: responsiveScreenHeight(0.5),
    },
    profileName: {
      fontSize: responsiveScreenFontSize(2.2),
      fontFamily: CustomeFonts.SEMI_BOLD,
      color: Colors.Heading,
      width: responsiveScreenWidth(75),
    },
    messageTime: {
      color: Colors.BodyText,
      paddingVertical: responsiveScreenHeight(0.2),
      fontFamily: CustomeFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    threadText: {
      color: Colors.Heading,
      fontSize: responsiveScreenFontSize(2),
      fontFamily: CustomeFonts.REGULAR,
    },
    messageImage: {
      // width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.LineColor,
    },

    img: {
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      overflow: 'hidden', // Prevents image overflow from its container
    },
    markdownStyle: {
      whiteSpace: 'pre',
      body: {
        fontFamily: CustomeFonts.REGULAR,
        // fontSize: responsiveScreenFontSize(1.9),
        color: Colors.BodyText,
        lineHeight: 20,
        paddingHorizontal: responsiveScreenWidth(3),
        // marginBottom: 100,
      },
      heading1: {
        // fontWeight: "bold",
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading2: {
        // fontWeight: "bold",
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading3: {
        // fontWeight: "bold",
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading4: {
        // fontWeight: "bold",
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      heading5: {
        fontWeight: 'bold',
      },
      heading6: {
        // fontWeight: "bold",
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      strong: {fontFamily: CustomeFonts.SEMI_BOLD},
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
        // backgroundColor: myMessage
        //   ? Colors.White
        //   : Colors.LightGreen,
        color: Colors.Primary,
        // fontWeight: "bold",
        fontFamily: CustomeFonts.SEMI_BOLD,
      },
      bullet_list: {
        marginVertical: 10,
      },
      ordered_list: {
        marginVertical: 10,
      },
      list_item: {
        marginVertical: 10,
      },
    },
  });
