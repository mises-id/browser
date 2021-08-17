/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-08-17 23:56:53
 * @LastEditors: lmk
 * @Description: Restore misesid
 */
import sdk from 'app/core/Sdk';
import {strings} from 'app/locales/i18n';
import {Toast} from 'app/util';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
const word = (item = {}, key) => {
  return (
    <View key={key} style={styles.wordContent}>
      <Text style={styles.wordTxt}>{item.value}</Text>
    </View>
  );
};
const Restore = ({navigation}) => {
  const [data, setdata] = useState([]);
  const [isHidden, setisHidden] = useState(true);
  const [value, setvalue] = useState('');
  const back = () => {
    navigation.goBack(null);
  };
  const getChange = ({nativeEvent}) => {
    const {text} = nativeEvent;
    const arr = text
      .split(',')
      .filter(val => val)
      .map(val => ({value: val}));
    if (arr.length < 13) {
      setvalue(text);
      setdata(arr);
    }
    setisHidden(data.length < 12);
  };
  const submit = () => {
    const mnemonics = data.map(val => val.value).join(' ');
    sdk
      .checkMnemonics(mnemonics)
      .then(res => {
        navigation.push('Password', {
          mnemonics,
        });
      })
      .catch(err => {
        Toast(err.message);
      });
  };
  return (
    <View style={styles.pageBox}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{strings('restore.title')}</Text>
      </View>
      <View style={styles.inputBox}>
        <TextInput
          placeholder={strings('common.placeholder')}
          value={value}
          onChange={getChange}
        />
      </View>
      {data.length > 0 && (
        <View style={styles.wordsContainer}>{data.map(word)}</View>
      )}
      <View style={styles.btnBox}>
        <TouchableOpacity onPress={submit}>
          <View
            style={[
              styles.btnStyle,
              isHidden ? styles.disableSuccess : styles.success,
            ]}>
            <Text
              style={
                isHidden ? styles.disableSuccessBtnTxt : styles.successBtnTxt
              }>
              {strings('restore.success_button')}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={back}>
          <View style={[styles.btnStyle, styles.cancel]}>
            <Text style={styles.cancelBtnTxt}>
              {strings('common.cancel_button')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  pageBox: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  titleBox: {
    paddingTop: 25,
    paddingBottom: 17,
  },
  inputBox: {
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 25,
  },
  wordsContainer: {
    borderColor: '#EEEEEE',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  wordContent: {
    padding: 15,
    borderRadius: 5,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7FF',
    margin: 5,
  },
  wordTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D61FF',
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
  disableSuccess: {
    borderColor: '#bdbfff',
  },
  disableSuccessBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bdbfff',
  },
  success: {
    borderColor: '#5D61FF',
  },
  successBtnTxt: {
    fontSize: 16,
    color: '#5D61FF',
    fontWeight: 'bold',
  },
  cancel: {
    borderColor: '#EEEEEE',
    backgroundColor: '#EEEEEE',
  },
  cancelBtnTxt: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
});
Restore.navigationOptions = () => {
  return {
    headerTitle: strings('menu.restore'),
  };
};
export default Restore;
