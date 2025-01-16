import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({
  activeColor = '#4caf50',
  inActiveColor = '#e6e6e6',
  progress = 50,
  radius = 70,
  strokeWidth = 20,
  textColor = '#4caf50',
  duration = 2000,
}) => {
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  // Update the progress dynamically
  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, {duration});
  }, [animatedProgress, progress, duration]);

  // Animate the strokeDashoffset
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value / 100),
  }));

  return (
    <View style={styles.container}>
      <Svg height={radius * 2 + strokeWidth} width={radius * 2 + strokeWidth}>
        {/* Background Circle */}
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={inActiveColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${
            radius + strokeWidth / 2
          })`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.text, {color: textColor}]}>
          {`${Math.round(progress)}%`}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CircularProgress;
