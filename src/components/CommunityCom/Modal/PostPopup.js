import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import {RegularFonts} from '../../../constants/Fonts';

const PostPopup = () => {
  const {user} = useSelector(state => state.auth);
  const {singlePost: post} = useSelector(state => state.community);

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
          showToast({message: post.isSaved ? 'Post unsaved' : 'Post saved'});
          dispatch(setSinglePost(null));
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
          dispatch(setSinglePost(null));
          setIsConfirmModalVisible(!isConfirmModalVisible);
        }
      })
      .catch(handleError);
  };

  return (
    <Popover
      backgroundStyle={{backgroundColor: Colors.BackDropColor}}
      popoverStyle={styles.popoverStyle}
      from={new Rect(post.x, post.y, 0, 0)}
      isVisible={Boolean(post)}
      onRequestClose={() => dispatch(setSinglePost(null))}>
      <View style={styles.content}>
        {!isModalVisible && !isEditModalVisible && !isConfirmModalVisible && (
          <>
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleCopyLink(link, {message: 'Link copied'});
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
      </View>
    </Popover>
  );
};

export default PostPopup;

const getStyles = Colors =>
  StyleSheet.create({
    popoverStyle: {
      backgroundColor: Colors.White,
    },
    content: {
      borderRadius: 5,
      gap: 10,
      backgroundColor: Colors.White,
      padding: 10,
      width: 200,
    },
    itemContainer: {
      paddingVertical: responsiveScreenHeight(1),
      backgroundColor: Colors.Background_color,
      paddingHorizontal: responsiveScreenWidth(2),
      borderRadius: responsiveFontSize(0.5),
    },
    item: {
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: RegularFonts.BR,
    },
  });
