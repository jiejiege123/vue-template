/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-04 09:23:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\api\user.js
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/account/login',
    // url: '/vue-element-admin/user/login',
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' }
  })
}
// export function login(params) {
//   const data = JSON.stringify(params)
//   return request({
//     url: '/Accounts/Login',
//     method: 'post',
//     data,
//     headers: { 'Content-Type': 'application/json' }
//   })
// }
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/account/logout',
    method: 'post'
  })
}

export function getRouter(params) {
  return request({
    url: '/vue-element-admin/user/GetClientsDataJson',
    method: 'get',
    params
  })
}
