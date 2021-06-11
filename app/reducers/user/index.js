import {REHYDRATE} from 'redux-persist';

const initialState = {
  identities: {},
  accounts: {},
  selectedAddress: '',
  keyrings: [],
  loadingMsg: '',
  loadingSet: false,
  passwordSet: false,
  seedphraseBackedUp: false,
  backUpSeedphraseVisible: false,
  protectWalletModalVisible: false,
  gasEducationCarouselSeen: false,
};

function randomString(randomLen, min, max) {
  var str = '',
    range = min,
    arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
  // 随机产生
  if (randomLen) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.user) {
        return {...state, ...action.payload.user};
      }
      return state;
    case 'LOADING_SET':
      return {
        ...state,
        loadingSet: true,
        loadingMsg: action.loadingMsg,
      };
    case 'LOADING_UNSET':
      return {
        ...state,
        loadingSet: false,
      };
    case 'PASSWORD_SET':
      return {
        ...state,
        passwordSet: true,
      };
    case 'PASSWORD_UNSET':
      return {
        ...state,
        passwordSet: false,
      };
    case 'SEEDPHRASE_NOT_BACKED_UP':
      return {
        ...state,
        seedphraseBackedUp: false,
        backUpSeedphraseVisible: true,
      };
    case 'SEEDPHRASE_BACKED_UP':
      return {
        ...state,
        seedphraseBackedUp: true,
        backUpSeedphraseVisible: false,
      };
    case 'BACK_UP_SEEDPHRASE_VISIBLE':
      return {
        ...state,
        backUpSeedphraseVisible: true,
      };
    case 'BACK_UP_SEEDPHRASE_NOT_VISIBLE':
      return {
        ...state,
        backUpSeedphraseVisible: false,
      };
    case 'PROTECT_MODAL_VISIBLE':
      if (!state.seedphraseBackedUp) {
        return {
          ...state,
          protectWalletModalVisible: true,
        };
      }
      return state;
    case 'PROTECT_MODAL_NOT_VISIBLE':
      return {
        ...state,
        protectWalletModalVisible: false,
      };
    case 'SET_GAS_EDUCATION_CAROUSEL_SEEN':
      return {
        ...state,
        gasEducationCarouselSeen: true,
      };
    case 'GENERATE_RANDOM_USER':
      return {
        ...state,
        selectedAddress: randomString(false, 32),
      };
    default:
      return state;
  }
};
export default userReducer;
