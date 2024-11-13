import React from 'react';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import NewChatScreen from '../screens/Chat/NewChatScreen';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import {Text, TouchableOpacity, View} from 'react-native';
import ChatProfile from '../screens/Chat/ChatProfile';
import DisplaySettingsScreen from '../screens/DisplaySettings/DisplaySettingsScreen';
import CustomFonts from '../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import {useTheme} from '../context/ThemeContext';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import CreateNewUser from '../components/ChatCom/CreateNewUser';

const ChatStack = createStackNavigator();

const ChatStackScreen = ({}) => {
  const Colors = useTheme();
  return (
    <ChatStack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}>
      <ChatStack.Screen
        name="NewChatScreen"
        component={NewChatScreen}
        options={{headerShown: false}}
      />
      <ChatStack.Screen
        name="CreateNewUser"
        component={CreateNewUser}
        options={{headerShown: false}}
      />
      <ChatStack.Screen
        name="DisplaySettingsScreen"
        component={DisplaySettingsScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerShown: false,
        })}
      />
      <ChatStack.Screen
        name="ThreadScreen"
        component={ThreadScreen}
        options={({route, navigation}) => ({
          headerTitle: 'ThreadScreen',
          headerShown: false,
        })}
      />
      <ChatStack.Screen
        name="MessageScreen2"
        component={MessageScreen2}
        options={({route, navigation}) => ({
          headerTitle: 'MessageScreen',
          headerShown: false,
        })}
      />
      <ChatStack.Screen
        name="ChatProfile"
        component={ChatProfile}
        options={({route, navigation}) => ({
          headerTitle: 'Chat_Profile',
          headerShown: false,
        })}
      />
    </ChatStack.Navigator>
  );
};

export default ChatStackScreen;
