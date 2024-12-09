import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CommunityScreen from '../screens/Community/CommunityScreen';
import Header from '../components/SharedComponent/Header';

const CommunityStack = createStackNavigator();

const CommunityStackScreen = ({navigation}) => (
  <CommunityStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <CommunityStack.Screen
      name="CommunityScreen"
      component={CommunityScreen}
      options={({route, navigation}) => ({
        headerTitle: '',
        header: () => <Header navigation={navigation} />,
      })}
    />
  </CommunityStack.Navigator>
);

export default CommunityStackScreen;
