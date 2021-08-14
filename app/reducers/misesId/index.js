/*
 * @Author: lmk
 * @Date: 2021-08-02 13:40:27
 * @LastEditTime: 2021-08-11 00:48:10
 * @LastEditors: lmk
 * @Description:
 */
const initialState = {
  auth: null,
  token: null,
};

const misesIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MISESAUTH':
      return {
        ...state,
        auth: action.auth,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
};
export default misesIdReducer;
