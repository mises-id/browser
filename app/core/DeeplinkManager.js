'use strict';

import URL from 'url-parse';
import qs from 'qs';
import {InteractionManager, Alert} from 'react-native';
import AppConstants from 'app/constants/core';
import {strings} from 'app/locales/i18n';

class DeeplinkManager {
  constructor(_navigation) {
    this.navigation = _navigation;
    this.pendingDeeplink = null;
  }

  setDeeplink = url => (this.pendingDeeplink = url);

  getPendingDeeplink = () => this.pendingDeeplink;

  expireDeeplink = () => (this.pendingDeeplink = null);

  handleBrowserUrl(url, callback) {
    this.navigation.navigate('BrowserTabHome');
    InteractionManager.runAfterInteractions(() => {
      if (callback) {
        callback(url);
      } else {
        this.navigation.navigate('BrowserView', {
          newTabUrl: url,
        });
      }
    });
  }

  parse(url, {browserCallBack, origin, onHandled}) {
    const urlObj = new URL(url);
    let params;

    if (urlObj.query.length) {
      try {
        params = qs.parse(urlObj.query.substring(1));
      } catch (e) {
        Alert.alert(strings('deeplink.invalid'), e.toString());
      }
    }

    const handled = () => onHandled?.();

    const {MM_UNIVERSAL_LINK_HOST} = AppConstants;
    switch (urlObj.protocol.replace(':', '')) {
      case 'http':
      case 'https':
        // Universal links
        handled();
        if (urlObj.hostname === MM_UNIVERSAL_LINK_HOST) {
          // action is the first parth of the pathname
          const action = urlObj.pathname.split('/')[1];

          switch (action) {
            case 'wc':
              break;
            case 'dapp':
              this.handleBrowserUrl(
                urlObj.href.replace(
                  `https://${MM_UNIVERSAL_LINK_HOST}/dapp/`,
                  'https://',
                ),
                browserCallBack,
              );
              break;
            case 'payment':
            case 'focus':
            case '':
              break;

            default:
              Alert.alert(strings('deeplink.not_supported'));
          }
        } else {
          // Normal links (same as dapp)

          handled();
          urlObj.set('protocol', 'https:');
          this.handleBrowserUrl(urlObj.href, browserCallBack);
        }
        break;

      // walletconnect related deeplinks
      // address, transactions, etc
      case 'wc':
        handled();
        break;

      // Specific to the browser screen
      // For ex. navigate to a specific dapp
      case 'dapp':
        // Enforce https
        handled();
        urlObj.set('protocol', 'https:');
        this.handleBrowserUrl(urlObj.href, browserCallBack);
        break;

      // Specific to the Mises Browser app
      // For ex. go to settings
      case 'mises':
        handled();
        if (urlObj.origin === 'mises://wc') {
          const cleanUrlObj = new URL(urlObj.query.replace('?uri=', ''));
          const href = cleanUrlObj.href;
        }
        break;
      default:
        return false;
    }

    return true;
  }
}

let instance = null;

const SharedDeeplinkManager = {
  init: navigation => {
    instance = new DeeplinkManager(navigation);
  },
  parse: (url, args) => instance.parse(url, args),
  setDeeplink: url => instance.setDeeplink(url),
  getPendingDeeplink: () => instance.getPendingDeeplink(),
  expireDeeplink: () => instance.expireDeeplink(),
};

export default SharedDeeplinkManager;
