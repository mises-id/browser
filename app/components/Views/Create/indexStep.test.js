/*
 * @Author: lmk
 * @Date: 2021-07-19 22:12:23
 * @LastEditTime: 2021-08-14 18:24:00
 * @LastEditors: lmk
 * @Description: CreateStepOne test
 */
import React from 'react';
import {shallow} from 'enzyme';
import indexStep from './indexStep';

describe('indexStep', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<indexStep />);
    expect(wrapper).toMatchSnapshot();
  });
});
