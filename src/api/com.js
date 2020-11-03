/*
 * @Author: your name
 * @Date: 2020-11-03 12:15:16
 * @LastEditTime: 2020-11-03 12:16:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\api\com.js
 */
import request from '@/utils/request'

export function getCompany(params) {
  return request({
    url: '/vue-element-admin/com/getCompany',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}
