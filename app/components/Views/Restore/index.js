/*
 * @Author: lmk
 * @Date: 2021-07-19 12:17:48
 * @LastEditTime: 2021-08-14 18:24:28
 * @LastEditors: lmk
 * @Description: Restore misesid
 */
import {strings} from 'app/locales/i18n';
import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
const word = (item = {}, key) => {
  return (
    <View key={key} style={styles.wordContent}>
      <Text style={styles.wordTxt}>{item.value}</Text>
    </View>
  );
};
const Restore = props => {
  const [data] = useState([
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
  return (
    <View style={styles.pageBox}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{strings('restore.title')}</Text>
      </View>
      <View style={styles.inputBox}>
        <TextInput placeholder={strings('common.placeholder')} />
      </View>
      <View style={styles.wordsContainer}>{data.map(word)}</View>
      <View style={styles.btnBox}>
        <View style={[styles.btnStyle, styles.success]}>
          <Text style={styles.successBtnTxt}>
            {strings('restore.success_button')}
          </Text>
        </View>
        <View style={[styles.btnStyle, styles.cancel]}>
          <Text style={styles.cancelBtnTxt}>
            {strings('common.cancel_button')}
          </Text>
        </View>
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
