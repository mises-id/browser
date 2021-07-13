import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Browser from '../../Views/Browser';
import AddBookmark from '../../Views/AddBookmark';
import SimpleWebview from '../../Views/SimpleWebview';
import Settings from '../../Views/Settings';
import GeneralSettings from '../../Views/Settings/GeneralSettings';

const styles = StyleSheet.create({
  headerLogo: {
    width: 125,
    height: 50,
  },
});
/**
 * Navigator component that wraps
 * the 2 main sections: Browser, Wallet
 */

const AppStack = createStackNavigator({
  BrowserView: {
    screen:Browser,
  },
  Webview: {
    screen: SimpleWebview
  },
  SettingsView: {
    screen: Settings
  },
  GeneralSettings: {
    screen: GeneralSettings
  },
  AddBookmarkView: {
    screen: AddBookmark
  }
},
{
  mode: 'modal',
  lazy: true
})
export default AppStack
