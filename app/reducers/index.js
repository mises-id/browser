import bookmarksReducer from './bookmarks';
import browserReducer from './browser';
import settingsReducer from './settings';
import alertReducer from './alert';
import userReducer from './user';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
  browser: browserReducer,
  alert: alertReducer,
  user: userReducer,
  settings: settingsReducer,
});

export default rootReducer;
