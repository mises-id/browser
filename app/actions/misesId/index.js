/*
 * @Author: lmk
 * @Date: 2021-08-02 13:46:43
 * @LastEditTime: 2021-08-11 00:48:01
 * @LastEditors: lmk
 * @Description:
 */
export function setMisesAuth(auth) {
  return {
    type: 'SET_MISESAUTH',
    auth,
  };
}

export function setToken(token) {
  return {
    type: 'SET_TOKEN',
    token,
  };
}
