/*
 * @Author: zzz
 * @LastEditors: zzz
 */
import request from '@/utils/request'

// 获取设备列表
export function getEquiList(data) {
  return request({
    url: '/api/device/search',
    method: 'post',
    data
  })
}

// 添加设备
export function addEqui(data) {
  return request({
    url: '/api/device/add',
    method: 'post',
    data
  })
}

// 更新设备
export function updateEqui(data) {
  return request({
    url: '/api/device/update',
    method: 'post',
    data
  })
}
// 删除设备
export function delEqui(params) {
  return request({
    url: '/api/device/delete',
    method: 'get',
    params
  })
}

// 批次管理
export function getPiciList(data) {
  return request({
    url: '/api/pici/search',
    method: 'post',
    data
  })
}

export function addPici(data) {
  return request({
    url: '/api/pici/add',
    method: 'post',
    data
  })
}

export function updatePici(data) {
  return request({
    url: '/api/pici/update',
    method: 'post',
    data
  })
}

export function delPici(params) {
  return request({
    url: '/api/pici/delete',
    method: 'get',
    params
  })
}
