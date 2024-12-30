import {Linking} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';

export function extractFilename(uri) {
  if (!uri) {
    return 'Unavailable';
  }

  const parts = uri.split('/');

  const filename = parts.pop();
  const filenameParts = filename.split('-');
  const cleanFilename = filenameParts.slice(1).join('-');
  return cleanFilename || 'Unavailable';
}

export const handleOpenLink = link => {
  if (link.startsWith('https://')) {
    Linking.openURL(link);
  } else {
    Linking.openURL(`https://${link}`);
  }
};
export function generateRandomHexId(length) {
  const characters = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * characters?.length)];
  }
  return result;
}
export function createIsoTimestamp(day, month, year) {
  // Ensure the day and month are two digits
  let dayStr = day.toString().padStart(2, '0');
  let monthStr = month.toString().padStart(2, '0');

  // Create the ISO 8601 timestamp string
  let isoTimestamp = `${year}-${monthStr}-${dayStr}T00:00:00.000Z`;

  return isoTimestamp;
}
export function removeMarkdown(markdownText) {
  return markdownText?.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$2');
}
export function CalendarFormatTime(timestamp) {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + (minutes === '00' ? '' : ':' + minutes) + ' ' + ampm;
}
export const showToast = ({message, color, background}) => {
  Toast.show({
    type: 'tomatoToast',
    text1: message,
    position: 'bottom',
    props: {color, background},
  });
};
