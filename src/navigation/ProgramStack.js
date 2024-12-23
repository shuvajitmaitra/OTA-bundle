import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import {createStackNavigator} from '@react-navigation/stack';

import Program from '../screens/Main/Program';
import ProgramDetails from '../screens/Main/ProgramDetails';
import Prograss from '../screens/Main/Prograss';
import CustomFonts from '../constants/CustomFonts';
import ProgramTextDetails from '../components/ProgramCom/ProgramTextDetails';
import {useTheme} from '../context/ThemeContext';
import TechnicalTestScreen from '../screens/TechnicalTest/TechnicalTestScreen';
import TestNow from '../components/TechnicalTestCom/TestNow';
import ViewStatus from '../components/TechnicalTestCom/ViewStatus';
import LeaderBoardScreen from '../screens/Leaderboard/LeaderBoardScreen';
import DayToDayActivities from '../screens/DayToDayActivities/DayToDayActivities';
import ActivitiesDetails from '../screens/DayToDayActivities/ActivitiesDetails';
import ShowAndTellScreen from '../screens/ShowNTell/ShowAndTellScreen';
import ShowNTellDetails from '../screens/ShowNTell/ShowNTellDetails';
import AudioVideoScreen from '../screens/AudioVideo/AudioVideoScreen';
import MockInterview from '../screens/MockInterview/MockInterview';
import Header from '../components/SharedComponent/Header';
import Presentation from '../screens/Documents/Presentation';
import PresentationDetailsView from '../screens/Documents/PresentationDetailsView';
import AudioVideoDetails from '../screens/AudioVideo/AudioVideoDetails';
import ArrowLeft from '../assets/Icons/ArrowLeft';

const ProgramStack = createStackNavigator();

const ProgramStackScreen = ({navigation}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  return (
    <ProgramStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.White,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Program">
      <ProgramStack.Screen
        name="Program"
        component={Program}
        options={{headerShown: false}}
      />
      <ProgramStack.Screen
        name="AudioVideoScreen"
        component={AudioVideoScreen}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />
      <ProgramStack.Screen
        name="AudioVideoDetails"
        component={AudioVideoDetails}
        options={({route, navigation}) => ({
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
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
                  fontFamily: CustomFonts.MEDIUM,
                  fontSize: responsiveScreenFontSize(2),
                  color: Colors.BodyText,
                  marginLeft: 10,
                }}>
                Back
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <ProgramStack.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={({route, navigation}) => ({
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5,
                gap: 10,
              }}>
              <ArrowLeft />
              <Text
                style={{
                  fontFamily: CustomFonts.MEDIUM,
                  fontSize: responsiveScreenFontSize(2),
                  color: Colors.BodyText,
                }}>
                Back
              </Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.Background_color,
            elevation: 0,
          },
        })}
      />
      <ProgramStack.Screen
        name="TechnicalTestScreen"
        component={TechnicalTestScreen}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />
      <ProgramStack.Screen
        name="ShowAndTellScreen"
        component={ShowAndTellScreen}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />
      <ProgramStack.Screen
        name="ShowNTellDetails"
        component={ShowNTellDetails}
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
      <ProgramStack.Screen
        name="TestNow"
        component={TestNow}
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
      <ProgramStack.Screen
        name="ViewStatus"
        component={ViewStatus}
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
                  paddingLeft: 10,
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
      <ProgramStack.Screen
        name="ProgramTextDetails"
        component={ProgramTextDetails}
        options={({route, navigation}) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.goBack()}>
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
          ),
        })}
      />

      <ProgramStack.Screen
        name="LeaderBoardScreen"
        component={LeaderBoardScreen}
        options={({route, navigation}) => ({
          headerTitle: '',
          header: () => <Header navigation={navigation} />,
        })}
      />
      <ProgramStack.Screen
        name="DayToDayActivities"
        component={DayToDayActivities}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />
      <ProgramStack.Screen
        name="ActivitiesDetails"
        component={ActivitiesDetails}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: 20,
                }}
                onPress={() => navigation.goBack()}>
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
      <ProgramStack.Screen
        name="Prograss"
        component={Prograss}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />

      <ProgramStack.Screen
        name="MockInterview"
        component={MockInterview}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />
      <ProgramStack.Screen
        name="Presentation"
        component={Presentation}
        options={{
          header: () => <Header navigation={navigation} />,
        }}
      />
      <ProgramStack.Screen
        name="PresentationDetailsView"
        component={PresentationDetailsView}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.goBack()}>
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
          ),
        })}
      />
    </ProgramStack.Navigator>
  );
};

export default ProgramStackScreen;
