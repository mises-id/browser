import React, {PureComponent} from 'react';
import {TouchableOpacity, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import ElevatedView from 'react-native-elevated-view';

import {colors} from 'app/styles/common';

import TabCountIcon from '../Tabs/TabCountIcon';

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 14,
    flex: 0,
    borderTopWidth: 0.5,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  iconButton: {
    height: 22,
    width: 22,
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  tabIcon: {
    marginTop: 0,
    width: 22,
    height: 22,
  },
  disabledIcon: {
    color: colors.grey100,
  },
  icon: {
    width: 22,
    height: 22,
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
      <ElevatedView elevation={0} style={styles.bottomBar}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.iconButton}
          testID={'go-back-button'}
          disabled={!canGoBack}>
          <Image
            source={
              !canGoBack
                ? require('app/images/left_no.png')
                : require('app/images/left.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goForward}
          style={styles.iconButton}
          testID={'go-forward-button'}
          disabled={!canGoForward}>
          <Image
            source={
              !canGoForward
                ? require('app/images/right_no.png')
                : require('app/images/right.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showUrlModal}
          style={styles.iconButton}
          testID={'search-button'}>
          <Image
            source={require('app/images/search.png')}
            style={styles.icon}
          />
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
          <Image source={require('app/images/home.png')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleOptions}
          style={styles.iconButton}
          testID={'options-button'}>
          <Image source={require('app/images/more.png')} style={styles.icon} />
        </TouchableOpacity>
      </ElevatedView>
    );
  }
}
