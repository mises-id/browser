import sdk from 'app/core/Sdk';
import {strings} from 'app/locales/i18n';
import {Toast} from 'app/util';
import React, {useReducer, useEffect, useRef, useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {BoxShadow} from 'react-native-shadow';

const setting = {
  inset: false,
  style: {marginVertical: 5},
  side: 'top',
  opacity: 0.5,
  x: 0,
  color: '#ECECEC',
  width: 190,
  height: 115,
  border: 15,
  radius: 15,
  y: 20,
};
const {width, height} = Dimensions.get('window');
const MenuTips = ({navigation}) => {
  const closePop = () => navigation.pop();
  const [pageFlag, setpageFlag] = useState(false);
  useEffect(() => {
    sdk.isLogin().then(setactiveUser);
    (async () => {
      const listUsers = await sdk.ListUsers();
      const count = await listUsers.count();
      setpageFlag(count > 0);
    })();
  }, []);
  const hasActiveUser = () => {
    Toast('Has ActiveUser');
  };
  const [activeUser, setactiveUser] = useState(false);

  const list = [
    {
      label: pageFlag ? strings('menu.login') : strings('menu.create'),
      icon: require('@/images/create.png'),
      fn: () => {
        closePop();
        if (!activeUser) {
          const pageName = pageFlag ? 'Login' : 'Create';
          navigation.push(pageName);
        }
        activeUser && hasActiveUser();
      },
    },
    {
      label: strings('menu.restore'),
      icon: require('@/images/restore.png'),
      fn: () => {
        closePop();
        navigation.push('Restore');
      },
    },
  ];
  return (
    <View>
      <BoxShadow setting={setting}>
        <View
          style={{
            position: 'relative',
            marginTop: 45,
            marginLeft: 5,
            zIndex: 9999,
          }}>
          <View style={styles.arrow} />
          <View style={styles.toolTips}>
            {list.map((val, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity onPress={val.fn} style={styles.labelBox}>
                    <Image source={val.icon} style={styles.icon} />
                    <Text style={styles.label}>{val.label}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </BoxShadow>
      <TouchableOpacity
        onPress={closePop}
        style={[styles.closePop, {width, height}]}></TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  toolTips: {
    width: 190,
    height: 115,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderWidth: 6,
    borderBottomColor: 'white',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    position: 'absolute',
    top: -12,
    left: 18,
  },
  closePop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)',
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
});
MenuTips.navigationOptions = current => {
  return {
    opacity: current.progress,
    cardStyle: {
      backgroundColor: 'transparent',
    },
  };
};
export default MenuTips;
