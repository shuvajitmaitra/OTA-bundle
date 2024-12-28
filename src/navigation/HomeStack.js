// src/navigation/HomeStack.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DisplaySettingsScreen from '../screens/DisplaySettings/DisplaySettingsScreen';
import {useTheme} from '../context/ThemeContext';
import Dashboard from '../screens/Main/Dashboard';
import MyProfile from '../screens/Main/MyProfile';
import MyProfileEdit from '../screens/Main/MyProfileEdit';
import ChangePasswordScreen from '../screens/Main/ChangePasswordScreen';
import NewChatScreen from '../screens/Chat/NewChatScreen';
import CreateNewUser from '../components/ChatCom/CreateNewUser';
import NotificationScreen from '../screens/NotificationScreen';
import Header from '../components/SharedComponent/Header';
import PurchasedScreen from '../screens/Main/PurchasedScreen';
import LandingScreenMain from '../screens/LandingScreen/LandingScreenMain';
import BootCampsDetails from '../screens/LandingScreen/BootCampsDetails';
import UserDashboard from '../screens/Dashboard/UserDashboard';
import CourseDetails from '../components/PurchasedCom/CourseDetails';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Text, TouchableOpacity, View} from 'react-native';
import NotificationScreenHeader from '../components/NotificationScreenHeader';
import MyPaymentScreen from '../screens/MyPaymentScreen';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import CustomFonts from '../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
  const Colors = useTheme(); // Assume this returns an object with color properties

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.White,
        },
        headerTintColor: Colors.BodyText, // Use appropriate color from theme
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.BodyText,
        },
      }}>
      <HomeStack.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false, // Hide header for Dashboard2
        }}
      />
      <HomeStack.Screen
        name="UserDashboard"
        component={UserDashboard}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="DisplaySettingsScreen"
        component={DisplaySettingsScreen}
        options={{
          headerShown: false, // Show header for DisplaySettingsScreen
          title: 'Display Settings', // Customize header title
        }}
      />
      <HomeStack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="MyProfileEdit"
        component={MyProfileEdit}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{headerShown: false}}
      />

      <HomeStack.Screen
        name="NewChatScreen"
        component={NewChatScreen}
        options={({route, navigation}) => ({
          headerShown: false,
        })}
      />

      <HomeStack.Screen
        name="CreateNewUser"
        component={CreateNewUser}
        options={({route, navigation}) => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          header: () => {
            return <NotificationScreenHeader navigation={navigation} />;
          },
        })}
      />
      <HomeStack.Screen
        name="PurchasedScreen"
        component={PurchasedScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          header: () => {
            return <Header navigation={navigation} />;
          },
        })}
      />
      <HomeStack.Screen
        name="CourseDetails"
        component={CourseDetails}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <ArrowLeft />
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: CustomFonts.MEDIUM,
                    fontSize: responsiveScreenFontSize(2),
                    color: Colors.BodyText,
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
            );
          },
        })}
      />
      <HomeStack.Screen
        name="LandingPage"
        component={LandingScreenMain}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="MyPaymentScreen"
        component={MyPaymentScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <ArrowLeft />
                <Text
                  style={{
                    marginLeft: 5,
                    fontFamily: CustomFonts.MEDIUM,
                    fontSize: responsiveScreenFontSize(2),
                    color: Colors.BodyText,
                  }}>
                  Back
                </Text>
              </TouchableOpacity>
            );
          },
        })}
      />
      <HomeStack.Screen
        name="BootCampsDetails"
        component={BootCampsDetails}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
