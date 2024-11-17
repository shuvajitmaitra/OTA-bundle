import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  FlatList,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';
import Images from '../../constants/Images';
import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import CustomFonts from '../../constants/CustomFonts';
import ClockIcon from '../../assets/Icons/ClockIcon';
import {RegularFonts} from '../../constants/Fonts';
import Divider from '../SharedComponent/Divider';
import EmojiIcon from '../../assets/Icons/EmojiIcon';
import GlobalAlertModal from '../SharedComponent/GlobalAlertModal';
import {showAlertModal} from '../../utility/commonFunction';
import useUserStatusData from '../../constants/UserStatusData';
import {setUserStatus} from '../../store/reducer/userStatusReducer';
import axiosInstance from '../../utility/axiosInstance';
import {setUser} from '../../store/reducer/authReducer';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const HomeUserDetails = ({statusSectionVisible, setStatusSectionVisible}) => {
  const navigation = useNavigation();
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const {status} = useSelector(state => state.userStatus);
  const [statusText, setStatusText] = useState('');
  const userStatusData = useUserStatusData();
  const profileStatus = useUserStatusData(16);
  // const {useStatus}=useSelector((state)=>state.userStatus)
  const dispatch = useDispatch();
  // Enable LayoutAnimation on Android

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleProfileNavigation = () => {
    navigation.navigate('HomeStack', {screen: 'MyProfile'});
  };

  const handleTextChange = text => {
    const lines = text.split('\n');
    // Ensure the number of lines does not exceed 4
    if (lines.length <= 4) {
      setStatusText(text);
    } else {
      // Limit to 4 lines if exceeded
      setStatusText(lines.slice(0, 4).join('\n'));
    }
  };

  // console.log("user", JSON.stringify(user, null, 1));

  const handleKeyPress = ({nativeEvent}) => {
    if (nativeEvent.key === 'Enter') {
      const lines = statusText.split('\n');
      // Prevent adding a new line if the field is empty or already at 4 lines
      if (statusText.trim() === '' || lines.length >= 4) {
        return; // Do nothing, stopping Enter from adding a line
      }
    }
  };

  const toggleStatusSection = () => {
    // Configure the next layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStatusSectionVisible(!statusSectionVisible);
  };

  const handleSetStatus = item => {
    // console.log("item", JSON.stringify(userStatusData, null, 1));
    dispatch(setUserStatus(item));
    handleSetStatusText(item);
    toggleStatusSection();
  };

  //    "profileStatus": {
  //   "recurring": {
  //    "isDailyRecurring": false,
  //    "fromTime": null,
  //    "toTime": null
  //   },
  //   "currentStatus": "Available"
  //  },
  const handleSetStatusText = item => {
    // console.log("statusText", JSON.stringify(status, null, 1));
    axiosInstance
      .patch('/user/updateuser', {
        profileStatus: {
          currentStatus: item,
          recurring: {
            isDailyRecurring: true,
            fromTime: '09:00 AM',
            toTime: '05:00 PM',
          },
        },
      })
      .then(async res => {
        // showAlert({
        //   title: "Done!",
        //   type: "success",
        //   message: "Profile status has been updated successfully!!",
        // });
        dispatch(setUser(res.data.user));
      })
      .catch(err => {
        console.log('updateStatus', err);
      });
  };
  // console.log("user", JSON.stringify(user, null, 1));
  useFocusEffect(
    React.useCallback(() => {
      setStatusSectionVisible(false);
    }, []),
  );
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => handleSetStatus(item.value)}
        style={styles.statusContainer}>
        {item.icon}
        <Text
          style={[
            styles.statusText,
            item.value == status && {color: Colors.Primary},
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={[styles.profileDetailsContainer, {backgroundColor: Colors.White}]}>
      <View style={styles.userDetails}>
        <TouchableOpacity onPress={toggleStatusSection}>
          <Image
            source={
              user?.profilePicture
                ? {
                    uri: user?.profilePicture,
                  }
                : Images.DEFAULT_IMAGE
            }
            style={styles.image}
          />
          <View
            style={{
              position: 'absolute',
              bottom: -5,
              right: -3,
              backgroundColor: Colors.White,
              borderRadius: 100,
              padding: 2,
            }}>
            {profileStatus.find(item => item.value === status).icon}
          </View>
        </TouchableOpacity>
        {/* <View style={styles.activeDot}></View> */}
        {/* {isEventNear && (
            <View style={{ position: "absolute", bottom: 0, right: 0 }}>
              <WaveThingy />
            </View>
          )} */}

        <TouchableOpacity onPress={() => navigation.navigate('MyProfile')}>
          <Text style={[styles.title, {color: Colors.Heading}]}>
            {user?.fullName}
          </Text>
          <Text style={[styles.details, {color: Colors.BodyText}]}>
            {user?.email}
          </Text>
          <Text style={[styles.details, {color: Colors.BodyText}]}>
            ID: {user?.id}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Status section */}
      {statusSectionVisible && (
        <View style={styles.statusSection}>
          <View style={styles.customStatusContainer}>
            <View style={{marginTop: 10}}>
              <EmojiIcon />
            </View>
            <View style={styles.statusTextStyle}>
              <TextInput
                placeholder="Your status? (40 character max)"
                placeholderTextColor="gray" // Ensure it contrasts well with your background
                maxLength={40}
                style={styles.customStatus}
                multiline
                value={statusText}
                onChangeText={handleTextChange}
                onKeyPress={handleKeyPress}
                keyboardAppearance={
                  Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
                }
              />
              <TouchableOpacity onPress={() => handleSetStatusText()}>
                <FontAwesome6 name="check" size={24} color={Colors.Primary} />
              </TouchableOpacity>
            </View>
          </View>
          <Divider marginTop={1} marginBottom={1} />
          <TouchableOpacity
            onPress={() =>
              showAlertModal({
                type: 'warning',
                title: 'Coming soon...',
                message: 'Available in future updates.',
              })
            }
            style={styles.clearAfterButton}>
            <ClockIcon size={20} />
            <View style={styles.clearAfterSection}>
              <Text style={styles.clearAfterText}>Clear after</Text>
              <Text style={styles.clearTimeText}>Tomorrow 12:30 pm</Text>
            </View>
          </TouchableOpacity>
          <Divider marginTop={1} marginBottom={1} />
          <FlatList
            data={userStatusData}
            renderItem={renderItem}
            keyExtractor={item => item.value}
            ItemSeparatorComponent={() => {
              return <Divider marginTop={1} marginBottom={1} />;
            }}
          />
        </View>
      )}
      <GlobalAlertModal />
    </View>

    // <TouchableOpacity activeOpacity={0.8} onPress={handleProfileNavigation}>
    // </TouchableOpacity>
  );
};

export default HomeUserDetails;

const getStyles = Colors =>
  StyleSheet.create({
    clearTimeText: {
      color: Colors.BodyText,
    },
    clearAfterSection: {
      gap: 5,
    },
    clearAfterText: {
      color: Colors.BodyText,
      fontSize: RegularFonts.HR,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    clearAfterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      color: Colors.BodyText,
      gap: 10,
      paddingLeft: 10,
    },
    customStatusContainer: {
      flexDirection: 'row',

      alignItems: 'flex-start',
      // paddingTop: 0,
      gap: 10,
      paddingLeft: 10,
    },
    customStatus: {
      minWidth: 100,
      flex: 0.9,
      // backgroundColor: "red",
      minHeight: 35,
      // marginBottom: 5,
      fontSize: RegularFonts.HS,
      color: Colors.BodyText,
      marginRight: 20,
      width: '88%',
      paddingTop: 10,
    },
    statusText: {
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.BodyText,
      fontSize: RegularFonts.HS,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 10,
    },
    userDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      // backgroundColor: "green",
    },
    profileDetailsContainer: {
      marginTop: responsiveScreenHeight(1.5),
      borderBottomLeftRadius: 10,
      paddingHorizontal: responsiveScreenWidth(4),
      marginHorizontal: responsiveScreenWidth(4),
      paddingVertical: responsiveScreenHeight(2),
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.BorderColor,
    },
    profileImageContainer: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      marginRight: responsiveScreenWidth(3),
      marginLeft: responsiveScreenWidth(4),
      marginTop: responsiveScreenHeight(0.3),
    },
    image: {
      width: responsiveScreenWidth(12),
      height: responsiveScreenWidth(12),
      borderRadius: responsiveScreenWidth(12),
      position: 'relative',
    },
    activeDot: {
      backgroundColor: Colors.Primary,
      height: 12,
      width: 12,
      borderRadius: 100,
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    title: {
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      color: Colors.Heading,
      width: responsiveScreenWidth(68),
    },
    details: {
      fontFamily: CustomFonts.REGULAR,
      fontSize: responsiveScreenFontSize(1.7),
      marginTop: responsiveScreenHeight(0.25),
    },
    statusSection: {
      overflow: 'hidden',
      backgroundColor: Colors.Background_color,
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
    },
    statusTextStyle: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
  });
