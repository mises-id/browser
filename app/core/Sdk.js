/*
 * @Author: lmk
 * @Date: 2021-07-30 16:20:12
 * @LastEditTime: 2021-08-13 00:58:46
 * @LastEditors: lmk
 * @Description:
 */
'use strict';
import {MSdk, MStringList, MUserInfo} from 'react-native-sdk-bridge';
// TODO: What to do with the module

const sdk = {
  testConnection: async () => {
    var i = await MSdk.instance();
    return i.testConnection();
  },
  randomMnemonics: async () => {
    var i = await MSdk.instance();
    return i.randomMnemonics();
  },
  getUserMgr: async () => {
    try {
      const i = await MSdk.instance();
      return await i.userMgr();
    } catch (error) {
      return Promise.reject();
    }
  },
  createUser: async (mnemonics = '', password = '') => {
    try {
      const umgr = await sdk.getUserMgr();
      return await umgr.createUser(mnemonics, password);
    } catch (error) {
      return Promise.reject();
    }
  },
  login: async (site = '', permission = []) => {
    try {
      const i = await MSdk.instance();
      return i.login(site, permission);
    } catch (error) {
      return Promise.reject();
    }
  },
  MStringList: async (a, b) => {
    try {
      return await MStringList.newStringList(a, b);
    } catch (error) {
      return Promise.reject();
    }
  },
  isLogin: async () => {
    try {
      const i = await MSdk.instance();
      await i.setTestEndpoint('http://gw.mises.site:1317/');
      const activeUser = await sdk.getActiveUser();
      // var m = await i.randomMnemonics();
      // Logger.log('randomMnemonics ' + m);
      // var activeUser = await umgr.createUser(m, '1243');
      // Logger.log('activeUser ' + activeUser);
      // var did = await activeUser.misesID();
      // Logger.log('misesID ' + did);
      // await umgr.setActiveUser(did, '1243');
      return !!activeUser;
    } catch (error) {
      return Promise.reject();
    }
  },
  ListUsers: async () => {
    try {
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
      const i = await MSdk.instance();
      const umgr = await i.userMgr();
      return await umgr.activeUser();
    } catch (error) {
      return Promise.reject(error);
    }
  },
  setUserInfo: async info => {
    try {
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
        return await activeUser.setInfo(userInfo);
      }
    } catch (error) {
      console.log(error, 'setUserInfo error');
      return Promise.reject(error);
    }
  },
  getAuth: async () => {
    try {
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
      const activeUser = await sdk.getActiveUser();
      return activeUser.follow(misesId);
    } catch (error) {
      console.log(error, 'follow error');
      return Promise.reject(error);
    }
  },
  unFollow: async misesId => {
    try {
      const activeUser = await sdk.getActiveUser();
      return activeUser.unfollow(misesId);
    } catch (error) {
      console.log(error, 'unFollow error');
      return Promise.reject(error);
    }
  },
};
export default sdk;
