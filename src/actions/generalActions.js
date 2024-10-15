import store from '../store';
import axios from '../utility/axiosInstance';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import {setNavigation} from '../store/reducer/navigationReducer';
export const getMyNavigations = () => {
  axios
    .get('/navigation/mynavigations')
    .then(res => {
      store.dispatch(setNavigation(res.data.navigation?.navigations));
    })
    .catch(err => {
      console.log(err);
    });
};

// test commit

async function getPushToken() {
  let token;
  if (Constants.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  return token;
}

export const removeToken = async () => {
  getPushToken().then(token => {
    if (token) {
      axios
        .post('/user/remove-pushtoken', {token})
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
    }
  });
};
