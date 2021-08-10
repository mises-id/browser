/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-08-10 22:50:41
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
import {NavigationActions, StackActions} from 'react-navigation';
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
const Create = ({navigation}) => {
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
  const {params} = navigation.state;
  const [isHidden, setisHidden] = useState(true);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (params) {
      const mnemonics = params.mnemonics
        .split(',')
        .map(val => ({value: val, isShow: false}));
      setdata(mnemonics);
    }
    return () => {
      console.log(loading);
      setloading(false);
    };
  }, [params, loading]);
  const submit = () => {
    //if(!isHidden){
    if (loading) {
      return false;
    }
    setloading(true);
    navigation.push('Password', params);
    //}
  };
  const back = routeName => {
    if (routeName) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName})],
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
      const findIndex = data.findIndex(val => val.value === text);
      if (findIndex > -1) {
        data[findIndex].isShow = true;
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
