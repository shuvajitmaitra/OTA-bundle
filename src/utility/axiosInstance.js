import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../constants/environment';
import {storage} from './mmkvInstance';

let apiUrl = environment.production
  ? 'https://api.bootcampshub.ai/api'
  : 'https://staging-api.bootcampshub.ai/api';
// // let apiUrl =  'http://192.168.242.219:5000/api'

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export const configureAxiosHeader = async () => {
  const value = storage.getString('user_token');
  // console.log('value', JSON.stringify(value, null, 1));
  if (value) {
    axiosInstance.defaults.headers.common = {
      Authorization: value,
    };
  }

  const enroll = await AsyncStorage.getItem('active_enrolment');
  if (enroll) {
    let enrollId = JSON.parse(enroll)?._id;
    if (enrollId) {
      axiosInstance.defaults.headers.common.enrollment = enrollId;
    }
  }
  const org = storage.getString('organization');
  console.log('org', JSON.stringify(org, null, 1));
  if (org) {
    let orgId = JSON.parse(org)?._id;
    if (orgId) {
      axiosInstance.defaults.headers.common['organization'] = orgId;
    }
  }
};

// Create cancel token using axios
export const getCancelTokenSource = () => axios.CancelToken.source();

export const isCancel = error => axios.isCancel(error); // Helper function

export default axiosInstance;
