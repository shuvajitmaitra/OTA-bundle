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
import NotificationScreenHeader from '../components/NotificationScreenHeader';
import MyPaymentScreen from '../screens/MyPaymentScreen';
import GlobalBackButton from '../components/SharedComponent/GlobalBackButton';

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
        options={({route, navigation}) => ({
          headerTitle: '',
          header: () => {
            return <Header navigation={navigation} />;
          },
        })}
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
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
          ),
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
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
          ),
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
