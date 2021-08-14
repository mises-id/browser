import React from 'react';
import {shallow} from 'enzyme';
import {NavigationContainer} from '@react-navigation/native';

describe('Main', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<NavigationContainer />);
    expect(wrapper).toMatchSnapshot();
  });
});
