import moment from 'moment';
import {Text} from 'react-native';

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function transFormDate(text) {
  // Define regex pattern to match {{DATE:...}}
  let regexPattern = /\{\{DATE:(.*?)\}\}/g;
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Replace all occurrences of the pattern with formatted time and timezone
  return text?.replace(regexPattern, (match, startTime) => {
    // Format startTime using moment.js
    return `${moment(startTime).format(
      'MMMM Do YYYY, h:mm A z',
    )} (${userTimezone})`;
  });
}

export const generateActivityText = (message, senderName) => {
  let activity = message.activity;
  if (activity?.type === 'add') {
    return (
      <>
        {senderName} <Text style={{color: 'green'}}>added</Text>{' '}
        {message.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'remove') {
    return (
      <>
        {senderName} <Text style={{color: 'red'}}>removed</Text>{' '}
        {message.activity?.user?.fullName}{' '}
      </>
    );
  } else if (activity?.type === 'join') {
    return (
      <>
        {message.activity?.user?.fullName}{' '}
        <Text style={{color: 'green'}}>joined</Text>{' '}
      </>
    );
  } else if (activity?.type === 'leave') {
    return (
      <>
        {message.activity?.user?.fullName}{' '}
        <Text style={{color: 'red'}}>left</Text>
        {' this channel'}
      </>
    );
  } else {
    return <>N/A</>;
  }
};

export function removeHtmlTags(inputString) {
  return inputString?.replace(/<[^>]*>/g, '');
}

export function autoLinkify(text) {
  // Regular expression to match valid URLs with common domain extensions
  const urlRegex =
    /\b((?:https?|ftp):\/\/[^\s\]]+|(?<!:\/\/)[^\s\]]+\.(com|net|org|edu|gov|mil|int|io|co|info|biz|dev|tv|me)(\b|\/)[^\s\]]*)\b/gi;

  // Replace plain text URLs with Markdown links
  return text.replace(urlRegex, match => {
    // Check if the match is already within Markdown link syntax
    if (text.includes(`[${match}](${match})`)) {
      return match; // Return the match unchanged
    } else {
      return `[${match}](${match})`; // Convert the match into a Markdown link
    }
  });
}
