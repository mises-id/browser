import React, {PureComponent} from 'react';
import {TouchableOpacity, StyleSheet,Image} from 'react-native';
import PropTypes from 'prop-types';
import ElevatedView from 'react-native-elevated-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';

import Device from 'app/util/Device';
import {colors} from 'app/styles/common';

import TabCountIcon from '../Tabs/TabCountIcon';

const HOME_INDICATOR_HEIGHT = 18;
const defaultBottomBarPadding = 0;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: Device.isAndroid() ? colors.white : colors.grey000,
    flexDirection: 'row',
    paddingBottom:
      Device.isIphoneX() && Device.isIos()
        ? defaultBottomBarPadding + HOME_INDICATOR_HEIGHT
        : defaultBottomBarPadding,
    flex: 0,
    borderTopWidth: Device.isAndroid() ? 0 : StyleSheet.hairlineWidth,
    borderColor: colors.grey200,
    justifyContent: 'space-between',
  },
  iconButton: {
    height: 24,
    width: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
  },
  tabIcon: {
    marginTop: 0,
    width: 24,
    height: 24,
  },
  disabledIcon: {
    color: colors.grey100,
  },
  icon: {
    width: 24,
    height: 24
  },
});

/**
 * Browser bottom bar that contains icons for navigatio
 * tab management, url change and other options
 */
export default class BrowserBottomBar extends PureComponent {
  static propTypes = {
    /**
     * Boolean that determines if you can navigate back
     */
    canGoBack: PropTypes.bool,
    /**
     * Boolean that determines if you can navigate forward
     */
    canGoForward: PropTypes.bool,
    /**
     * Function that allows you to navigate back
     */
    goBack: PropTypes.func,
    /**
     * Function that allows you to navigate forward
     */
    goForward: PropTypes.func,
    /**
     * Function that triggers the tabs view
     */
    showTabs: PropTypes.func,
    /**
     * Function that triggers the change url modal view
     */
    showUrlModal: PropTypes.func,
    /**
     * Function that redirects to the home screen
     */
    goHome: PropTypes.func,
    /**
     * Function that toggles the options menu
     */
    toggleOptions: PropTypes.func,
  };

  render() {
    const {
      canGoBack,
      goBack,
      canGoForward,
      goForward,
      showTabs,
      goHome,
      showUrlModal,
      toggleOptions,
    } = this.props;

    return (
      <ElevatedView elevation={11} style={styles.bottomBar}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.iconButton}
          testID={'go-back-button'}
          disabled={!canGoBack}>
          <Image source={!canGoBack ? require('app/images/left_no.png') : require('app/images/left.png')} style={styles.icon}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goForward}
          style={styles.iconButton}
          testID={'go-forward-button'}
          disabled={!canGoForward}>
          <Image source={!canGoForward ? require('app/images/right_no.png') : require('app/images/right.png')} style={styles.icon}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showUrlModal}
          style={styles.iconButton}
          testID={'search-button'}>
          <Image source={require('app/images/search.png')} style={styles.icon}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showTabs}
          style={styles.iconButton}
          testID={'show-tabs-button'}>
          <TabCountIcon style={styles.tabIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goHome}
          style={styles.iconButton}
          testID={'home-button'}>
          <Image source={require('app/images/home.png')} style={styles.icon}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleOptions}
          style={styles.iconButton}
          testID={'options-button'}>
          <Image source={require('app/images/more.png')} style={styles.icon}></Image>
        </TouchableOpacity>
      </ElevatedView>
    );
  }
}
