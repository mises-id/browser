import React, {useState, useEffect, useRef, useCallback} from 'react';

import {
  ActivityIndicator,
  AppState,
  StyleSheet,
  View,
  PushNotificationIOS,
  InteractionManager,
} from 'react-native';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';

import {AppConstants} from 'app/constants/core';
import I18n from 'app/locales/i18n';
import {colors} from 'app/styles/common';
import Device from 'app/util/Device';
import {
  hideCurrentNotification,
  showSimpleNotification,
  removeNotificationById,
  removeNotVisibleNotifications,
} from 'app/actions/notification';

import NotificationManager from 'app/core/NotificationManager';

import MainNavigator from './MainNavigator';
import Notification from '../../UI/Notification';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    marginTop: Device.isIphone12() ? 20 : 0,
  },
  loader: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
const Main = props => {
  //const [connected, setConnected] = useState(true);
  const [forceReload, setForceReload] = useState(false);

  const backgroundMode = useRef(false);
  const locale = useRef(I18n.locale);
  const lockManager = useRef();
  const removeConnectionStatusListener = useRef();

  const usePrevious = value => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevLockTime = usePrevious(props.lockTime);

  const handleAppStateChange = useCallback(
    appState => {
      const newModeIsBackground = appState === 'background';
      // If it was in background and it's not anymore
      // we need to stop the Background timer
      if (backgroundMode.current && !newModeIsBackground) {
        BackgroundTimer.stop();
      }

      backgroundMode.current = newModeIsBackground;

      // If the app is now in background, we need to start
      // the background timer, which is less intense
      if (backgroundMode.current) {
        BackgroundTimer.runBackgroundTimer(async () => {},
        AppConstants.TX_CHECK_BACKGROUND_FREQUENCY);
      }
    },
    [backgroundMode],
  );

  const initForceReload = () => {
    // Force unmount the webview to avoid caching problems
    setForceReload(true);
    setTimeout(() => {
      setForceReload(false);
    }, 1000);
  };

  const renderLoader = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="small" />
    </View>
  );

  useEffect(() => {
    if (locale.current !== I18n.locale) {
      locale.current = I18n.locale;
      initForceReload();
      return;
    }
    if (prevLockTime !== props.lockTime) {
      lockManager.current && lockManager.current.updateLockTime(props.lockTime);
    }
  });

  // Remove all notifications that aren't visible
  useEffect(
    () => {
      props.removeNotVisibleNotifications();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    PushNotification.configure({
      requestPermissions: false,
      onNotification: notification => {
        let data = null;
        if (Device.isAndroid()) {
          if (notification.tag) {
            data = JSON.parse(notification.tag);
          }
        } else if (notification.data) {
          data = notification.data;
        }
        if (data && data.action === 'tx') {
          if (data.id) {
          }
          props.navigation.navigate('TransactionsHome');
        }

        if (Device.isIos()) {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
    });

    setTimeout(() => {
      NotificationManager.init({
        navigation: props.navigation,
        showTransactionNotification: props.showTransactionNotification,
        hideCurrentNotification: props.hideCurrentNotification,
        showSimpleNotification: props.showSimpleNotification,
        removeNotificationById: props.removeNotificationById,
      });
    }, 1000);

    return function cleanup() {
      AppState.removeEventListener('change', handleAppStateChange);
      removeConnectionStatusListener.current &&
        // eslint-disable-next-line react-hooks/exhaustive-deps
        removeConnectionStatusListener.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <View style={styles.flex}>
        {!forceReload ? (
          <MainNavigator
            navigation={props.navigation}
            screenProps={{
              isPaymentRequest: props.isPaymentRequest,
            }}
          />
        ) : (
          renderLoader()
        )}
        <Notification navigation={props.navigation} />
      </View>
    </React.Fragment>
  );
};

Main.router = MainNavigator.router;

Main.propTypes = {
  swapsTransactions: PropTypes.object,
  /**
   * Object that represents the navigator
   */
  navigation: PropTypes.object,
  /**
   * Time to auto-lock the app after it goes in background mode
   */
  lockTime: PropTypes.number,
  /**
   * Action that sets an ETH transaction
   */
  setEtherTransaction: PropTypes.func,
  /**
   * Action that sets a transaction
   */
  setTransactionObject: PropTypes.func,
  /**
   * Array of ERC20 assets
   */
  tokens: PropTypes.array,
  /**
   * Dispatch showing a transaction notification
   */
  showTransactionNotification: PropTypes.func,
  /**
   * Dispatch showing a simple notification
   */
  showSimpleNotification: PropTypes.func,
  /**
   * Dispatch hiding a transaction notification
   */
  hideCurrentNotification: PropTypes.func,
  removeNotificationById: PropTypes.func,
  /**
   * Indicates whether the current transaction is a deep link transaction
   */
  isPaymentRequest: PropTypes.bool,
  /**
   * Indicates whether third party API mode is enabled
   */
  thirdPartyApiMode: PropTypes.bool,
  /**
  /* Hides or shows dApp transaction modal
  */
  toggleDappTransactionModal: PropTypes.func,
  /**
  /* Hides or shows approve modal
  */
  toggleApproveModal: PropTypes.func,
  /**
  /* dApp transaction modal visible or not
  */
  dappTransactionModalVisible: PropTypes.bool,
  /**
  /* Token approve modal visible or not
  */
  approveModalVisible: PropTypes.bool,
  /**
   * Selected address
   */
  selectedAddress: PropTypes.string,
  /**
   * Chain id
   */
  chainId: PropTypes.string,
  /**
   * Network provider type
   */
  providerType: PropTypes.string,
  /**
   * Dispatch infura availability blocked
   */
  setInfuraAvailabilityBlocked: PropTypes.func,
  /**
   * Dispatch infura availability not blocked
   */
  setInfuraAvailabilityNotBlocked: PropTypes.func,
  /**
   * Remove not visible notifications from state
   */
  removeNotVisibleNotifications: PropTypes.func,
};

const mapStateToProps = state => ({
  lockTime: state.settings.lockTime,
  dappTransactionModalVisible: state.modals.dappTransactionModalVisible,
  approveModalVisible: state.modals.approveModalVisible,
});

const mapDispatchToProps = dispatch => ({
  showSimpleNotification: args => dispatch(showSimpleNotification(args)),
  hideCurrentNotification: () => dispatch(hideCurrentNotification()),
  removeNotificationById: id => dispatch(removeNotificationById(id)),
  removeNotVisibleNotifications: () =>
    dispatch(removeNotVisibleNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
