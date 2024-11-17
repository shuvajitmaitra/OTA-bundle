import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import AuthStackScreen from './AuthStackScreen';
import MainTabScreen from './BottomTabNavigator';
import {useSelector} from 'react-redux';
import {useTheme} from '../context/ThemeContext';
import SplashScreen from '../screens/SplashScreen';
import DefaultRoute from '../components/SharedComponent/DefaultRoute';
import GlobalCommentModal from '../components/SharedComponent/GlobalCommentModal';
import MessageScreen2 from '../screens/Chat/MessageScreen2';
import ChatProfile from '../screens/Chat/ChatProfile';
import ThreadScreen from '../screens/Chat/ThreadScreen';
import CustomFonts from '../constants/CustomFonts';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import ArrowLeft from '../assets/Icons/ArrowLeft';
import {Text, TouchableOpacity} from 'react-native';
import DisplaySettingsIcon from '../assets/Icons/DisplaySettingsIcon';

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

// Custom Drawer Content
const drawerContent = props => {
  const {navigation} = props;

  return (
    <DrawerContentScrollView contentContainerStyle={{flex: 1}}>
      <DrawerItem
        icon={({color, size}) => <DisplaySettingsIcon />}
        label="Display Settings"
        labelStyle={{
          fontFamily: CustomFonts.MEDIUM,
          // color: Colors.Heading, // Uncomment and define Colors.Heading if needed
        }}
        onPress={() => {
          console.log('Navigating to DisplaySettingsScreen'); // Debugging log
          navigation.navigate('DisplaySettingsScreen');
        }}
      />
    </DrawerContentScrollView>
  );
};

// Drawer Navigator
const DrawerScreen = () => (
  <>
    <Drawer.Navigator
      screenOptions={{drawerPosition: 'left', headerShown: false}}
      drawerContent={drawerContent}>
      <Drawer.Screen name="MainTabScreen" component={MainTabScreen} />
      <Drawer.Screen
        name="DefaultRoute"
        component={DefaultRoute}
        options={{
          headerLeft: false,
          headerShown: false,
        }}
      />
      {/* Optionally, you can add DisplaySettingsScreen here if you prefer */}
      {/* <Drawer.Screen name="DisplaySettingsScreen" component={DisplaySettingsScreen} /> */}
    </Drawer.Navigator>
    <GlobalCommentModal />
  </>
);

// Root Stack Navigator
const RootStackScreen = ({loading, hasToken}) => {
  const Colors = useTheme();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {hasToken ? (
        <RootStack.Screen name="DrawerScreen" component={DrawerScreen} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
      )}

      <RootStack.Screen
        name="MessageScreen2"
        component={MessageScreen2}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="ChatProfile"
        component={ChatProfile}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="ThreadScreen"
        component={ThreadScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerShown: false,
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
                }}>
                <ArrowLeft />
                <Text
                  style={{
                    marginLeft: 10,
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
    </RootStack.Navigator>
  );
};

// Main Navigation Container
const Route = () => {
  const {isAuthenticated} = useSelector(state => state.auth);
  const user = useSelector(state => state.auth.user);

  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      if (user._id) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
      setLoading(false);
    }

    fetchToken();
  }, [isAuthenticated, user._id]);
  return (
    <NavigationContainer>
      <RootStackScreen hasToken={hasToken} loading={loading} />
    </NavigationContainer>
  );
};

export default Route;
