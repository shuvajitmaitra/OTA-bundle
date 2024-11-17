// src/screens/Main/Dashboard2.js
import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Dashboard2 = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.getParent()?.openDrawer(); // Access the Drawer navigator
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard2</Text>
      <Pressable onPress={openDrawer} style={styles.button}>
        <Text style={styles.buttonText}>Open Drawer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Dashboard2;
