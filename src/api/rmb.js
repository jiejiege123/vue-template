/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-01 16:37:15
 * @LastEditTime: 2019-11-11 17:39:58
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request'
import qs from 'qs'

// 获取缴费系统组织机构
export function getComCodelist(params) {
  return request({
    url: '/Com/Rmb/ComCodelist',
    method: 'get',
    params
  })
}
// 编辑企业数据
// export function updateCompanysData(data) {
//   return request({
//     url: '/System/Companys/Update',
//     method: 'post',
//     data
//   })
// }

// 获取充值记录

export function getRechargetlist(params) {
  return request({
    url: '/Com/Rmb/rechargetlist',
    method: 'get',
    params
  })
}

// 微信支付充值接口
export function getweixinpayinfo(data) {
  return request({
    url: '/Com/Rmb/getweixinpayinfo',
    method: 'post',
    data
  })
}

// 基础信息
export function getbaseinfo(params) {
  return request({
    url: '/Com/Rmb/getbaseinfo',
    method: 'get',
    params
  })
}

// 发票记录
export function invoicelist(params) {
  return request({
    url: '/Com/Rmb/invoicelist',
    method: 'get',
    params
  })
}

// 申请开票
export function sqkaipiao(data) {
  return request({
    url: '/Com/Rmb/sqkaipiao',
    method: 'post',
    data
  })
}
// /Com/Rmb/newkaipiao
export function newkaipiao(data) {
  return request({
    url: '/Com/Rmb/newkaipiao',
    method: 'post',
    data
  })
}
// 消费记录
export function getComUselist(params) {
  return request({
    url: '/Com/Rmb/ComUselist',
    method: 'get',
    params
  })
}

// 开票信息列表
export function getInvoiceList(params) {
  return request({
    url: '/Com/Rmb/GetInvoiceList',
    method: 'get',
    params
  })
}

// 添加开票信息
export function addInvoice(data) {
  return request({
    url: '/Com/Rmb/AddInvoice',
    method: 'post',
    data
  })
}

// 删除开票信息
export function delInvoice(data) {
  return request({
    url: '/Com/Rmb/DelInvoice',
    method: 'post',
    data
  })
}

// 编辑开票信息
export function editInvoice(data) {
  return request({
    url: '/Com/Rmb/EditInvoice',
    method: 'post',
    data
  })
}

// 快递信息列表
export function getExpressList(params) {
  return request({
    url: '/Com/Rmb/GetExpressList',
    method: 'get',
    params
  })
}

// 快递信息列表
export function addExpress(data) {
  return request({
    url: '/Com/Rmb/AddExpress',
    method: 'post',
    data
  })
}

// 快递信息列表
export function editExpress(data) {
  return request({
    url: '/Com/Rmb/EditExpress',
    method: 'post',
    data
  })
}

// 快递信息列表
export function delExpress(data) {
  return request({
    url: '/Com/Rmb/DelExpress',
    method: 'post',
    data
  })
}

// 企业未开票记录
export function comUselistNo(params) {
  return request({
    url: '/Com/Rmb/ComUselistNo',
    method: 'get',
    params
  })
}

// ComUselistQer
export function getComUselistQer(params) {
  return request({
    url: '/Com/Rmb/ComUselistQer',
    method: 'get',
    params
  })
}

// 库区支付
export function getweixinpayinfoByKq(data) {
  return request({
    url: '/Com/Rmb/getweixinpayinfoByKq',
    method: 'post',
    data
  })
}

// 生产单位数据
export function comkuqulist(params) {
  return request({
    url: '/Com/Rmb/comkuqulist',
    method: 'get',
    params
  })
}
