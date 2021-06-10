import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

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

export default createStackNavigator(
  {
    Home: {
      screen: createBottomTabNavigator(
        {
          BrowserTabHome: createStackNavigator({
            BrowserView: {
              screen: Browser,
              navigationOptions: {
                gestureEnabled: false,
              },
            },
          }),
        },
        {
          defaultNavigationOptions: () => ({
            tabBarVisible: false,
          }),
        },
      ),
    },
    Webview: {
      screen: createStackNavigator(
        {
          SimpleWebview: {
            screen: SimpleWebview,
          },
        },
        {
          mode: 'modal',
        },
      ),
    },
    SettingsView: {
      screen: createStackNavigator({
        Settings: {
          screen: Settings,
        },
        GeneralSettings: {
          screen: GeneralSettings,
        },
      }),
    },
    AddBookmarkView: {
      screen: createStackNavigator({
        AddBookmark: {
          screen: AddBookmark,
        },
      }),
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    lazy: true,
  },
);
