import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Program from '../screens/Main/Program';
import ProgramDetails from '../screens/Main/ProgramDetails';
import Progress from '../screens/Main/Progress';
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
import GlobalBackButton from '../components/SharedComponent/GlobalBackButton';

const ProgramStack = createStackNavigator();

const ProgramStackScreen = ({navigation}) => {
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
          headerTitle: '',
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 20}} />
          ),
        })}
      />
      <ProgramStack.Screen
        name="ProgramDetails"
        component={ProgramDetails}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
          ),
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
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
          ),
        })}
      />
      <ProgramStack.Screen
        name="TestNow"
        component={TestNow}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => <GlobalBackButton />,
        })}
      />
      <ProgramStack.Screen
        name="ViewStatus"
        component={ViewStatus}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
          ),
        })}
      />
      <ProgramStack.Screen
        name="ProgramTextDetails"
        component={ProgramTextDetails}
        options={({route, navigation}) => ({
          headerTitle: '',
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
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
          headerLeft: () => (
            <GlobalBackButton containerStyle={{marginLeft: 20}} />
          ),
        })}
      />
      <ProgramStack.Screen
        name="Progress"
        component={Progress}
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
            <GlobalBackButton containerStyle={{marginLeft: 10}} />
          ),
        })}
      />
    </ProgramStack.Navigator>
  );
};

export default ProgramStackScreen;
