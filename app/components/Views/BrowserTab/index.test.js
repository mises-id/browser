/*
 * @Author: lmk
 * @Date: 2021-07-05 10:09:07
 * @LastEditTime: 2021-07-19 22:17:30
 * @LastEditors: lmk
 * @Description: 
 */
jest.useFakeTimers();

import React from 'react';
import {shallow} from 'enzyme';
import {BrowserTab} from './';

describe('Browser', () => {
  it('should render correctly', () => {
    const navigation = {
      state:{}
    }
    const wrapper = shallow(<BrowserTab initialUrl="https://mises.site" navigation={navigation}/>);
    expect(wrapper).toMatchSnapshot();
  });
});
