import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Pressable} from 'react-native';
import Sound from 'react-native-sound';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import AudioWaveform from './AudioWaveform';
import CrossCircle from '../../../assets/Icons/CrossCircle';
import CheckIconTwo from '../../../assets/Icons/CheckIconTwo';
import AudioMessage from '../AudioMessage';
import MicIcon from '../../../assets/Icons/MicIcon';
import ChatMessageInput from '../ChatMessageInput';
import {useTheme} from '../../../context/ThemeContext';
import axiosInstance from '../../../utility/axiosInstance';
import SendIcon from '../../../assets/Icons/SendIcon';
import LoadingSmall from '../../SharedComponent/LoadingSmall';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = ({
  setStartRecording,
  sendMessage,
  handleKey,
  chat,
  isChannel,
}) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState('');
  const [Uploading, setUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [text, setText] = useState('');
  const sendAudioMessage = async (txt, RecordedURI) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: RecordedURI,
      name: 'recording.mp3',
      type: 'audio/mp3',
    });
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      let response = await axiosInstance.post('/chat/file', formData, config);
      let fileData = response?.data?.file;

      let files = [
        {
          name: fileData?.name,
          type: fileData?.type,
          size: fileData?.size,
          url: fileData?.location,
        },
      ];

      sendMessage(txt, files);
    } catch (error) {
      // showAlert({
      //   title: 'Error',
      //   type: 'error',
      //   message: err?.response?.data?.error,
      // });
      // setIsSendingAudio(false);
    } finally {
      setUploading(false);
    }
  };
  const startAudioRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setRecording(true);
      setStartRecording(true);
      audioRecorderPlayer.addRecordBackListener(e => {
        console.log('Recording', e);
        return;
      });
      console.log('Recording started', result);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setRecordedAudioPath(result);
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Recording stopped, file saved at:', result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };
  const cancelRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setStartRecording(false);
      setRecordedAudioPath('');
      audioRecorderPlayer.removeRecordBackListener();
      console.log('Recording canceled');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const playRecording = async () => {
    if (recordedAudioPath) {
      const playbackSound = new Sound(recordedAudioPath, '', error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        playbackSound.play(success => {
          if (success) {
            console.log('Playback finished successfully');
            setIsPlaying(false);
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      });
      setSound(playbackSound);
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (sound) {
      sound.stop(() => {
        console.log('Playback stopped');
        setIsPlaying(false);
      });
    }
  };

  const Colors = useTheme();
  const styles = getStyles(Colors);

  return (
    <View
      style={[
        !recording && !recordedAudioPath
          ? {
              position: 'absolute',
              right: '8%',
              top: '30%',
              // backgroundColor: Colors.CyanOpacity,
              alignItems: 'center',
              justifyContent: 'center',
              // padding: 20,
              // borderRadius: 100,
            }
          : styles.container,
      ]}>
      {!recording && recordedAudioPath && (
        <View style={styles.inputContainer}>
          <ChatMessageInput
            chat={chat}
            handleKey={handleKey}
            isChannel={isChannel}
            text={text}
            setText={setText}
          />
          <TouchableOpacity
            onPress={() => {
              sendAudioMessage(text, recordedAudioPath);
              setRecordedAudioPath('');
              setText('');
              setRecording(false);
              setStartRecording(false);
            }}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      )}
      {!recording && !recordedAudioPath && (
        <>
          {Uploading ? (
            <LoadingSmall size={20} color={Colors.Primary} />
          ) : (
            <TouchableOpacity
              // style={{backgroundColor: 'red', padding: 20}}
              onPress={startAudioRecording}>
              <MicIcon size={25} />
            </TouchableOpacity>
          )}
        </>
      )}
      {recording && (
        <View style={styles.containerTwo}>
          <Pressable onPress={cancelRecording}>
            <CrossCircle color={Colors.Red} size={30} />
          </Pressable>
          <AudioWaveform />
          <Pressable onPress={stopRecording}>
            <CheckIconTwo />
          </Pressable>
        </View>
      )}
      {recordedAudioPath && (
        <View style={styles.containerTwo}>
          <AudioMessage audioUrl={recordedAudioPath} color={Colors.BodyText} />
          <Pressable
            onPress={() => {
              setRecordedAudioPath('');
              setStartRecording(false);
            }}>
            <CrossCircle />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default AudioRecorder;

const getStyles = Colors =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // paddingVertical: 10,
      // minHeight: 80,
      justifyContent: 'space-between',
      width: '100%',
      // marginTop: 10,
    },
    containerTwo: {
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'red',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: Colors.BodyTextOpacity,
      borderRadius: 40,
    },
    container: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.Background_color,
      borderRadius: 30,
      // minHeight: 60,
      padding: 20,
      paddingTop: 10,
      gap: 20,
      marginTop: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#1E90FF',
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
