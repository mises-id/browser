import React from 'react';
import {shallow} from 'enzyme';
import Entry from './';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';

const initialState = {
  user: {
    passwordSet: false,
  },
  engine: {
    backgroundState: {
      PreferencesController: {},
    },
  },
};

const mockStore = configureMockStore();

const store = mockStore(initialState);

describe('Entry', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Entry />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
