/*
 * @Author: lmk
 * @Date: 2021-07-30 16:20:12
 * @LastEditTime: 2021-08-17 23:00:39
 * @LastEditors: lmk
 * @Description:
 */
'use strict';
import {MSdk, MStringList, MUserInfo} from 'react-native-sdk-bridge';

import NotificationManager from 'app/core/NotificationManager';
import Logger from 'app/util/Logger';
// TODO: What to do with the module

const sdk = {
  testConnection: async () => {
    Logger.log('testConnection ');
    var i = await MSdk.instance();
    return await i.testConnection();
  },
  randomMnemonics: async () => {
    Logger.log('randomMnemonics ');
    var i = await MSdk.instance();
    Logger.log('randomMnemonics return');
    return i.randomMnemonics();
  },
  getUserMgr: async () => {
    try {
      Logger.log('getUserMgr ');
      const i = await MSdk.instance();
      return await i.userMgr();
    } catch (error) {
      return Promise.reject();
    }
  },
  createUser: async (mnemonics = '', password = '') => {
    try {
      Logger.log('createUser ');
      const umgr = await sdk.getUserMgr();
      return await umgr.createUser(mnemonics, password);
    } catch (error) {
      return Promise.reject();
    }
  },
  login: async (site = '', permission = []) => {
    try {
      Logger.log('login ');
      const i = await MSdk.instance();
      return i.login(site, permission);
    } catch (error) {
      return Promise.reject();
    }
  },
  MStringList: async (a, b) => {
    try {
      Logger.log('MStringList ');
      return await MStringList.newStringList(a, b);
    } catch (error) {
      return Promise.reject();
    }
  },
  isLogin: async () => {
    try {
      const activeUser = await sdk.getActiveUser();
      return !!activeUser;
    } catch (error) {
      return Promise.reject();
    }
  },
  init: async () => {
    try {
      const i = await MSdk.instance();
      await i.setTestEndpoint('http://gw.mises.site:1317/');
    } catch (error) {
      return Promise.reject();
    }
  },
  ListUsers: async () => {
    try {
      Logger.log('ListUsers');
      const i = await MSdk.instance();
      const umgr = await i.userMgr();
      return await umgr.listUsers();
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  getActiveUser: async () => {
    try {
      Logger.log('getActiveUser ');
      const i = await MSdk.instance();
      const umgr = await i.userMgr();
      return await umgr.activeUser();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  restoreUser: async () => {
    try {
      Logger.log('restoreUser ');
      const i = await MSdk.instance();
      const umgr = await i.userMgr();
      return await umgr.RestoreUser();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  setUserInfo: async info => {
    try {
      Logger.log('setUserInfo ');
      const activeUser = await sdk.getActiveUser();
      if (activeUser) {
        const {username: name, gender, avatarDid, mobile, email} = info;
        const telphones = await sdk.MStringList(mobile, ',');
        const emails = await sdk.MStringList(email, ',');
        const userInfo = await MUserInfo.newUserInfo(
          name,
          gender,
          avatarDid,
          '',
          '',
          emails,
          telphones,
          '',
        );
        const session = await activeUser.setInfo(userInfo);
        NotificationManager.showMisesNotification();
        return session;
      }
    } catch (error) {
      console.log(error, 'setUserInfo error');
      return Promise.reject(error);
    }
  },
  getAuth: async () => {
    try {
      Logger.log('getAuth ');
      const i = await MSdk.instance();
      const permissions = await sdk.MStringList('signin', ',');
      return await i.login('mises.site', permissions);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  setActiveUser: async (did, password) => {
    try {
      Logger.log('setActiveUser ');
      const i = await MSdk.instance();
      const umgr = await i.userMgr();
      return umgr.setActiveUser(did, password);
    } catch (error) {
      console.log(error, 'setActiveUser error');
      return Promise.reject(error);
    }
  },
  follow: async misesId => {
    try {
      Logger.log('follow ');
      const activeUser = await sdk.getActiveUser();
      const session = activeUser.follow(misesId);

      NotificationManager.showMisesNotification();
      return session;
    } catch (error) {
      console.log(error, 'follow error');
      return Promise.reject(error);
    }
  },
  unFollow: async misesId => {
    try {
      Logger.log('unfollow ');
      const activeUser = await sdk.getActiveUser();
      const session = activeUser.unfollow(misesId);
      NotificationManager.showMisesNotification();
      return session;
    } catch (error) {
      console.log(error, 'unFollow error');
      return Promise.reject(error);
    }
  },
  checkMnemonics: async mne => {
    try {
      Logger.log('checkMnemonics ');
      const i = await MSdk.instance();
      return i.checkMnemonics(mne);
    } catch (error) {
      console.log(error, 'checkMnemonics error');
      return Promise.reject(error);
    }
  },
};
export default sdk;
