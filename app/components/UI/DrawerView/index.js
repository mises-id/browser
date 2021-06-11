import React, {PureComponent} from 'react';
import {
  Alert,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  InteractionManager,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrawerActions} from 'react-navigation-drawer';
import Modal from 'react-native-modal';

import {colors, fontStyles} from 'app/styles/common';
import {strings} from 'app/locales/i18n';
import {showAlert} from 'app/actions/alert';
import {toggleAccountsModal} from '../../../actions/modals';

import Device from 'app/util/Device';
import {ANALYTICS_EVENT_OPTS} from 'app/util/analytics';
import {
  findBottomTabRouteNameFromNavigatorState,
  findRouteNameFromNavigatorState,
} from 'app/util/general';
import Analytics from 'app/core/Analytics';
import DeeplinkManager from 'app/core/DeeplinkManager';
import {AppConstants} from 'app/constants/core';

import Identicon from '../Identicon';
import StyledButton from '../StyledButton';
import AccountList from '../AccountList';
import SettingsNotification from '../SettingsNotification';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingTop: Device.isIphoneX() ? 60 : 24,
    backgroundColor: colors.grey000,
    height: Device.isIphoneX() ? 110 : 74,
    flexDirection: 'column',
    paddingBottom: 0,
  },
  Logo: {
    flexDirection: 'row',
    flex: 1,
    marginTop: Device.isAndroid() ? 0 : 12,
    marginLeft: 15,
    paddingTop: Device.isAndroid() ? 10 : 0,
  },
  Icon: {
    height: 27,
    width: 27,
    marginRight: 15,
  },
  Name: {
    marginTop: 4,
    width: 90,
    height: 18,
  },
  account: {
    flex: 1,
    backgroundColor: colors.grey000,
  },
  accountBgOverlay: {
    borderBottomColor: colors.grey100,
    borderBottomWidth: 1,
    padding: 17,
  },
  identiconWrapper: {
    marginBottom: 12,
    width: 56,
    height: 56,
  },
  identiconBorder: {
    borderRadius: 96,
    borderWidth: 2,
    padding: 2,
    borderColor: colors.blue,
  },
  accountNameWrapper: {
    flexDirection: 'row',
    paddingRight: 17,
  },
  accountName: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 5,
    color: colors.fontPrimary,
    ...fontStyles.normal,
  },
  caretDown: {
    textAlign: 'right',
    marginLeft: 7,
    marginTop: 3,
    fontSize: 18,
    color: colors.fontPrimary,
  },
  accountBalance: {
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 5,
    color: colors.fontPrimary,
    ...fontStyles.normal,
  },
  accountAddress: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.fontSecondary,
    ...fontStyles.normal,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.grey100,
    borderBottomWidth: 1,
    padding: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1.5,
  },
  leftButton: {
    marginRight: 5,
  },
  rightButton: {
    marginLeft: 5,
  },
  buttonText: {
    paddingLeft: 8,
    fontSize: 15,
    color: colors.blue,
    ...fontStyles.normal,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginTop: 0,
  },
  buttonReceive: {
    transform: [{rotate: '90deg'}],
  },
  menu: {},
  noTopBorder: {
    borderTopWidth: 0,
  },
  menuSection: {
    borderTopWidth: 1,
    borderColor: colors.grey100,
    paddingVertical: 10,
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 9,
    paddingLeft: 17,
  },
  selectedRoute: {
    backgroundColor: colors.blue000,
    marginRight: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  selectedName: {
    color: colors.blue,
  },
  menuItemName: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 2,
    fontSize: 16,
    color: colors.grey400,
    ...fontStyles.normal,
  },
  menuItemWarningText: {
    color: colors.red,
    fontSize: 12,
    ...fontStyles.normal,
  },
  noIcon: {
    paddingLeft: 0,
  },
  menuItemIconImage: {
    width: 22,
    height: 22,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  importedWrapper: {
    marginTop: 10,
    width: 73,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey400,
  },
  importedText: {
    color: colors.grey400,
    fontSize: 10,
    ...fontStyles.bold,
  },
  protectWalletContainer: {
    backgroundColor: colors.white,
    paddingTop: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingBottom: Device.isIphoneX() ? 20 : 0,
    paddingHorizontal: 40,
  },
  protectWalletIconContainer: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.red000,
    borderColor: colors.red,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  protectWalletIcon: {alignSelf: 'center', color: colors.red},
  protectWalletTitle: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 8,
    ...fontStyles.bold,
  },
  protectWalletContent: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 8,
    justifyContent: 'center',
    ...fontStyles.normal,
  },
  protectWalletButtonWrapper: {marginVertical: 8},
});

const app_name = require('app/images/app-name.png');
const app_icon = require('app/images/app-icon.png');

/**
 * View component that displays the App Icon
 * in the middle of the screen
 */
class DrawerView extends PureComponent {
  static propTypes = {
    /**
    /* navigation object required to push new views
    */
    navigation: PropTypes.object,
    /**
     * Selected address as string
     */
    selectedAddress: PropTypes.string,
    /**
     * List of accounts from the AccountTrackerController
     */
    accounts: PropTypes.object,
    /**
     * List of accounts from the PreferencesController
     */
    identities: PropTypes.object,
    /**
    /* Selected currency
    */
    currentCurrency: PropTypes.string,
    /**
     * List of keyrings
     */
    keyrings: PropTypes.array,
    /**
     * Action that toggles the network modal
     */
    toggleNetworkModal: PropTypes.func,
    /**
     * Action that toggles the accounts modal
     */
    toggleAccountsModal: PropTypes.func,
    /**
     * Action that toggles the receive modal
     */
    toggleReceiveModal: PropTypes.func,
    /**
     * Action that shows the global alert
     */
    showAlert: PropTypes.func.isRequired,
    /**
     * Boolean that determines the status of the networks modal
     */
    networkModalVisible: PropTypes.bool.isRequired,
    /**
     * Boolean that determines the status of the receive modal
     */
    receiveModalVisible: PropTypes.bool.isRequired,
    /**
     * Boolean that determines the status of the networks modal
     */
    accountsModalVisible: PropTypes.bool.isRequired,
    /**
     * Boolean that determines if the user has set a password before
     */
    passwordSet: PropTypes.bool,
    /**
     * Wizard onboarding state
     */
    wizard: PropTypes.object,
    /**
     * Chain Id
     */
    chainId: PropTypes.string,
    /**
     * Current provider ticker
     */
    ticker: PropTypes.string,
    /**
     * Frequent RPC list from PreferencesController
     */
    frequentRpcList: PropTypes.array,
    /**
     * Array of ERC20 assets
     */
    tokens: PropTypes.array,
    /**
     * Array of ERC721 assets
     */
    collectibles: PropTypes.array,
    /**
     * redux flag that indicates if the user
     * completed the seed phrase backup flow
     */
    seedphraseBackedUp: PropTypes.bool,
    /**
     * An object containing token balances for current account and network in the format address => balance
     */
    tokenBalances: PropTypes.object,
    /**
     * Prompts protect wallet modal
     */
    protectWalletModalVisible: PropTypes.func,
  };

  state = {
    showProtectWalletModal: undefined,
  };

  browserSectionRef = React.createRef();

  currentBalance = null;
  previousBalance = null;
  processedNewBalance = false;
  animatingNetworksModal = false;
  animatingAccountsModal = false;

  isCurrentAccountImported() {
    let ret = false;

    return ret;
  }

  componentDidUpdate() {
    const route = findRouteNameFromNavigatorState(this.props.navigation.state);
    if (!this.props.passwordSet || !this.props.seedphraseBackedUp) {
      const bottomTab = findBottomTabRouteNameFromNavigatorState(
        this.props.navigation.state,
      );
      if (['SetPasswordFlow', 'Webview', 'LockScreen'].includes(bottomTab)) {
        return;
      }
      let tokenFound = false;

      if (
        !this.props.passwordSet ||
        this.currentBalance > 0 ||
        tokenFound ||
        this.props.collectibles.length > 0
      ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({showProtectWalletModal: true});
      } else {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({showProtectWalletModal: false});
      }
    } else {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({showProtectWalletModal: false});
    }
    const pendingDeeplink = DeeplinkManager.getPendingDeeplink();
    if (pendingDeeplink && route !== 'LockScreen') {
      DeeplinkManager.expireDeeplink();
      DeeplinkManager.parse(pendingDeeplink, {
        origin: AppConstants.DEEPLINKS.ORIGIN_DEEPLINK,
      });
    }
  }

  toggleAccountsModal = () => {
    if (!this.animatingAccountsModal) {
      this.animatingAccountsModal = true;
      this.props.toggleAccountsModal();
      setTimeout(() => {
        this.animatingAccountsModal = false;
      }, 500);
    }
    !this.props.accountsModalVisible &&
      this.trackEvent(ANALYTICS_EVENT_OPTS.NAVIGATION_TAPS_ACCOUNT_NAME);
  };

  trackEvent = event => {
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(event);
    });
  };

  goToBrowser = () => {
    this.props.navigation.navigate('BrowserTabHome');
    this.hideDrawer();
    this.trackEvent(ANALYTICS_EVENT_OPTS.NAVIGATION_TAPS_BROWSER);
  };

  showSettings = async () => {
    this.props.navigation.navigate('SettingsView');
    this.hideDrawer();
    this.trackEvent(ANALYTICS_EVENT_OPTS.NAVIGATION_TAPS_SETTINGS);
  };

  onPress = async () => {
    const {passwordSet} = this.props;
    if (!passwordSet) {
      this.props.navigation.navigate('Onboarding');
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  logout = () => {
    Alert.alert(
      strings('drawer.logout_title'),
      '',
      [
        {
          text: strings('drawer.logout_cancel'),
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: strings('drawer.logout_ok'),
          onPress: this.onPress,
        },
      ],
      {cancelable: false},
    );
    this.trackEvent(ANALYTICS_EVENT_OPTS.NAVIGATION_TAPS_LOGOUT);
  };

  showHelp = () => {
    this.goToBrowserUrl(
      'https://support.mises.site',
      strings('drawer.mises_support'),
    );
    this.trackEvent(ANALYTICS_EVENT_OPTS.NAVIGATION_TAPS_GET_HELP);
  };

  goToBrowserUrl(url, title) {
    this.props.navigation.navigate('Webview', {
      url,
      title,
    });
    this.hideDrawer();
  }

  hideDrawer() {
    return new Promise(resolve => {
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  onAccountChange = () => {
    setTimeout(() => {
      this.toggleAccountsModal();
      this.hideDrawer();
    }, 300);
  };

  onImportAccount = () => {
    this.toggleAccountsModal();
    this.props.navigation.navigate('ImportPrivateKey');
    this.hideDrawer();
  };

  getIcon(name, size) {
    return <Icon name={name} size={size || 24} color={colors.grey400} />;
  }

  getFeatherIcon(name, size) {
    return <FeatherIcon name={name} size={size || 24} color={colors.grey400} />;
  }

  getMaterialIcon(name, size) {
    return (
      <MaterialIcon name={name} size={size || 24} color={colors.grey400} />
    );
  }

  getImageIcon(name) {
    return <Image source={name} style={styles.menuItemIconImage} />;
  }

  getSelectedIcon(name, size) {
    return <Icon name={name} size={size || 24} color={colors.blue} />;
  }

  getSelectedFeatherIcon(name, size) {
    return <FeatherIcon name={name} size={size || 24} color={colors.blue} />;
  }

  getSelectedMaterialIcon(name, size) {
    return <MaterialIcon name={name} size={size || 24} color={colors.blue} />;
  }

  getSelectedImageIcon(name) {
    return (
      <Image source={`selected-${name}`} style={styles.menuItemIconImage} />
    );
  }

  getSections = () => {
    return [
      [
        {
          name: strings('drawer.browser'),
          icon: this.getIcon('globe'),
          selectedIcon: this.getSelectedIcon('globe'),
          action: this.goToBrowser,
          routeNames: ['BrowserView', 'AddBookmark'],
        },
        {
          name: strings('drawer.settings'),
          icon: this.getFeatherIcon('settings'),
          warning: strings('drawer.settings_warning_short'),
          action: this.showSettings,
        },
        {
          name: strings('drawer.help'),
          icon: this.getFeatherIcon('help-circle'),
          action: this.showHelp,
        },
        {
          name: strings('drawer.logout'),
          icon: this.getFeatherIcon('log-out'),
          action: this.logout,
        },
      ],
    ];
  };

  copyAccountToClipboard = async () => {
    const {selectedAddress} = this.props;
    await Clipboard.setString(selectedAddress);
    this.toggleReceiveModal();
    InteractionManager.runAfterInteractions(() => {
      this.props.showAlert({
        isVisible: true,
        autodismiss: 1500,
        content: 'clipboard-alert',
        data: {msg: strings('account_details.account_copied_to_clipboard')},
      });
    });
  };

  render() {
    const {
      network,
      accounts,
      identities,
      selectedAddress,
      keyrings,
      ticker,
      seedphraseBackedUp,
    } = this.props;

    const account = {
      address: selectedAddress,
    };
    const currentRoute = findRouteNameFromNavigatorState(
      this.props.navigation.state,
    );
    return (
      <View style={styles.wrapper} testID={'drawer-screen'}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.Logo}>
              <Image
                source={app_icon}
                style={styles.Icon}
                resizeMethod={'auto'}
              />
              <Image
                source={app_name}
                style={styles.Name}
                resizeMethod={'auto'}
              />
            </View>
          </View>
          <View style={styles.account}>
            <View style={styles.accountBgOverlay}>
              <TouchableOpacity
                style={styles.identiconWrapper}
                onPress={this.toggleAccountsModal}
                testID={'navbar-account-identicon'}>
                <View style={styles.identiconBorder}>
                  <Identicon diameter={48} address={selectedAddress} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.accountInfo}
                onPress={this.toggleAccountsModal}
                testID={'navbar-account-button'}>
                <View style={styles.accountNameWrapper}>
                  <Text style={styles.accountName} numberOfLines={1}>
                    {account.name}
                  </Text>
                  <Icon name="caret-down" size={24} style={styles.caretDown} />
                </View>
                {this.isCurrentAccountImported() && (
                  <View style={styles.importedWrapper}>
                    <Text numberOfLines={1} style={styles.importedText}>
                      {strings('accounts.imported')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menu}>
            {this.getSections().map(
              (section, i) =>
                section?.length > 0 && (
                  <View
                    key={`section_${i}`}
                    style={[
                      styles.menuSection,
                      i === 0 ? styles.noTopBorder : null,
                    ]}>
                    {section
                      .filter(item => {
                        if (!item) {
                          return undefined;
                        }
                        const {name = undefined} = item;
                        if (
                          name &&
                          name.toLowerCase().indexOf('etherscan') !== -1
                        ) {
                          const type = network.provider?.type;
                          return (
                            (type && this.hasBlockExplorer(type)) || undefined
                          );
                        }
                        return true;
                      })
                      .map((item, j) => (
                        <TouchableOpacity
                          key={`item_${i}_${j}`}
                          style={[
                            styles.menuItem,
                            item.routeNames &&
                            item.routeNames.includes(currentRoute)
                              ? styles.selectedRoute
                              : null,
                          ]}
                          ref={
                            item.name === strings('drawer.browser') &&
                            this.browserSectionRef
                          }
                          onPress={() => item.action()}>
                          {item.icon
                            ? item.routeNames &&
                              item.routeNames.includes(currentRoute)
                              ? item.selectedIcon
                              : item.icon
                            : null}
                          <Text
                            style={[
                              styles.menuItemName,
                              !item.icon ? styles.noIcon : null,
                              item.routeNames &&
                              item.routeNames.includes(currentRoute)
                                ? styles.selectedName
                                : null,
                            ]}
                            numberOfLines={1}>
                            {item.name}
                          </Text>
                          {!seedphraseBackedUp && item.warning ? (
                            <SettingsNotification isNotification isWarning>
                              <Text style={styles.menuItemWarningText}>
                                {item.warning}
                              </Text>
                            </SettingsNotification>
                          ) : null}
                        </TouchableOpacity>
                      ))}
                  </View>
                ),
            )}
          </View>
        </ScrollView>
        <Modal
          isVisible={this.props.accountsModalVisible}
          style={styles.bottomModal}
          onBackdropPress={this.toggleAccountsModal}
          onBackButtonPress={this.toggleAccountsModal}
          onSwipeComplete={this.toggleAccountsModal}
          swipeDirection={'down'}
          propagateSwipe>
          <AccountList
            enableAccountsAddition
            identities={identities}
            selectedAddress={selectedAddress}
            keyrings={keyrings}
            onAccountChange={this.onAccountChange}
            onImportAccount={this.onImportAccount}
            ticker={ticker}
          />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  selectedAddress: state.user.selectedAddress,
  accounts: state.user.accounts,
  identities: state.user.identities,
  keyrings: state.user.keyrings,
  networkModalVisible: state.modals.networkModalVisible,
  accountsModalVisible: state.modals.accountsModalVisible,
  receiveModalVisible: state.modals.receiveModalVisible,
  passwordSet: state.user.passwordSet,
  wizard: state.wizard,
  seedphraseBackedUp: state.user.seedphraseBackedUp,
});

const mapDispatchToProps = dispatch => ({
  toggleAccountsModal: () => dispatch(toggleAccountsModal()),
  showAlert: config => dispatch(showAlert(config)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerView);
