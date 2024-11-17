// src/navigation/CustomDrawerContent.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const CustomDrawerContent = props => {
  const {navigation} = props;

  const navigateToDisplaySettings = () => {
    navigation.navigate('BottomTabNavigator', {
      screen: 'HomeStack',
      params: {
        screen: 'DisplaySettingsScreen',
      },
    });
  };
  const navigateToMyProfile = () => {
    navigation.navigate('BottomTabNavigator', {
      screen: 'HomeStack',
      params: {
        screen: 'MyProfile',
      },
    });
  };
  const handleChangePassword = () => {
    navigation.navigate('BottomTabNavigator', {
      screen: 'HomeStack',
      params: {
        screen: 'ChangePasswordScreen',
      },
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        {/* Render default drawer items */}
        <DrawerItemList {...props} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Custom Drawer Item */}
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToDisplaySettings}>
          <Text style={styles.buttonText}>Display Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToMyProfile}>
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
