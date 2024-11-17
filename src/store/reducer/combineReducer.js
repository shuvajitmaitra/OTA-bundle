import {combineReducers} from 'redux';
import authReducers from './authReducer';
import chatReducer from './chatReducer';
import notificationReducer from './notificationReducer';
import navigationReducer from './navigationReducer';
import pinReducer from './pinReducer';
import dashboardReducer from './dashboardReducer';
import activitiesReducer from './activitiesReducer';
import showNTellReducer from './showNTellReducer';
import calendarReducer from './calendarReducer';
import TechnicalTestReducer from './TechnicalTestReducer';
import InterviewReducer from './InterviewReducer';
import communityReducer from './communityReducer';
import audioVideoReducer from './audioVideoReducer';
import commentReducer from './commentReducer';
import programReducer from './programReducer';
import progressReducer from './progressReducer';
import modalReducer from './ModalReducer';
import newChatReducer from './newChatReducer';
import chatSlice from './chatSlice';
import userStatusReducer from './userStatusReducer';

const rootReducer = combineReducers({
  auth: authReducers,
  chat: chatReducer,
  notification: notificationReducer,
  navigations: navigationReducer,
  pin: pinReducer,
  dashboard: dashboardReducer,
  activities: activitiesReducer,
  showNTell: showNTellReducer,
  calendar: calendarReducer,
  technicalTest: TechnicalTestReducer,
  interview: InterviewReducer,
  community: communityReducer,
  medias: audioVideoReducer,
  comment: commentReducer,
  program: programReducer,
  progress: progressReducer,
  modal: modalReducer,
  newChat: newChatReducer,
  userStatus: userStatusReducer,
  chatSlice: chatSlice,
});

export default rootReducer;
