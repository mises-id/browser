/*
 * @Author: lmk
 * @Date: 2021-07-19 22:12:23
 * @LastEditTime: 2021-08-14 18:34:47
 * @LastEditors: lmk
 * @Description: Create test
 */
import React from 'react';
import {shallow} from 'enzyme';
import Create from './';

describe('Create', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Create />);
    expect(wrapper).toMatchSnapshot();
  });
});
