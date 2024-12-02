import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useTheme} from '../../context/ThemeContext';
import CustomFonts from '../../constants/CustomFonts';
import ShareIcon from '../../assets/Icons/ShareIcon';
import MyButton from '../../components/AuthenticationCom/MyButton';

import axios from '../../utility/axiosInstance';
import StartInterviewModal from '../../components/MockInterviewCom/StartInterviewModal';
import ShareInterviewModal from '../../components/MockInterviewCom/ShareInterviewModal';
import CommentModal from '../../components/MockInterviewCom/CommentModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Loading from '../../components/SharedComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {setInterviews} from '../../store/reducer/InterviewReducer';
import NoDataAvailable from '../../components/SharedComponent/NoDataAvailable';

export default function MockInterview({route}) {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const [isLoading, setIsLoading] = useState(false);
  const [startModalInterview, setStartModalInterview] = useState(null);
  const [shareModalInterview, setShareModalInterview] = useState(null);
  const [commentModalInterview, setCommentModalInterview] = useState(null);
  const [interviewIndex, setInterviewIndex] = useState(0);
  const dispatch = useDispatch();
  const {interviews} = useSelector(state => state.interview);

  const toggleStartModal = interview => {
    setStartModalInterview(prev => (prev === interview ? null : interview));
  };
  const toggleShareModal = interview => {
    setShareModalInterview(prev => (prev === interview ? null : interview));
  };
  const toggleCommentModal = interview => {
    setCommentModalInterview(prev => (prev === interview ? null : interview));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get('/interview/myinterviews')
      .then(res => {
        dispatch(setInterviews(res.data.interviews));
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [route]);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: Colors.Background_color,
        paddingHorizontal: responsiveScreenWidth(4),
        flex: 1,
      }}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <Text style={styles.heading}>Mock Interviews</Text>
      <Text style={styles.description}>
        Your Practice Ground for Real-Time Answers
      </Text>
      {isLoading ? (
        <Loading backgroundColor={'transparent'} />
      ) : (
        <ScrollView>
          {interviews?.length ? (
            interviews.map((interview, i) => (
              <View key={i} style={styles.interviewContainer}>
                <Image
                  source={{
                    uri:
                      interview?.thumbnail ||
                      'https://www.bootcampshub.ai/placeholder2.jpg',
                  }}
                  style={styles.img}
                />
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: responsiveScreenWidth(64.5),
                    }}>
                    <Text style={styles.title}>{interview?.name}</Text>
                    <TouchableOpacity
                      disabled={!interview?.submission[0]?._id}
                      onPress={() =>
                        toggleShareModal(interview?.submission[0]?._id)
                      }
                      style={{
                        flexDirection: 'row',
                        marginTop: responsiveScreenWidth(1.5),
                      }}>
                      <ShareIcon
                        color={
                          interview?.submission[0]?._id
                            ? Colors.Primary
                            : Colors.DisablePrimaryBackgroundColor
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[
                      styles.title2,
                      {paddingVertical: responsiveScreenWidth(1)},
                    ]}>
                    Expiry Date:{' '}
                    <Text style={styles.text2}>
                      {interview.dueDate
                        ? new Date(interview.dueDate).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 7,
                      alignItems: 'center',
                    }}>
                    <Text style={styles.title2}>
                      Status:{' '}
                      <Text
                        style={[
                          styles.text2,
                          interview.submission?.length > 0
                            ? styles.doneStatus
                            : styles.pendingStatus,
                        ]}>
                        {interview.submission?.length > 0 ? 'Done' : 'Pending'}
                      </Text>
                    </Text>
                    <Text style={styles.title2}>
                      Mark:{' '}
                      <Text style={styles.text2}>
                        {interview.submission?.length > 0
                          ? interview.submission[0].mark
                          : 'N/A'}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                      marginTop: responsiveScreenHeight(1.5),
                    }}>
                    {interview.submission?.length > 0 ? (
                      <MyButton
                        onPress={() => {}}
                        title={'View Result'}
                        bg={Colors.PrimaryOpacityColor}
                        colour={Colors.Primary}
                        width={responsiveScreenWidth(35)}
                        height={responsiveScreenHeight(4)}
                        fontSize={responsiveScreenFontSize(1.6)}
                      />
                    ) : (
                      <MyButton
                        onPress={() => toggleStartModal(interview)}
                        title={'Start Interview'}
                        bg={Colors.Primary}
                        colour={Colors.PureWhite}
                        width={responsiveScreenWidth(35)}
                        height={responsiveScreenHeight(4)}
                        fontSize={responsiveScreenFontSize(1.6)}
                      />
                    )}
                    <MyButton
                      onPress={() => {
                        setInterviewIndex(i);
                        toggleCommentModal(interview);
                      }}
                      title={'Comments'}
                      bg={
                        interview?.submission[0]?._id
                          ? Colors.SecondaryButtonBackgroundColor
                          : Colors.DisableSecondaryBackgroundColor
                      }
                      colour={
                        interview?.submission[0]?._id
                          ? Colors.SecondaryButtonTextColor
                          : Colors.DisableSecondaryButtonTextColor
                      }
                      width={responsiveScreenWidth(25)}
                      height={responsiveScreenHeight(4)}
                      fontSize={responsiveScreenFontSize(1.6)}
                      disable={!interview?.submission[0]?._id}
                    />
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <NoDataAvailable />
            </View>
          )}
          {startModalInterview && (
            <StartInterviewModal
              interview={startModalInterview}
              setIsStartModalVisible={setStartModalInterview}
              isStartModalVisible={!!startModalInterview}
              toggleStartModal={() => toggleStartModal(startModalInterview)}
            />
          )}
          {shareModalInterview && (
            <ShareInterviewModal
              interview={shareModalInterview}
              setIsShareModalVisible={setShareModalInterview}
              isShareModalVisible={!!shareModalInterview}
              toggleShareModal={() => toggleShareModal(shareModalInterview)}
            />
          )}
          {commentModalInterview && (
            <CommentModal
              interview={commentModalInterview}
              setIsCommentModalVisible={setCommentModalInterview}
              toggleCommentModal={() =>
                toggleCommentModal(commentModalInterview)
              }
              isCommentModalVisible={!!commentModalInterview}
              interviewIndex={interviewIndex}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    noDataContainer: {
      flex: 1,
      height: responsiveScreenHeight(77),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.White,
      borderRadius: 10,
    },
    container: {
      // flex: 1,
      // backgroundColor: Colors.Red,
    },
    description: {
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
      paddingBottom: responsiveScreenHeight(2),
      fontSize: responsiveFontSize(1.6),
    },
    heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2.4),
      color: Colors.Heading,
    },
    interviewContainer: {
      backgroundColor: Colors.White,
      padding: responsiveScreenWidth(4),
      borderRadius: responsiveScreenWidth(3),
      marginBottom: responsiveScreenHeight(2),
      flexDirection: 'row',
      gap: responsiveScreenWidth(3),
    },
    img: {
      width: responsiveScreenWidth(14),
      height: responsiveScreenWidth(13),
      borderRadius: 5,
    },
    title: {
      fontSize: responsiveFontSize(1.8),
      fontFamily: CustomFonts.SEMI_BOLD,
      color: Colors.Heading,
    },
    text: {
      fontSize: responsiveFontSize(1.6),
      fontFamily: CustomFonts.REGULAR,
      color: Colors.BodyText,
    },
    title2: {
      fontSize: responsiveFontSize(1.6),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Heading,
    },
    text2: {
      fontSize: responsiveFontSize(1.5),
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
    },
    doneStatus: {
      color: 'green',
    },
    pendingStatus: {
      color: 'orange',
    },
    rejectedStatus: {
      color: 'red',
    },
  });
