import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const HomeScreen = () => {
  return (
    <View style={styles.HomeContainer}>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  HomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
