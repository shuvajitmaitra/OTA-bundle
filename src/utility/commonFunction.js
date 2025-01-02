import moment from 'moment';
import {Alert, Linking, Platform, Share} from 'react-native';
import {showToast} from '../components/HelperFunction';
import store from '../store';
import Clipboard from '@react-native-clipboard/clipboard';
import {setAlert} from '../store/reducer/ModalReducer';
// import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const eventTypes = type => {
  return type == 'showNTell'
    ? 'Show N Tell'
    : type == 'mockInterview'
    ? 'Mock Interview'
    : type == 'orientation'
    ? 'Orientation Meeting'
    : type == 'technicalInterview'
    ? 'Technical Interview'
    : type == 'behavioralInterview'
    ? 'Behavioral Interview'
    : type == 'syncUp'
    ? 'Sync up call'
    : type == 'reviewMeeting'
    ? 'Review Meeting'
    : type == 'other'
    ? 'Others'
    : 'Select Type';
};

export function formatDynamicDate(dateStr) {
  const date = moment(dateStr);
  const now = moment();

  // Get day name once
  const dayName = date.format('ddd');

  // Start of day calculations
  if (date.isSame(now, 'day')) {
    return `${dayName}, Today`;
  }

  if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
    return `${dayName}, Yesterday`;
  }

  if (date.isSame(now, 'week')) {
    return dayName;
  }

  return `${dayName}, ${date.format('MMM D, YYYY')}`;
}

export function replaceTimeInDatetime(datetimeString, newTime) {
  const originalMoment = moment(datetimeString);
  const newTimeMoment = moment(newTime, 'hh:mm A');

  originalMoment.set({
    hour: newTimeMoment.hour(),
    minute: newTimeMoment.minute(),
    second: 0,
  });

  const modifiedDatetimeString = originalMoment.format(
    'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  );
  console.log('modifieded', JSON.stringify(modifiedDatetimeString, null, 1));
  return modifiedDatetimeString;
}
export function combineDateAndTime(props) {
  const {fullDate, date, time} = props;

  if (date) {
    const combinedDate = moment(fullDate)
      .set({
        year: moment(date, 'YYYY-MM-DD').year(),
        month: moment(date, 'YYYY-MM-DD').month(),
        date: moment(date, 'YYYY-MM-DD').date(),
      })
      .toISOString();

    return combinedDate;
  } else if (fullDate && time) {
    const newDate = moment(fullDate)
      .set({
        hour: moment(time, 'hh:mm A').hour(),
        minute: moment(time, 'hh:mm A').minute(),
        second: moment(time, 'hh:mm A').second(),
        millisecond: moment(time, 'hh:mm A').millisecond(),
      })
      .toISOString();
    return newDate;
  } else {
    return moment();
  }
}
export function getHashtagTexts(text) {
  if (!text) return;
  const regex = /#(\w+)/g;
  const matches = text?.matchAll(regex);
  return Array.from(matches, match => match[1])?.filter(tag =>
    /^[a-zA-Z0-9_]+$/.test(tag),
  );
}
export function formattingDate(date) {
  const dateObject = new Date(date);
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  const formattedDate = dateObject.toLocaleDateString('en-US', options);
  return formattedDate;
}

export function generateRandomNumbers(max) {
  // Define the count based on the max value. Adjust the formula as needed.
  const count = Math.floor(max / 3);

  const randomNumbers = [];
  for (let i = 0; i < count; i++) {
    randomNumbers.push(Math.floor(Math.random() * (max - 2 + 1)) + 2);
  }
  return randomNumbers;
}
export const onShare = async message => {
  try {
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};
export const handleCopyText = text => {
  console.log('text', JSON.stringify(text, null, 1));
  try {
    Clipboard.setString(text);
    showToast({message: 'Link copied!'});
  } catch (error) {
    console.error('Error while copying to clipboard:', error);
  }
};

export const nameTrim = fullName => {
  const n = fullName || 'New User';
  let name = n.split(' ').slice(0, 3).join(' ');
  return name;
};
export const showAlertModal = data => {
  store.dispatch(setAlert({visible: true, data}));
};
// export const checkImagePermission = async () => {
//   const permissionType = Platform.select({
//     ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
//     android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
//   });

//   let permissionStatus = await check(permissionType);

//   if (
//     permissionStatus === RESULTS.DENIED ||
//     permissionStatus === RESULTS.LIMITED
//   ) {
//     permissionStatus = await request(permissionType);
//   }

//   if (permissionStatus === RESULTS.BLOCKED) {
//     // Permission is blocked, prompt user to open settings
//     Alert.alert(
//       'Permission Required',
//       'Photo library access is blocked. Please enable it in the app settings to select images.',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Open Settings',
//           onPress: () => Linking.openSettings(),
//         },
//       ],
//       {cancelable: false},
//     );
//   }
//   return permissionStatus;
// };

// export const checkAudioPermission = async () => {
//   const permissionType = Platform.select({
//     ios: PERMISSIONS.IOS.MICROPHONE,
//     android: PERMISSIONS.ANDROID.RECORD_AUDIO,
//   });

//   try {
//     let permissionStatus = await check(permissionType);

//     if (
//       permissionStatus === RESULTS.DENIED ||
//       permissionStatus === RESULTS.LIMITED
//     ) {
//       permissionStatus = await request(permissionType);
//     }

//     if (permissionStatus === RESULTS.BLOCKED) {
//       // Permission is blocked, prompt user to open settings
//       Alert.alert(
//         'Permission Required',
//         'Microphone access is blocked. Please enable it in the app settings to record audio.',
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {
//             text: 'Open Settings',
//             onPress: () => Linking.openSettings(),
//           },
//         ],
//         {cancelable: false},
//       );
//     }

//     return permissionStatus;
//   } catch (error) {
//     console.warn('Error checking audio permission:', error);
//     return RESULTS.UNAVAILABLE;
//   }
// };
// export const checkDocumentPickerPermission = async () => {
//   let permissionType = null;

//   if (Platform.OS === 'android') {
//     const sdkVersion = Platform.Version;

//     if (sdkVersion >= 33) {
//       permissionType = PERMISSIONS.ANDROID.READ_MEDIA_DOCUMENTS;
//     } else {
//       permissionType = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
//     }
//   } else if (Platform.OS === 'ios') {
//     return RESULTS.GRANTED;
//   } else {
//     return RESULTS.UNAVAILABLE;
//   }

//   try {
//     let permissionStatus = await check(permissionType);

//     if (
//       permissionStatus === RESULTS.DENIED ||
//       permissionStatus === RESULTS.LIMITED
//     ) {
//       permissionStatus = await request(permissionType);
//     }
//     console.log('permissionStatus', JSON.stringify(permissionStatus, null, 2));
//     if (permissionStatus === RESULTS.BLOCKED) {
//       Alert.alert(
//         'Permission Required',
//         'Access to documents is blocked. Please enable it in the app settings to select documents.',
//         [
//           {text: 'Cancel', style: 'cancel'},
//           {
//             text: 'Open Settings',
//             onPress: () =>
//               Linking.openSettings().catch(() =>
//                 console.warn('cannot open settings'),
//               ),
//           },
//         ],
//         {cancelable: false},
//       );
//     }
//     console.log('permissionStatus', JSON.stringify(permissionStatus, null, 2));
//     return permissionStatus;
//   } catch (error) {
//     console.warn('Error checking document picker permission:', error);
//     return RESULTS.UNAVAILABLE;
//   }
// };
