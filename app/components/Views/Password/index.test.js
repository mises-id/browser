/*
 * @Author: lmk
 * @Date: 2021-07-19 22:12:23
 * @LastEditTime: 2021-08-14 23:14:39
 * @LastEditors: lmk
 * @Description: Password test
 */
import React from 'react';
import {shallow} from 'enzyme';
import Password from './';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from 'app/reducers';

describe('Password', () => {
  it('should render correctly', () => {
    const store = createStore(rootReducer);
    const wrapper = shallow(
      <Provider store={store}>
        <Password />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
