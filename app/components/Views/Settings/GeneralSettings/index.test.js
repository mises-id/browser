import React from 'react';
import {shallow} from 'enzyme';
import GeneralSettings from './';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';

const initialState = {
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

describe('GeneralSettings', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <GeneralSettings
          navigation={{
            state: {params: {}},
          }}
        />
      </Provider>,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
