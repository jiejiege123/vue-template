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
