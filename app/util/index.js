/*
 * @Author: lmk
 * @Date: 2021-08-02 17:15:53
 * @LastEditTime: 2021-08-02 17:32:36
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