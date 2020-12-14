/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-01 16:37:15
 * @LastEditTime: 2020-12-14 19:20:51
 * @LastEditors: zzz
 */
import request from '@/utils/request'

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
export function invoicelist(data) {
  return request({
    url: '/api/kaipiao/search',
    method: 'post',
    data
  })
}

// 申请开票
export function sqkaipiao(data) {
  return request({
    url: '/api/kaipiao/add',
    method: 'post',
    data
  })
}

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
export function getInvoiceList(data) {
  return request({
    // url: '/api/kaipiao/search',
    url: '/api/invoice/search',
    method: 'post',
    data
  })
}

// 添加开票信息
export function addInvoice(data) {
  return request({
    url: '/api/invoice/add',
    method: 'post',
    data
  })
}

// 删除开票信息
export function delInvoice(params) {
  return request({
    url: '/api/invoice/delete',
    method: 'get',
    params
  })
}

export function batchDelInvoice(data) {
  return request({
    url: '/api/invoice/batch/delete',
    method: 'post',
    data
  })
}

// 编辑开票信息
export function editInvoice(data) {
  return request({
    url: '/api/invoice/update',
    method: 'post',
    data
  })
}

// 快递信息列表
export function getExpressList(data) {
  return request({
    url: '/api/express/search',
    method: 'post',
    data
  })
}

// 快递信息列表
export function addExpress(data) {
  return request({
    url: '/api/express/add',
    method: 'post',
    data
  })
}

// 快递信息列表
export function editExpress(data) {
  return request({
    url: '/api/express/update',
    method: 'post',
    data
  })
}

// 快递信息列表
export function batchDelExpress(data) {
  return request({
    url: '/api/express/batch/delete',
    method: 'post',
    data
  })
}

export function delExpress(params) {
  return request({
    url: '/api/express/delete',
    method: 'get',
    params
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

// 产品列表 /api/product/search
export function getProduct(data) {
  return request({
    url: '/api/product/search',
    method: 'post',
    data
  })
}

// 添加产品
export function addProduct(data) {
  return request({
    url: '/api/product/add',
    method: 'post',
    data
  })
}
// 编辑产品
export function updateProduct(data) {
  return request({
    url: '/api/product/update',
    method: 'post',
    data
  })
}

// 删除产品
export function delProduct(params) {
  return request({
    url: '/api/product/delete',
    method: 'get',
    params
  })
}

// 批量删除 /api/product/batch/delete
export function batchDelProduct(params) {
  return request({
    url: '/api/product/batch/delete',
    method: 'get',
    params
  })
}

// 获取支付信息
export function getPayinfo(data) {
  return request({
    url: '/api/common/getPayinfo',
    method: 'post',
    data
  })
}
