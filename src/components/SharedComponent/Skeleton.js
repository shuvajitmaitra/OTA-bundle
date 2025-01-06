// Skeleton.js
import React from 'react';
import {View, StyleSheet} from 'react-native';

const Skeleton = ({width, height, borderRadius, style}) => {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width || '100%',
          height: height || 20,
          borderRadius: borderRadius || 4,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
    overflow: 'hidden',
  },
});

export default Skeleton;
