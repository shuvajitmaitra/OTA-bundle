import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch, useSelector} from 'react-redux';
import {useTheme} from '../../../context/ThemeContext';
import PostEditModal from './PostEditModal';
import ReportModal from './ReportModal';
import ConfirmationModal from '../../SharedComponent/ConfirmationModal';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import {showToast} from '../../HelperFunction';
import {
  setSinglePost,
  setSavePost,
} from '../../../store/reducer/communityReducer';
import axiosInstance from '../../../utility/axiosInstance';
import {handleError, loadCommunityPosts} from '../../../actions/chat-noti';
import {showAlertModal} from '../../../utility/commonFunction';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import Popover, {Rect} from 'react-native-popover-view';

const PostPopup = () => {
  const {user} = useSelector(state => state.auth);
  const {singlePost: post} = useSelector(state => state.community);
  console.log('singlePost', JSON.stringify(post, null, 1));

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const handleCopyLink = (text, toast) => {
    try {
      Clipboard.setString(text);
      showToast(toast);
      dispatch(setSinglePost(null));
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  const handleSavePost = () => {
    axiosInstance
      .post('/content/community/post/option/save', {
        post: post._id,
        action: 'save',
      })
      .then(res => {
        if (res.data.success) {
          dispatch(setSavePost(post));
          showToast(post.isSaved ? 'Post unsaved' : 'Post saved');
        }
      })
      .catch(handleError);
  };

  const link = `https://portal.bootcampshub.ai/dashboard/community/post/${post?._id}`;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleDeletePost = () => {
    axiosInstance
      .delete(`/content/community/post/delete/${post._id}`)
      .then(res => {
        if (res.data.success) {
          loadCommunityPosts({
            page: 1,
            limit: 10,
            query: '',
            tags: [],
            user: '',
            filterBy: '',
          });
        }
      })
      .catch(handleError);
  };

  return (
    // <ReactNativeModal
    //   style={{
    //     position: 'absolute',
    //     top: post.x - 20,
    //     left: post.y - 100,
    //     margin: 0,
    //     backgroundColor: Colors.Background_color,
    //     padding: 10,
    //     borderRadius: 5,
    //   }}
    //   isVisible={Boolean(post)}
    //   onBackdropPress={() => dispatch(setSinglePost(null))}
    //   animationIn="slideInUp"
    //   animationOut="slideOutDown"
    //   useNativeDriver={true}>

    // </ReactNativeModal>
    <Popover
      from={new Rect(post.x, post.y, 0, 0)}
      isVisible={Boolean(post)}
      onRequestClose={() => dispatch(setSinglePost(null))}>
      <>
        {!isModalVisible && !isEditModalVisible && !isConfirmModalVisible && (
          <>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleCopyLink(link, 'Link copied');
              }}>
              <Text style={styles.item}>Copy post link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleCopyLink(post?.description, 'Text copied');
              }}>
              <Text style={styles.item}>Copy Post Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleSavePost();
              }}>
              <Text style={styles.item}>
                {post?.isSaved ? 'Saved' : 'Save the post'}
              </Text>
            </TouchableOpacity>
            {user?._id !== post?.createdBy?._id && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  if (post?.isReported) {
                    showAlertModal({
                      title: 'You have reported this post',
                      type: 'success',
                    });
                  } else {
                    setIsModalVisible(pre => !pre);
                  }
                }}>
                <Text style={styles.item}>Report the post</Text>
              </TouchableOpacity>
            )}
            {user?._id === post?.createdBy?._id && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  setIsEditModalVisible(pre => !pre);
                }}>
                <Text style={styles.item}>Edit this post</Text>
              </TouchableOpacity>
            )}
            {user?._id === post?.createdBy?._id && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  setIsConfirmModalVisible(!isConfirmModalVisible);
                }}>
                <Text style={styles.item}>Delete the post</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {isModalVisible && (
          <ReportModal
            post={post}
            setIsModalVisible={() => setIsModalVisible(pre => !pre)}
            isModalVisible={isModalVisible}
          />
        )}
        {isEditModalVisible && (
          <PostEditModal
            post={post}
            setIsModalVisible={() => setIsEditModalVisible(pre => !pre)}
            isModalVisible={isEditModalVisible}
          />
        )}
        {isConfirmModalVisible && (
          <ConfirmationModal
            isVisible={isConfirmModalVisible}
            tittle="Delete"
            description="Do you want to delete this post?"
            okPress={() => handleDeletePost()}
            cancelPress={() => setIsConfirmModalVisible(!isConfirmModalVisible)}
          />
        )}
        <GlobalAlertModal />
      </>
    </Popover>
  );
};

export default PostPopup;

const getStyles = Colors =>
  StyleSheet.create({
    itemContainer: {
      paddingVertical: responsiveScreenHeight(0.5),
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveFontSize(0.5),
    },
    item: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
  });
