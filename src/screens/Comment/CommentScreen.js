import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTheme} from '../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import {RegularFonts} from '../../constants/Fonts';
import CommentPopup from '../../components/CommentCom/CommentPopup';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {useDispatch, useSelector} from 'react-redux';
import {formatDynamicDate, showAlertModal} from '../../utility/commonFunction';
import axiosInstance from '../../utility/axiosInstance';
import store from '../../store';
import {setCommentCount} from '../../store/reducer/communityReducer';
import {
  addComment,
  setComments,
  setSingleComment,
} from '../../store/reducer/commentReducer';
import Comment from '../../components/CommunityCom/Comment';
import LoadingSmall from '../../components/SharedComponent/LoadingSmall';
import SendIcon from '../../assets/Icons/SendIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getComments, giveReply} from '../../actions/chat-noti';

const CommentScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const [commentText, setCommentText] = useState('');
  const textInputRef = useRef(null);
  const {top} = useSafeAreaInsets();
  const Colors = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(Colors);
  const {comments = [], singleComment} = useSelector(state => state.comment);
  const [isCommenting, setCommenting] = useState(false);
  const {contentId} = route.params;

  useEffect(() => {
    getComments(contentId);

    return () => {
      dispatch(setComments([]));
    };
  }, [dispatch, contentId]);

  const handleCreateComment = () => {
    if (!commentText.trim()) {
      return showAlertModal({
        title: 'Empty Comment',
        type: 'warning',
        message: 'Comment cannot be empty.',
      });
    }

    setCommenting(true);
    axiosInstance
      .post('/content/comment/create', {
        comment: commentText,
        contentId,
      })
      .then(res => {
        // console.log('res.data', JSON.stringify(res.data, null, 2));
        if (res?.data?.success) {
          store.dispatch(
            setCommentCount({
              contentId: res.data.comment?.contentId,
              action: 'add',
            }),
          );
          dispatch(
            addComment({
              ...res.data.comment,
              user: {...user, profilePicture: user.profilePicture},
            }),
          );
          getComments(contentId);
        }
      })
      .catch(error => {
        console.error('Error creating comment:', error);
        showAlertModal({
          title: 'Comment Error',
          type: 'error',
          message: 'Failed to post comment. Please try again.',
        });
      })
      .finally(() => {
        setCommentText('');
        setCommenting(false);
      });
  };

  const filteredComments = useMemo(
    () => comments.filter(comment => comment?.contentId === contentId),
    [comments, contentId],
  );

  const renderCommentItem = useCallback(
    (comment, index) => {
      if (!comment) return null;

      const isSameDate =
        index > 0 &&
        new Date(comment?.createdAt).toDateString() ===
          new Date(filteredComments[index - 1]?.createdAt).toDateString();

      return (
        <React.Fragment key={comment._id}>
          {!isSameDate && (
            <View style={styles.commentDateContainer}>
              <Text style={styles.commentDate}>
                {formatDynamicDate(comment.createdAt)}
              </Text>
            </View>
          )}
          <Comment comment={comment} />
        </React.Fragment>
      );
    },
    [filteredComments, styles.commentDate, styles.commentDateContainer],
  );
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' && 'padding'}
      keyboardVerticalOffset={0}
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        paddingHorizontal: 10,
        paddingTop: Platform.OS === 'android' && 10,
      }}>
      <View
        style={[
          {
            flex: 1,
            // paddingBottom: bottom / 2,
            paddingTop: top,
            // backgroundColor: Colors.Red,
            // marginBottom: bottom / 1.5,
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.comments}>Comments</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
              dispatch(setSingleComment(null));
            }}>
            <CrossCircle size={35} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View>
            {filteredComments && filteredComments.length > 0 ? (
              filteredComments.map((comment, index) =>
                renderCommentItem(comment, index),
              )
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // backgroundColor: "green",
                  minHeight: '80%',
                }}>
                <FontAwesome
                  name="comments"
                  size={111}
                  color={Colors.BodyText}
                />
                <Text
                  style={{
                    color: Colors.BodyText,
                    fontSize: responsiveScreenFontSize(2.5),
                    fontFamily: CustomFonts.SEMI_BOLD,
                    marginTop: responsiveScreenHeight(2.5),
                  }}>
                  No comments yet
                </Text>
                <Text
                  style={{
                    color: Colors.BodyText,
                    fontSize: responsiveScreenFontSize(1.6),
                    fontFamily: CustomFonts.SEMI_BOLD,
                  }}>
                  Be the first to comment
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {singleComment?.replyOpen && (
          <View style={styles.inputOuterContainer}>
            <Text numberOfLines={1} style={styles.commentText}>
              {singleComment?.comment}
            </Text>
            <TouchableOpacity
              style={{flex: 0.05}}
              onPress={() => dispatch(setSingleComment(null))}>
              <CrossCircle size={25} />
            </TouchableOpacity>
          </View>
        )}
        {!singleComment?.updateOpen && (
          <View style={styles.inputContainer}>
            <TextInput
              ref={textInputRef}
              keyboardAppearance={
                Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
              }
              style={styles.inputText}
              value={commentText}
              onChangeText={e => setCommentText(e)}
              placeholder={
                user?.fullName ? `Comment as ${user?.fullName}` : 'Comment...'
              }
              placeholderTextColor={Colors.BodyText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.submitBtn,
                {
                  paddingBottom:
                    Platform.OS == 'ios'
                      ? responsiveScreenHeight(0.5)
                      : responsiveScreenHeight(0.5),
                },
              ]}
              onPress={() => {
                if (singleComment?.replyOpen) {
                  giveReply({
                    contentId: singleComment.contentId,
                    comment: commentText,
                    parentId: singleComment._id,
                  });
                  setCommentText('');
                } else {
                  isCommenting ? null : handleCreateComment();
                }
              }}>
              {isCommenting ? (
                <View style={{paddingBottom: responsiveScreenHeight(1)}}>
                  <LoadingSmall color={Colors.Primary} />
                </View>
              ) : (
                <SendIcon size={30} />
              )}
            </TouchableOpacity>
          </View>
        )}
        <CommentPopup />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentScreen;

const getStyles = Colors =>
  StyleSheet.create({
    commentDateContainer: {
      paddingVertical: 3,
      paddingHorizontal: 5,
      backgroundColor: Colors.PrimaryOpacityColor,
      width: responsiveScreenWidth(40),
      borderRadius: 5,
      marginTop: 10,
      alignSelf: 'center',
    },
    commentDate: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BR,
      textAlign: 'center',
      color: Colors.Primary,
    },
    noDataText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      textAlign: 'center',
      marginVertical: responsiveScreenHeight(2),
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      // backgroundColor: Colors.Red,
      paddingVertical: responsiveScreenHeight(1),
      maxHeight: 400,
    },
    container: {
      backgroundColor: Colors.White,
      height: 200,
      width: 300,
      borderRadius: 10,
    },
    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: 'center',
    },
    submitBtn: {
      //   paddingTop: 10,
      alignSelf: 'flex-end',
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 36, // Avoid overlap with handle
      paddingHorizontal: 16,
    },
    bottomSheet: {
      overflow: 'hidden',
      zIndex: 99,
    },
    bottomSheetBackground: {
      backgroundColor: Colors.White,
    },
    handle: {
      backgroundColor: Colors.White,
      height: 40,
      borderRadius: 0,
    },
    handleIndicator: {
      backgroundColor: Colors.White,
      width: 40,
      height: 4,
      borderRadius: 2,
    },
    commentText: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: RegularFonts.BR,
      color: Colors.BodyText,
      flex: 0.95,
    },
    inputOuterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      paddingBottom: 40,
      marginBottom: -30,
      paddingTop: 10,
      marginTop: 10,
      paddingHorizontal: 20,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: Colors.BorderColor,
      // marginVertical: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      paddingRight: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 30,
      paddingLeft: 10,
    },
  });
