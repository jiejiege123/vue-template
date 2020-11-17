/*
 * @Author: zzz
 * @LastEditors: zzz
 */
import request from '@/utils/request'

export function getAlarmList(data) {
  return request({
    url: '/api/alarmrecord/search',
    method: 'post',
    data
  })
}

export function getAlarmHistory(data) {
  return request({
    url: '/api/alarm/history',
    method: 'post',
    data
  })
}

// 工单
export function getWorkorder(data) {
  return request({
    url: '/api/workorder/search',
    method: 'post',
    data
  })
}

export function addWorkorder(data) {
  return request({
    url: '/api/workorder/add',
    method: 'post',
    data
  })
}

export function updateWorkorder(data) {
  return request({
    url: '/api/workorder/update',
    method: 'post',
    data
  })
}

export function exportWorkorder(data) {
  return request({
    url: '/api/workorder/export',
    method: 'post',
    data
  })
}

export function finishedWorkorder(data) {
  return request({
    url: '/api/workorder/finished',
    method: 'post',
    data
  })
}

export function processWorkorder(data) {
  return request({
    url: '/api/workorder/process',
    method: 'post',
    data
  })
}
