import request from 'app/util/request';

/*
 * @Author: lmk
 * @Date: 2021-08-11 00:52:54
 * @LastEditTime: 2021-08-11 00:54:12
 * @LastEditors: lmk
 * @Description:
 */
export function signin(data) {
  return request({
    data,
    url: '/signin',
    method: 'post',
  });
}

export function createStatus(data) {
  return request({
    data,
    url: '/status',
    method: 'post',
  });
}
