import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import axios from '../../utility/axiosInstance';
import moment from 'moment';
import CustomFonts from '../../constants/CustomFonts';
import {useTheme} from '../../context/ThemeContext';
import Modal from 'react-native-modal';
import ModalBackAndCrossButton from '../../components/ChatCom/Modal/ModalBackAndCrossButton';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import CommentsIcon from '../../assets/Icons/CommentsIcon';
import NoDataAvailable from '../SharedComponent/NoDataAvailable';
import {ScrollView} from 'react-native';
import {updateInterviewComments} from '../../store/reducer/InterviewReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {showAlertModal} from '../../utility/commonFunction';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';

export default function CommentModal({
  toggleCommentModal,
  isCommentModalVisible,
  interviewIndex,
}) {
  const {interviews} = useSelector(state => state.interview);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const [replyText, setReplyText] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (interviews[interviewIndex]?.submission[0]?.comments?.length) {
      setSelectedComment(
        interviews[interviewIndex]?.submission[0]?.comments || [],
      );
    }
  }, [interviews, interviews[interviewIndex]?.submission[0]]);

  const sendReply = id => {
    if (!replyText)
      return showAlertModal({
        title: 'Empty Comment',
        type: 'warning',
        message: 'Please, write something',
      });
    setIsCommentLoading(true);
    axios
      .put(`/interview/review/comment/${id}`, {text: replyText})
      .then(res => {
        dispatch(
          updateInterviewComments({
            comments: res.data.comments,
            interviewId: interviews[interviewIndex]._id,
          }),
        );
        setReplyText('');
      })
      .catch(err => {
        showAlertModal({
          title: 'Error',
          type: 'error',
          message: 'Something went wrong',
        });
        console.log(err);
      })
      .finally(() => {
        setIsCommentLoading(false);
      });
  };

  const {top} = useSafeAreaInsets();

  return (
    <Modal
      backdropColor={Colors.White}
      backdropOpacity={1}
      isVisible={isCommentModalVisible}
      style={{margin: 0, paddingTop: top / 2}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalTop}>
          <ModalBackAndCrossButton toggleModal={toggleCommentModal} />
        </View>
        <Text style={styles.heading}>Comment</Text>
        <View style={styles.writeComment}>
          <Image
            source={{
              uri:
                user?.profilePicture ||
                'https://api.adorable.io/avatars/50/abott@adorable.png',
            }}
            style={styles.profileImg}
          />
          <TextInput
            keyboardAppearance={
              Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
            }
            style={styles.inputText}
            value={replyText}
            onChangeText={e => setReplyText(e)}
            placeholder="Type Comment..."
            placeholderTextColor={Colors.BodyText}
            multiline
            textAlignVertical="top"
          />
        </View>
        <View style={styles.submit}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() =>
              sendReply(interviews[interviewIndex].submission[0]?._id)
            }>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.totalComments}>
          <CommentsIcon />
          <Text style={styles.total}>Comments {selectedComment?.length}</Text>
        </View>
        {isCommentLoading ? (
          <ActivityIndicator
            style={{marginTop: 20}}
            color={Colors.Primary}
            size={40}
            animating
          />
        ) : selectedComment?.length > 0 ? (
          <ScrollView>
            {[...selectedComment]?.reverse()?.map(item => (
              <View key={item._id} style={styles.commentItem}>
                <View>
                  <Avatar.Image
                    size={40}
                    source={{uri: user?.profilePicture}}
                  />
                </View>
                <View style={{flex: 1}}>
                  <View style={styles.nameDate}>
                    <Text style={styles.name}>{user?.fullName}</Text>
                  </View>
                  <Text style={styles.text}>{item.text}</Text>
                  <Text style={styles.date}>{moment(item.date).fromNow()}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noDataContainer}>
            <NoDataAvailable height={10} />
          </View>
        )}
      </View>
      {/* <CommentSection postId={interviews?.interviewId}/> */}
      <GlobalAlertModal />
    </Modal>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    noDataContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
    },
    modalTop: {
      paddingVertical: responsiveScreenHeight(2),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      // width: responsiveScreenWidth(90),
      backgroundColor: Colors.White,
      borderRadius: responsiveScreenWidth(3),
      paddingHorizontal: responsiveScreenWidth(5),
      paddingBottom: responsiveScreenHeight(1.5),
      flex: 1, // Added to make sure the container takes up available space
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.2),
      color: Colors.Heading,
      marginBottom: responsiveScreenHeight(2),
    },
    writeComment: {
      flexDirection: 'row',
      gap: responsiveScreenWidth(4),
      alignItems: 'center',
    },
    profileImg: {
      width: responsiveScreenWidth(13),
      height: responsiveScreenWidth(13),
      objectFit: 'cover',
      borderRadius: 50,
    },
    inputText: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 5,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
      color: Colors.BodyText,
      backgroundColor: Colors.BorderColor,
      height: responsiveScreenHeight(8),
      borderRadius: responsiveScreenWidth(3),
    },
    submitBtn: {
      backgroundColor: Colors.Primary,
      paddingVertical: responsiveScreenWidth(2),
      borderRadius: responsiveScreenWidth(2),
      alignItems: 'center',
      marginBottom: responsiveScreenHeight(1),
      width: responsiveScreenWidth(30),
      marginVertical: responsiveScreenHeight(2),
      verticalAlign: 'top',
    },
    submitBtnText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(1.8),
    },
    submit: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      borderBottomColor: Colors.BorderColor,
      borderBottomWidth: 2,
      paddingBottom: responsiveScreenHeight(1),
    },
    total: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: responsiveScreenFontSize(2.2),
      paddingVertical: responsiveScreenHeight(2),
    },
    totalComments: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: responsiveScreenWidth(2),
    },
    commentList: {
      flex: 1,
    },
    commentListContent: {
      flexGrow: 1,
    },
    commentItem: {
      marginVertical: responsiveScreenHeight(1),
      padding: responsiveScreenHeight(2),
      flexDirection: 'row',
      // alignItems: "center",
      justifyContent: 'space-between',
      gap: responsiveScreenWidth(3),
      backgroundColor: Colors.Background_color,
      borderRadius: responsiveScreenWidth(3),
    },
    nameDate: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    name: {
      color: Colors.Primary,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
    },
    text: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.8),
    },
    date: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.6),
      marginTop: responsiveScreenHeight(1),
      textAlign: 'right',
    },
    noComment: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      alignSelf: 'center',
    },
  });
