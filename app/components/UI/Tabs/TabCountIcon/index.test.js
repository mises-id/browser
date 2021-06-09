import React from 'react';
import TabCountIcon from './';
import configureMockStore from 'redux-mock-store';
import {shallow} from 'enzyme';

const mockStore = configureMockStore();

describe('TabCountIcon', () => {
  it('should render correctly', () => {
    const initialState = {
      browser: {
        tabs: [{url: 'https://mises.site'}],
      },
    };

    const onPress = () => null;

    const wrapper = shallow(<TabCountIcon onPress={onPress} />, {
      context: {store: mockStore(initialState)},
    });
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
