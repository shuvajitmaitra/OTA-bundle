import React, {useEffect, useRef, useState} from 'react';
import {
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
import Loading from '../../components/SharedComponent/Loading';
import {useNavigation} from '@react-navigation/native';
import UpdateIcon from '../../assets/Icons/UpdateIcon';

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
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [progressNumber, setProgressNumber] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(0)).current;

  // Add a listener so that we can update our local numeric progress state.
  useEffect(() => {
    const progressListener = progressAnim.addListener(({value}) => {
      setProgressNumber(Math.floor(value));
    });
    return () => {
      progressAnim.removeListener(progressListener);
    };
  }, [progressAnim]);

  // Function to show a custom message overlay
  const showStatusMessage = message => {
    setStatusMessage(message);
    setShowMessage(true);
    Animated.timing(messageOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowMessage(false));
      }, 2000);
    });
  };

  // Function to handle navigation on update finish.
  const navigateBackOrHome = () => {};

  const onCheckGitVersion = () => {
    setLoading(true);
    showStatusMessage('Starting update...');
    // Reset progress for each run
    progressAnim.setValue(0);
    setProgressNumber(0);

    // Simulate continuous progress over 30 seconds (30000 ms)
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 30000,
      useNativeDriver: false,
    }).start(() => {
      // showStatusMessage('Download complete!');
      setTimeout(() => {
        setLoading(false);
        navigateBackOrHome();
      }, 1000);
    });

    // Perform real update operations via hotUpdate
    hotUpdate.git.checkForGitUpdate({
      branch: Platform.OS === 'ios' ? 'iOS' : 'android',
      bundlePath:
        Platform.OS === 'ios'
          ? 'output/main.jsbundle'
          : 'output/index.android.bundle',
      url: 'https://github.com/shuvajitmaitra/OTA-bundle.git',
      restartAfterInstall: true,
      onCloneFailed(msg) {
        showStatusMessage('Clone project failed. Please try again.');
        setLoading(false);
      },
      onCloneSuccess() {
        showStatusMessage('Clone successful, applying update...');
        setTimeout(() => {
          hotUpdate.resetApp();
        }, 1000);
      },
      onPullFailed(msg) {
        showStatusMessage(msg);
        setLoading(false);
      },
      onPullSuccess() {
        showStatusMessage('Update pulled successfully. Restarting...');
        setTimeout(() => {
          hotUpdate.resetApp();
        }, 1000);
      },
      // If the update provider reports progress, you could integrate it with our animation:
      onProgress(received, total) {
        // Optionally, update the animated progress with received values.
        const percent = (+received / +total) * 100;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        progressAnim.setValue(percent);
      },
      onFinishProgress() {
        // In case the update finishes early or differently, handle it here.
        setLoading(false);
        // showStatusMessage('Download complete!');
        progressAnim.setValue(100);
        setTimeout(() => {
          navigation.pop();
        }, 1000);
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading
          backgroundColor="transparent"
          style={{minHeight: 100, maxHeight: 100}}
        />
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressText}>{progressNumber}%</Text>
          <View style={styles.bgProgress}>
            <Animated.View
              style={[
                styles.animatedProgress,
                {
                  backgroundColor: Colors.Primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>100%</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UpdateIcon />
      <Text style={styles.headerText}>Update your app to stay up to date</Text>
      <TouchableOpacity style={styles.button} onPress={onCheckGitVersion}>
        <Text style={styles.buttonText}>Start Update</Text>
      </TouchableOpacity>

      {showMessage && (
        <Animated.View
          style={[styles.messageContainer, {opacity: messageOpacity}]}>
          <Text style={styles.messageText}>{statusMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
};

export default OtaScreen;

const getStyles = Colors =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.Background_color,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      // justifyContent: 'center',
      padding: 20,
      paddingTop: 150,
      backgroundColor: Colors.Background_color,
    },
    headerText: {
      fontSize: 20,
      fontFamily: CustomFonts.MEDIUM,
      color: Colors.Primary,
      marginBottom: 30,
      textAlign: 'center',
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    progressText: {
      color: Colors.Primary,
      fontSize: 16,
      fontFamily: CustomFonts.MEDIUM,
      textAlign: 'center',
    },
    bgProgress: {
      backgroundColor: Colors.White,
      width: '60%',
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
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      elevation: 3,
    },
    buttonText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 18,
    },
    messageContainer: {
      position: 'absolute',
      bottom: 40,
      backgroundColor: Colors.Primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      elevation: 5,
    },
    messageText: {
      color: Colors.PureWhite,
      fontFamily: CustomFonts.MEDIUM,
      fontSize: 16,
    },
  });
