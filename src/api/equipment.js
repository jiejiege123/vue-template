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

// 添加设备到本公司
export function imeiAddEqui(params) {
  return request({
    url: '/api/device/imei/add',
    method: 'get',
    params
  })
}

export function updateEqui(data) {
  return request({
    url: '/api/device/update',
    method: 'post',
    data
  })
}

export function delEqui(params) {
  return request({
    url: '/api/device/delete',
    method: 'get',
    params
  })
}

export function batchDelEqui(data) {
  return request({
    url: '/api/device/batch/delete',
    method: 'post',
    data
  })
}

export function getEquiByid(params) {
  return request({
    url: '/api/device/get',
    method: 'get',
    params
  })
}
// 过户
export function transferEqui(data) {
  return request({
    url: '/api/device/transfer',
    method: 'post',
    data
  })
}

export function importEqui(data) {
  return request({
    url: '/api/device/batch/import',
    method: 'post',
    data
  })
}

export function exportEqui(data) {
  return request({
    url: '/api/device/export',
    method: 'post',
    data
  })
}

export function setModeEqui(data) {
  return request({
    url: '/api/device/mode/set',
    method: 'post',
    data
  })
}
export function setConfigEqui(data) {
  return request({
    url: '/api/device/config',
    method: 'post',
    data
  })
}

export function getConfigEqui(params) {
  return request({
    url: '/api/device/config/get',
    method: 'get',
    params
  })
}

export function addEquiByImei(params) {
  return request({
    url: '/api/device/imei/add',
    method: 'get',
    params
  })
}

// 设备故障列表
export function getEquiFalseList(params) {
  return request({
    url: '/api/device/malfunction/get',
    method: 'get',
    params
  })
}

// 设备报警列表
export function getEquiAlarmList(params) {
  return request({
    url: '/api/device/alarmevent/get',
    method: 'get',
    params
  })
}

// 批次管理
export function getPiciList(data) {
  return request({
    url: '/api/batchno/search',
    method: 'post',
    data
  })
}

export function addPici(data) {
  return request({
    url: '/api/batchno/add',
    method: 'post',
    data
  })
}

export function updatePici(data) {
  return request({
    url: '/api/batchno/update',
    method: 'post',
    data
  })
}

export function delPici(params) {
  return request({
    url: '/api/batchno/delete',
    method: 'get',
    params
  })
}

// 型号管理
export function getModelList(data) {
  return request({
    url: '/api/model/search',
    method: 'post',
    data
  })
}

export function addModel(data) {
  return request({
    url: '/api/model/add',
    method: 'post',
    data
  })
}
export function updateModel(data) {
  return request({
    url: '/api/model/update',
    method: 'post',
    data
  })
}
export function delModel(params) {
  return request({
    url: '/api/model/delete',
    method: 'get',
    params
  })
}

// 获取当前接警人
export function getAlarmuser(params) {
  return request({
    url: '/api/device/alarmuser/get',
    method: 'get',
    params
  })
}

export function bindAlarmuser(data) {
  return request({
    url: '/api/device/alarmuser/bind',
    method: 'post',
    data
  })
}

export function unbindAlarmuser(data) {
  return request({
    url: '/api/device/alarmuser/unbind',
    method: 'post',
    data
  })
}

// 设备总数 /api/device/totalnum/get
export function getTotalEqui(params) {
  return request({
    url: '/api/device/totalnum/get',
    method: 'get',
    params
  })
}

// 今日 报警 故障
export function gettotalnum(params) {
  return request({
    url: '/api/monitor/faultandalarm/gettotalnum',
    method: 'get',
    params
  })
}

// 设备状态曲线图 /
export function getDevicestatus(params) {
  return request({
    url: '/api/monitor/devicestatuscurvefigure/get',
    method: 'get',
    params
  })
}

// 设备健康指数
export function getHealth(params) {
  return request({
    url: '/api/monitor/healthindex/get',
    method: 'get',
    params
  })
}

// 设备报警原因
export function getAlarmortest(params) {
  return request({
    url: '/api/monitor/alarmortest/set',
    method: 'get',
    params
  })
}

// 今日故障或者报警
export function getTodayfaultandalarm(params) {
  return request({
    url: '/api/monitor/todayfaultandalarm/get',
    method: 'get',
    params
  })
}
