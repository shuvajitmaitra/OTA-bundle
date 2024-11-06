import moment from 'moment';
import {Alert, Share} from 'react-native';
import {showToast} from '../components/HelperFunction';
import store from '../store';
import Clipboard from '@react-native-clipboard/clipboard';

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
  const momentDate = moment(dateStr);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'days').startOf('day');
  const startOfWeek = moment().startOf('week');

  // Check if the date is today
  if (momentDate.isSame(today, 'day')) {
    return 'Today';
  }

  // Check if the date is yesterday
  if (momentDate.isSame(yesterday, 'day')) {
    return 'Yesterday';
  }

  // Check if the date is within the current week
  if (momentDate.isSameOrAfter(startOfWeek)) {
    return momentDate.format('dddd'); // Returns day name (e.g., "Monday")
  }

  // Otherwise, return the formatted date
  return momentDate.format('MMM D, YYYY'); // Returns date in "Aug 24, 2024" format
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
    // showToast('Link copied!');
  } catch (error) {
    console.error('Error while copying to clipboard:', error);
  }
};

export const nameTrim = fullName => {
  const n = fullName || 'New User';
  let name = n.split(' ').slice(0, 3).join(' ');
  return name;
};
