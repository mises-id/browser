/*
 * @Author: lmk
 * @Date: 2021-08-02 14:33:49
 * @LastEditTime: 2021-08-07 20:52:36
 * @LastEditors: lmk
 * @Description: 
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';

import {store, persistor} from 'app/store/';
import SplashScreen from 'react-native-splash-screen';

import App from 'app/components/Nav/App';
import Logger from 'app/util/Logger';

import Sdk from 'app/core/Sdk';

import ErrorBoundary from 'app/components/UI/ErrorBoundary';
import { WRootToastApp } from 'react-native-smart-tip'

/**
 * Top level of the component hierarchy
 * App component is wrapped by the provider from react-redux
 */
export default class Root extends PureComponent {
  static propTypes = {
    foxCode: PropTypes.string,
  };

  static defaultProps = {
    foxCode: 'null',
  };

  errorHandler = (error, stackTrace) => {
    Logger.error(error, stackTrace);
  };

  constructor(props) {
    super(props);

    SplashScreen.hide();
    //It is an sdk sample usage
    Logger.log('Mises sdk init start');
    (async ()=>{
      try {
        const login = await Sdk.isLogin();
        if(!login){
          const list = await Sdk.ListUsers();
          // const len = await list.count()
          // console.log(len)
        }
        Logger.log('Mises sdk init ok ' + login);
      } catch (error) {
        
        Logger.log('Mises sdk init error ',error);
      }
    })()
  }

  render = () => (
    <WRootToastApp>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ErrorBoundary onError={this.errorHandler} view="Root">
            <App />
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </WRootToastApp>
  );
}
