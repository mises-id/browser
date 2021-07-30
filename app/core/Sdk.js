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
};
