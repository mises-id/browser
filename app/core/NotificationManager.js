'use strict';

import PushNotification from 'react-native-push-notification';
import {Alert, AppState, InteractionManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Device from '../util/Device';
import {strings} from 'app/locales/i18n';
import {AppConstants} from 'app/constants/core';
import {
  PUSH_NOTIFICATIONS_PROMPT_COUNT,
  PUSH_NOTIFICATIONS_PROMPT_TIME,
} from '../constants/storage';

const constructTitleAndMessage = data => {
  let title, message;
  switch (data.type) {
    case 'pending':
      title = strings('notifications.pending_title');
      message = strings('notifications.pending_message');
      break;
    case 'pending_deposit':
      title = strings('notifications.pending_deposit_title');
      message = strings('notifications.pending_deposit_message');
      break;
    case 'pending_withdrawal':
      title = strings('notifications.pending_withdrawal_title');
      message = strings('notifications.pending_withdrawal_message');
      break;
    case 'success':
      title = strings('notifications.success_title', {
        nonce: data?.transaction?.nonce || '',
      });
      message = strings('notifications.success_message');
      break;
    case 'speedup':
      title = strings('notifications.speedup_title', {
        nonce: data?.transaction?.nonce || '',
      });
      message = strings('notifications.speedup_message');
      break;
    case 'success_withdrawal':
      title = strings('notifications.success_withdrawal_title');
      message = strings('notifications.success_withdrawal_message');
      break;
    case 'success_deposit':
      title = strings('notifications.success_deposit_title');
      message = strings('notifications.success_deposit_message');
      break;
    case 'error':
      title = strings('notifications.error_title');
      message = strings('notifications.error_message');
      break;
    case 'cancelled':
      title = strings('notifications.cancelled_title');
      message = strings('notifications.cancelled_message');
      break;
    case 'received':
      title = strings('notifications.received_title', {
        amount: data.transaction.amount,
        assetType: data.transaction.assetType,
      });
      message = strings('notifications.received_message');
      break;
    case 'received_payment':
      title = strings('notifications.received_payment_title');
      message = strings('notifications.received_payment_message', {
        amount: data.transaction.amount,
      });
      break;
  }
  return {title, message};
};

/**
 * Singleton class responsible for managing all the
 * related notifications, which could be in-app or push
 * depending on the state of the app
 */
class NotificationManager {
  /**
   * Navigation object from react-navigation
   */
  _navigation;
  /**
   * Array containing the id of the transaction that should be
   * displayed while interacting with a notification
   */
  _transactionToView;
  /**
   * Boolean based on the current state of the app
   */
  _backgroundMode;

  /**
   * Object containing watched transaction ids list by transaction nonce
   */
  _transactionsWatchTable = {};

  _handleAppStateChange = appState => {
    this._backgroundMode = appState === 'background';
  };

  _viewTransaction = id => {
    this._transactionToView.push(id);
    this.goTo('TransactionsHome');
  };

  _removeListeners = transactionId => {};

  _showNotification(data) {
    if (this._backgroundMode) {
      const {title, message} = constructTitleAndMessage(data);

      const pushData = {
        title,
        message,
        largeIcon: 'ic_notification',
        smallIcon: 'ic_notification_small',
      };
      const id = data?.transaction?.id || null;

      const extraData = {action: 'tx', id};
      if (Device.isAndroid()) {
        pushData.tag = JSON.stringify(extraData);
      } else {
        pushData.userInfo = extraData;
      }

      PushNotification.localNotification(pushData);

      if (id) {
        this._transactionToView.push(id);
      }
    } else {
      this._showTransactionNotification({
        autodismiss: data.duration,
        transaction: data.transaction,
        status: data.type,
      });
    }
  }

  _finishedCallback = transactionMeta => {
    // If it fails we hide the pending tx notification
    this._removeNotificationById(transactionMeta.id);
    const transaction =
      this._transactionsWatchTable[transactionMeta.transaction.nonce];
    transaction &&
      transaction.length &&
      setTimeout(() => {
        // Then we show the error notification
        this._showNotification({
          type: transactionMeta.status === 'cancelled' ? 'cancelled' : 'error',
          autoHide: true,
          transaction: {id: transactionMeta.id},
          duration: 5000,
        });
        // Clean up
        this._removeListeners(transactionMeta.id);
        delete this._transactionsWatchTable[transactionMeta.transaction.nonce];
      }, 2000);
  };

  _confirmedCallback = (transactionMeta, originalTransaction) => {
    // Once it's confirmed we hide the pending tx notification
    this._removeNotificationById(transactionMeta.id);
    this._transactionsWatchTable[transactionMeta.transaction.nonce].length &&
      setTimeout(() => {
        // Then we show the success notification
        this._showNotification({
          type: 'success',
          autoHide: true,
          transaction: {
            id: transactionMeta.id,
            nonce: transactionMeta.transaction.nonce,
          },
          duration: 5000,
        });
        // Clean up
        this._removeListeners(transactionMeta.id);

        Device.isIos() &&
          setTimeout(() => {
            this.requestPushNotificationsPermission();
          }, 7000);

        this._removeListeners(transactionMeta.id);
        delete this._transactionsWatchTable[transactionMeta.transaction.nonce];
      }, 2000);
  };

  _speedupCallback = transactionMeta => {
    this.watchSubmittedTransaction(transactionMeta, true);
    setTimeout(() => {
      this._showNotification({
        autoHide: false,
        type: 'speedup',
        transaction: {
          id: transactionMeta.id,
          nonce: transactionMeta.transaction.nonce,
        },
      });
    }, 2000);
  };

  /**
   * Creates a NotificationManager instance
   */
  constructor(
    _navigation,
    _showTransactionNotification,
    _hideTransactionNotification,
    _showSimpleNotification,
    _removeNotificationById,
  ) {
    if (!NotificationManager.instance) {
      this._navigation = _navigation;
      this._showTransactionNotification = _showTransactionNotification;
      this._hideTransactionNotification = _hideTransactionNotification;
      this._showSimpleNotification = _showSimpleNotification;
      this._removeNotificationById = _removeNotificationById;
      this._transactionToView = [];
      this._backgroundMode = false;
      NotificationManager.instance = this;
      AppState.addEventListener('change', this._handleAppStateChange);
    }

    return NotificationManager.instance;
  }

  /**
   * Navigates to a specific view
   */
  goTo(view) {
    this._navigation.navigate(view);
  }

  /**
   * Handles the push notification prompt
   * with a custom set of rules, like max. number of attempts
   */
  requestPushNotificationsPermission = async () => {
    const promptCount = await AsyncStorage.getItem(
      PUSH_NOTIFICATIONS_PROMPT_COUNT,
    );
    if (
      !promptCount ||
      Number(promptCount) < AppConstants.MAX_PUSH_NOTIFICATION_PROMPT_TIMES
    ) {
      PushNotification.checkPermissions(permissions => {
        if (!permissions || !permissions.alert) {
          Alert.alert(
            strings('notifications.prompt_title'),
            strings('notifications.prompt_desc'),
            [
              {
                text: strings('notifications.prompt_cancel'),
                onPress: () => false,
                style: 'default',
              },
              {
                text: strings('notifications.prompt_ok'),
                onPress: () => PushNotification.requestPermissions(),
              },
            ],
            {cancelable: false},
          );

          const times = (promptCount && Number(promptCount) + 1) || 1;
          AsyncStorage.setItem(
            PUSH_NOTIFICATIONS_PROMPT_COUNT,
            times.toString(),
          );
          // In case we want to prompt again after certain time.
          AsyncStorage.setItem(
            PUSH_NOTIFICATIONS_PROMPT_TIME,
            Date.now().toString(),
          );
        }
      });
    }
  };

  /**
   * Returns the id of the transaction that should
   * be displayed and removes it from memory
   */
  getTransactionToView = () => this._transactionToView.pop();

  /**
   * Sets the id of the transaction that should
   * be displayed in memory
   */
  setTransactionToView = id => {
    this._transactionToView.push(id);
  };

  /**
   * Shows a notification with title and description
   */
  showSimpleNotification = data => {
    const id = Date.now();
    this._showSimpleNotification({
      id,
      autodismiss: data.duration,
      title: data.title,
      description: data.description,
      status: data.status,
    });
    return id;
  };

  /**
   * Listen for events of a submitted transaction
   * and generates the corresponding notification
   * based on the status of the transaction (failed or confirmed)
   */
  watchSubmittedTransaction(transaction, speedUp = false) {
    if (transaction.silent) {
      return false;
    }
    const nonce = transaction.transaction.nonce;
    // First we show the pending tx notification if is not an speed up tx
    !speedUp &&
      this._showNotification({
        type: 'pending',
        autoHide: false,
        transaction: {
          id: transaction.id,
        },
      });

    this._transactionsWatchTable[nonce]
      ? this._transactionsWatchTable[nonce].push(transaction.id)
      : (this._transactionsWatchTable[nonce] = [transaction.id]);
  }

  /**
   * Generates a notification for an incoming transaction
   */
  gotIncomingTransaction = async lastBlock => {};
}

let instance;

export default {
  init({
    navigation,
    showTransactionNotification,
    hideCurrentNotification,
    showSimpleNotification,
    removeNotificationById,
  }) {
    instance = new NotificationManager(
      navigation,
      showTransactionNotification,
      hideCurrentNotification,
      showSimpleNotification,
      removeNotificationById,
    );
    return instance;
  },
  watchSubmittedTransaction(transaction) {
    return instance?.watchSubmittedTransaction(transaction);
  },
  getTransactionToView() {
    return instance?.getTransactionToView();
  },
  setTransactionToView(id) {
    return instance?.setTransactionToView(id);
  },
  gotIncomingTransaction(lastBlock) {
    return instance?.gotIncomingTransaction(lastBlock);
  },
  requestPushNotificationsPermission() {
    return instance?.requestPushNotificationsPermission();
  },
  showSimpleNotification(data) {
    return instance?.showSimpleNotification(data);
  },

  showMisesNotification(success) {
    InteractionManager.runAfterInteractions(() => {
      instance?.showSimpleNotification({
        status: success
          ? 'simple_notification'
          : 'simple_notification_rejected',
        duration: 5000,
        title: strings('notifications.mises_sent_tx_title'),
        description: success
          ? strings('notifications.mises_sent_tx_description')
          : strings('notifications.mises_sent_tx_fail_description'),
      });
    });
  },
};
