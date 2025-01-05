import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import GalleryIcon from '../../assets/Icons/GalleryIcon';
import SendIconTwo from '../../assets/Icons/SendIconTwo';
import CrossCircle from '../../assets/Icons/CrossCircle'; // Assuming you have a CrossCircle icon
import axiosInstance from '../../utility/axiosInstance';
import {getHashtagTexts} from '../../utility/commonFunction';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {showToast} from '../HelperFunction';
import {loadCommunityPosts} from '../../actions/chat-noti';
import {useGlobalAlert} from '../SharedComponent/GlobalAlertContext';
import CustomIconButton from '../SharedComponent/CustomIconButton';
import AiModal from '../SharedComponent/AiModal/AiModal';
import AiIcon2 from '../../assets/Icons/AiIcon2';
import {launchImageLibrary} from 'react-native-image-picker';

export const handleGalleryPress = async ({setPost, setIsLoading}) => {
  const options = {
    mediaType: 'photo',
    maxWidth: 30000,
    maxHeight: 30000,
    quality: 1,
    selectionLimit: 10,
  };

  try {
    setIsLoading(true);

    // Use the Promise-based API of launchImageLibrary
    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorMessage);
      showToast({message: `ImagePicker Error: ${response.errorMessage}`});
      return;
    }

    if (!response.assets || response.assets.length === 0) {
      console.log('No images selected');
      showToast({message: 'No images selected'});
      return;
    }

    // Upload all selected images concurrently
    const uploadedFiles = await Promise.all(
      response.assets.map(async item => {
        const formData = new FormData();
        formData.append('file', {
          uri: item.uri,
          name: item.fileName || `uploaded_image_${Date.now()}`,
          type: item.type || 'image/jpeg',
        });

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        try {
          const res = await axiosInstance.post('/chat/file', formData, config);
          return res.data.file;
        } catch (uploadError) {
          console.error('Upload Error:', uploadError);
          throw uploadError; // This will be caught by the outer catch
        }
      }),
    );

    // Update the post with the newly uploaded attachments
    setPost(prevPost => ({
      ...prevPost,
      attachments: [
        ...(prevPost.attachments || []),
        ...uploadedFiles.map(file => ({
          url: file.location,
          name: file.name,
          type: file.type || 'image/jpeg',
          size: file.size,
        })),
      ],
    }));
  } catch (error) {
    console.error('Error in handleGalleryPress:', error);
    showToast({message: 'An error occurred while uploading images.'});
  } finally {
    setIsLoading(false);
  }
};

const CreatePostButtonContainer = ({post, setPost}) => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {showAlert} = useGlobalAlert();
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const extractTags = () => {
    setPost(pre => ({...pre, tags: getHashtagTexts(pre.description)}));
  };

  const handlePost = () => {
    const title = post.title?.trim() || '';
    const description = post.description?.trim() || '';

    if (!title)
      return showAlert({
        title: 'Empty Title',
        type: 'warning',
        message: 'Title cannot be empty.',
      });
    if (!description)
      return showAlert({
        title: 'Empty Post',
        type: 'warning',
        message: 'Post cannot be empty.',
      });

    setCreating(true);

    axiosInstance
      .post('/content/community/post/create', {
        ...post,
        title,
        description,
        attachments: post.attachments || [],
      })
      .then(res => {
        if (res.data.success) {
          loadCommunityPosts({page: 1, limit: 10});
          setPost({attachments: [], title: '', description: '', tags: []});
          showToast({message: 'Posted...'});
          setCreating(false);
        }
      })
      .catch(error => {
        console.log(
          'error from content community post create',
          JSON.stringify(error.response?.data || error.message, null, 1),
        );
        setCreating(false);
      });
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
              <Image style={styles.selectedImage} source={{uri: item?.url}} />
              <TouchableOpacity
                onPress={() => removeImage(item.url)}
                style={styles.CrossCircle}>
                <CrossCircle color={'red'} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <CustomIconButton
          handlePress={() => handleGalleryPress({setPost, setIsLoading})}
          title="Gallery"
          customContainerStyle={styles.buttonStyle}
          isLoading={isLoading}
          disable={false}
          icon={<GalleryIcon color={Colors.Primary} />}
          iconPosition={'left'}
          background={Colors.PrimaryOpacityColor}
          color={Colors.Primary}
        />
        <CustomIconButton
          handlePress={() => {
            setAiModalVisible(pre => !pre);
          }}
          title="AI"
          customContainerStyle={styles.buttonStyle}
          isLoading={false}
          disable={false}
          icon={<AiIcon2 color={'white'} size={24} />}
          iconPosition={'left'}
          color={creating || isLoading ? Colors.Primary : Colors.PureWhite}
        />
        <CustomIconButton
          handlePress={() => {
            extractTags();
            handlePost();
          }}
          title="Publish"
          customContainerStyle={styles.buttonStyle}
          isLoading={creating}
          disable={creating || isLoading}
          icon={
            <SendIconTwo
              color={creating || isLoading ? Colors.Primary : Colors.PureWhite}
            />
          }
          iconPosition={'left'}
          color={creating || isLoading ? Colors.Primary : Colors.PureWhite}
        />
      </View>
      <AiModal
        setState={text => setPost(pre => ({...pre, description: text}))}
        post={post}
        isVisible={aiModalVisible}
        onCancelPress={() => setAiModalVisible(!aiModalVisible)}
      />
    </>
  );
};

export default CreatePostButtonContainer;

const getStyles = Colors =>
  StyleSheet.create({
    buttonStyle: {
      flex: 0.3,
      height: 40,
      borderRadius: 4,
      marginTop: 0,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: responsiveScreenFontSize(2),
      marginVertical: responsiveScreenHeight(1.5),
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
      flex: 0.3,
    },
    holidayButtonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
    },
    disabledButton: {
      backgroundColor: Colors.PrimaryOpacityColor,
    },
    disabledButtonText: {
      color: Colors.Primary,
    },
    selectedImagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: responsiveScreenHeight(2),
    },
    selectedImageContainer: {
      position: 'relative',
      marginRight: responsiveScreenWidth(3),
      marginBottom: responsiveScreenHeight(2),
      // backgroundColor: "red",
    },
    selectedImage: {
      width: responsiveScreenWidth(25),
      height: responsiveScreenHeight(15),
      borderRadius: responsiveScreenWidth(2),
    },
    CrossCircle: {
      position: 'absolute',
      top: -12,
      right: -12,
      zIndex: 1,
    },
  });
