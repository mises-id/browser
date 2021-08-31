import React, {PureComponent} from 'react';
import {NavigationActions} from '@react-navigation/compat';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createCompatNavigatorFactory} from '@react-navigation/compat';
import Branch from 'react-native-branch';
import Logger from 'app/util/Logger';
import {AppConstants} from 'app/constants/core';
import trackErrorAsAnalytics from 'app/util/analyticsV2';
import SharedDeeplinkManager from 'app/core/DeeplinkManager';

import Main from '../Main';
import MenuToolTips from 'app/components/UI/MenuToolTips';

// import SharedDrawerStatusTracker from 'app/components/UI/DrawerView/DrawerStatusTracker';
/**
 * Main app navigator which handles all the screens
 * after the user is already onboarded
 */
// const HomeNav = createDrawerNavigator(
//   {
//     Main: {
//       screen: Main,
//     },
//   },
//   {
//     contentComponent: DrawerView,
//     drawerWidth: 315,
//     overlayColor: 'rgba(0, 0, 0, 0.5)',
//   },
// );

// /**
//  * Drawer status tracking
//  */
// const defaultGetStateForAction = HomeNav.router.getStateForAction;
// SharedDrawerStatusTracker.init();
// HomeNav.router.getStateForAction = (action, state) => {
//   if (action) {
//     if (action.type === 'Navigation/MARK_DRAWER_SETTLING' && action.willShow) {
//       SharedDrawerStatusTracker.setStatus('open');
//     } else if (
//       action.type === 'Navigation/MARK_DRAWER_SETTLING' &&
//       !action.willShow
//     ) {
//       SharedDrawerStatusTracker.setStatus('closed');
//     }
//   }

//   return defaultGetStateForAction(action, state);
// };

/**
 * Top level switch navigator which decides
 * which top level view to show
 */
const AppNavigator = createCompatNavigatorFactory(createStackNavigator)(
  {
    Main,
    MenuToolTips: {
      screen: MenuToolTips,
      navigationOptions: current => {
        return {
          elevation: 0,
        };
      },
    },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    mode: 'modal',
  },
);

class App extends PureComponent {
  unsubscribeFromBranch;
  navigationRef = null;
  componentDidMount = () => {
    SharedDeeplinkManager.init({
      navigate: (routeName, opts) => {
        Logger.log('Deeplink navigation: ', routeName);
        this.navigationRef.dispatch(
          NavigationActions.navigate({routeName, params: opts}),
        );
      },
    });
    if (!this.unsubscribeFromBranch) {
      this.unsubscribeFromBranch = Branch.subscribe(this.handleDeeplinks);
    }
  };

  handleDeeplinks = async ({error, params, uri}) => {
    Logger.log('Deeplink: ', params, uri);
    if (error) {
      if (
        error ===
        'Trouble reaching the Branch servers, please try again shortly.'
      ) {
        trackErrorAsAnalytics('Branch: Trouble reaching servers', error);
      } else {
        Logger.error(error, 'Deeplink: Error from Branch');
      }
    }
    const deeplink = params['+non_branch_link'] || uri || null;
    try {
      if (deeplink) {
        const isUnlocked = true;
        isUnlocked
          ? SharedDeeplinkManager.parse(deeplink, {
              origin: AppConstants.DEEPLINKS.ORIGIN_DEEPLINK,
            })
          : SharedDeeplinkManager.setDeeplink(deeplink);
      }
    } catch (e) {
      Logger.error(e, 'Deeplink: Error parsing deeplink');
    }
  };

  componentWillUnmount = () => {
    this.unsubscribeFromBranch && this.unsubscribeFromBranch();
  };

  render() {
    return (
      <NavigationContainer ref={e => (this.navigationRef = e)}>
        <AppNavigator> </AppNavigator>
      </NavigationContainer>
    );
  }
}
export default App;
