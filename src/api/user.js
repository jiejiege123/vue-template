/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-02 11:21:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\api\user.js
 */
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
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
