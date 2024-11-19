import axios from 'axios';
import environment from '../constants/environment';
import {storage} from './mmkvInstance';

let apiUrl = environment.production
  ? 'https://api.bootcampshub.ai/api'
  : 'https://staging-api.bootcampshub.ai/api';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export const configureAxiosHeader = async () => {
  const value = storage.getString('user_token');
  if (value) {
    axiosInstance.defaults.headers.common = {
      Authorization: value,
    };
  }

  const enroll = storage.getString('active_enrolment');
  if (enroll) {
    let enrollId = JSON.parse(enroll)?._id;
    console.log('enrollId', JSON.stringify(enrollId, null, 1));
    if (enrollId) {
      axiosInstance.defaults.headers.common.enrollment = enrollId;
    }
  }

  const org = storage.getString('organization');
  if (org) {
    let orgId = JSON.parse(org)?._id;
    console.log('orgId', JSON.stringify(orgId, null, 1));
    if (orgId) {
      axiosInstance.defaults.headers.common['organization'] = orgId;
    }
  }
};

// Create cancel token using axios
export const getCancelTokenSource = () => axios.CancelToken.source();

export const isCancel = error => axios.isCancel(error); // Helper function

export default axiosInstance;
