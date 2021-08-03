/*
 * @Author: lmk
 * @Date: 2021-08-02 13:40:27
 * @LastEditTime: 2021-08-02 13:45:57
 * @LastEditors: lmk
 * @Description: 
 */
const initialState = {
  sdk:null
};

const misesIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SDK':
      return {
        ...state,
        sdk: action.sdk
      };
    default:
      return state;
  }
};
export default misesIdReducer;
