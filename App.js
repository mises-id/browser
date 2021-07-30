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
    Sdk.init()
      .then(sdk => {
        return sdk.testConnection();
      })
      .then(_ => {
        Logger.log('Mises sdk init ok');
      });
  }

  render = () => (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ErrorBoundary onError={this.errorHandler} view="Root">
          <App />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
}
