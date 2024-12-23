import {ScrollView, StyleSheet, Text, View} from 'react-native';
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
import ModalBackAndCrossButton from '../../ChatCom/Modal/ModalBackAndCrossButton';
import {handleError, loadCommunityPosts} from '../../../actions/chat-noti';
import {getHashtagTexts, showAlertModal} from '../../../utility/commonFunction';
import {TextInput} from 'react-native';
import EditPostBottomContainer from '../EditPostBottomContainer';
import GlobalAlertModal from '../../SharedComponent/GlobalAlertModal';
import RequireFieldStar from '../../../constants/RequireFieldStar';

export default function PostEditModal({
  setIsModalVisible,
  isModalVisible,
  post: postData,
  closePopover,
}) {
  const [post, setPost] = useState(postData);
  const Colors = useTheme();
  const styles = getStyles(Colors);

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
        closePopover();
        setIsModalVisible(false);
        showToast('Edited...');
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

  return (
    <ReactNativeModal
      backdropColor={Colors.BackDropColor}
      isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalChild}>
          <ModalBackAndCrossButton toggleModal={setIsModalVisible} />
          <ScrollView>
            <View style={styles.createPostContainer}>
              <Text style={styles.title}>Edit Post</Text>
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
                  style={[
                    styles.input,
                    {
                      minHeight: responsiveScreenHeight(15),
                      fontFamily: CustomFonts.REGULAR,
                    },
                  ]}
                  onChangeText={text =>
                    setPost(pre => ({...pre, description: text}))
                  }
                  value={post.description || ''}
                />
              </View>
              <EditPostBottomContainer
                handleEditPost={handleEditPost}
                post={post}
                setPost={setPost}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <GlobalAlertModal />
    </ReactNativeModal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    modalContainer: {
      height: responsiveScreenHeight(100),
      flex: 1,
      width: responsiveScreenWidth(90),
      justifyContent: 'center',
    },

    modalChild: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4.5),
      paddingVertical: responsiveScreenWidth(4.5),
      maxHeight: responsiveScreenHeight(80),
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
    },
    fieldLabel: {
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,
    },
    createPostContainer: {
      backgroundColor: Colors.White,
      borderRadius: 10,
      minHeight: responsiveScreenHeight(30),
    },
    title: {
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      fontFamily: CustomFonts.MEDIUM,

      marginTop: responsiveScreenHeight(2),
    },
    fieldContainer: {
      // backgroundColor: "pink",
      //   minHeight: responsiveScreenHeight(10),
      marginTop: responsiveScreenHeight(2),
      gap: responsiveScreenHeight(1),
    },
  });
