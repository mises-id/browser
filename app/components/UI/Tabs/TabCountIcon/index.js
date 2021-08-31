/*
 * @Author: lmk
 * @Date: 2021-07-05 10:09:07
 * @LastEditTime: 2021-08-29 21:35:08
 * @LastEditors: lmk
 * @Description:
 */
import React, {PureComponent} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {fontStyles} from 'app/styles/common';

const styles = StyleSheet.create({
  tabIcon: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabCount: {
    color: '#333',
    flex: 0,
    lineHeight: 22,
    fontSize: 12,
    textAlign: 'center',
    alignSelf: 'center',
    ...fontStyles.normal,
  },
});

/**
 * PureComponent that renders an icon showing
 * the current number of open tabs
 */
class TabCountIcon extends PureComponent {
  static propTypes = {
    /**
     * Switches to a specific tab
     */
    tabCount: PropTypes.number,
    /**
     * PureComponent styles
     */
    style: PropTypes.any,
  };

  render() {
    const {tabCount, style} = this.props;

    return (
      <View style={[styles.tabIcon, style]}>
        <Text styles={styles.tabCount}>{tabCount}</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  tabCount: state.browser.tabs.length,
});

export default connect(mapStateToProps)(TabCountIcon);
