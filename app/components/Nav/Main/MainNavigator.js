/*
 * @Author: lmk
 * @Date: 2021-07-12 14:33:08
 * @LastEditTime: 2021-08-07 13:52:26
 * @LastEditors: lmk
 * @Description: MainNavigator
 */
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createCompatNavigatorFactory} from '@react-navigation/compat';

import Browser from '../../Views/Browser';
import AddBookmark from '../../Views/AddBookmark';
import SimpleWebview from '../../Views/SimpleWebview';
import Settings from '../../Views/Settings';
import GeneralSettings from '../../Views/Settings/GeneralSettings';
import Create from 'app/components/Views/Create';
import Restore from 'app/components/Views/Restore';
import CreateStep from 'app/components/Views/Create/indexStep';
import Password from 'app/components/Views/Password';
import Login from 'app/components/Views/Login';

const styles = StyleSheet.create({
  headerLogo: {
    width: 125,
    height: 50,
  },
  backBox: {
    width: 60,
  },
  backIcon: {
    width: 16,
    height: 25,
  },
});
/**
 * Navigator component that wraps
 * the 2 main sections: Browser, Wallet
 */
const headerBackImage = navigation => {
  return (
    <TouchableOpacity
      style={styles.backBox}
      onPress={() => navigation.goBack(null)}>
      <Image
        source={require('../../../images/left.png')}
        style={styles.backIcon}
      />
    </TouchableOpacity>
  );
};
const navigationOptions = ({navigation}) => ({
  headerBackImage: () => headerBackImage(navigation),
  headerBackTitleVisible: false, // 隐藏 iOS 返回按钮标题
  headerPressColorAndroid: 'transparent', // 移除 Android 点击返回按钮效果
  headerTitleAlign: 'center', // Android 标题居中
  headerStyle: {
    backgroundColor: 'white',
  },
  cardStyle: {
    backgroundColor: 'white',
  },
});
const AppStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    BrowserView: {
      screen: Browser,
    },
    Password: {
      screen: Password,
      navigationOptions,
    },
    CreateStep2: {
      screen: Create, //step2
      navigationOptions,
    },
    Create: {
      screen: CreateStep, //step 1
      navigationOptions,
    },
    Restore: {
      screen: Restore,
      navigationOptions,
    },
    Webview: {
      screen: SimpleWebview,
    },
    SettingsView: {
      screen: Settings,
    },
    GeneralSettings: {
      screen: GeneralSettings,
    },
    AddBookmarkView: {
      screen: AddBookmark,
    },
    Login: {
      screen: Login,
      navigationOptions,
    },
  },
  {
    mode: 'modal',
    lazy: true,
  },
);
export default AppStack;
