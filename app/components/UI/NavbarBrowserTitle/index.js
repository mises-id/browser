import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TouchableOpacity, View, StyleSheet, Text, Image} from 'react-native';

import {colors, fontStyles} from 'app/styles/common';
import Device from 'app/util/Device';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#EEEEEE',
    height: 40,
    position: 'relative',
    borderRadius: 20,
    flexDirection: 'row',
  },
  network: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  networkName: {
    marginTop: -3,
    fontSize: 11,
    lineHeight: 11,
    color: colors.fontSecondary,
    ...fontStyles.normal,
  },
  networkIcon: {
    width: 5,
    height: 5,
    borderRadius: 100,
    marginRight: 5,
  },
  currentUrlWrapper: {
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    flex: 1,
  },
  refreshIcon: {
    width: 16,
    height: 18,
  },
  refresh: {
    position: 'absolute',
    right: 15,
    top: 0,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentUrl: {
    ...fontStyles.normal,
    fontSize: 17,
    textAlign: 'center',
    color: '#333',
  },
  currentUrlAndroid: {
    maxWidth: '60%',
  },
  siteIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  flex1: {
    flex: 1,
  },
});

/**
 * UI PureComponent that renders inside the navbar
 * showing the view title and the selected network
 */
class NavbarBrowserTitle extends PureComponent {
  static propTypes = {
    /**
     * Object representing the navigator
     */
    navigation: PropTypes.object,
    /**
     * String representing the current url
     */
    url: PropTypes.string,
    /**
     * Object representing the selected the selected network
     */
    network: PropTypes.object.isRequired,
    /**
     * hostname of the current webview
     */
    hostname: PropTypes.string.isRequired,
    /**
     * Boolean that specifies if it is a secure website
     */
    https: PropTypes.bool,
    /**
     * Boolean that specifies if there is an error
     */
    error: PropTypes.bool,
    /**
     * Website icon
     */
    icon: PropTypes.string,
    /**
     * Website webviewRef
     */
    webviewRef: PropTypes.object,
  };

  onTitlePress = () => {
    const showUrlModal = this.props.navigation.getParam(
      'showUrlModal',
      () => null,
    );
    showUrlModal({urlInput: this.props.url});
  };

  getNetworkName(network) {
    let name = null;

    if (network && network.provider) {
      if (network.provider.nickname) {
        name = network.provider.nickname;
      } else if (network.provider.type) {
      }
    }

    return name;
  }
  //onload webviewpage
  reloadWebview = () => {
    const {current} = this.props.webviewRef;
    current && current.reload();
  };
  render = () => {
    const {hostname} = this.props;
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={this.onTitlePress} style={styles.flex1}>
          <View style={styles.currentUrlWrapper}>
            {/* {icon && <Image style={styles.siteIcon} source={{uri: icon}} />} */}
            <Text
              numberOfLines={1}
              ellipsizeMode={'head'}
              style={[
                styles.currentUrl,
                Device.isAndroid() ? styles.currentUrlAndroid : {},
              ]}>
              {hostname}
            </Text>
            {/* {https && !error ? (
              <Icon name="lock" size={14} style={styles.lockIcon} />
            ) : null} */}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.reloadWebview} style={styles.refresh}>
          <Image
            source={require('app/images/refresh.png')}
            style={styles.refreshIcon}
          />
        </TouchableOpacity>
        {/* <View style={styles.network}>
          <View
            style={[styles.networkIcon, {backgroundColor: color || colors.red}]}
          />
          <Text style={styles.networkName} testID={'navbar-title-network'}>
            {name}
          </Text>
        </View> */}
      </View>
    );
  };
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(NavbarBrowserTitle);
