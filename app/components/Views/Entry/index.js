import React, {useState, useRef, useEffect, useCallback} from 'react';
import {withNavigation} from 'react-navigation';
import PropTypes from 'prop-types';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import {colors} from 'app/styles/common';
import Logger from 'app/util/Logger';
import Device from 'app/util/Device';
import {
  EXISTING_USER,
  CURRENT_APP_VERSION,
  LAST_APP_VERSION,
} from 'app/constants/storage';
import {getVersion} from 'react-native-device-info';

/**
 * Entry Screen that decides which screen to show
 * depending on the state of the user
 * new, existing , logged in or not
 * while showing the fox
 */
const LOGO_SIZE = 175;
const LOGO_PADDING = 25;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white,
  },
  appName: {
    marginTop: 10,
    height: 25,
    width: 170,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    backgroundColor: colors.white,
    paddingTop: 50,
    marginTop:
      Dimensions.get('window').height / 2 - LOGO_SIZE / 2 - LOGO_PADDING,
    height: LOGO_SIZE + LOGO_PADDING * 2,
  },
  foxAndName: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fox: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Entry = props => {
  const [viewToGo, setViewToGo] = useState(null);

  const animation = useRef(null);
  const animationName = useRef(null);
  const opacity = useRef(new Animated.Value(1)).current;

  const onAnimationFinished = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      isInteraction: false,
    }).start(() => {
      if (
        viewToGo &&
        (viewToGo !== 'WalletView' || viewToGo !== 'Onboarding')
      ) {
        props.navigation.navigate(viewToGo);
      } else if (viewToGo === 'Onboarding') {
        props.navigation.navigate('OnboardingRootNav');
      } else {
        props.navigation.navigate('HomeNav');
      }
      Logger.log('animation finish', viewToGo);
    });
  }, [opacity, viewToGo, props.navigation]);

  const animateAndGoTo = useCallback(
    view => {
      setViewToGo(view);
      if (Device.isAndroid()) {
        animation && animation.current
          ? animation.current.play(0, 25)
          : onAnimationFinished();
        animationName && animationName.current && animationName.current.play();
      } else {
        animation && animation.current && animation.current.play();
        animation && animation.current && animationName.current.play();
      }
    },
    [onAnimationFinished],
  );

  const unlockKeychain = useCallback(async () => {
    try {
      props.navigation.navigate('HomeNav');
    } catch (error) {
      Logger.log("Keychain couldn't be accessed", error);
      animateAndGoTo('Login');
    }
  }, [animateAndGoTo, props]);

  useEffect(() => {
    async function startApp() {
      const existingUser = await AsyncStorage.getItem(EXISTING_USER);
      try {
        const currentVersion = await getVersion();
        const savedVersion = await AsyncStorage.getItem(CURRENT_APP_VERSION);
        if (currentVersion !== savedVersion) {
          if (savedVersion) {
            await AsyncStorage.setItem(LAST_APP_VERSION, savedVersion);
          }
          await AsyncStorage.setItem(CURRENT_APP_VERSION, currentVersion);
        }

        const lastVersion = await AsyncStorage.getItem(LAST_APP_VERSION);
        if (!lastVersion) {
          if (existingUser) {
            // Setting last version to first version if user exists and lastVersion does not, to simulate update
            await AsyncStorage.setItem(LAST_APP_VERSION, '0.0.1');
          } else {
            // Setting last version to current version so that it's not treated as an update
            await AsyncStorage.setItem(LAST_APP_VERSION, currentVersion);
          }
        }
      } catch (error) {
        Logger.error(error);
      }

      if (existingUser !== null) {
        unlockKeychain();
      } else {
        animateAndGoTo('HomeNav');
      }
    }

    startApp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAnimations = () => {
    if (!viewToGo) {
      return (
        <LottieView
          style={styles.animation}
          autoPlay
          source={require('app/animations/bounce.json')}
        />
      );
    }

    return (
      <View style={styles.foxAndName}>
        <LottieView
          ref={animation}
          style={styles.animation}
          loop={false}
          source={require('app/animations/fox-in.json')}
          onAnimationFinish={onAnimationFinished}
        />
        <LottieView
          ref={animationName}
          style={styles.appName}
          loop={false}
          source={require('app/animations/wordmark.json')}
        />
      </View>
    );
  };

  return (
    <View style={styles.main}>
      <Animated.View style={[styles.logoWrapper, {opacity}]}>
        <View style={styles.fox}>{renderAnimations()}</View>
      </Animated.View>
    </View>
  );
};

Entry.propTypes = {
  /**
  /* navigation object required to push new views
  */
  navigation: PropTypes.object,
  /**
   * A string that represents the selected address
   */
  selectedAddress: PropTypes.string,
  /**
   * Boolean that determines if the user has set a password before
   */
  passwordSet: PropTypes.bool,
  /**
   * Dispatch set onboarding wizard step
   */
  setOnboardingWizardStep: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => ({
  passwordSet: state.user.passwordSet,
  selectedAddress: '',
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(Entry));
