/*
 * @Author: lmk
 * @Date: 2021-07-19 22:12:23
 * @LastEditTime: 2021-07-19 22:12:43
 * @LastEditors: lmk
 * @Description: Password test
 */
import React from 'react';
import {shallow} from 'enzyme';
import Password from './';

describe('Password', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Password/>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
