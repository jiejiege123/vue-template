/*
 * @Author: zzz
 * @LastEditors: zzz
 */
import request from '@/utils/request'

// 建筑物
export function getBuildingList(data) {
  return request({
    url: '/api/building/search',
    method: 'post',
    data
  })
}

export function addBuilding(data) {
  return request({
    url: '/api/building/add',
    method: 'post',
    data
  })
}

export function updateBuilding(data) {
  return request({
    url: '/api/building/update',
    method: 'post',
    data
  })
}
export function deleteBuilding(params) {
  return request({
    url: '/api/building/delete',
    method: 'get',
    params
  })
}

// 布防
export function armedBuilding(data) {
  return request({
    url: '/api/building/armed',
    method: 'post',
    data
  })
}

// 撤防
export function disarmBuilding(data) {
  return request({
    url: '/api/building/disarm',
    method: 'post',
    data
  })
}
// 楼层管理
export function getFloorList(data) {
  return request({
    url: '/api/floor/search',
    method: 'post',
    data
  })
}

export function addFloor(data) {
  return request({
    url: '/api/floor/add',
    method: 'post',
    data
  })
}

export function updateFloor(data) {
  return request({
    url: '/api/floor/update',
    method: 'post',
    data
  })
}
export function deleteFloor(params) {
  return request({
    url: '/api/floor/delete',
    method: 'get',
    params
  })
}

// 安装点管理
export function getInstallpointList(data) {
  return request({
    url: '/api/installpoint/search',
    method: 'post',
    data
  })
}

export function addInstallpoint(data) {
  return request({
    url: '/api/installpoint/add',
    method: 'post',
    data
  })
}

export function updateInstallpoint(data) {
  return request({
    url: '/api/installpoint/update',
    method: 'post',
    data
  })
}

export function deleteInstallpoint(params) {
  return request({
    url: '/api/installpoint/delete',
    method: 'get',
    params
  })
}

export function configInstallpoint(data) {
  return request({
    url: '/api/installpoint/config',
    method: 'post',
    data
  })
}

export function getConfigInstallpoint(params) {
  return request({
    url: '/api/installpoint/config/get',
    method: 'get',
    params
  })
}
