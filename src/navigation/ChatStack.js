import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import NewChatScreen from '../screens/Chat/NewChatScreen';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import TestMessageScreen from '../screens/Chat/TestMessageScreen';
import {Text, TouchableOpacity, View} from 'react-native';
import ChatProfile from '../screens/Chat/ChatProfile';
import DisplaySettingsScreen from '../screens/DisplaySettings/DisplaySettingsScreen';
import CustomeFonts from '../constants/CustomeFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import {useTheme} from '../context/ThemeContext';

const ChatStack = createStackNavigator();

const ChatStackScreen = ({}) => {
  const Colors = useTheme();
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <ChatStack.Screen
        name="NewChatScreen"
        component={NewChatScreen}
        options={{headerShown: false}}
      />
      <ChatStack.Screen
        name="DisplaySettingsScreen"
        component={DisplaySettingsScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ArrowLeft />
                <Text
                  style={{
                    marginLeft: 10,
                    fontFamily: CustomeFonts.MEDIUM,
                    fontSize: responsiveScreenFontSize(2),
                    color: Colors.BodyText,
                  }}>
                  Back
                </Text>
              </View>
            );
          },
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
      <ChatStack.Screen
        name="TestMessageScreen"
        component={TestMessageScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          header: () => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <AntDesign
            name="arrowleft"
            style={{ marginLeft: 10 }}

            size={24}
            color={Colors.BodyText}
          /> */}
                <Text
                  style={
                    {
                      // marginLeft: 10,
                      // fontFamily: CustomeFonts.MEDIUM,
                      // fontSize: responsiveScreenFontSize(2),
                      // color: Colors.BodyText,
                    }
                  }>
                  Back
                </Text>
              </TouchableOpacity>
            );
          },
        })}
      />
    </ChatStack.Navigator>
  );
};

export default ChatStackScreen;
