/**
 * @format
 */

import 'react-native';
import {MSdk} from 'react-native-sdk-bridge';

const testSdk = async () => {
  const sdk = await MSdk.newSdk();
  sdk.setLogLevel(0);
};

describe('Sdk', () => {
  it('should work', () => {
    testSdk();
  });
});
