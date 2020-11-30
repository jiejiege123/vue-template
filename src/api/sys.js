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

// 系统消息列表
export function getSysMessage(data) {
  return request({
    url: '/api/message/search',
    method: 'post',
    data
  })
}

export function batchDelSmg(data) {
  return request({
    url: '/api/message/batch/delete',
    method: 'post',
    data
  })
}

export function delSmg(params) {
  return request({
    url: '/api/message/delete',
    method: 'get',
    params
  })
}

export function addSmg(data) {
  return request({
    url: '/api/message/add',
    method: 'post',
    data
  })
}
export function updateSmg(data) {
  return request({
    url: '/api/message/update',
    method: 'post',
    data
  })
}

// 设备占比
export function getPercent(params) {
  return request({
    url: '/api/monitor/device/percent/get',
    method: 'get',
    params
  })
}

// 大屏 左上角统计
export function getLefttopdata(params) {
  return request({
    url: '/api/monitor/lefttopdata/get',
    method: 'get',
    params
  })
}
