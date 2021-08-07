/*
 * @Author: lmk
 * @Date: 2021-08-07 13:50:47
 * @LastEditTime: 2021-08-07 20:04:36
 * @LastEditors: lmk
 * @Description: loginPage
 */
import { setMisesAuth } from 'app/actions/misesId';
import sdk from 'app/core/Sdk';
import { strings } from 'app/locales/i18n';
import { Toast, useBind } from 'app/util';
import React, { useReducer, useEffect, useRef, useState } from 'react';
import {Platform, StyleSheet, Text, View,Image ,TouchableOpacity, TextInput} from 'react-native';
import { useDispatch } from 'react-redux';
const Login = (props)=>{
  const pwd = useBind('');
  const dispatch = useDispatch();
  let misesId = '';
  let activeUser = '';
  const [info, setinfo] = useState({})
  useEffect(()=>{
    (async ()=>{
      try {
        // activeUser = await sdk.getActiveUser();
        // misesId = await activeUser.misesID();
        // const userInfo = await activeUser.info();
        // const name = await userInfo.name();
        // const avatarDid = await userInfo.avatarDid()
        // setinfo({name,avatarDid})
      } catch (error) {
        console.log(error,'www')
      }
    })()
  },[])
  const submit = async ()=>{
    if(!pwd.value){
      Toast(strings('password.pwderror'))
      return false;
    }
    try {
      if(!misesId){
        return false;
      }
      await sdk.setActiveUser(misesId,pwd.value)
      const permissions = await Sdk.MStringList('signin', ',');
      const auth = await Sdk.login('mises.site', permissions);
      dispatch(setMisesAuth(auth))
    } catch (error) {
      console.log(error,'22222')
    }
  }
  return <View style={styles.pageBox}>
    <View style={styles.userHeader}>
      
    </View>
    <View style={styles.inputTitleBox}><Text style={styles.inputTitleTxt}>{strings('password.inputTxt')}:</Text></View>
    <View style={styles.inputBox}>
      <TextInput placeholder={strings('common.placeholder')} {...pwd}
			secureTextEntry={true}></TextInput>
    </View>
    <View style={styles.btnBox}>
      <TouchableOpacity onPress={submit}>
        <View style={[styles.btnStyle,styles.success]}>
          <Text style={styles.successBtnTxt}>{strings('password.success_button')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
}
const styles = StyleSheet.create({
  userHeader:{
    alignItems:'center',
    justifyContent:'center'
  },
  pageBox:{
    paddingLeft:15,
    paddingRight:15
  },
  inputTitleBox:{
    marginTop:0,
    marginBottom:15
  },
  inputTitleTxt:{
    fontSize:16,
    color:'#333',
  },
  inputBox:{
    height:50,
    backgroundColor:"#F8F8F8",
    borderRadius:5,
    paddingLeft:15,
    paddingRight:15,
    marginBottom:25
  },
  btnBox:{
    marginTop:15,
    marginLeft:25,
    marginRight:25
  },
  btnStyle:{
    borderWidth:1,
    height:50,
    borderRadius:50,
    alignItems:'center',
    justifyContent:'center',
    overflow:'hidden',
    marginTop:25
  },
  success:{
    borderColor:'#5D61FF'
  },
  successBtnTxt:{
    fontSize:16,
    color:"#5D61FF",
    fontWeight:'bold'
  },

})
export default Login