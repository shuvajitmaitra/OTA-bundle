import React, {useEffect, useRef} from 'react';
import {
  Alert,
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import hotUpdate from 'react-native-ota-hot-update';
import CustomFonts from '../../constants/CustomFonts';

// Enable LayoutAnimation on Android if needed
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OtaScreen = () => {
  const Colors = useTheme();
  const styles = getStyles(Colors);

  // Create an Animated.Value to track progress (0 to 100)
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Function to animate progress update
  const updateProgress = newPercent => {
    Animated.timing(progressAnim, {
      toValue: newPercent,
      duration: 300, // Adjust duration for faster or slower animation
      useNativeDriver: false, // false because we animate layout properties
    }).start();
  };

  useEffect(() => {
    const onCheckGitVersion = () => {
      hotUpdate.git.checkForGitUpdate({
        branch: 'main',
        bundlePath:
          Platform.OS === 'ios'
            ? 'iosOutput/main.jsbundle'
            : 'androidOutput/index.android.bundle',
        url: 'https://github.com/shuvajitmaitra/OTA-bundle.git',
        onCloneFailed(msg) {
          console.log('Clone failed:', JSON.stringify(msg, null, 2));
          // Optionally display an alert
          // Alert.alert('Clone project failed!', msg);
        },
        onCloneSuccess() {
          Alert.alert(
            'Clone project success!',
            'Restart to apply the changes',
            [
              {
                text: 'OK',
                onPress: () => hotUpdate.resetApp(),
              },
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
            ],
          );
        },
        onPullFailed(msg) {
          console.log('Pull failed:', JSON.stringify(msg, null, 2));
          // Optionally display an alert
          // Alert.alert('Pull project failed!', msg);
        },
        onPullSuccess() {
          // Optionally display a success alert
          // Alert.alert('Pull project success!', 'Restart to apply the changes');
        },
        onProgress(received, total) {
          const percent = (+received / +total) * 100;
          console.log('Progress percent:', percent);

          // Optionally use LayoutAnimation for additional layout transitions
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          updateProgress(percent);
        },
        onFinishProgress() {
          // Optionally perform any finalization when progress completes.
          console.log('Download progress finished!');
          updateProgress(100);
        },
      });
    };

    onCheckGitVersion();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Text style={{color: Colors.Primary, fontSize: 20}}>0%</Text>
        <View style={styles.bgProgress}>
          <Animated.View
            style={[
              styles.animatedProgress,
              {
                backgroundColor: Colors.Primary,
                // Interpolate the animated value so it converts 0-100 to a percentage width
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={{color: Colors.Primary, fontSize: 20}}>100%</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => hotUpdate.resetApp()}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtaScreen;

const getStyles = Colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Background_color,
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      width: '80%',
      marginBottom: 20,
    },
    bgProgress: {
      backgroundColor: Colors.White,
      width: '80%',
      height: 10,
      borderRadius: 100,
      overflow: 'hidden',
    },
    animatedProgress: {
      height: 10,
      borderRadius: 100,
    },
    button: {
      backgroundColor: Colors.Primary,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
    },
  });
