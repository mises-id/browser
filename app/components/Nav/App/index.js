import React, {PureComponent} from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationActions,
} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Branch from 'react-native-branch';
import Entry from 'app/components/Views/Entry';
import Logger from 'app/util/Logger';
import {AppConstants} from 'app/constants/core';
import trackErrorAsAnalytics from 'app/util/analyticsV2';
import SharedDeeplinkManager from 'app/core/DeeplinkManager';

import Main from '../Main';
import DrawerView from 'app/components/UI/DrawerView';
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
const AppNavigator = createStackNavigator(
  {
    Entry,
    Main,
    MenuToolTips:{
      screen:MenuToolTips,
      navigationOptions:(current)=>{
        return {
          opacity: current.progress,
          cardStyleInterpolator:()=>{
            return {
              cardStyle:{
                backgroundColor: 'rgba(0,0,0,0)' 
              },
              containerStyle:{
                backgroundColor: 'rgba(0,0,0,0)' ,
              }
            }
          }
        }
      }
    }
  },
  {
    initialRouteName: 'Main',
    headerMode:"none",
    mode:'modal'
  },
);

const AppContainer = createAppContainer(AppNavigator);

class App extends PureComponent {
  unsubscribeFromBranch;

  componentDidMount = () => {
    SharedDeeplinkManager.init({
      navigate: (routeName, opts) => {
        this.navigator.dispatch(
          NavigationActions.navigate({routeName, params: opts}),
        );
      },
    });
    if (!this.unsubscribeFromBranch) {
      this.unsubscribeFromBranch = Branch.subscribe(this.handleDeeplinks);
    }
  };

  handleDeeplinks = async ({error, params, uri}) => {
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
      <AppContainer
        ref={nav => {
          this.navigator = nav;
        }}
      />
    );
  }
}
export default App;
