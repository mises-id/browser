/*
 * @Author: lmk
 * @Date: 2021-07-05 10:09:07
 * @LastEditTime: 2021-08-14 18:37:29
 * @LastEditors: lmk
 * @Description:
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Image, View, ViewPropTypes} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
import Jazzicon from 'react-native-jazzicon';
import {connect} from 'react-redux';

import {colors} from 'app/styles/common.js';
import {toDataUrl} from 'app/util/blockies.js';

/**
 * UI component that renders an Identicon
 * for now it's just a blockie
 * but we could add more types in the future
 */

const Identicon = React.memo(props => {
  const {diameter, address, customStyle, noFadeIn, useBlockieIcon} = props;
  if (!address) {
    return null;
  }
  const uri = useBlockieIcon && toDataUrl(address);
  const image = useBlockieIcon ? (
    <Image
      source={{uri}}
      style={[
        {
          height: diameter,
          width: diameter,
          borderRadius: diameter / 2,
        },
        customStyle,
      ]}
    />
  ) : (
    <View style={customStyle}>
      <Jazzicon size={diameter} address={address} />
    </View>
  );

  if (noFadeIn) {
    return image;
  }
  return (
    <FadeIn placeholderStyle={{backgroundColor: colors.white}}>{image}</FadeIn>
  );
});

Identicon.propTypes = {
  /**
   * Diameter that represents the size of the identicon
   */
  diameter: PropTypes.number,
  /**
   * Address used to render a specific identicon
   */
  address: PropTypes.string,
  /**
   * Custom style to apply to image
   */
  customStyle: ViewPropTypes.style,
  /**
   * True if render is happening without fade in
   */
  noFadeIn: PropTypes.bool,
  /**
   * Show a BlockieIcon instead of JazzIcon
   */
  useBlockieIcon: PropTypes.bool,
};

Identicon.defaultProps = {
  diameter: 46,
  useBlockieIcon: true,
};

const mapStateToProps = state => ({
  useBlockieIcon: state.settings.useBlockieIcon,
});

export default connect(mapStateToProps)(Identicon);
