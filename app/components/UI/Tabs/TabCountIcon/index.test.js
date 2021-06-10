import React from 'react';
import TabCountIcon from './';
import configureMockStore from 'redux-mock-store';
import {shallow} from 'enzyme';
import {Provider} from 'react-redux';

const initialState = {
  browser: {
    tabs: [{url: 'https://mises.site'}],
  },
};
const mockStore = configureMockStore();
const store = mockStore(initialState);

describe('TabCountIcon', () => {
  it('should render correctly', () => {
    const onPress = () => null;

    const wrapper = shallow(
      <Provider store={store}>
        <TabCountIcon onPress={onPress} />
      </Provider>,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
