/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-07-25 21:53:56
 * @LastEditors: lmk
 * @Description: Restore misesid
 */
import { strings } from 'app/locales/i18n';
import React, { useReducer, useEffect, useRef, useState } from 'react';
import {Platform, StyleSheet, Text, View,Image ,TouchableOpacity, TextInput, Button, ScrollView} from 'react-native';
const word = (item={},key)=>{
  return <View key={key} style={styles.wordContent}>
    <Text style={styles.wordTxt}>{item.value}</Text>
    {!item.isShow&&<View style={styles.isHidden}>
      <Text style={styles.isHiddenTxt}>?</Text>
    </View>}
  </View>
}
const Create = ({navigation})=>{
  const [data, setdata] = useState([{value:'cloud'},{value:'rabbit'},{value:'fly'},{value:'hawk'},{value:'contemplate'},{value:'pretty'},{value:'superduty'},{value:'lovely'},{value:'come'},{value:'gift'},{value:'main'},{value:'green'}])
  const nextStep = ()=>{
    navigation.push('CreateStep2')
  }
  const [inputValue, setinputValue] = useState('')
  const getChange = ({nativeEvent})=>{
    const {text} = nativeEvent;
    setinputValue(text)
    if(text){
      const findIndex = data.findIndex(val=>val.value===text);
      if(findIndex>-1){
        data[findIndex].isShow = true;
        setdata([...data])
        setinputValue('')
      }
    }
  }
  return <ScrollView>
    <View style={styles.pageBox}>
    <View style={styles.titleBox}><Text style={styles.title}>{strings('restore.title')}</Text></View>
    <View style={styles.inputBox}>
      <TextInput value={inputValue} onChange={getChange} placeholder={strings('common.placeholder')}></TextInput>
    </View>
    <View style={styles.wordsContainer}>
      {data.map(word)}
    </View>
    <View style={styles.btnBox}>
      <TouchableOpacity onPress={nextStep}>
        <View style={[styles.btnStyle,styles.success]}>
          <Text style={styles.successBtnTxt}>{strings('create.success_button')}</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.btnStyle,styles.cancel]}>
        <Text style={styles.cancelBtnTxt}>{strings('common.cancel_button')}</Text>
      </View>
      <View style={styles.back}><Text style={styles.backTxt}>{strings('create.back')}</Text></View>
    </View>
  </View>
  </ScrollView>
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
  },
  isHidden:{
    position:"absolute",
    left:0,
    right:0,
    top:0,
    bottom:0,
    backgroundColor:'#eee',
    borderRadius:5,
    alignItems:"center",
    justifyContent:"center"
  },
  isHiddenTxt:{
    color:'#999',
    fontSize:21
  },
  back:{
    marginTop:25,
    alignItems:'center',
    marginBottom:200
  },
  backTxt:{
    fontSize:15,
    color:'#5D61FF'
  }
})
Create.navigationOptions = ()=>{
  return {
    headerTitle:strings('menu.create')
  }
}
export default Create