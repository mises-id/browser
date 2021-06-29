/**
 * @format
 */

import 'react-native';
import React from 'react';
import {shallow} from 'enzyme';
import {SdkBridge, MisesSdk} from 'react-native-sdk-bridge';

const testSdk = async () => {
  const sdk = await MisesSdk.newsdk();
  sdk.setLogLevel(0);
};

describe('Sdk', () => {
  it('should work', () => {
    testSdk();
  });
});
