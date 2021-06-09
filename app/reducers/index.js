import {combineReducers} from 'redux';
import bookmarksReducer from './bookmarks';
import browserReducer from './browser';
import settingsReducer from './settings';
import alertReducer from './alert';
import userReducer from './user';
import notificationReducer from './notification';
import wizardReducer from './wizard';
import modalsReducer from './modals';

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
  browser: browserReducer,
  alert: alertReducer,
  user: userReducer,
  settings: settingsReducer,
  notificatio: notificationReducer,
  wizard: wizardReducer,
  modals: modalsReducer,
});

export default rootReducer;
