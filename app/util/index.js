/*
 * @Author: lmk
 * @Date: 2021-08-02 17:15:53
 * @LastEditTime: 2021-08-11 01:17:06
 * @LastEditors: lmk
 * @Description:
 */
/**
 * @param {*} init use hooks
 */
import {useCallback, useState} from 'react';
import {WToast} from 'react-native-smart-tip';
export function useBind(init) {
  let [value, setValue] = useState(init);
  let onChange = useCallback(event => {
    setValue(event.nativeEvent.text);
  }, []);
  return {
    value,
    setValue,
    onChange,
  };
}
/**
 * @description: showToast txt
 * @param {*} data content
 * @return {*}
 */
export function Toast(data) {
  WToast.show({data});
}

export function urlToJson(url = '') {
  var question = url.indexOf('?');
  var hash = url.indexOf('#');
  if (hash === -1 && question === -1) {
    return {};
  }
  if (hash === -1) {
    hash = url.length;
  }
  var query =
    question === -1 || hash === question + 1
      ? url.substring(hash)
      : url.substring(question + 1, hash);
  var result = {};
  query.split('&').forEach(function (part) {
    if (!part) {
      return;
    }
    part = part.split('+').join(' '); // replace every + with space, regexp-free version
    var eq = part.indexOf('=');
    var key = eq > -1 ? part.substr(0, eq) : part;
    var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : '';
    var from = key.indexOf('[');
    if (from === -1) {
      result[decodeURIComponent(key)] = val;
    } else {
      var to = key.indexOf(']', from);
      var index = decodeURIComponent(key.substring(from + 1, to));
      key = decodeURIComponent(key.substring(0, from));
      if (!result[key]) {
        result[key] = [];
      }
      if (!index) {
        result[key].push(val);
      } else {
        result[key][index] = val;
      }
    }
  });
  return result;
}
export function obj2strUrl(obj = {}) {
  let str = '';
  for (let key in obj) {
    str = `${str}${key}=${obj[key]}&`;
  }
  str = str.substring(0, str.length - 1);
  return str;
}
