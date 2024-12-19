// src/navigation/DrawerContent.js

import React, {useState} from 'react';
import {View, StyleSheet, Image, Text, Platform} from 'react-native';
import {Caption} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import environment from '../constants/environment';
import {logout} from '../store/reducer/authReducer';
import {useTheme} from '../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import CustomFonts from '../constants/CustomFonts';
import useUserStatusData from '../constants/UserStatusData';
import HomeIconTwo from '../assets/Icons/HomeIcon2';
import ProfileGreenIcon from '../assets/Icons/ProfileGreenIcon';
import MyProgramIcon from '../assets/Icons/MyProgramIcon';
import BookIcon from '../assets/Icons/BookIcon';
import DocumentIcon from '../assets/Icons/DocumentIcon';
import PasswordIcon from '../assets/Icons/PasswordIcon';
import DisplaySettingsIcon from '../assets/Icons/DisplaySettingsIcon';
import {storage} from '../utility/mmkvInstance';
import OrganizationDetails from '../navigation/OrganizationDetails';
import {handleOpenLink} from '../components/HelperFunction';

// Icon render functions
const renderHomeIconTwo = ({color, size}) => (
  <HomeIconTwo color={color} size={size} />
);
const renderProfileGreenIcon = ({color, size}) => (
  <ProfileGreenIcon color={color} size={size} />
);
const renderMyProgramIcon = ({color, size}) => (
  <MyProgramIcon color={color} size={size} />
);
const renderBookIcon = ({color, size}) => (
  <BookIcon color={color} size={size} />
);
const renderDocumentIcon = ({color, size}) => (
  <DocumentIcon color={color} size={size} />
);
const renderPasswordIcon = ({color, size}) => (
  <PasswordIcon color={color} size={size} />
);
const renderDisplaySettingsIcon = ({color, size}) => (
  <DisplaySettingsIcon color={color} size={size} />
);
const renderSystemUpdateAltIcon = ({color, size}) => (
  <MIcon name="system-update-alt" color={color} size={size} />
);
const renderExitToAppIcon = ({color, size}) => (
  <Icon name="exit-to-app" color={color} size={size} />
);

export function DrawerContent(props) {
  const {navigation} = props; // Use navigation from props
  const Colors = useTheme();
  const styles = getStyles(Colors);
  const {user} = useSelector(state => state.auth);
  const {status} = useSelector(state => state.userStatus);
  const dispatch = useDispatch();
  const userStatusData = useUserStatusData(16);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const signOut = async () => {
    await AsyncStorage.removeItem('user_token');
    storage.clearAll();
    dispatch(logout());
  };

  async function onFetchUpdateAsync() {
    // Your update fetching logic here
    // ...
  }

  async function onDownloadUpdateAsync() {
    // Your update downloading logic here
    // ...
  }

  const navigateToScreen = (stack, screen) => {
    navigation.navigate('BottomTabNavigator', {
      screen: stack,
      params: {
        screen: screen,
      },
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Image
                source={{
                  uri:
                    user?.profilePicture ||
                    'https://api.adorable.io/avatars/50/abott@adorable.png',
                }}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 32,
                  backgroundColor: Colors.White,
                  borderRadius: 100,
                  padding: 2,
                }}>
                {userStatusData.find(item => item.value === status)?.icon}
              </View>
              <View style={{marginLeft: 15, flexDirection: 'column', flex: 1}}>
                <Text style={styles.title}>{user?.fullName}</Text>
                <Text style={styles.caption}>{user?.email}</Text>
              </View>
            </View>
          </View>
          <OrganizationDetails />
          <View style={styles.drawerSection}>
            <DrawerItem
              icon={renderHomeIconTwo}
              label="Home"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
                marginLeft: responsiveScreenWidth(-1),
              }}
              onPress={() => navigateToScreen('HomeStack', 'Home')}
            />

            <DrawerItem
              icon={renderProfileGreenIcon}
              label="Profile"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() => navigateToScreen('HomeStack', 'MyProfile')}
            />

            <DrawerItem
              icon={renderMyProgramIcon}
              label="Bootcamps"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() => navigateToScreen('ProgramStack', 'Program')}
            />

            <DrawerItem
              icon={() => renderBookIcon({color: Colors.Heading, size: 24})}
              label="Technical Tests"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() =>
                navigateToScreen('ProgramStack', 'TechnicalTestScreen')
              }
            />

            <DrawerItem
              icon={renderDocumentIcon}
              label="My Documents"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() => navigateToScreen('ProgramStack', 'Presentation')}
            />

            <DrawerItem
              icon={renderPasswordIcon}
              label="Change Password"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() =>
                navigateToScreen('HomeStack', 'ChangePasswordScreen')
              }
            />

            <DrawerItem
              icon={renderDisplaySettingsIcon}
              label="Display Settings"
              labelStyle={{
                fontFamily: CustomFonts.MEDIUM,
                color: Colors.Heading,
              }}
              onPress={() =>
                navigateToScreen('HomeStack', 'DisplaySettingsScreen')
              }
            />

            {updateAvailable ? (
              <DrawerItem
                icon={() => (
                  <MIcon name="system-update-alt" color={'red'} size={19} />
                )}
                label="Download Update"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: 'red',
                }}
                onPress={() => {
                  onDownloadUpdateAsync();
                }}
              />
            ) : (
              <DrawerItem
                icon={() =>
                  renderSystemUpdateAltIcon({color: Colors.Heading, size: 20})
                }
                label="Check for Update"
                labelStyle={{
                  fontFamily: CustomFonts.MEDIUM,
                  color: Colors.Heading,
                }}
                onPress={() => {
                  Platform.OS === 'ios'
                    ? handleOpenLink(
                        'https://apps.apple.com/us/app/bootcamps-hub/id6476014062',
                      )
                    : onFetchUpdateAsync();
                }}
              />
            )}
          </View>
        </View>
      </DrawerContentScrollView>

      <DrawerItem
        icon={() => renderExitToAppIcon({color: 'red', size: 20})}
        label="Sign Out"
        onPress={signOut}
        labelStyle={{
          fontFamily: CustomFonts.SEMI_BOLD,
          color: 'red',
        }}
      />

      <Caption
        style={{
          paddingLeft: 20,
          paddingBottom: 20,
          color: Colors.Heading,
          fontFamily: CustomFonts.MEDIUM,
        }}>
        Version: 3.6.5 {!environment.production && '(staging)'}
      </Caption>
    </View>
  );
}

const getStyles = Colors =>
  StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      lineHeight: 20,
      color: Colors.Heading,
      fontFamily: CustomFonts.SEMI_BOLD,
    },
    caption: {
      fontSize: 12,
      lineHeight: 14,
      color: Colors.BodyText,
      fontFamily: CustomFonts.REGULAR,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      // marginTop: 15,
      // backgroundColor: 'yellow',
    },
    bottomDrawerSection: {
      marginBottom: 15,
      // Additional styling if needed
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
