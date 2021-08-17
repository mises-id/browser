/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-08-16 23:01:13
 * @LastEditors: lmk
 * @Description: Restore misesid
 */
import {strings} from 'app/locales/i18n';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
const word = (item = {}, key) => {
  return (
    <View key={key} style={styles.wordContent}>
      <Text style={styles.wordTxt}>{item.value}</Text>
      {!item.isShow && (
        <View style={styles.isHidden}>
          <Text style={styles.isHiddenTxt}>?</Text>
        </View>
      )}
    </View>
  );
};
const Create = ({navigation = {}}) => {
  const [data, setdata] = useState([
    {value: 'cloud'},
    {value: 'rabbit'},
    {value: 'fly'},
    {value: 'hawk'},
    {value: 'contemplate'},
    {value: 'pretty'},
    {value: 'superduty'},
    {value: 'lovely'},
    {value: 'come'},
    {value: 'gift'},
    {value: 'main'},
    {value: 'green'},
  ]);
  const {params = {}} = navigation.state || {};
  const [isHidden, setisHidden] = useState(true);
  const [loading, setloading] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  useEffect(() => {
    if (params) {
      const mnemonics = params.mnemonics
        .split(',')
        .map(val => ({value: val, isShow: false}));
      setdata(mnemonics);
    }
    return () => {
      setloading(false);
      setisHidden(true);
      setcurrentIndex(0);
    };
  }, [params, loading]);
  const submit = () => {
    const isHiddenFlag = data.some(val => !val.isShow);
    console.log(isHidden, 'isHidden', loading, 'loading', isHiddenFlag);
    // 如果当前为isHidden（禁止状态）且loading为true 就阻止 否则通过
    if (loading && isHiddenFlag) {
      return false;
    }
    setloading(true);
    if (!isHiddenFlag) {
      navigation.push('Password', params);
    }
  };
  const back = routeName => {
    if (routeName) {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: routeName}],
      });
      navigation.dispatch(resetAction);
      return false;
    }
    navigation.goBack(null);
  };
  const [inputValue, setinputValue] = useState('');
  const getChange = ({nativeEvent}) => {
    const {text} = nativeEvent;
    setinputValue(text);
    if (text) {
      const currentText = data[currentIndex].value;
      if (text === currentText) {
        data[currentIndex].isShow = true;
        setcurrentIndex(currentIndex + 1);
        setdata([...data]);
        setinputValue('');
        const isHiddenFlag = data.some(val => !val.isShow);
        setisHidden(isHiddenFlag);
      }
    }
  };
  return (
    <ScrollView>
      <View style={styles.pageBox}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{strings('restore.title')}</Text>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            value={inputValue}
            onChange={getChange}
            placeholder={strings('common.placeholder')}
          />
        </View>
        <View style={styles.wordsContainer}>{data.map(word)}</View>
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
                {strings('create.success_button')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => back('Main')}>
            <View style={[styles.btnStyle, styles.cancel]}>
              <Text style={styles.cancelBtnTxt}>
                {strings('common.cancel_button')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => back(null)}>
            <View style={styles.back}>
              <Text style={styles.backTxt}>{strings('create.back')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  success: {
    borderColor: '#5D61FF',
  },
  disableSuccess: {
    borderColor: '#bdbfff',
  },
  disableSuccessBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bdbfff',
  },
  successBtnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D61FF',
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
  isHidden: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isHiddenTxt: {
    color: '#999',
    fontSize: 21,
  },
  back: {
    marginTop: 25,
    alignItems: 'center',
    marginBottom: 200,
  },
  backTxt: {
    fontSize: 15,
    color: '#5D61FF',
  },
});
Create.navigationOptions = () => {
  return {
    headerTitle: strings('menu.create'),
  };
};
export default Create;
