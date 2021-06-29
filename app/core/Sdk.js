'use strict';

import {SdkBridge, MisesSdk} from 'react-native-sdk-bridge';

// TODO: What to do with the module?
SdkBridge;

const testSdk = async () => {
  const sdk = await MisesSdk.newsdk();
  sdk.setLogLevel(0);
};
