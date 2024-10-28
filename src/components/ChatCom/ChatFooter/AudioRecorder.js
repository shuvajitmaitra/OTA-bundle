// // components/AudioRecorder.js
// import React, {useState, useRef, useEffect} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Alert,
//   Platform,
// } from 'react-native';
// import AudioWaveform from './AudioWaveform';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import {PERMISSIONS, request, check, RESULTS} from 'react-native-permissions';
// import CrossCircle from '../../../assets/Icons/CrossCircle';
// import CheckIconTwo from '../../../assets/Icons/CheckIconTwo';

// const AudioRecorder = ({onCancel, onConfirm}) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordTime, setRecordTime] = useState('00:00');
//   const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

//   useEffect(() => {
//     return () => {
//       audioRecorderPlayer.stopRecorder();
//       audioRecorderPlayer.removeRecordBackListener();
//     };
//   }, [audioRecorderPlayer]);

//   const onStartRecord = async () => {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) {
//       Alert.alert(
//         'Permission required',
//         'App needs microphone access to record audio.',
//       );
//       return;
//     }

//     setIsRecording(true);
//     const path = 'hello.m4a'; // Specify the path as needed
//     try {
//       const uri = await audioRecorderPlayer.startRecorder(path);
//       audioRecorderPlayer.addRecordBackListener(e => {
//         setRecordTime(
//           audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
//         );
//         return;
//       });
//       console.log(`Recording started at: ${uri}`);
//     } catch (error) {
//       console.error('Failed to start recording:', error);
//       setIsRecording(false);
//     }
//   };

//   const onStopRecord = async () => {
//     try {
//       const result = await audioRecorderPlayer.stopRecorder();
//       audioRecorderPlayer.removeRecordBackListener();
//       setRecordTime('00:00');
//       setIsRecording(false);
//       console.log(`Recording stopped: ${result}`);
//       // Optionally, handle the recorded file (e.g., save, upload)
//     } catch (error) {
//       console.error('Failed to stop recording:', error);
//     }
//   };

//   const requestPermission = async () => {
//     const permission =
//       Platform.OS === 'android'
//         ? PERMISSIONS.ANDROID.RECORD_AUDIO
//         : PERMISSIONS.IOS.MICROPHONE;

//     const result = await check(permission);
//     switch (result) {
//       case RESULTS.UNAVAILABLE:
//         console.log('This feature is not available on this device.');
//         return false;
//       case RESULTS.DENIED:
//         const requestResult = await request(permission);
//         return requestResult === RESULTS.GRANTED;
//       case RESULTS.GRANTED:
//         return true;
//       case RESULTS.BLOCKED:
//         console.log('The permission is blocked and cannot be requested.');
//         return false;
//       default:
//         return false;
//     }
//   };

//   const handleCancel = () => {
//     if (isRecording) {
//       onStopRecord();
//     }
//     onCancel();
//   };

//   const handleConfirm = () => {
//     if (isRecording) {
//       onStopRecord();
//     }
//     onConfirm();
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={handleCancel}>
//         <CrossCircle size={35} />
//       </TouchableOpacity>

//       <AudioWaveform />

//       <Text style={styles.timer}>{recordTime}</Text>

//       <TouchableOpacity onPress={handleConfirm}>
//         <CheckIconTwo size={35} />
//       </TouchableOpacity>

//       {!isRecording ? (
//         <TouchableOpacity style={styles.recordButton} onPress={onStartRecord}>
//           <Text style={styles.recordText}>Record</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.stopButton} onPress={onStopRecord}>
//           <Text style={styles.stopText}>Stop</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default AudioRecorder;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff', // Adjust as needed
//     borderRadius: 10,
//     elevation: 2, // For Android shadow
//     shadowColor: '#000', // For iOS shadow
//     shadowOffset: {width: 0, height: 2}, // For iOS shadow
//     shadowOpacity: 0.25, // For iOS shadow
//     shadowRadius: 3.84, // For iOS shadow
//   },
//   timer: {
//     marginHorizontal: 10,
//     fontSize: 16,
//     color: '#333',
//   },
//   recordButton: {
//     marginLeft: 20,
//     padding: 10,
//     backgroundColor: 'red',
//     borderRadius: 50,
//   },
//   recordText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   stopButton: {
//     marginLeft: 20,
//     padding: 10,
//     backgroundColor: 'gray',
//     borderRadius: 50,
//   },
//   stopText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AudioRecorder = () => {
  return (
    <View>
      <Text>AudioRecorder</Text>
    </View>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({});
