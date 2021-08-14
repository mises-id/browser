/*
 * @Author: lmk
 * @Date: 2021-07-19 22:12:23
 * @LastEditTime: 2021-08-14 18:24:57
 * @LastEditors: lmk
 * @Description: Restore test
 */
import React from 'react';
import {shallow} from 'enzyme';
import Restore from './';

describe('Restore', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Restore />);
    expect(wrapper).toMatchSnapshot();
  });
});
