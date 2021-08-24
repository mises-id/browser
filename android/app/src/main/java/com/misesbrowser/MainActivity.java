package com.misesbrowser;

import android.content.Intent;
import android.content.pm.ApplicationInfo;

import com.facebook.react.ReactActivity;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import io.branch.rnbranch.RNBranchModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "MisesBrowser";
  }
  /**
   * 
   * Operate drawerView by gesture
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }


  // Override onStart, onNewIntent:
  @Override
  protected void onStart() {
    super.onStart();
    RNBranchModule.initSession(getIntent().getData(), this);

  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    RNBranchModule.onNewIntent(intent);
  }
}
