/*
 * @Author: zzz
 * @LastEditors: zzz
 */
import request from '@/utils/request'

// 修改单位配置信息
export function updateComInfo(data) {
  return request({
    url: '/api/company/config',
    method: 'post',
    data
  })
}
export function getComInfo(params) {
  return request({
    url: '/api/company/config/get',
    method: 'get',
    params
  })
}
