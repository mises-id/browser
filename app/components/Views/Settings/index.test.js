import React from 'react';
import {shallow} from 'enzyme';
import Settings from './';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';

const initialState = {
  user: {seedphraseBackedUp: true},
  privacy: {approvedHosts: [], privacyMode: true},
  browser: {history: []},
  settings: {
    lockTime: 1000,
    searchEngine: 'DuckDuckGo',
    useBlockieIcon: true,
  },
  engine: {
    backgroundState: {
      CurrencyRateController: {currentCurrency: 'USD'},
      NetworkController: {
        provider: {
          type: 'mainnet',
        },
      },
      PreferencesController: {selectedAddress: '0x0'},
    },
  },
};
const mockStore = configureMockStore();
const store = mockStore(initialState);

describe('Settings', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Settings
          navigation={{
            state: {params: {}},
          }}
        />
      </Provider>,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
