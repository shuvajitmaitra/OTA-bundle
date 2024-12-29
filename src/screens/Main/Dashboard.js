import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import CustomFonts from '../../constants/CustomFonts';
import DashboardTopPart from '../../components/DashboardCom/DashboardTopPart';
import ProgramIconBig from '../../assets/Icons/ProgramIconBig';
import CalenderIconBig from '../../assets/Icons/CalenderIconBig';
import ChatIconBig from '../../assets/Icons/ChatIconBig';
import NotificationIconBig from '../../assets/Icons/NotificationIconBig';
import {useSelector} from 'react-redux';
import {useTheme} from '../../context/ThemeContext';
import PurchasedIcon from '../../assets/Icons/PurchasedIcon';
import DocumentsIcon from '../../assets/Icons/DocumentsIcon';
import BookIcon from '../../assets/Icons/BookIcon';
import ActivityIcon from '../../assets/Icons/ActivityIcon';
import ShowNTellIcon from '../../assets/Icons/ShowNTellIcon';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DashboardIcon from '../../assets/Icons/DashboardIcon';
import MockInterviewIcon from '../../assets/Icons/MockInterviewIcon';
import CommunityIcon from '../../assets/Icons/CommunityIcon';
import MediaIcon from '../../assets/Icons/MediaIcon';
import {LoadCalenderInfo, LoadMockInterviewInfo} from '../../actions/apiCall';
import ExploreMoreIcon from '../../assets/Icons/ExploreMoreIcon';
import HomeUserDetails from '../../components/HomeCom/HomeUserDetails';

export default function Dashboard() {
  const {myEnrollments} = useSelector(state => state.auth);

  const Colors = useTheme();
  const styles = getStyles(Colors);
  const navigation = useNavigation();
  const [statusSectionVisible, setStatusSectionVisible] = useState(false);

  const handleDefaultRoute = () => {
    navigation.navigate('DefaultRoute', {
      title: 'Enrollment is not available',
      description:
        'Sorry, You have not enrolled at any Bootcamp yet. Please explore your Institutes website to enroll your preferred bootcamp!\n or \n If you already enrolled, please select your program.',
    });
  };

  const NavigationItem = ({
    icon,
    title,
    backgroundColor,
    circleColor,
    handlePress,
  }) => {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={[
          styles.navigationItemContainer,
          {backgroundColor: backgroundColor},
        ]}>
        <View
          // animation="bounceIn"
          // duration={6000}
          style={[styles.iconContainer, {backgroundColor: circleColor}]}>
          {icon}
        </View>
        <Text style={styles.navigationItemText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handleMyProgramNavigation = () => {
    navigation.navigate('ProgramStack', {screen: 'Program'});
  };
  const handleMyChatNavigation = () => {
    navigation.navigate('HomeStack', {screen: 'NewChatScreen'});
  };
  const handleMyNotiNavigation = () => {
    navigation.navigate('HomeStack', {screen: 'NotificationScreen'});
  };

  // const handleExploreNavigation = () => {
  //   navigation.navigate("ExploreStack", { screen: "Explore" });
  // };

  const handleLandingNavigation = () => {
    navigation.navigate('LandingPage', {screen: 'LandingPage'});
  };

  const handlePresentationNavigation = () => {
    // navigation.navigate('PresentationStack', { screen: 'Presentation' })
    true
      ? navigation.navigate('ProgramStack', {screen: 'Presentation'})
      : handleDefaultRoute();
  };

  const handleCalenderNavigation = () => {
    true
      ? navigation.navigate('MyCalenderStack', {screen: 'CalendarScreen'})
      : handleDefaultRoute();
  };

  const handlePurchasedNavigation = () => {
    navigation.navigate('HomeStack', {screen: 'PurchasedScreen'});
  };
  const handleShowNTellNavigation = () => {
    true
      ? navigation.navigate('ProgramStack', {screen: 'ShowAndTellScreen'})
      : handleDefaultRoute();
  };
  const handleMockInterviewNavigation = () => {
    true
      ? navigation.navigate('ProgramStack', {screen: 'MockInterview'})
      : handleDefaultRoute();
  };
  const handleDashboardNavigation = () => {
    LoadCalenderInfo();
    LoadMockInterviewInfo();
    navigation.navigate('HomeStack', {screen: 'UserDashboard'});
  };
  const handleCommunityNavigation = () => {
    // dispatch(setCommunityPosts([]));
    // loadCommunityPosts({
    //   page: 1,
    //   limit: 10,
    //   query: "",
    //   tags: [],
    //   user: "",
    //   filterBy: "",
    // });
    navigation.navigate('CommunityStack', {screen: 'CommunityScreen'});
  };

  const handleAudioVideoNavigation = () => {
    true
      ? navigation.navigate('ProgramStack', {
          screen: 'AudioVideoScreen',
        })
      : handleDefaultRoute();
  };

  const {top} = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors.Background_color,
          paddingTop: top,
        },
      ]}>
      <StatusBar
        translucent={true}
        backgroundColor={Colors.Background_color}
        barStyle={
          Colors.Background_color === '#F5F5F5'
            ? 'dark-content'
            : 'light-content'
        }
      />
      <DashboardTopPart
        switchAvailable={myEnrollments.length > 1 ? true : false}
        statusSectionVisible={statusSectionVisible}
        setStatusSectionVisible={setStatusSectionVisible}
      />

      <HomeUserDetails
        statusSectionVisible={statusSectionVisible}
        setStatusSectionVisible={setStatusSectionVisible}
      />
      <ScrollView>
        <Text style={styles.navigationText}>Navigations</Text>
        <View style={styles.navigationAllItemContainer}>
          <NavigationItem
            title={'Bootcamps'}
            handlePress={handleMyProgramNavigation}
            backgroundColor={Colors.Primary}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<ProgramIconBig />}
          />
          <NavigationItem
            title={'Explore More'}
            handlePress={handleLandingNavigation}
            backgroundColor={'#006884'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<ExploreMoreIcon />}
          />

          <NavigationItem
            title={'Dashboard'}
            handlePress={handleDashboardNavigation}
            backgroundColor={'#EB77E6'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<DashboardIcon />}
          />
          <NavigationItem
            title={'Chats'}
            handlePress={handleMyChatNavigation}
            backgroundColor={'#9908F5'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<ChatIconBig />}
          />
          <NavigationItem
            title={'Calendar'}
            handlePress={handleCalenderNavigation}
            backgroundColor={'#EF7817'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<CalenderIconBig />}
          />
          <NavigationItem
            title={'Courses'}
            handlePress={handlePurchasedNavigation}
            backgroundColor={'#097ef2'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<PurchasedIcon />}
          />
          {/* <NavigationItem title={"Presentation"} handlePress={handlePresentationNavigation} backgroundColor={"#FDB70B"} circleColor={"rgba(255, 255, 255, 0.17)"} icon={<PresentationIconBig />} /> */}
          <NavigationItem
            title={'Community'}
            handlePress={handleCommunityNavigation}
            backgroundColor={'#83B4FF'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<CommunityIcon />}
          />
          <NavigationItem
            title={'Day to Day Activities'}
            handlePress={() =>
              true
                ? navigation.navigate('ProgramStack', {
                    screen: 'DayToDayActivities',
                  })
                : handleDefaultRoute()
            }
            backgroundColor={'#00d7c4'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<ActivityIcon />}
          />
          <NavigationItem
            title={'Technical Tests'}
            handlePress={() =>
              true
                ? navigation.navigate('ProgramStack', {
                    screen: 'TechnicalTestScreen',
                  })
                : handleDefaultRoute()
            }
            backgroundColor={'#f34141'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<BookIcon size={30} color={Colors.PureWhite} />}
          />
          <NavigationItem
            title={'Mock Interview'}
            handlePress={handleMockInterviewNavigation}
            backgroundColor={'#4f14ea'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<MockInterviewIcon />}
          />
          <NavigationItem
            title={'Show N Tell'}
            handlePress={handleShowNTellNavigation}
            backgroundColor={'#629dcc'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<ShowNTellIcon />}
          />
          <NavigationItem
            title={'Audios & Videos'}
            handlePress={handleAudioVideoNavigation}
            backgroundColor={'#DA7297'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<MediaIcon />}
          />
          <NavigationItem
            title={'Notifications'}
            handlePress={handleMyNotiNavigation}
            backgroundColor={'#5BBCFF'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<NotificationIconBig />}
          />
          <NavigationItem
            title={'Documents'}
            handlePress={handlePresentationNavigation}
            backgroundColor={'#FDB70B'}
            circleColor={'rgba(255, 255, 255, 0.17)'}
            icon={<DocumentsIcon />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      // paddingTop: responsiveScreenHeight(3),
    },

    dashboardItemsContainer: {
      width: '100%',
      height: responsiveScreenHeight(78),
      zIndex: 10,
      resizeMode: 'contain',
      position: 'relative',
      top: responsiveScreenHeight(-3),
    },
    navigationText: {
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      marginTop: responsiveScreenHeight(2),
      marginLeft: responsiveScreenWidth(5),
    },
    navigationAllItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 20,
      marginLeft: responsiveScreenWidth(5),
      marginTop: responsiveScreenHeight(2),
      marginBottom: 20,
      // backgroundColor: "red",
    },
    navigationItemContainer: {
      width: responsiveScreenWidth(42),
      height: responsiveScreenHeight(16.5),
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      width: responsiveScreenWidth(17),
      height: responsiveScreenWidth(17),
      borderRadius: responsiveScreenWidth(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    navigationItemImage: {
      width: responsiveScreenWidth(9),
      height: responsiveScreenWidth(9),
      resizeMode: 'center',
    },
    navigationItemText: {
      textAlign: 'center',
      width: '80%',
      color: Colors.PureWhite,
      fontFamily: CustomFonts.SEMI_BOLD,
      fontSize: responsiveScreenFontSize(2),
      marginTop: responsiveScreenHeight(1),
    },
  });
