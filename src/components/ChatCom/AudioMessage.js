import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Audio} from 'expo-av';
import {MaterialIcons} from '@expo/vector-icons';
import Waveform from './WaveForm';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AudioManager from '../../utility/AudioManager';
import {useFocusEffect} from '@react-navigation/native';

const formatTime = time => {
  return new Date(time * 1000).toISOString().substr(14, 5);
};

const AudioMessage = ({audioUrl, background}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        const {sound: loadedSound} = await Audio.Sound.createAsync(
          {uri: audioUrl},
          {
            shouldPlay: false, // Prevents automatic playback on load
            isLooping: false, // Ensures audio doesn't loop
          },
        );

        if (isMounted) {
          setSound(loadedSound);

          // Set playback status update
          loadedSound.setOnPlaybackStatusUpdate(status => {
            if (status.isLoaded) {
              setCurrentPlaybackTime(status.positionMillis / 1000);
              setTotalDuration(status.durationMillis / 1000);
              setProgress(status.positionMillis / status.durationMillis);

              // If the audio just finished playing, reset the state
              if (status.didJustFinish) {
                setIsPlaying(false); // This ensures play button is shown
                setProgress(0); // Reset progress
                setCurrentPlaybackTime(0); // Reset playback time
                loadedSound.setPositionAsync(0); // Ensure sound is reset
                loadedSound.pauseAsync().catch(() => {});
              } else {
                setIsPlaying(status.isPlaying);
              }
            }
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.log('Error loading audio:', error);
        if (isMounted) {
          setLoadError(error);
          setIsLoading(false);
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;

      if (sound) {
        sound.pauseAsync().catch(() => {});
        sound.unloadAsync().catch(() => {});

        // Resetting AudioManager if this sound was the current audio
        if (AudioManager.getInstance().currentAudio === sound) {
          AudioManager.getInstance().reset();
        }
      }
    };
  }, [audioUrl]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.pauseAsync().catch(() => {});
        }
      };
    }, [sound]),
  );

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // Check if the audio has finished to reset it
        if (Math.floor(currentPlaybackTime) === Math.floor(totalDuration)) {
          await sound.setPositionAsync(0); // Reset position if audio ended
        }
        AudioManager.getInstance().setAudio(sound);
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const Colors = useTheme();
  const styles = getStyles({Colors});

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: background || Colors.ModalBoxColor},
      ]}>
      {loadError ? (
        <Text style={{color: Colors.BodyText}}>Error loading audio</Text>
      ) : isLoading ? (
        <ActivityIndicator
          style={{marginRight: 10}}
          size="small"
          color={Colors.Primary}
        />
      ) : (
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <MaterialIcons
            style={styles.playIcon}
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={24}
          />
        </TouchableOpacity>
      )}

      {!loadError && <Waveform progress={progress} />}
      <Text style={styles.audioTimer}>
        {formatTime(currentPlaybackTime)} / {formatTime(totalDuration)}
      </Text>
    </View>
  );
};

const getStyles = ({Colors}) =>
  StyleSheet.create({
    playIcon: {
      color: Colors.Primary,
    },
    audioTimer: {
      marginLeft: responsiveScreenWidth(2),
      color: Colors.BodyText,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      width: '90%',
    },
    playButton: {
      marginRight: 10,
    },
  });

export default AudioMessage;
