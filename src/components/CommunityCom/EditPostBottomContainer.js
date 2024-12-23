import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import SendIconTwo from '../../assets/Icons/SendIconTwo';
import CrossCircle from '../../assets/Icons/CrossCircle'; // Assuming you have a CrossCircle icon
import {getHashtagTexts} from '../../utility/commonFunction';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import LoadingSmall from '../SharedComponent/LoadingSmall';
import {handleGalleryPress} from './CreatePostButtonContainer';

const EditPostBottomContainer = ({post, setPost, handleEditPost}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [creating, setCreating] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const extractTags = () => {
    setPost(pre => ({...pre, tags: getHashtagTexts(pre.description)}));
  };

  const removeImage = uri => {
    setPost(prevPost => ({
      ...prevPost,
      attachments: prevPost.attachments?.filter(
        attachment => attachment.url !== uri,
      ),
    }));
  };

  return (
    <>
      {post?.attachments?.length > 0 && (
        <View style={styles.selectedImagesContainer}>
          {post?.attachments?.map((item, index) => (
            <View
              key={`${item}_${index}`}
              style={styles.selectedImageContainer}>
              <Image style={styles.selectedImage} source={{uri: item.url}} />
              <TouchableOpacity
                onPress={() => removeImage(item.url)}
                style={styles.CrossCircle}>
                <CrossCircle color={Colors.Primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.holidayButtonContainer,
            {backgroundColor: Colors.PrimaryOpacityColor},
          ]}
          onPress={() => handleGalleryPress({setPost, setIsLoading})}>
          {!isLoading ? (
            <>
              <GalleryIcon color={Colors.Primary} />
              <Text style={[styles.holidayButtonText, {color: Colors.Primary}]}>
                Gallery
              </Text>
            </>
          ) : (
            <LoadingSmall color={Colors.Primary} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.holidayButtonContainer,
            {backgroundColor: Colors.Primary},
          ]}
          onPress={() => {
            extractTags();
            handleEditPost();
          }}>
          {creating ? (
            <LoadingSmall color={Colors.PureWhite} />
          ) : (
            <>
              <SendIconTwo color={Colors.PureWhite} />
              <Text
                style={[styles.holidayButtonText, {color: Colors.PureWhite}]}>
                Publish
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default EditPostBottomContainer;

const getStyles = Colors =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: responsiveScreenFontSize(2),
      marginTop: responsiveScreenHeight(3),
    },
    holidayButtonContainer: {
      width: responsiveScreenWidth(30),
      height: responsiveScreenHeight(5),
      backgroundColor: Colors.SecondaryButtonBackgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: responsiveScreenWidth(4),
      gap: 8,
      borderRadius: responsiveScreenWidth(2),
    },
    holidayButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    selectedImagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: responsiveScreenHeight(2),
    },
    selectedImageContainer: {
      position: 'relative',
      marginRight: responsiveScreenWidth(2),
      marginBottom: responsiveScreenHeight(2),
    },
    selectedImage: {
      width: responsiveScreenWidth(24.5),
      height: responsiveScreenHeight(15),
      borderRadius: responsiveScreenWidth(2),
      resizeMode: 'cover',
    },
    CrossCircle: {
      position: 'absolute',
      top: -responsiveScreenHeight(1),
      right: -responsiveScreenWidth(1),
      zIndex: 1,
    },
  });
