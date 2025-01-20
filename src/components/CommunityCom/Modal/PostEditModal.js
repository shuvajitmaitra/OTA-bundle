import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import ReactNativeModal from 'react-native-modal';
import CustomFonts from '../../../constants/CustomFonts';
import axiosInstance from '../../../utility/axiosInstance';
import {useTheme} from '../../../context/ThemeContext';
import {showToast} from '../../HelperFunction';
import {handleError, loadCommunityPosts} from '../../../actions/chat-noti';
import {getHashtagTexts, showAlertModal} from '../../../utility/commonFunction';
import {TextInput} from 'react-native';
import EditPostBottomContainer from '../EditPostBottomContainer';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import RequireFieldStar from '../../../constants/RequireFieldStar';
import {useDispatch} from 'react-redux';
import {setSinglePost} from '../../../store/reducer/communityReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import SendIconTwo from '../../../assets/Icons/SendIconTwo';
export default function PostEditModal({
  setIsModalVisible,
  isModalVisible,
  post: postData,
}) {
  const [post, setPost] = useState(postData);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  useEffect(() => {
    setPost(postData);
  }, [postData]);

  const handleEditPost = () => {
    if (!post.title.trim()) {
      showAlertModal({
        title: 'Empty Title',
        type: 'warning',
        message: 'Title cannot be empty.',
      });
      return;
    }

    if (!post.description.trim()) {
      showAlertModal({
        title: 'Empty Post',
        type: 'warning',
        message: 'Post cannot be empty.',
      });
      return;
    }

    setPost(pre => ({...pre, tags: getHashtagTexts(pre.description)}));
    axiosInstance
      .patch(`/content/community/post/edit/${post._id}`, {
        title: post?.title,
        description: post?.description,
        tags: post.tags,
        attachments: post?.attachments,
      })
      .then(res => {
        // closePopover();
        dispatch(setSinglePost(null));
        setIsModalVisible(false);
        showToast({message: 'Post edited successfully...'});
        loadCommunityPosts({
          page: 1,
          limit: 10,
          query: '',
          tags: [],
          user: '',
          filterBy: '',
        });
      })
      .catch(error => {
        handleError(error);
      });
  };

  const {top} = useSafeAreaInsets();

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}
      avoidKeyboard={true}
      style={{
        margin: 0,
        justifyContent: 'flex-start',
        backgroundColor: Colors.White,
      }}>
      <View style={[styles.modalChild, {paddingTop: top}]}>
        {/* <ModalBackAndCrossButton toggleModal={setIsModalVisible} /> */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}>
            <CrossCircle size={35} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Post</Text>
          <TouchableOpacity style={styles.sendButton} onPress={handleEditPost}>
            <SendIconTwo />
            <Text style={styles.sendButtonText}>Publish</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.createPostContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Title
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                placeholder="Edit post title..."
                multiline
                textAlignVertical="top"
                placeholderTextColor={Colors.BodyText}
                style={[styles.input, {fontFamily: CustomFonts.REGULAR}]}
                onChangeText={text => setPost(pre => ({...pre, title: text}))}
                value={post.title || ''}
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Write Post
                <RequireFieldStar />
              </Text>
              <TextInput
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
                placeholder="Edit post..."
                placeholderTextColor={Colors.BodyText}
                textAlignVertical="top"
                multiline
                style={styles.input}
                onChangeText={text =>
                  setPost(pre => ({...pre, description: text}))
                }
                value={post.description || ''}
              />
            </View>
            <View style={{flexGrow: 1}} />
            <EditPostBottomContainer
              handleEditPost={handleEditPost}
              post={post}
              setPost={setPost}
            />
          </View>
        </ScrollView>
      </View>
      <GlobalAlertModal />
    </ReactNativeModal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    closeButton: {
      width: 100,
    },
    sendButtonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
    },
    sendButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Primary,
      borderRadius: 5,
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 10,
      width: 100,
    },
    headerContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginTop: 20,
      // backgroundColor: 'red',
      alignItems: 'center',
      marginBottom: 10,
    },

    modalChild: {
      backgroundColor: Colors.White,
      paddingHorizontal: responsiveScreenWidth(4.5),
      flex: 1,
    },
    input: {
      backgroundColor: Colors.Background_color,
      minHeight: responsiveScreenHeight(6),
      borderRadius: responsiveScreenFontSize(1),
      borderColor: Colors.BorderColor,
      borderWidth: 1,
      paddingHorizontal: responsiveScreenWidth(4),
      paddingTop: responsiveScreenHeight(1.5),
      paddingVertical: responsiveScreenHeight(1),
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    fieldLabel: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      marginTop: responsiveScreenHeight(2),
    },
    createPostContainer: {},
    title: {
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
    },
    fieldContainer: {
      gap: responsiveScreenHeight(1),
      maxHeight: responsiveScreenHeight(40),
    },
  });
