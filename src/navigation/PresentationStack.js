import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PresentationDetails from '../screens/Main/PresentationDetails';
import PresentationDetailsView from '../screens/Documents/PresentationDetailsView';
import Colors from '../constants/Colors';
import {useTheme} from '../context/ThemeContext';
import CustomFonts from '../constants/CustomFonts';
import {Text, TouchableOpacity, View} from 'react-native';
import {responsiveScreenFontSize} from 'react-native-responsive-dimensions';
import Presentation from '../screens/Documents/Presentation';
import ArrowLeft from '../assets/Icons/ArrowLeft';

const PresentationStack = createStackNavigator();

const PresentationStackScreen = ({navigation, route}) => {
  // --------------------------
  // ----------- Import theme Colors -----------
  // --------------------------
  const Colors = useTheme();
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();

      navigation.popToTop();

      navigation.navigate('Presentation');
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <PresentationStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.White,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      initialRouteName="Presentation">
      <PresentationStack.Screen
        name="Presentation"
        component={Presentation}
        options={{headerShown: false}}
      />
      <PresentationStack.Screen
        name="PresentationDetailsView"
        component={PresentationDetailsView}
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
      <PresentationStack.Screen
        name="PresentationDetails"
        component={PresentationDetails}
        options={({route, navigation}) => ({
          headerShown: true,
          headerLeft: () => (
            <ArrowLeft
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
    </PresentationStack.Navigator>
  );
};

export default PresentationStackScreen;
