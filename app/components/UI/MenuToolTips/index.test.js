import React from 'react';
import {shallow} from 'enzyme';
import MenuToolTips from './';

describe('MenuToolTips', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<MenuToolTips />);
    expect(wrapper).toMatchSnapshot();
  });
});
