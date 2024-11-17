import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTheme} from '../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomSheetVisible} from '../../store/reducer/ModalReducer';
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
import Divider from './Divider';
import SendIcon from '../../assets/Icons/SendIcon';

const GlobalCommentModal = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const bottomSheetRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const {user} = useSelector(state => state.auth);
  const textInputRef = useRef(null);
  const {comments, commentId} = useSelector(state => state.comment);
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
      .post('/content/comment/create', {
        comment: commentText,
        contentId: commentId,
      })
      .then(res => {
        if (res.data.success) {
          getComments(commentId);
        }
        setCommentText('');
        setCommenting(false);
      })
      .catch(error => {
        console.log('error to create comment', JSON.stringify(error, null, 1));
        setCommenting(false);
      });
  };
  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      dispatch(setBottomSheetVisible(false));
      textInputRef.current?.blur();
    }
    if (index === 0) {
      textInputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (bottomSheetRef.current) {
      if (bottomSheetVisible) {
        bottomSheetRef.current.present();
      } else {
        bottomSheetRef.current.close();
      }
    }
  }, [bottomSheetVisible]);

  const filteredComments = comments.filter(
    comment => comment.contentId === commentId,
  );
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={['100%']}
      onChange={handleSheetChanges}
      style={styles.bottomSheet}
      backgroundStyle={styles.bottomSheetBackground}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.comments}>Comments</Text>
        <View>
          {filteredComments && filteredComments.length > 0 ? (
            filteredComments?.map((comment, index) => {
              const isSameDate =
                new Date(filteredComments[index]?.createdAt).toDateString() ===
                new Date(filteredComments[index - 1]?.createdAt).toDateString();

              return (
                <React.Fragment key={comment._id}>
                  {(index === 0 || !isSameDate) && (
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
            <Text style={styles.noDataText}>No comments available</Text>
          )}
        </View>
      </BottomSheetScrollView>

      <Divider marginBottom={1} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}>
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
                  Platform.OS === 'ios'
                    ? responsiveScreenHeight(0.5)
                    : responsiveScreenHeight(1),
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
              // <Text style={styles.submitBtnText}>Submit</Text>
              // <FontAwesome name="send" size={28} color={Colors.Primary} />
              <SendIcon />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BottomSheetModal>
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
      maxHeight: responsiveScreenWidth(30),
      borderRadius: 50,
    },
    container: {
      flex: 1,
      backgroundColor: 'grey',
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
      paddingTop: responsiveScreenHeight(1.5),
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
      backgroundColor: Colors.Background_color,
    },
    handle: {
      backgroundColor: Colors.Background_color,
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
      marginHorizontal: responsiveScreenWidth(4),
      // marginVertical: responsiveScreenHeight(2),
      marginBottom: responsiveScreenHeight(2),
      paddingRight: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 50,
      paddingLeft: 10,
    },
  });
