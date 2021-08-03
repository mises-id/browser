'use strict';
import {MSdk} from 'react-native-sdk-bridge';
import Logger from 'app/util/Logger';
// TODO: What to do with the module

export default {
  testConnection: async () => {
    var i = await MSdk.instance();
    return i.testConnection();
  },
  randomMnemonics: async () => {
    var i = await MSdk.instance();
    return i.randomMnemonics();
  },
  isLogin: async () => {
    var i = await MSdk.instance();
    var umgr = await i.userMgr();
    var activeUser = await umgr.activeUser();
    if (activeUser != null) {
      return true;
    }

    // var m = await i.randomMnemonics();
    // Logger.log('randomMnemonics ' + m);
    // var activeUser = await umgr.createUser(m, '1243');
    // Logger.log('activeUser ' + activeUser);
    // var did = await activeUser.misesID();
    // Logger.log('misesID ' + did);
    // await umgr.setActiveUser(did, '1243');
    return false;
  },
};
