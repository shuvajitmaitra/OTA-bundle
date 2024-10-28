// components/AudioWaveform.js
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const NUM_BARS = 10;
const BAR_WIDTH = 5;
const BAR_MAX_HEIGHT = 100;
const BAR_MARGIN = 3;
const ANIMATION_DURATION = 500;

const AudioWaveform = () => {
  const animatedValues = useRef(
    Array.from({length: NUM_BARS}, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animateBar = animatedValue => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
      ]).start(() => animateBar(animatedValue));
    };

    animatedValues.forEach((animatedValue, index) => {
      setTimeout(() => {
        animateBar(animatedValue);
      }, index * 100);
    });

    return () => {
      animatedValues.forEach(animatedValue => animatedValue.stopAnimation());
    };
  }, [animatedValues]);

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => {
        const height = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [20, BAR_MAX_HEIGHT],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_MAX_HEIGHT,
    justifyContent: 'space-between',
    width: NUM_BARS * (BAR_WIDTH + BAR_MARGIN),
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: 'rgba(153,0,0,0.8)',
    marginHorizontal: BAR_MARGIN / 2,
    borderRadius: BAR_WIDTH / 2,
  },
});

export default AudioWaveform;
