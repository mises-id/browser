/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  BackHandler,
  InteractionManager,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {withNavigation} from '@react-navigation/compat';
import {WebView} from 'react-native-webview';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';
import {isEmulatorSync} from 'react-native-device-info';
import URL from 'url-parse';
import Modal from 'react-native-modal';
import {colors, baseStyles, fontStyles} from 'app/styles/common';
import Logger from 'app/util/Logger';
import onUrlSubmit, {getUrlObj} from 'app/util/browser';
import {JS_DESELECT_TEXT, JS_WEBVIEW_URL} from 'app/util/browserScripts';
import {strings} from 'app/locales/i18n';
import {addBookmark, removeBookmark} from 'app/actions/bookmarks';
import {addToHistory, addToWhitelist, createNewTab} from 'app/actions/browser';
import {toggleNetworkModal} from 'app/actions/modals';
import setOnboardingWizardStep from 'app/actions/wizard';
import Device from 'app/util/Device';
import {AppConstants} from 'app/constants/core';
import Analytics from 'app/core/Analytics';
import {ANALYTICS_EVENT_OPTS} from 'app/util/analytics';

import BrowserBottomBar from '../../UI/BrowserBottomBar';
import WebviewProgressBar from '../../UI/WebviewProgressBar';
import Button from '../../UI/Button';
import UrlAutocomplete from '../../UI/UrlAutocomplete';
import WebviewError from '../../UI/WebviewError';
// import SharedDrawerStatusTracker from '../../UI/DrawerView/DrawerStatusTracker';

import ErrorBoundary from '../../UI/ErrorBoundary';
import {BoxShadow} from 'react-native-shadow';
import sdk from 'app/core/Sdk';
import {useBind, urlToJson, obj2strUrl, Toast} from 'app/util';
import {createStatus} from 'app/api/user';

const {HOMEPAGE_URL, USER_AGENT, HOMEPAGE_HOST} = AppConstants;
const MM_MIXPANEL_TOKEN = process.env.MM_MIXPANEL_TOKEN;

const ANIMATION_TIMING = 300;

const styles = StyleSheet.create({
  wrapper: {
    ...baseStyles.flexGrow,
    backgroundColor: colors.white,
  },
  hide: {
    flex: 0,
    opacity: 0,
    display: 'none',
    width: 0,
    height: 0,
  },
  progressBarWrapper: {
    height: 3,
    width: '100%',
    left: 0,
    right: 0,
    top: 0,
    position: 'absolute',
    zIndex: 999999,
  },
  optionsOverlay: {
    position: 'absolute',
    zIndex: 99999998,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  optionsWrapper: {
    width: 150,
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingBottom: 13,
    paddingTop: 12,
    paddingLeft: 15.0,
    paddingRight: 15,
  },
  optionsWrapperBox: {
    position: 'absolute',
    zIndex: 99999999,
    bottom: 25,
    right: 5,
  },
  option: {
    paddingVertical: 10,
    height: 'auto',
    minHeight: 44,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Device.isAndroid() ? 0 : -5,
  },
  optionText: {
    fontSize: 16,
    lineHeight: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 3,
    color: colors.blue,
    flex: 1,
    ...fontStyles.fontPrimary,
  },
  optionIconWrapper: {
    flex: 0,
    borderRadius: 5,
    backgroundColor: colors.blue000,
    padding: 3,
    marginRight: 10,
    alignSelf: 'center',
  },
  optionIcon: {
    color: colors.blue,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
  },
  webview: {
    ...baseStyles.flexGrow,
    zIndex: 1,
  },
  urlModalContent: {
    flexDirection: 'row',
    paddingTop: Device.isAndroid() ? 10 : Device.isIphoneX() ? 50 : 27,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    height: Device.isAndroid() ? 59 : Device.isIphoneX() ? 87 : 65,
  },
  urlModal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
  urlInput: {
    ...fontStyles.normal,
    backgroundColor: Device.isAndroid() ? colors.white : colors.grey000,
    borderRadius: 30,
    fontSize: Device.isAndroid() ? 16 : 14,
    padding: 8,
    paddingLeft: 15,
    textAlign: 'left',
    flex: 1,
    height: Device.isAndroid() ? 40 : 30,
  },
  cancelButton: {
    marginTop: 7,
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.blue,
    ...fontStyles.normal,
  },
  iconCloseButton: {
    borderRadius: 300,
    backgroundColor: colors.fontSecondary,
    color: colors.white,
    fontSize: 18,
    padding: 0,
    height: 20,
    width: 20,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginRight: 5,
  },
  iconClose: {
    color: colors.white,
    fontSize: 18,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  fullScreenModal: {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  label: {
    marginLeft: 15,
    fontSize: 16,
  },

  arrow: {
    width: 0,
    height: 0,
    borderWidth: 6,
    borderTopColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    position: 'absolute',
    bottom: -11,
    right: 24,
  },
  forwardBox: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  forwardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 17,
  },
  forwardInput: {
    height: 150,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    padding: 17,
    fontSize: 17,
  },
  websiteBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 2,
    padding: 5,
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  websiteDataBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteIcon: {
    width: 28,
    height: 28,
  },
  websiteData: {
    marginLeft: 7,
  },
  websiteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#222',
  },
  websiteUrl: {
    fontSize: 10,
    color: '#999',
  },
  websiteIconBox: {
    marginTop: 4,
  },
  iconType: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  btnBox: {
    marginTop: 30,
    flexDirection: 'row',
  },
  btnStyle: {
    width: 144,
    height: 40,
    borderRadius: 22,
    marginLeft: 7,
    marginRight: 7,
  },
  cancelBtn: {
    backgroundColor: '#eee',
  },
  cancelBtnTxt: {
    color: '#666',
  },
  addBtn: {
    backgroundColor: '#5D61FF',
  },
  addBtnTxt: {
    color: 'white',
  },
});

const sessionENSNames = {};

export const BrowserTab = props => {
  const [backEnabled, setBackEnabled] = useState(false);
  const [forwardEnabled, setForwardEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [initialUrl, setInitialUrl] = useState('');
  const [firstUrlLoaded, setFirstUrlLoaded] = useState(false);
  const [autocompleteValue, setAutocompleteValue] = useState('');
  const [error, setError] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showForward, setshowForward] = useState(false);
  const [blockedUrl, setBlockedUrl] = useState(undefined);

  const webviewRef = useRef(null);
  const inputRef = useRef(null);

  const url = useRef('');
  const title = useRef('');
  const icon = useRef(null);
  const webviewUrlPostMessagePromiseResolve = useRef(null);
  const fromHomepage = useRef(false);

  /**
   * Gets the url to be displayed to the user
   * For example, if it's ens then show [site].eth instead of ipfs url
   */
  const getMaskedUrl = u => {
    if (!u) {
      return u;
    }
    let replace = null;
    if (u.startsWith(AppConstants.IPFS_DEFAULT_GATEWAY_URL)) {
      replace = key =>
        `${AppConstants.IPFS_DEFAULT_GATEWAY_URL}${sessionENSNames[key].hash}/`;
    } else if (u.startsWith(AppConstants.IPNS_DEFAULT_GATEWAY_URL)) {
      replace = key =>
        `${AppConstants.IPNS_DEFAULT_GATEWAY_URL}${sessionENSNames[key].hostname}/`;
    } else if (u.startsWith(AppConstants.SWARM_DEFAULT_GATEWAY_URL)) {
      replace = key =>
        `${AppConstants.SWARM_GATEWAY_URL}${sessionENSNames[key].hash}/`;
    }

    if (replace) {
      const key = Object.keys(sessionENSNames).find(ens => u.startsWith(ens));
      if (key) {
        u = u.replace(
          replace(key),
          `https://${sessionENSNames[key].hostname}/`,
        );
      }
    }

    return u;
  };

  /**
   * Shows or hides the url input modal.
   * When opened it sets the current website url on the input.
   */
  const toggleUrlModal = useCallback(
    ({urlInput = null} = {}) => {
      const goingToShow = !showUrlModal;
      const urlToShow = getMaskedUrl(urlInput || url.current);

      if (goingToShow && urlToShow) {
        setAutocompleteValue(urlToShow);
      }

      setShowUrlModal(goingToShow);
    },
    [showUrlModal],
  );

  /**
   * Checks if a given url or the current url is the homepage
   */
  const isHomepage = useCallback((checkUrl = null) => {
    const currentPage = checkUrl || url.current;
    const {host: currentHost} = getUrlObj(currentPage);
    return currentHost === HOMEPAGE_HOST;
  }, []);

  /**
   * Disabling iframes for now
  const onFrameLoadStarted = url => {
    url && initializeBackgroundBridge(url, false);
  };
  */

  /**
   * Is the current tab the active tab
   */
  const isTabActive = useCallback(
    () => props.activeTab === props.id,
    [props.activeTab, props.id],
  );

  /**
   * Dismiss the text selection on the current website
   */
  const dismissTextSelectionIfNeeded = useCallback(() => {
    if (isTabActive() && Device.isAndroid()) {
      const {current} = webviewRef;
      if (current) {
        setTimeout(() => {
          current.injectJavaScript(JS_DESELECT_TEXT);
        }, 50);
      }
    }
  }, [isTabActive]);

  /**
   * Toggle the options menu
   */
  const toggleOptions = useCallback(() => {
    dismissTextSelectionIfNeeded();
    setShowOptions(!showOptions);
    InteractionManager.runAfterInteractions(() => {
      Analytics.trackEvent(ANALYTICS_EVENT_OPTS.DAPP_BROWSER_OPTIONS);
    });
  }, [dismissTextSelectionIfNeeded, showOptions]);

  /**
   * Show the options menu
   */
  const toggleOptionsIfNeeded = useCallback(() => {
    if (showOptions) {
      toggleOptions();
    }
  }, [showOptions, toggleOptions]);

  /**
   * Go back to previous website in history
   */
  const goBack = useCallback(() => {
    if (!backEnabled) {
      return;
    }

    toggleOptionsIfNeeded();
    const {current} = webviewRef;
    current && current.goBack();
  }, [backEnabled, toggleOptionsIfNeeded]);

  /**
   * Go forward to the next website in history
   */
  const goForward = async () => {
    if (!forwardEnabled) {
      return;
    }

    toggleOptionsIfNeeded();
    const {current} = webviewRef;
    current && current.goForward && current.goForward();
  };

  /**
   * Check if a hostname is allowed
   */
  const isAllowedUrl = useCallback(
    hostname => {
      return (props.whitelist && props.whitelist.includes(hostname)) || true;
    },
    [props.whitelist],
  );

  // const isBookmark = () => {
  //   const {bookmarks} = props;
  //   const maskedUrl = getMaskedUrl(url.current);
  //   return bookmarks.some(({url: bookmark}) => bookmark === maskedUrl);
  // };

  /**
   * Inject home page scripts to get the favourites and set analytics key
   */
  const injectHomePageScripts = async () => {
    const {current} = webviewRef;
    if (!current) {
      return;
    }
    const analyticsEnabled = Analytics.getEnabled();
    const disctinctId = await Analytics.getDistinctId();

    const homepageScripts = `
      window.__mmFavorites = ${JSON.stringify(props.bookmarks)};
      window.__mmSearchEngine = "${props.searchEngine}";
      window.__mmMetametrics = ${analyticsEnabled};
      window.__mmDistinctId = "${disctinctId}";
      window.__mmMixpanelToken = "${MM_MIXPANEL_TOKEN}";
    `;

    current.injectJavaScript(homepageScripts);
  };

  /**
   * Show a phishing modal when a url is not allowed
   */
  const handleNotAllowedUrl = useCallback(
    urlToGo => {
      setBlockedUrl(urlToGo);
      console.log(blockedUrl);
    },
    [blockedUrl],
  );

  /**
   * Go to a url
   */
  const go = useCallback(
    async (url, initialCall) => {
      const hasProtocol = url.match(/^[a-z]*:\/\//) || isHomepage(url);
      const sanitizedURL = hasProtocol ? url : `${props.defaultProtocol}${url}`;
      const {hostname} = new URL(sanitizedURL);

      let urlToGo = sanitizedURL;
      const {current} = webviewRef;
      if (isAllowedUrl(hostname)) {
        if (initialCall) {
          setInitialUrl(urlToGo);
          setFirstUrlLoaded(true);
        } else {
          current &&
            current.injectJavaScript(
              `(function(){window.location.href = '${urlToGo}' })()`,
            );
        }

        setProgress(0);
        return sanitizedURL;
      }
      handleNotAllowedUrl(urlToGo);
      return null;
    },
    [handleNotAllowedUrl, isAllowedUrl, isHomepage, props.defaultProtocol],
  );

  /**
   * Open a new tab
   */
  // const openNewTab = useCallback(
  //   url => {
  //     toggleOptionsIfNeeded();
  //     dismissTextSelectionIfNeeded();
  //     props.newTab(url);
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [dismissTextSelectionIfNeeded, toggleOptionsIfNeeded],
  // );

  /**
   * Hide url input modal
   */
  const hideUrlModal = useCallback(() => {
    setShowUrlModal(false);

    if (isHomepage()) {
      const {current} = webviewRef;
      const blur =
        "document.getElementsByClassName('autocomplete-input')[0].blur();";
      current && current.injectJavaScript(blur);
    }
  }, [isHomepage]);

  /**
   * Handle keyboard hide
   */
  const keyboardDidHide = useCallback(() => {
    if (!isTabActive() || isEmulatorSync()) {
      return false;
    }
    if (!fromHomepage.current) {
      if (showUrlModal) {
        hideUrlModal();
      }
    }
  }, [hideUrlModal, isTabActive, showUrlModal]);

  /**
   * Set keyboard listeners
   */
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );
    return function cleanup() {
      keyboardDidHideListener.remove();
    };
  }, [keyboardDidHide]);

  /**
   * Reload current page
   */
  const reload = useCallback(() => {
    toggleOptionsIfNeeded();
    const {current} = webviewRef;
    current && current.reload();
  }, [toggleOptionsIfNeeded]);

  /**
   * Handle when the drawer (app menu) is opened
   */
  // const drawerOpenHandler = useCallback(() => {
  //   dismissTextSelectionIfNeeded();
  // }, [dismissTextSelectionIfNeeded]);

  /**
   * Set initial url, dapp scripts and engine. Similar to componentDidMount
   */
  useEffect(() => {
    const init_url = props.initialUrl || HOMEPAGE_URL;
    go(init_url, true);

    // Specify how to clean up after this effect:
    return function cleanup() {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * Enable the header to toggle the url modal and update other header data
   */
  useEffect(() => {
    if (props.activeTab === props.id) {
      props.navigation.setParams({
        showUrlModal: toggleUrlModal,
        url: getMaskedUrl(url.current),
        icon: icon.current,
        error,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, props.activeTab, props.id, toggleUrlModal]);

  // useEffect(() => {
  //   if (Device.isAndroid()) {
  //     SharedDrawerStatusTracker.hub.on('drawer::open', drawerOpenHandler);
  //   }

  //   return function cleanup() {
  //     if (Device.isAndroid()) {
  //       SharedDrawerStatusTracker &&
  //         SharedDrawerStatusTracker.hub &&
  //         SharedDrawerStatusTracker.hub.removeListener(
  //           'drawer::open',
  //           drawerOpenHandler,
  //         );
  //     }
  //   };
  // }, [drawerOpenHandler]);

  /**
   * Set navigation listeners
   */
  useEffect(() => {
    const handleAndroidBackPress = () => {
      if (!isTabActive()) {
        return false;
      }
      goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleAndroidBackPress);

    // Handle hardwareBackPress event only for browser, not components rendered on top
    props.navigation.addListener('willFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleAndroidBackPress);
    });
    props.navigation.addListener('willBlur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleAndroidBackPress,
      );
    });

    return function cleanup() {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleAndroidBackPress,
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goBack, isTabActive]);

  /**
   * Handles state changes for when the url changes
   */
  const changeUrl = (siteInfo, type) => {
    setBackEnabled(siteInfo.canGoBack);
    setForwardEnabled(siteInfo.canGoForward);

    url.current = siteInfo.url;
    title.current = siteInfo.title;
    if (siteInfo.icon) {
      icon.current = siteInfo.icon;
    }

    isTabActive() &&
      props.navigation.setParams({
        url: getMaskedUrl(siteInfo.url),
        icon: siteInfo.icon,
        name: siteInfo.title,
        silent: true,
      });

    props.updateTabInfo(getMaskedUrl(siteInfo.url), props.id);

    props.addToBrowserHistory({
      name: siteInfo.title,
      url: getMaskedUrl(siteInfo.url),
    });
  };

  /**
   * Stops normal loading when it's ens, instead call go to be properly set up
   */
  const onShouldStartLoadWithRequest = ({u}) => {
    return true;
  };

  /**
   * Website started to load
   */
  const onLoadStart = async ({nativeEvent}) => {
    const {hostname} = new URL(nativeEvent.url);

    if (!isAllowedUrl(hostname)) {
      return handleNotAllowedUrl(nativeEvent.url);
    }
    webviewUrlPostMessagePromiseResolve.current = null;
    setError(false);
    changeUrl(nativeEvent, 'start');
    icon.current = null;
    if (isHomepage()) {
      injectHomePageScripts();
    }
  };

  /**
   * Sets loading bar progress
   */
  const onLoadProgress = ({nativeEvent: {progress}}) => {
    setProgress(progress);
  };

  /**
   * When website finished loading
   */
  const onLoadEnd = ({nativeEvent}) => {
    if (nativeEvent.loading) {
      return;
    }
    const {current} = webviewRef;

    current && current.injectJavaScript(JS_WEBVIEW_URL);

    const promiseResolver = resolve => {
      webviewUrlPostMessagePromiseResolve.current = resolve;
    };
    const promise = current
      ? new Promise(promiseResolver)
      : Promise.resolve(url.current);

    promise.then(info => {
      const {hostname: currentHostname} = new URL(url.current);
      const {hostname} = new URL(nativeEvent.url);
      if (info.url === nativeEvent.url && currentHostname === hostname) {
        changeUrl({...nativeEvent, icon: info.icon}, 'end-promise');
      }
    });
    props.navigation.setParams({webviewRef});
  };
  const injectCallbackJavaScript = data => {
    const {current} = webviewRef;
    const callback = `window.ReactNativeWebViewCallback(${JSON.stringify(
      data,
    )})`;
    current && current.injectJavaScript(callback);
  };
  /**
   * Handle message from website
   */
  const onMessage = ({nativeEvent}) => {
    let data = nativeEvent.data;
    const {title} = nativeEvent;
    try {
      data = typeof data === 'string' ? JSON.parse(data) : data;
      if (!data || (!data.type && !data.name)) {
        return;
      }
      if (data.name) {
        return;
      }

      switch (data.type) {
        /**
        * Disabling iframes for now
        case 'FRAME_READY': {
          const { url } = data.payload;
          onFrameLoadStarted(url);
          break;
        }*/
        case 'GET_WEBVIEW_URL':
          {
            const {url} = data.payload;
            if (url === nativeEvent.url) {
              data.payload.title = title;
              webviewUrlPostMessagePromiseResolve.current &&
                webviewUrlPostMessagePromiseResolve.current(data.payload);
            }
          }
          break;
        case 'OpenCreateUserPanel':
          props.navigation.push('Create');
          injectCallbackJavaScript({success: true});
          break;
        case 'OpenRestoreUserPanel':
          props.navigation.push('Restore');
          injectCallbackJavaScript({success: true});
          break;
        case 'setUserInfo':
          //判断是否有activeuser 为空则去登录
          (async () => {
            try {
              const activeUser = await sdk.getActiveUser();
              if (!activeUser) {
                Toast('Please log in');
                props.navigation.push('Login');
                injectCallbackJavaScript({success: false});
                return false;
              }
              sdk
                .setUserInfo(data.data)
                .then(() => {
                  console.log('setUserInfo success');
                  injectCallbackJavaScript({success: true});
                })
                .catch(() => {
                  console.log('setUserInfo error');
                  injectCallbackJavaScript({
                    success: false,
                    message: 'update error',
                  });
                });
            } catch (error) {
              injectCallbackJavaScript({
                success: false,
                message: 'update error',
              });
            }
          })();
          break;
        case 'getAuth':
          sdk
            .getAuth()
            .then(res => {
              injectCallbackJavaScript({success: true, data: res});
            })
            .catch(() => {
              injectCallbackJavaScript({success: false});
            });
          break;
        case 'openLoginPage':
          props.navigation.push('Login');
          injectCallbackJavaScript({success: true});
          break;
        case 'openRegister':
          props.navigation.push('create');
          injectCallbackJavaScript({success: true});
          break;
        case 'newTagPage':
          props.newTab(data.data);
          injectCallbackJavaScript({success: true});
          break;
        case 'follow':
          (async () => {
            const activeUser = await sdk.getActiveUser();
            if (!activeUser) {
              misesIdModel();
              injectCallbackJavaScript({success: false});
              return false;
            }
            sdk
              .follow(data.data)
              .then(res => {
                injectCallbackJavaScript({success: true, data: res});
              })
              .catch(() => {
                injectCallbackJavaScript({success: false});
              });
          })();
          break;
        case 'unFollow':
          (async () => {
            const activeUser = await sdk.getActiveUser();
            if (!activeUser) {
              misesIdModel();
              injectCallbackJavaScript({success: false});
              return false;
            }
            sdk
              .unFollow(data.data)
              .then(res => {
                injectCallbackJavaScript({success: true, data: res});
              })
              .catch(() => {
                injectCallbackJavaScript({success: false});
              });
          })();
          break;
        case 'getListUsersCount':
          (async () => {
            try {
              const listUsers = await sdk.ListUsers();
              const count = await listUsers.count();
              injectCallbackJavaScript({success: true, data: count});
            } catch (error) {
              injectCallbackJavaScript({success: false});
            }
          })();
          break;
      }
    } catch (e) {
      Logger.error(e, `Browser::onMessage on ${url.current}`);
    }
  };

  /**
   * Go to home page, reload if already on homepage
   */
  const goToHomepage = async () => {
    toggleOptionsIfNeeded();
    if (url.current === HOMEPAGE_URL) {
      return reload();
    }
    await go(HOMEPAGE_URL);
    Analytics.trackEvent(ANALYTICS_EVENT_OPTS.DAPP_HOME);
  };

  /**
   * Render the progress bar
   */
  const renderProgressBar = () => (
    <View style={styles.progressBarWrapper}>
      <WebviewProgressBar progress={progress} />
    </View>
  );

  /**
   * When url input changes
   */
  const onURLChange = inputValue => {
    setAutocompleteValue(inputValue);
  };

  /**
   * Handle url input submit
   */
  const onUrlInputSubmit = async (input = null) => {
    const inputValue =
      (typeof input === 'string' && input) || autocompleteValue;
    if (!inputValue) {
      toggleUrlModal();
      return;
    }
    const {defaultProtocol, searchEngine} = props;
    const sanitizedInput = onUrlSubmit(
      inputValue,
      searchEngine,
      defaultProtocol,
    );
    await go(sanitizedInput);
    toggleUrlModal();
  };

  /**
   * Render url input modal
   */
  const renderUrlModal = () => {
    if (showUrlModal && inputRef) {
      setTimeout(() => {
        const {current} = inputRef;
        if (current && !current.isFocused()) {
          current.focus();
        }
      }, ANIMATION_TIMING);
    }

    return (
      <Modal
        isVisible={showUrlModal}
        style={styles.urlModal}
        onBackdropPress={toggleUrlModal}
        onBackButtonPress={toggleUrlModal}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        backdropOpacity={0.7}
        animationInTiming={ANIMATION_TIMING}
        animationOutTiming={ANIMATION_TIMING}
        useNativeDriver>
        <View style={styles.urlModalContent} testID={'url-modal'}>
          <TextInput
            keyboardType="web-search"
            ref={inputRef}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            testID={'url-input'}
            onChangeText={onURLChange}
            onSubmitEditing={onUrlInputSubmit}
            placeholder={strings('autocomplete.placeholder')}
            placeholderTextColor={colors.grey400}
            returnKeyType="go"
            style={styles.urlInput}
            value={autocompleteValue}
            selectTextOnFocus
          />

          {Device.isAndroid() ? (
            <TouchableOpacity
              onPress={() =>
                !autocompleteValue
                  ? setShowUrlModal(false)
                  : setAutocompleteValue('')
              }
              style={styles.iconCloseButton}>
              <MaterialIcon
                name="close"
                size={20}
                style={[styles.icon, styles.iconClose]}
                testID={'android-cancel-url-button'}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              testID={'ios-cancel-url-button'}
              onPress={toggleUrlModal}>
              <Text style={styles.cancelButtonText}>
                {strings('browser.cancel')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <UrlAutocomplete
          onSubmit={onUrlInputSubmit}
          input={autocompleteValue}
          onDismiss={toggleUrlModal}
        />
      </Modal>
    );
  };

  /**
   * Handle error, for example, ssl certificate error
   */
  const onError = ({nativeEvent: errorInfo}) => {
    Logger.log(errorInfo);
    props.navigation.setParams({
      error: true,
    });
    setError(errorInfo);
  };

  /**
   * Add bookmark
   */
  // const addBookmark = () => {
  //   toggleOptionsIfNeeded();
  //   props.navigation.push('AddBookmarkView', {
  //     title: title.current || '',
  //     url: getMaskedUrl(url.current),
  //     onAddBookmark: async ({name, url}) => {
  //       props.addBookmark({name, url});
  //       if (Device.isIos()) {
  //         const item = {
  //           uniqueIdentifier: url,
  //           title: name || getMaskedUrl(url),
  //           contentDescription: `Launch ${name || url} on MetaMask`,
  //           keywords: [name.split(' '), url, 'dapp'],
  //           thumbnail: {
  //             uri:
  //               icon.current ||
  //               `https://api.faviconkit.com/${getHost(url)}/256`,
  //           },
  //         };
  //         try {
  //           SearchApi.indexSpotlightItem(item);
  //         } catch (e) {
  //           Logger.error(e, 'Error adding to spotlight');
  //         }
  //       }
  //     },
  //   });

  //   Analytics.trackEvent(ANALYTICS_EVENT_OPTS.DAPP_ADD_TO_FAVORITE);
  // };

  // /**
  //  * Share url
  //  */
  // const share = () => {
  //   toggleOptionsIfNeeded();
  //   Share.open({
  //     url: url.current,
  //   }).catch(err => {
  //     Logger.log('Error while trying to share address', err);
  //   });
  // };

  // /**
  //  * Open external link
  //  */
  // const openInBrowser = () => {
  //   toggleOptionsIfNeeded();
  //   Linking.openURL(url.current).catch(error =>
  //     Logger.log(
  //       `Error while trying to open external link: ${url.current}`,
  //       error,
  //     ),
  //   );
  //   Analytics.trackEvent(ANALYTICS_EVENT_OPTS.DAPP_OPEN_IN_BROWSER);
  // };

  /**
   * Render non-homepage options menu
   */
  // const renderNonHomeOptions = () => {
  //   if (isHomepage()) {
  //     return null;
  //   }

  //   return (
  //     <React.Fragment>
  //       <Button onPress={reload} style={styles.option}>
  //         <View style={styles.optionIconWrapper}>
  //           <Icon name="refresh" size={15} style={styles.optionIcon} />
  //         </View>
  //         <Text style={styles.optionText} numberOfLines={2}>
  //           {strings('browser.reload')}
  //         </Text>
  //       </Button>
  //       {!isBookmark() && (
  //         <Button onPress={addBookmark} style={styles.option}>
  //           <View style={styles.optionIconWrapper}>
  //             <Icon name="star" size={16} style={styles.optionIcon} />
  //           </View>
  //           <Text style={styles.optionText} numberOfLines={2}>
  //             {strings('browser.add_to_favorites')}
  //           </Text>
  //         </Button>
  //       )}
  //       <Button onPress={share} style={styles.option}>
  //         <View style={styles.optionIconWrapper}>
  //           <Icon name="share" size={15} style={styles.optionIcon} />
  //         </View>
  //         <Text style={styles.optionText} numberOfLines={2}>
  //           {strings('browser.share')}
  //         </Text>
  //       </Button>
  //       <Button onPress={openInBrowser} style={styles.option}>
  //         <View style={styles.optionIconWrapper}>
  //           <Icon name="expand" size={16} style={styles.optionIcon} />
  //         </View>
  //         <Text style={styles.optionText} numberOfLines={2}>
  //           {strings('browser.open_in_browser')}
  //         </Text>
  //       </Button>
  //     </React.Fragment>
  //   );
  // };

  // /**
  //  * Handle new tab button press
  //  */
  // const onNewTabPress = () => {
  //   openNewTab();
  // };

  // /**
  //  * Handle switch network press
  //  */
  // const switchNetwork = () => {
  //   toggleOptionsIfNeeded();
  //   props.toggleNetworkModal();
  // };

  const misesId = useSelector(state => state.misesId);
  /**
   * Render options menu
   */
  const misesIdModel = async () => {
    const list = await sdk.ListUsers();
    const count = await list.count();
    const flag = count > 0;
    const content = flag
      ? strings('login.login_modal_content')
      : strings('login.create_modal_content');
    Alert.alert('Message', content, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          const url = flag ? 'Login' : 'Create';
          props.navigation.push(url);
        },
      },
    ]);
  };
  const optionsMenuList = [
    {
      label: strings('menu.forward'),
      icon: require('@/images/forward.png'),
      fn: async () => {
        //call page function
        toggleOptions();
        const activeUser = await sdk.getActiveUser();
        if (props.navigation.state.params.error) {
          Toast('Can’t forward this website page');
          return false;
        }
        if (activeUser) {
          toggleForwardModal();
          return false;
        }
        misesIdModel();
      },
    },
  ];
  const toggleForwardModal = () => setshowForward(!showForward);
  const setting = {
    inset: false,
    style: {marginVertical: 5},
    side: 'top',
    opacity: 0.5,
    x: 0,
    color: '#ECECEC',
    width: 150,
    height: 115,
    border: 15,
    radius: 15,
    y: 20,
  };
  const renderOptions = () => {
    if (showOptions) {
      return (
        <TouchableWithoutFeedback onPress={toggleOptions}>
          <View style={styles.optionsOverlay}>
            <View style={styles.optionsWrapperBox}>
              <BoxShadow setting={setting}>
                <View style={styles.optionsWrapper}>
                  {optionsMenuList.map((val, index) => {
                    return (
                      <TouchableOpacity
                        onPress={val.fn}
                        key={index}
                        style={styles.labelBox}>
                        <Image source={val.icon} style={styles.icon} />
                        <Text style={styles.label}>{val.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                  <View style={styles.arrow} />
                </View>
              </BoxShadow>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };
  const forwardContent = useBind('');
  const browserForward = ({name, origin, link, icon}) => {
    /**
     * @description: 如果有token 直接用 如果返回token过期就登录
     * @param {*}
     * @return {*}
     */
    toggleForwardModal();
    if (misesId.token) {
      const form = {
        title: name,
        host: origin,
        link,
        attachment_url: icon,
      };
      console.log(form, 'form');
      return false;
      // const obj = {
      //   link_meta: form,
      //   content: forwardContent.value,
      //   status_type: 'link',
      //   form_type: 'status',
      // };
      // createStatus(obj)
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     Toast(err);
      //   });
      // return false;
    }
    props.navigation.push('Login');
  };
  const renderForwardModal = () => {
    const {params = {}} = props.navigation.state;
    const {origin, href, pathname} = new URL(params.url);
    const queryObj = urlToJson(href);
    if (
      !isHomepage(href) &&
      queryObj.mises_id &&
      queryObj.nonce &&
      queryObj.sig
    ) {
      delete queryObj.mises_id;
      delete queryObj.nonce;
      delete queryObj.sig;
    }
    const link = `${origin}${pathname}?${obj2strUrl(queryObj)}`;
    const webviewParams =
      params.icon && initialUrl ? {...params, link, origin} : {};
    return (
      <Modal isVisible={showForward}>
        <View style={styles.forwardBox}>
          <Text style={styles.forwardTitle}>{strings('menu.forward')}</Text>
          <TextInput
            style={styles.forwardInput}
            numberOfLines={6}
            {...forwardContent}
            underlineColorAndroid="transparent"
            multiline={true}
            placeholder={strings('common.placeholder')}
          />
          <View style={styles.websiteBox}>
            <View style={styles.websiteDataBox}>
              <Image
                source={{uri: webviewParams.icon}}
                style={styles.websiteIcon}
              />
              <View style={styles.websiteData}>
                <View>
                  <Text style={styles.websiteTitle}>{webviewParams.name}</Text>
                </View>
                <View style={styles.websiteIconBox}>
                  <Text style={styles.websiteUrl}>{origin}</Text>
                </View>
              </View>
            </View>
            <Image
              source={require('../../../images/link.png')}
              style={styles.iconType}
            />
          </View>
          <View style={styles.btnBox}>
            <Button
              style={[styles.btnStyle, styles.cancelBtn]}
              onPress={toggleForwardModal}>
              <Text style={styles.cancelBtnTxt}>
                {strings('common.cancel_button')}
              </Text>
            </Button>
            <Button
              style={[styles.btnStyle, styles.addBtn]}
              onPress={() => browserForward(webviewParams)}>
              <Text style={styles.addBtnTxt}>
                {strings('forward.add_button')}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };
  /**
   * Show the different tabs
   */
  const showTabs = () => {
    dismissTextSelectionIfNeeded();
    props.showTabs();
  };

  /**
   * Render the bottom (navigation/options) bar
   */
  const renderBottomBar = () => (
    <BrowserBottomBar
      canGoBack={backEnabled}
      canGoForward={forwardEnabled}
      goForward={goForward}
      goBack={goBack}
      showTabs={showTabs}
      showUrlModal={toggleUrlModal}
      toggleOptions={toggleOptions}
      goHome={goToHomepage}
    />
  );

  /**
   * Main render
   */
  let webviewUrl = initialUrl;
  if (misesId.auth) {
    webviewUrl =
      webviewUrl +
      ((webviewUrl.indexOf('?') === -1 ? '?' : '&') + `${misesId.auth}`);
  }
  return (
    <ErrorBoundary view="BrowserTab">
      <View
        style={[styles.wrapper, !isTabActive() && styles.hide]}
        {...(Device.isAndroid() ? {collapsable: false} : {})}>
        <View style={styles.webview}>
          {firstUrlLoaded && (
            <WebView
              ref={webviewRef}
              renderError={() => (
                <WebviewError error={error} onReload={() => null} />
              )}
              source={{uri: webviewUrl}}
              style={styles.webview}
              onLoadStart={onLoadStart}
              onLoadEnd={onLoadEnd}
              onLoadProgress={onLoadProgress}
              onMessage={onMessage}
              onError={onError}
              onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
              userAgent={USER_AGENT}
              sendCookies
              javascriptEnabled
              allowsInlineMediaPlayback
              useWebkit
              testID={'browser-webview'}
            />
          )}
        </View>
        {renderProgressBar()}
        {isTabActive() && renderUrlModal()}
        {isTabActive() && renderOptions()}
        {isTabActive() && renderBottomBar()}
        {isTabActive() && renderForwardModal()}
      </View>
    </ErrorBoundary>
  );
};

BrowserTab.propTypes = {
  /**
   * The ID of the current tab
   */
  id: PropTypes.number,
  /**
   * The ID of the active tab
   */
  activeTab: PropTypes.number,
  /**
   * InitialUrl
   */
  initialUrl: PropTypes.string,
  /**
   * Map of hostnames with approved account access
   */
  approvedHosts: PropTypes.object,
  /**
   * Protocol string to append to URLs that have none
   */
  defaultProtocol: PropTypes.string,
  /**
   * A string that of the chosen ipfs gateway
   */
  ipfsGateway: PropTypes.string,
  /**
   * Object containing the information for the current transaction
   */
  transaction: PropTypes.object,
  /**
   * react-navigation object used to switch between screens
   */
  navigation: PropTypes.object,
  /**
   * A string representing the network type
   */
  networkType: PropTypes.string,
  /**
   * A string representing the network id
   */
  network: PropTypes.string,
  /**
   * Indicates whether privacy mode is enabled
   */
  privacyMode: PropTypes.bool,
  /**
   * A string that represents the selected address
   */
  selectedAddress: PropTypes.string,
  /**
   * whitelisted url to bypass the phishing detection
   */
  whitelist: PropTypes.array,
  /**
   * Url coming from an external source
   * For ex. deeplinks
   */
  url: PropTypes.string,
  /**
   * Function to toggle the network switcher modal
   */
  toggleNetworkModal: PropTypes.func,
  /**
   * Function to open a new tab
   */
  newTab: PropTypes.func,
  /**
   * Function to store bookmarks
   */
  addBookmark: PropTypes.func,
  /**
   * Function to remove bookmarks
   */
  removeBookmark: PropTypes.func,
  /**
   * Array of bookmarks
   */
  bookmarks: PropTypes.array,
  /**
   * String representing the current search engine
   */
  searchEngine: PropTypes.string,
  /**
   * Function to store the a page in the browser history
   */
  addToBrowserHistory: PropTypes.func,
  /**
   * Function to store the a website in the browser whitelist
   */
  addToWhitelist: PropTypes.func,
  /**
   * Function to update the tab information
   */
  updateTabInfo: PropTypes.func,
  /**
   * Function to update the tab information
   */
  showTabs: PropTypes.func,
  /**
   * Action to set onboarding wizard step
   */
  setOnboardingWizardStep: PropTypes.func,
  /**
   * Current onboarding wizard step
   */
  wizardStep: PropTypes.number,
  /**
   * the current version of the app
   */
  app_version: PropTypes.string,
  /**
   * An object representing the selected network provider
   */
  networkProvider: PropTypes.object,
};

BrowserTab.defaultProps = {
  defaultProtocol: 'https://',
};

const mapStateToProps = state => ({
  bookmarks: state.bookmarks,
  searchEngine: state.settings.searchEngine,
  whitelist: state.browser.whitelist,
  activeTab: state.browser.activeTab,
  wizardStep: state.wizard.step,
});

const mapDispatchToProps = dispatch => ({
  addBookmark: bookmark => dispatch(addBookmark(bookmark)),
  removeBookmark: bookmark => dispatch(removeBookmark(bookmark)),
  createNewTab: url => dispatch(createNewTab(url)),
  addToBrowserHistory: ({url, name}) => dispatch(addToHistory({url, name})),
  addToWhitelist: url => dispatch(addToWhitelist(url)),
  toggleNetworkModal: () => dispatch(toggleNetworkModal()),
  setOnboardingWizardStep: step => dispatch(setOnboardingWizardStep(step)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(BrowserTab));
