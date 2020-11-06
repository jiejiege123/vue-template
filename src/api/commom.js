/*
 * @Author: your name
 * @Date: 2020-11-06 16:33:53
 * @LastEditTime: 2020-11-06 16:37:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\api\commom.js
 */
import request from '@/utils/request'

// 根据值查询字典
/**
 *
 * @param {Array} {values:[]}
 */
export function getDicsByValue(params) {
  return request({
    url: '/api/dictionary/group/byvalue/select',
    method: 'get',
    params
  })
}

// 根据名称字典
/**
 *
 * @param {Array} {names:[]}
 */
export function getDicsByName(params) {
  return request({
    url: '/api/dictionary/group/byname/select',
    method: 'get',
    params
  })
}
