/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-08-02 23:29:28
 * @LastEditors: lmk
 * @Description: Restore misesid
 */
import { strings } from 'app/locales/i18n';
import React, { useReducer, useEffect, useRef, useState } from 'react';
import {Platform, StyleSheet, Text, View,Image ,TouchableOpacity, TextInput, Button} from 'react-native';
import radio from 'app/images/radio.png'
import radioChecked from 'app/images/radio_selected.png'
import { Toast, useBind } from 'app/util';
import Sdk from 'app/core/Sdk';
const Password = ({navigation})=>{
  
  const [checked, setchecked] = useState(false)
  const pwd = useBind('')
  const confimPwd = useBind('')
  const submit = ()=>{
    const toastContent = strings('common.placeholder')
    if(!pwd.value){
      Toast(strings('password.pwderror'))
      return false;
    }
    if(!confimPwd.value){
      Toast(strings('password.confimPwderror'))
      return false;
    }
    if(pwd.value!==confimPwd.value){
      Toast(strings('password.retypederror'))
      return false;
    }
    Sdk.createUser(navigation.state.params.mnemonics.split(',').join(' '),pwd.value).then(res=>{
      console.log(res)
    })
  }
  return <View style={styles.pageBox}>
    <View style={styles.titleBox}><Text style={styles.title}>{strings('password.title')}</Text></View>
    <View style={styles.inputTitleBox}><Text style={styles.inputTitleTxt}>{strings('password.inputTxt')}:</Text></View>
    <View style={styles.inputBox}>
      <TextInput placeholder={strings('common.placeholder')} {...pwd}
			secureTextEntry={true}></TextInput>
    </View>
    <View style={styles.inputTitleBox}><Text style={styles.inputTitleTxt}>{strings('password.inputTxtConfirm')}:</Text></View>
    <View style={styles.inputBox}>
      <TextInput placeholder={strings('common.placeholder')} {...confimPwd}
			secureTextEntry={true}></TextInput>
    </View>
    {/* <View style={styles.txtBtnBox}>
      <TouchableOpacity onPress={()=>setchecked(!checked)} style={{flexDirection:'row',alignItems:'center'}}>
        <Image source={checked? radioChecked : radio} style={styles.radio}></Image>
        <Text style={styles.stay}>{strings('password.stay')}</Text>
      </TouchableOpacity>
      <Text  style={styles.txtBtnStyle}>{strings('password.forgot')}</Text>
    </View> */}
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
  pageBox:{
    paddingLeft:15,
    paddingRight:15
  },
  title:{
    fontSize:16,
    color:"#333",
    fontWeight:"bold"
  },
  titleBox:{
    paddingTop:25,
    paddingBottom:17
  },
  inputBox:{
    height:50,
    backgroundColor:"#F8F8F8",
    borderRadius:5,
    paddingLeft:15,
    paddingRight:15,
    marginBottom:25
  },
  inputTitleBox:{
    marginTop:0,
    marginBottom:15
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
  inputTitleTxt:{
    fontSize:16,
    color:'#333',
    
  },
  success:{
    borderColor:'#5D61FF'
  },
  successBtnTxt:{
    fontSize:16,
    color:"#5D61FF",
    fontWeight:'bold'
  },
  cancel:{
    borderColor:'#EEEEEE',
    backgroundColor:'#EEEEEE'
  },
  cancelBtnTxt:{
    fontSize:16,
    color:"#666",
    fontWeight:'bold'
  },
  txtBtnBox:{
    flexDirection:'row',
    justifyContent:"space-between"
  },
  txtBtnStyle:{
    color:"#5D61FF"
  },
  radio:{
    width:15,
    height:15
  },
  stay:{
    marginLeft:6,
    fontSize:13,
    color:'#666'
  }
})
Password.navigationOptions = ()=>{
  return {
    headerTitle:strings('menu.create')
  }
}
export default Password