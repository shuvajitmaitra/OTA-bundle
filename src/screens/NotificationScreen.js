import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../utility/axiosInstance';
import {useTheme} from '../context/ThemeContext';
import {
  setNotifications,
  updateNotification,
} from '../store/reducer/notificationReducer';
import Loading from '../components/SharedComponent/Loading';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import moment from 'moment';
import NoDataAvailable from '../components/SharedComponent/NoDataAvailable';
import {handleReadAllNotification} from '../actions/apiCall';
import LoadingSmall from '../components/SharedComponent/LoadingSmall';
import {useNavigation} from '@react-navigation/native';
import {getEventDetails, loadInitialNotifications} from '../actions/chat-noti';
import {useGlobalAlert} from '../components/SharedComponent/GlobalAlertContext';
import {RegularFonts} from '../constants/Fonts';
import {setNotificationClicked} from '../store/reducer/calendarReducer';

const NotificationScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const dispatch = useDispatch();
  const {notifications, notificationCount} = useSelector(
    state => state.notification,
  );
  const {programs} = useSelector(state => state.program);
  const {showAlert} = useGlobalAlert();

  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications(page);
  }, [page]);

  const loadNotifications = () => {
    setIsLoading(true);
    axios
      .get(`/notification/mynotifications?limit=10&page=${page}`)
      .then(res => {
        if (page == 1) {
          dispatch(setNotifications(res.data.notifications));
        } else {
          dispatch(
            setNotifications([...notifications, ...res.data.notifications]),
          );
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleNavigation = notification => {
    console.log('notification', JSON.stringify(notification, null, 1));
    switch (notification.notificationType) {
      case 'submitMockInterview': //not
      case 'certificateGenerate': //not
      case 'createDaytoDay': //not
      case 'sendInvoice': //not
      case 'newEnrollment': //not
      case 'enrollmentStatusChange': //not
      case 'organizationApply': //not
      case 'organizationStatusChange': //not
      case 'branchApply': //not
      case 'branchStatusChange': //not
        break;
      case 'calendarNoti':
      case 'rescheduleCalendarEvent':
      case 'createCalendarEvent':
      case 'invitationCalendarEvent':
        navigation.navigate('MyCalenderStack', {
          screen: 'CalendarScreen',
          params: {random: Math.random()},
        });
        break;
      case 'calendarReminder':
        getEventDetails(notification.entityId);
        dispatch(setNotificationClicked(true));
        navigation.navigate('MyCalenderStack', {
          screen: 'CalendarScreen',
          params: {random: Math.random()},
        });
        break;
      case 'changePassword': //profile
      case 'updateProfile': //profile
        navigation.navigate('HomeStack', {
          screen: 'MyProfile',
          params: {random: Math.random()},
        });
        break;
      case 'createMockInterview': //app
        navigation.navigate('HomeStack', {screen: 'MockInterview'});
        break;

      case 'createShowAndTell':
      case 'changeStatusShowAndTell':
        navigation.navigate('ProgramStack', {screen: 'ShowAndTellScreen'});
        break;

      case 'createContent':
        navigation.navigate('ProgramStack', {screen: 'Presentation'});
        break;

      // case "createDaytoDay":
      //   navigation.navigate("ProgramStack", { screen: "DayToDayActivities" });
      //   break;
      case 'orderTransactionStatusChange':
      case 'updateTransactionStatus':
      case 'createOrderTransaction':
      case 'createTransaction':
        navigation.navigate('HomeStack', {screen: 'MyPaymentScreen'});
        break;

      case 'newCourseOrder':
      case 'orderStatusChange': //not
        navigation.navigate('HomeStack', {screen: 'PurchasedScreen'});
        break;

      case 'newLessonAdd':
        navigation.navigate('ProgramStack', {
          screen: 'ProgramDetails',
          params: {slug: programs?.program?.slug},
        });
        break;

      case 'createSlide': //portal
      case 'createImportantLink': //portal
      case 'createTemplate': //portal
      case 'createDiagram': //portal
      case 'createMyDocument': //portal
      case 'createUserDocument': //portal
        // Alert.alert(
        //   "Unavailable",
        //   "Feature not available in the app. Please visit our website \n portal.bootcampshub.ai\n for full access.",
        //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        //   { cancelable: false }
        // );
        showAlert({
          title: 'Unavailable',
          type: 'warning',
          message:
            'Feature not available in the app. Please visit our website for full access.',
          link: 'portal.bootcampshub.ai',
        });
        break;
      default:
        // Alert.alert(
        //   "Unavailable",
        //   "Feature not available in the app. Please visit our website \n portal.bootcampshub.ai\n for full access.",
        //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        //   { cancelable: false }
        // );
        showAlert({
          title: 'Unavailable',
          type: 'warning',
          message:
            'Feature not available in the app. Please visit our website for full access.',
          link: 'portal.bootcampshub.ai',
        });
        break;
    }
  };

  const notificationMarkRead = noti => {
    // setIsLoading(true);
    axios
      .patch(`/notification/markread/${noti?._id}`)
      .then(res => {
        if (res.data.notification._id) {
          loadInitialNotifications();
          dispatch(updateNotification(res.data.notification));
          handleNavigation(noti);
        }
        // console.log("res.data", JSON.stringify(res.data, null, 1));
        // const event = events.find(
        //   (event) => event._id == res.data.notification.entityId
        // );
        // if (res.data.notification.notificationType === "calendarNoti") {
        //   navigation.navigate("MyCalenderStack", {
        //     screen: "CalendarScreen",
        //     params: { event, random: Math.random() },
        //   });
        // }

        // if (event) {
        //   getEventDetails(event?._id);
        // }
        // setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => notificationMarkRead(item)}
      style={styles.list}>
      <Avatar.Image
        style={{marginRight: 10}}
        size={50}
        source={{
          uri:
            item?.userFrom?.profilePicture ||
            'https://ts4u.us/placeholder2.jpg',
        }}
      />
      <View style={{flex: 1}}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{item.generatedTitle}</Text>
          {!item.opened && <View style={styles.unread} />}
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.text}>{item.generatedText}</Text>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
            <Text style={styles.date}>
              {moment(item.createdAt).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <View style={styles.headingContainer}>
        <Text style={styles.Heading}>Notifications</Text>
        {notificationCount.totalUnread > 0 && (
          <TouchableOpacity
            onPress={() => {
              handleReadAllNotification();
            }}
            disabled={notificationCount.totalUnread === 0}
            style={[
              styles.buttonContainer,
              {
                backgroundColor: notificationCount.totalUnread
                  ? Colors.Primary
                  : Colors.DisablePrimaryBackgroundColor,
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: notificationCount.totalUnread
                    ? Colors.PrimaryButtonTextColor
                    : Colors.DisablePrimaryButtonTextColor,
                },
              ]}>
              Read all
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {isLoading && page === 1 ? (
        <Loading />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          onEndReached={() => setPage(prevPage => prevPage + 1)}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<NoDataAvailable />}
          ListFooterComponent={
            <>
              {notificationCount.totalCount === notifications.length ? (
                <Text style={[styles.title, {textAlign: 'center'}]}>
                  No data available
                </Text>
              ) : (
                <View style={styles.spinnerContainer}>
                  <LoadingSmall size={20} color={Colors.Primary} />
                </View>
              )}
            </>
          }
        />
      )}
    </View>
  );
};

export default NotificationScreen;

const getStyles = Colors =>
  StyleSheet.create({
    buttonText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.PureWhite,
      fontSize: responsiveScreenFontSize(1.8),
    },
    buttonContainer: {
      backgroundColor: Colors.Primary,
      borderRadius: responsiveScreenFontSize(1),
      paddingHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(1),
    },
    headingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: responsiveScreenWidth(4),
      paddingTop: 0,
    },
    container: {
      flex: 1,
      backgroundColor: Colors.Background_color,
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
      marginHorizontal: responsiveScreenWidth(4),
      backgroundColor: Colors.White,
      borderRadius: 15,
    },
    spinnerContainer: {
      paddingBottom: 10,
    },
    unread: {
      backgroundColor: Colors.Primary,
      width: 10,
      height: 10,
      borderRadius: 100,
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(1.8),
    },
    text: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.5),
      flex: 0.95,
      fontFamily: CustomFonts.MEDIUM,
    },
    time: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
    },
    date: {
      color: Colors.BodyText,
      fontSize: responsiveScreenFontSize(1.4),
      fontFamily: CustomFonts.REGULAR,
    },
    Heading: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: RegularFonts.HL,
      color: Colors.Heading,
    },
  });
