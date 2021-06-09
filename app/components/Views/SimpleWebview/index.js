import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import Share from 'react-native-share';

import Logger from 'app/util/Logger';
import {baseStyles} from 'app/styles/common';

import {getWebviewNavbar} from '../../UI/Navbar';

export default class SimpleWebview extends PureComponent {
  static navigationOptions = ({navigation}) => getWebviewNavbar(navigation);

  static propTypes = {
    /**
     * react-navigation object used to switch between screens
     */
    navigation: PropTypes.object,
  };

  componentDidMount = () => {
    const {navigation} = this.props;
    navigation && navigation.setParams({dispatch: this.share});
  };

  share = () => {
    const {navigation} = this.props;
    const url = navigation && navigation.getParam('url', null);
    if (url) {
      Share.open({
        url,
      }).catch(err => {
        Logger.log('Error while trying to share simple web view', err);
      });
    }
  };

  render() {
    const uri = this.props.navigation.getParam('url', null);
    if (uri) {
      return (
        <View style={baseStyles.flexGrow}>
          <WebView source={{uri}} />
        </View>
      );
    }
  }
}
