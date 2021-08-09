/*
 * @Author: lmk
 * @Date: 2021-08-02 17:15:53
 * @LastEditTime: 2021-08-10 00:42:28
 * @LastEditors: lmk
 * @Description: 
 */
/**
 * @param {*} init use hooks 
 */
import { useCallback, useState } from "react";
import { WToast } from "react-native-smart-tip";
 export function useBind(init) {
  let [value, setValue] = useState(init);
  let onChange = useCallback(event=> {
    setValue(event.nativeEvent.text);
  }, []);
  return {
    value,
    setValue,
    onChange
  };
}
/**
 * @description: showToast txt
 * @param {*} data content
 * @return {*}
 */
export function Toast(data){
  WToast.show({data})
}

export function urlToJson(url = '') {

  let obj = {},
    index = url.indexOf('?'),
    params = url.substr(index + 1);
  
  if (index !== -1) { // 有参数时
    let parr = params.split('&');
    for (let i of parr) {
      let arr = i.split('=');
      obj[arr[0]] = arr[1];
    }
  }

  return obj;
}
export function obj2strUrl(obj={}){
  let str="";
  for (let key in obj) {
    str = `${str}${key}=${obj[key]}&`
  };
  str = str.substring(0, str.length-1);
  return str;
}