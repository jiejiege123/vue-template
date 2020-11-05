/*
 * @Author: your name
 * @Date: 2020-11-03 12:15:16
 * @LastEditTime: 2020-11-05 17:07:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\api\com.js
 */
import request from '@/utils/request'

export function getCompany(data) {
  return request({
    url: '/api/company/search',
    method: 'post',
    data
  })
}

// 添加公司
export function addCom(data) {
  return request({
    url: '/api/company/add',
    method: 'post',
    data
  })
}
// 编辑公司
export function updateCom(data) {
  return request({
    url: '/api/company/update',
    method: 'post',
    data
  })
}
// 删除公司
export function delCom(params) {
  return request({
    url: '/api/company/deltet',
    method: 'get',
    params
  })
}
