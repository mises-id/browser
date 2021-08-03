/*
 * @Author: lmk
 * @Date: 2021-07-30 16:20:12
 * @LastEditTime: 2021-08-02 21:51:41
 * @LastEditors: lmk
 * @Description: 
 */
'use strict';

import {MSdk} from 'react-native-sdk-bridge';

// TODO: What to do with the module?
let instance;

export default {
  init: async () => {
    if (instance) {
      return instance;
    }
    instance = await MSdk.newSdk();
    return instance;
  },
  testConnection: async () => {
    return instance && instance.testConnection();
  },
  randomMnemonics: async () => {
    return instance && instance.randomMnemonics();
  },
  createUser: async (mnemonic='',string='')=>{
    try {
      const data = await instance.userMgr();
      const res = await data.userMgr(mnemonic,string)
      console.log(res,'wewqeeeeeee')
    } catch (error) {
      console.log(error+'2333333')
    }

    //return instance&&instance.userMgr&&instance.userMgr().createUser(mnemonic,string)
  }
};
