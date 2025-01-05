import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Sound from 'react-native-sound';
import Waveform from './WaveForm';
import {useTheme} from '../../context/ThemeContext';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import AudioManager from '../../utility/AudioManager';
import {useFocusEffect} from '@react-navigation/native';
import PlayIcon from '../../assets/Icons/PlayIcon';
import PauseIcon from '../../assets/Icons/PauseIcon';

Sound.setCategory('Playback');

const formatTime = time => {
  return new Date(time * 1000).toISOString().substr(14, 5);
};

const AudioMessage = ({audioUrl, background, color}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  let interval = null;

  useEffect(() => {
    let isMounted = true;

    const loadAudio = () => {
      const loadedSound = new Sound(audioUrl, null, error => {
        if (error) {
          console.log('Error loading audio:', error);
          setLoadError(error);
          setIsLoading(false);
          return;
        }
        if (isMounted) {
          setSound(loadedSound);
          setTotalDuration(loadedSound.getDuration());
          setIsLoading(false);
        }
      });

      return () => {
        isMounted = false;
        if (sound) {
          sound.stop(() => {});
          sound.release();
          if (AudioManager.getInstance().currentAudio === sound) {
            AudioManager.getInstance().reset();
          }
        }
      };
    };

    loadAudio();
  }, [audioUrl]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound) {
          sound.pause();
          clearInterval(interval); // Clear interval when losing focus
        }
      };
    }, [sound]),
  );

  const handlePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
        clearInterval(interval); // Clear interval when paused
      } else {
        if (Math.floor(currentPlaybackTime) === Math.floor(totalDuration)) {
          sound.setCurrentTime(0);
        }
        AudioManager.getInstance().setAudio(sound);
        sound.play(success => {
          if (success) {
            setIsPlaying(false);
            setProgress(0);
            setCurrentPlaybackTime(0);
          }
        });
        setIsPlaying(true);

        // Start interval to update playback time
        interval = setInterval(() => {
          sound.getCurrentTime(seconds => {
            setCurrentPlaybackTime(seconds);
            setProgress(seconds / totalDuration);
          });
        }, 1000); // Update every second
      }
    }
  };

  const Colors = useTheme();
  const styles = getStyles({Colors, color});

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
          color={color || Colors.PureWhite}
        />
      ) : (
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          {isPlaying ? (
            <PauseIcon color={color || Colors.PureWhite} />
          ) : (
            <PlayIcon color={color || Colors.PureWhite} />
          )}
        </TouchableOpacity>
      )}

      {!loadError && <Waveform progress={progress} color={color} />}
      <Text style={styles.audioTimer}>
        {formatTime(currentPlaybackTime)} / {formatTime(totalDuration)}
      </Text>
    </View>
  );
};

const getStyles = ({Colors, color}) =>
  StyleSheet.create({
    playIcon: {
      color: Colors.Primary,
    },
    audioTimer: {
      marginLeft: responsiveScreenWidth(2),
      color: color || Colors.PureWhite,
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
