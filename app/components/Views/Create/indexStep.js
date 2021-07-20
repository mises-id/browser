/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-07-20 09:58:35
 * @LastEditors: lmk
 * @Description: Restore misesid
 */
import { strings } from 'app/locales/i18n';
import React, { useReducer, useEffect, useRef, useState } from 'react';
import {Platform, StyleSheet, Text, View,Image ,TouchableOpacity, TextInput, Button} from 'react-native';
const word = (item={},key)=>{
  return <View key={key} style={styles.wordContent}>
    <Text style={styles.wordTxt}>{item.value}</Text>
  </View>
}
const CreateStep = ({navigation})=>{

  const nextStep = ()=>{
    navigation.push('CreateStep2')
  }
  const [data, setdata] = useState([{value:'cloud'},{value:'rabbit'},{value:'fly'},{value:'hawk'},{value:'contemplate'},{value:'pretty'},{value:'superduty'},{value:'lovely'},{value:'come'},{value:'gift'},{value:'main'},{value:'green'}])
  return <View style={styles.pageBox}>
    <View style={styles.titleBox}><Text style={styles.title}>{strings('create.Step1Title')}</Text></View>
    <View style={styles.desc}><Text style={styles.title}>{strings('create.desc')}</Text></View>
    <View style={styles.wordsContainer}>
      {data.map(word)}
    </View>
    <View style={styles.btnBox}>
      <TouchableOpacity onPress={nextStep}>
        <View style={[styles.btnStyle,styles.success]}>
          <Text style={styles.successBtnTxt}>{strings('create.step_btn')}</Text>
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
  desc:{
    fontSize:15,
    color:"#333",
    marginBottom:25
  },
  wordsContainer:{
    borderColor:"#EEEEEE",
    borderRadius:5,
    borderWidth:1,
    flexDirection: 'row',
    flexWrap:"wrap",
    padding:5
  },
  wordContent:{
    padding:15,
    borderRadius:5,
    position:'relative',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#F7F7FF',
    margin:5,
  },
  wordTxt:{
    fontSize:16,
    fontWeight:'bold',
    color:'#5D61FF'
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
  cancel:{
    borderColor:'#EEEEEE',
    backgroundColor:'#EEEEEE'
  },
  cancelBtnTxt:{
    fontSize:16,
    color:"#666",
    fontWeight:'bold'
  }
})
CreateStep.navigationOptions = ()=>{
  return {
    headerTitle:strings('menu.create')
  }
}
export default CreateStep