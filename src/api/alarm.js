/*
 * @Author: zzz
 * @LastEditors: zzz
 */
import request from '@/utils/request'

export function getAlarmList(data) {
  return request({
    url: '/api/alarm/search',
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
