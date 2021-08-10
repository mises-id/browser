/*
 * @Author: lmk
 * @Date: 2021-07-05 10:09:07
 * @LastEditTime: 2021-08-11 00:26:44
 * @LastEditors: lmk
 * @Description:
 */
import {combineReducers} from 'redux';
import bookmarksReducer from './bookmarks';
import browserReducer from './browser';
import settingsReducer from './settings';
import alertReducer from './alert';
import userReducer from './user';
import notificationReducer from './notification';
import wizardReducer from './wizard';
import modalsReducer from './modals';
import misesIdReducer from './misesId';

const rootReducer = combineReducers({
  bookmarks: bookmarksReducer,
  browser: browserReducer,
  alert: alertReducer,
  user: userReducer,
  settings: settingsReducer,
  notificatio: notificationReducer,
  wizard: wizardReducer,
  modals: modalsReducer,
  misesId: misesIdReducer,
});

export default rootReducer;
