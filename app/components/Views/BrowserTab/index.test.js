/*
 * @Author: lmk
 * @Date: 2021-07-05 10:09:07
 * @LastEditTime: 2021-08-14 23:12:49
 * @LastEditors: lmk
 * @Description:
 */
jest.useFakeTimers();

import React from 'react';
import {shallow} from 'enzyme';
import {BrowserTab} from './';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from 'app/reducers';

describe('Browser', () => {
  it('should render correctly', () => {
    const navigation = {
      state: {},
    };
    const store = createStore(rootReducer);
    const wrapper = shallow(
      <Provider store={store}>
        <BrowserTab initialUrl="https://mises.site" navigation={navigation} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
