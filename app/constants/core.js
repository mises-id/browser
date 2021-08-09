/*
 * @Author: lmk
 * @Date: 2021-08-07 10:52:25
 * @LastEditTime: 2021-08-10 01:19:06
 * @LastEditors: lmk
 * @Description: 
 */
import Device from 'app/util/Device';

const DEVELOPMENT = 'development';

export const AppConstants = {
  IS_DEV: process.env?.NODE_ENV === DEVELOPMENT,
  DEFAULT_LOCK_TIMEOUT: 30000,
  DEFAULT_SEARCH_ENGINE: 'DuckDuckGo',
  TX_CHECK_MAX_FREQUENCY: 5000,
  TX_CHECK_NORMAL_FREQUENCY: 10000,
  TX_CHECK_BACKGROUND_FREQUENCY: 30000,
  MAX_PUSH_NOTIFICATION_PROMPT_TIMES: 2,
  MM_UNIVERSAL_LINK_HOST: 'mises.site',
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  USER_AGENT: Device.isAndroid()
    ? 'Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/OSM1.180201.023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/76.0.3809.123 Mobile/15E148 Safari/605.1',
  DEEPLINKS: {
    ORIGIN_DEEPLINK: 'deeplink',
    ORIGIN_QR_CODE: 'qr-code',
  },
  ERRORS: {
    INFURA_BLOCKED_MESSAGE:
      'EthQuery - RPC Error - This service is not available in your country',
  },
  HOMEPAGE_HOST:"home.mises.site",
  HOMEPAGE_URL: 'https://home.mises.site/'
};
