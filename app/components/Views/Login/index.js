/*
 * @Author: lmk
 * @Date: 2021-08-07 13:50:47
 * @LastEditTime: 2021-08-29 23:20:54
 * @LastEditors: lmk
 * @Description: loginPage
 */
import {setMisesAuth, setToken} from 'app/actions/misesId';
import {signin} from 'app/api/user';
import sdk from 'app/core/Sdk';
import {strings} from 'app/locales/i18n';
import {Toast, useBind} from 'app/util';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
const Login = ({navigation}) => {
  const pwd = useBind('');
  const dispatch = useDispatch();
  const [info, setinfo] = useState({});
  const [misesId, setmisesId] = useState('');
  const [pageAuth, setpageAuth] = useState('');
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (pageAuth) {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
      navigation.dispatch(resetAction);
    }
  }, [pageAuth, navigation]);
  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = async () => {
    try {
      const list = await sdk.ListUsers();
      const count = await list.count();
      if (count > 0) {
        const user = await list.get(0);
        const id = await user.misesID();
        const userinfo = await user.info();
        const name = await userinfo.name();
        const avatarDid = await userinfo.avatarDid();
        const obj = {
          name,
          avatarDid,
        };
        console.log(obj, 'weeee');
        setinfo(obj);
        setmisesId(id);
      }
    } catch (error) {
      console.log(error, 'www');
    }
  };
  const submit = async () => {
    if (!pwd.value) {
      Toast(strings('password.pwderror'));
      return false;
    }
    try {
      if (!misesId) {
        return false;
      }
      //Toast(strings('create.operating'));
      if (loading) {
        Toast(strings('create.operating'));
        return false;
      }
      setloading(true);
      await sdk.setActiveUser(misesId, pwd.value);
      const auth = await sdk.getAuth();
      const res = await signin({
        provider: 'mises',
        user_authz: {auth},
      });
      dispatch(setToken(res.token));
      dispatch(setMisesAuth(auth));
      setpageAuth(auth);
      setloading(false);
    } catch (error) {
      Toast(error.message);
      console.log(error, 'loginerror');
      setloading(false);
    }
  };
  return (
    <View style={styles.pageBox}>
      <View style={styles.userHeader}>
        <Text>{info.name}</Text>
      </View>
      <View style={styles.inputTitleBox}>
        <Text style={styles.inputTitleTxt}>
          {strings('password.inputTxt')}:
        </Text>
      </View>
      <View style={styles.inputBox}>
        <TextInput
          placeholder={strings('common.placeholder')}
          {...pwd}
          secureTextEntry={true}
        />
      </View>
      <View style={styles.btnBox}>
        <TouchableOpacity onPress={submit}>
          <View style={[styles.btnStyle, styles.success]}>
            {loading && <ActivityIndicator color="#5D61FF" />}
            <Text style={styles.successBtnTxt}>
              {strings('password.success_button')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  userHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBox: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  inputTitleBox: {
    marginTop: 20,
    marginBottom: 15,
  },
  inputTitleTxt: {
    fontSize: 16,
    color: '#333',
  },
  inputBox: {
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 25,
  },
  btnBox: {
    marginTop: 15,
    marginLeft: 25,
    marginRight: 25,
  },
  btnStyle: {
    borderWidth: 1,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 25,
  },
  success: {
    borderColor: '#5D61FF',
  },
  successBtnTxt: {
    fontSize: 16,
    color: '#5D61FF',
    fontWeight: 'bold',
  },
});
export default Login;
