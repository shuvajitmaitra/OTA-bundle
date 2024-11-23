import React, {useMemo, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
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
import Divider from './Divider';
import SendIcon from '../../assets/Icons/SendIcon';
import ReactNativeModal from 'react-native-modal';

const GlobalCommentModal = () => {
  const dispatch = useDispatch();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [commentText, setCommentText] = useState('');
  const {user} = useSelector(state => state.auth);
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
    () => comments.filter(comment => comment.contentId === commentId),
    [comments, commentId],
  );

  return (
    <ReactNativeModal
      isVisible={bottomSheetVisible}
      onBackdropPress={() => dispatch(setBottomSheetVisible(false))}
      onSwipeComplete={() => dispatch(setBottomSheetVisible(false))}
      swipeDirection={['down']}
      style={styles.modal}
      avoidKeyboard={true}
      propagateSwipe={true}
      animationIn="slideInUp"
      animationOut="slideOutDown" // Added keyboard blur behavior
      // Optional: Add additional props if needed
      backdropOpacity={0}>
      <View style={styles.modalContent}>
        {/* Draggable Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handleIndicator} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.comments}>Comments</Text>
          <View>
            {filteredComments && filteredComments.length > 0 ? (
              filteredComments.map((comment, index) => {
                const isSameDate =
                  index > 0 &&
                  new Date(
                    filteredComments[index]?.createdAt,
                  ).toDateString() ===
                    new Date(
                      filteredComments[index - 1]?.createdAt,
                    ).toDateString();

                return (
                  <React.Fragment key={comment._id}>
                    {(!isSameDate || index === 0) && (
                      <View style={styles.commentDateContainer}>
                        <Text style={styles.commentDate}>
                          {formatDynamicDate(filteredComments[index].createdAt)}
                        </Text>
                      </View>
                    )}
                    <Comment comment={comment} />
                  </React.Fragment>
                );
              })
            ) : (
              <View style={styles.noCommentContainer}>
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

        <Divider marginBottom={1} />
        <View style={styles.inputContainer}>
          <TextInput
            keyboardAppearance={
              Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
            }
            style={styles.inputText}
            value={commentText}
            onChangeText={setCommentText}
            placeholder={
              user?.fullName ? `Comment as ${user?.fullName}` : 'Comment...'
            }
            placeholderTextColor={Colors.BodyText}
            multiline
          />
          <TouchableOpacity
            style={[styles.submitBtn]}
            onPress={() => {
              if (!isCommenting) {
                handleCreateComment();
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
      </View>
    </ReactNativeModal>
  );
};

export default GlobalCommentModal;

const getStyles = Colors =>
  StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
      margin: 0, // Ensures the modal takes up the full width
    },
    modalContent: {
      backgroundColor: Colors.White,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      minHeight: '97%', // Adjust as needed
    },
    handleContainer: {
      alignItems: 'center',
      paddingVertical: responsiveScreenHeight(1),
    },
    handleIndicator: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: Colors.BorderColor,
    },
    noCommentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80%',
    },
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
      flex: 1,
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      padding: 36,
      alignItems: 'center',
    },
    submitBtn: {
      alignSelf: 'flex-end',
      paddingBottom: responsiveScreenHeight(0.5),
    },
    comments: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
      paddingTop: responsiveScreenHeight(1.5),
      textAlign: 'center',
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
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center', // Ensure items are centered vertically
      justifyContent: 'space-between',
      backgroundColor: Colors.BorderColor,
      marginHorizontal: responsiveScreenWidth(4),
      marginBottom: responsiveScreenHeight(2),
      paddingRight: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
      borderRadius: 30,
      paddingLeft: 10,
    },
  });
