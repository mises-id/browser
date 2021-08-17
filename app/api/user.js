import request from 'app/util/request';

/*
 * @Author: lmk
 * @Date: 2021-08-11 00:52:54
 * @LastEditTime: 2021-08-17 00:42:10
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
export function attachment(data) {
  return request({
    data,
    url: '/attachment',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
