/*
 * @Author: lmk
 * @Date: 2021-08-02 13:40:27
 * @LastEditTime: 2021-08-07 09:54:20
 * @LastEditors: lmk
 * @Description: 
 */
const initialState = {
  auth:null
};

const misesIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MISESAUTH':
      return {
        ...state,
        auth: action.auth
      };
    default:
      return state;
  }
};
export default misesIdReducer;