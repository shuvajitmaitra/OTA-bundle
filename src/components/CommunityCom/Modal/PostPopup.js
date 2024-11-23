import {StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import Popover from 'react-native-modal-popover';
import {TouchableOpacity} from 'react-native';
import {showToast} from '../../HelperFunction';
import axiosInstance from '../../../utility/axiosInstance';
import {handleError, loadCommunityPosts} from '../../../actions/chat-noti';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../../constants/CustomFonts';
import {useTheme} from '../../../context/ThemeContext';
import ReportModal from './ReportModal';
import {useDispatch, useSelector} from 'react-redux';
import PostEditModal from './PostEditModal';
import ConfirmationModal from '../../SharedComponent/ConfirmationModal';
import {setSavePost} from '../../../store/reducer/communityReducer';
import {showAlertModal} from '../../../utility/commonFunction';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import Clipboard from '@react-native-clipboard/clipboard';

const PostPopup = ({
  setIsReportModalVisible,
  popoverVisible,
  closePopover,
  popoverAnchorRect,
  post,
}) => {
  const {user} = useSelector(state => state.auth);
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();

  const handleCopyLink = (text, toast) => {
    try {
      Clipboard.setString(text);
      showToast(toast); // Show a toast message after copying the link
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
          closePopover();
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
      .catch(error => {
        handleError(error);
      });
  };
  return (
    <Popover
      contentStyle={styles.content}
      arrowStyle={styles.arrow}
      backgroundStyle={styles.background}
      visible={popoverVisible}
      onClose={closePopover}
      fromRect={popoverAnchorRect}
      supportedOrients={['portrait', 'landscape']}>
      {!isModalVisible && !isEditModalVisible && !isConfirmModalVisible && (
        <>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              handleCopyLink(link, 'Link copied');
              closePopover();
            }}>
            <Text style={styles.item}>Copy post link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              handleCopyLink(post?.description, 'Text copied');
              closePopover(); // Close the popover after copying the link
            }}>
            <Text style={styles.item}>Copy Post Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              handleSavePost();
            }}>
            <Text style={styles.item}>
              {post.isSaved ? 'Saved' : 'Save the post'}
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
          {user?._id == post?.createdBy?._id && (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                setIsEditModalVisible(pre => !pre);
              }}>
              <Text style={styles.item}>Edit this post</Text>
            </TouchableOpacity>
          )}
          {user?._id == post?.createdBy?._id && (
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
          closePopover={closePopover}
          post={post}
          setIsModalVisible={() => setIsModalVisible(pre => !pre)}
          isModalVisible={isModalVisible}
        />
      )}
      {isEditModalVisible && (
        <PostEditModal
          closePopover={closePopover}
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
    </Popover>
  );
};

export default PostPopup;

const getStyles = Colors =>
  StyleSheet.create({
    arrow: {
      borderTopColor: Colors.White,
      marginTop: responsiveScreenHeight(2),
    },
    content: {
      borderRadius: 5,
      gap: responsiveScreenHeight(1),
      backgroundColor: Colors.White,
    },
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
