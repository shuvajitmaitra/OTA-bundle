import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Enables strict mode
});

import React, {useMemo, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomSheetVisible} from '../../store/reducer/ModalReducer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import LoadingSmall from './LoadingSmall';
import {RegularFonts} from '../../constants/Fonts';
import {getComments} from '../../actions/chat-noti';
import {formatDynamicDate, showAlertModal} from '../../utility/commonFunction';
import axiosInstance from '../../utility/axiosInstance';
import Comment from '../CommunityCom/Comment';
import SendIcon from '../../assets/Icons/SendIcon';
import ReactNativeModal from 'react-native-modal';
import CrossCircle from '../../assets/Icons/CrossCircle';
import {
  setSelectedComment,
  updateComment,
} from '../../store/reducer/commentReducer';

const GlobalCommentModal = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [commentText, setCommentText] = useState('');
  const {user} = useSelector(state => state.auth);
  const textInputRef = useRef(null);
  const {comments, commentId, selectedComment} = useSelector(
    state => state.comment,
  );
  const {bottomSheetVisible} = useSelector(state => state.modal);
  const [isCommenting, setCommenting] = useState(false);
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
      .post(`/content/comment/create`, {
        comment: commentText,
        contentId: commentId,
      })
      .then(res => {
        if (res.data.success) {
          getComments(commentId);
        }
      })
      .catch(error => {
        console.log('error to create comment', JSON.stringify(error, null, 1));
      })
      .finally(() => {
        setCommentText('');
        setCommenting(false);
      });
  };

  const filteredComments = useMemo(
    () => comments.filter(comment => comment?.contentId === commentId),
    [comments, commentId],
  );
  return (
    <ReactNativeModal
      style={[
        {
          margin: 0,
          paddingTop: 30,
          backgroundColor: Colors.White,
          paddingHorizontal: 10,
        },
      ]}
      isVisible={bottomSheetVisible}
      avoidKeyboard={true}
      //   onBackdropPress={() => {
      //     dispatch(setBottomSheetVisible(null));
      //   }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.comments}>Comments</Text>
        <TouchableOpacity
          onPress={() => dispatch(setBottomSheetVisible(false))}>
          <CrossCircle />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          {filteredComments && filteredComments.length > 0 ? (
            filteredComments?.map((comment, index) => {
              const isSameDate =
                new Date(filteredComments[index]?.createdAt).toDateString() ===
                new Date(filteredComments[index - 1]?.createdAt).toDateString();

              return (
                <React.Fragment key={comment._id}>
                  {(index == 0 || !isSameDate) && (
                    <View style={styles.commentDateContainer}>
                      <Text style={styles.commentDate}>
                        {/* {moment(comments[index].createdAt).format("MMM DD, YYYY")} */}
                        {formatDynamicDate(filteredComments[index].createdAt)}
                      </Text>
                    </View>
                  )}
                  <Comment comment={comment} />
                </React.Fragment>
              );
            })
          ) : (
            // <Text style={styles.noDataText}>No comments available</Text>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: "green",
                minHeight: '80%',
              }}>
              <FontAwesome name="comments" size={111} color={Colors.BodyText} />
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
            isCommenting ? null : handleCreateComment();
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
    </ReactNativeModal>
  );
};

export default GlobalCommentModal;

const getStyles = Colors =>
  StyleSheet.create({
    commentDateContainer: {
      paddingVertical: 3,
      paddingHorizontal: 5,
      backgroundColor: Colors.PrimaryOpacityColor,
      width: responsiveScreenWidth(30),
      borderRadius: 5,
      marginTop: 10,
      alignSelf: 'center',
    },
    commentDate: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.BL,
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
      backgroundColor: Colors.BorderColor,
      paddingVertical: responsiveScreenHeight(1),
      maxHeight: 400,
      borderRadius: 30,
    },
    container: {
      backgroundColor: Colors.red,
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
      marginTop: 10,
    },
  });
