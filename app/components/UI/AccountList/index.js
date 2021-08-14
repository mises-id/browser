import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  Alert,
  ActivityIndicator,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import {colors, fontStyles} from 'app/styles/common';
import Device from 'app/util/Device';
import {strings} from 'app/locales/i18n';
import Logger from 'app/util/Logger';
import Analytics from 'app/core/Analytics';
import {ANALYTICS_EVENT_OPTS} from 'app/util/analytics';
import {randomUser} from 'app/actions/user';

import AccountElement from './AccountElement';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 450,
  },
  titleWrapper: {
    width: '100%',
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grey100,
  },
  dragger: {
    width: 48,
    height: 5,
    borderRadius: 4,
    backgroundColor: colors.grey400,
    opacity: Device.isAndroid() ? 0.6 : 0.5,
  },
  accountsWrapper: {
    flex: 1,
  },
  footer: {
    height: Device.isIphoneX() ? 140 : 110,
    paddingBottom: Device.isIphoneX() ? 30 : 0,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 14,
    color: colors.blue,
    ...fontStyles.normal,
  },
  footerButton: {
    width: '100%',
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.grey100,
  },
});

/**
 * View that contains the list of all the available accounts
 */
class AccountList extends PureComponent {
  static propTypes = {
    /**
     * Map of accounts to information objects including balances
     */
    accounts: PropTypes.object,
    /**
     * An object containing each identity in the format address => account
     */
    identities: PropTypes.object,
    /**
     * A string representing the selected address => account
     */
    selectedAddress: PropTypes.string,
    /**
     * An object containing all the keyrings
     */
    keyrings: PropTypes.array,
    /**
     * function to be called when switching accounts
     */
    onAccountChange: PropTypes.func,
    /**
     * function to be called when importing an account
     */
    onImportAccount: PropTypes.func,
    /**
     * Current provider ticker
     */
    ticker: PropTypes.string,
    /**
     * Whether it will show options to create or import accounts
     */
    enableAccountsAddition: PropTypes.bool,
    /**
     * function to generate an error string based on a passed balance
     */
    getBalanceError: PropTypes.func,
    /**
     * Indicates whether third party API mode is enabled
     */
    thirdPartyApiMode: PropTypes.bool,

    randomUser: PropTypes.func,
  };

  state = {
    selectedAccountIndex: 0,
    loading: false,
    orderedAccounts: {},
  };

  flatList = React.createRef();
  lastPosition = 0;
  updating = false;

  getInitialSelectedAccountIndex = () => {
    const {identities, selectedAddress} = this.props;
    Object.keys(identities).forEach((address, i) => {
      if (selectedAddress === address) {
        this.mounted && this.setState({selectedAccountIndex: i});
      }
    });
  };
  getOrderedAccounts = () => {
    const orderedAccounts = this.getAccounts();
    InteractionManager.runAfterInteractions(() => {
      if (orderedAccounts.length > 4) {
        this.scrollToCurrentAccount();
      }
    });
    this.mounted && this.setState({orderedAccounts});
  };
  componentDidMount() {
    this.mounted = true;
    this.getInitialSelectedAccountIndex();
    this.getOrderedAccounts();
  }

  componentWillUnmount = () => {
    this.mounted = false;
  };

  scrollToCurrentAccount() {
    this.flatList?.current?.scrollToIndex({
      index: this.state.selectedAccountIndex,
      animated: true,
    });
  }

  onAccountChange = async newIndex => {
    const previousIndex = this.state.selectedAccountIndex;
    const {keyrings} = this.props;

    requestAnimationFrame(async () => {
      try {
        this.mounted && this.setState({selectedAccountIndex: newIndex});

        const allKeyrings = keyrings;
        const accountsOrdered = allKeyrings.reduce(
          (list, keyring) => list.concat(keyring.accounts),
          [],
        );

        // If not enabled is used from address book so we don't change accounts
        if (!this.props.enableAccountsAddition) {
          this.props.onAccountChange(accountsOrdered[newIndex]);
          const orderedAccounts = this.getAccounts();
          this.mounted && this.setState({orderedAccounts});
          return;
        }

        this.props.onAccountChange();

        this.props.thirdPartyApiMode &&
          InteractionManager.runAfterInteractions(async () => {
            setTimeout(() => {}, 1000);
          });
      } catch (e) {
        // Restore to the previous index in case anything goes wrong
        this.mounted && this.setState({selectedAccountIndex: previousIndex});
        Logger.error(e, 'error while trying change the selected account');
      }
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_SWITCHED_ACCOUNTS);
        }, 1000);
      });
      const orderedAccounts = this.getAccounts();
      this.mounted && this.setState({orderedAccounts});
    });
  };

  importAccount = () => {
    this.props.onImportAccount();
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_IMPORTED_NEW_ACCOUNT);
    });
  };

  addAccount = async () => {
    if (this.state.loading) {
      return;
    }
    this.mounted && this.setState({loading: true});
    requestAnimationFrame(async () => {
      try {
        this.props.randomUser();
        const newIndex = Object.keys(this.props.identities).length - 1;
        this.mounted && this.setState({selectedAccountIndex: newIndex});
        setTimeout(() => {
          this.flatList &&
            this.flatList.current &&
            this.flatList.current.scrollToEnd();
          this.mounted && this.setState({loading: false});
        }, 500);
        const orderedAccounts = this.getAccounts();
        this.mounted && this.setState({orderedAccounts});
      } catch (e) {
        // Restore to the previous index in case anything goes wrong
        Logger.error(e, 'error while trying to add a new account');
        this.mounted && this.setState({loading: false});
      }
    });
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.ACCOUNTS_ADDED_NEW_ACCOUNT);
    });
  };

  isImported(allKeyrings, address) {
    let ret = false;
    for (const keyring of allKeyrings) {
      if (keyring.accounts.includes(address)) {
        ret = keyring.type !== 'HD Key Tree';
        break;
      }
    }

    return ret;
  }

  onLongPress = (address, imported, index) => {
    if (!imported) {
      return;
    }
    Alert.alert(
      strings('accounts.remove_account_title'),
      strings('accounts.remove_account_message'),
      [
        {
          text: strings('accounts.no'),
          onPress: () => false,
          style: 'cancel',
        },
        {
          text: strings('accounts.yes_remove_it'),
          onPress: async () => {
            // Default to the previous account in the list
            this.onAccountChange(index - 1);
          },
        },
      ],
      {cancelable: false},
    );
  };

  renderItem = ({item}) => {
    const {ticker} = this.props;
    return (
      <AccountElement
        onPress={this.onAccountChange}
        onLongPress={this.onLongPress}
        item={item}
        ticker={ticker}
        disabled={Boolean(item.balanceError)}
      />
    );
  };

  getAccounts() {
    const {accounts, identities, selectedAddress, keyrings, getBalanceError} =
      this.props;
    const allKeyrings = keyrings;

    const accountsOrdered = allKeyrings.reduce(
      (list, keyring) => list.concat(keyring.accounts),
      [],
    );
    return accountsOrdered
      .filter(address => !!identities[address])
      .map((addr, index) => {
        const checksummedAddress = addr;
        const identity = identities[checksummedAddress];
        const {name, address} = identity;
        const identityAddressChecksummed = address;
        const isSelected = identityAddressChecksummed === selectedAddress;
        const isImported = this.isImported(
          allKeyrings,
          identityAddressChecksummed,
        );
        let balance = 0x0;
        if (accounts[identityAddressChecksummed]) {
          balance = accounts[identityAddressChecksummed].balance;
        }

        const balanceError = getBalanceError ? getBalanceError(balance) : null;
        return {
          index,
          name,
          address: identityAddressChecksummed,
          balance,
          isSelected,
          isImported,
          balanceError,
        };
      });
  }

  keyExtractor = item => item.address;

  render() {
    const {orderedAccounts} = this.state;
    const {enableAccountsAddition} = this.props;
    return (
      <SafeAreaView style={styles.wrapper} testID={'account-list'}>
        <View style={styles.titleWrapper}>
          <View style={styles.dragger} testID={'account-list-dragger'} />
        </View>
        <FlatList
          data={orderedAccounts}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          ref={this.flatList}
          style={styles.accountsWrapper}
          testID={'account-number-button'}
          getItemLayout={(_, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
        />
        {enableAccountsAddition && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              testID={'create-account-button'}
              onPress={this.addAccount}>
              {this.state.loading ? (
                <ActivityIndicator size="small" color={colors.blue} />
              ) : (
                <Text style={styles.btnText}>
                  {strings('accounts.create_new_account')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.importAccount}
              style={styles.footerButton}
              testID={'import-account-button'}>
              <Text style={styles.btnText}>
                {strings('accounts.import_account')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.user.accounts,
  keyrings: state.user.keyrings,
});

const mapDispatchToProps = dispatch => ({
  randomUser: () => dispatch(randomUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
