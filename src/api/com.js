/*
 * @Author: your name
 * @Date: 2020-11-03 12:15:16
 * @LastEditTime: 2020-12-09 18:35:24
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\api\com.js
 */
import request from '@/utils/request'

export function getCompany(data) {
  return request({
    url: '/api/company/search',
    method: 'post',
    data
  })
}

// 添加公司
export function addCom(data) {
  return request({
    url: '/api/company/add',
    method: 'post',
    data
  })
}
// 编辑公司
export function updateCom(data) {
  return request({
    url: '/api/company/update',
    method: 'post',
    data
  })
}

// 删除公司
export function delCom(params) {
  return request({
    url: '/api/company/delete',
    method: 'get',
    params
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/api/user/search',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}
export function changepwd(data) {
  return request({
    url: '/api/user/changepwd',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/user/update',
    method: 'post',
    data
  })
}

// 更新状态
export function changeUserState(params) {
  return request({
    url: '/api/user/changestate',
    method: 'get',
    params
  })
}

// 直接修改用户密码
export function updateUserPsd(params) {
  return request({
    url: '/api/user/revisepassword',
    method: 'get',
    params
  })
}

// 修改当前用户密码
export function changeNowUserpwd(params) {
  return request({
    url: '/api/user/changepwd',
    method: 'get',
    params
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/api/role/search',
    method: 'post',
    data
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/api/role/add',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/api/role/update',
    method: 'post',
    data
  })
}

// 启停角色
export function enableRole(params) {
  return request({
    url: '/api/role/enable',
    method: 'get',
    params
  })
}

// 获取字典列表
export function getRoleDic(params) {
  return request({
    url: '/api/role/dic',
    method: 'get',
    params
  })
}

// 获取权限列表
export function getPermission(data) {
  return request({
    url: '/api/permission/search',
    method: 'post',
    data
  })
}

export function getPermissionAll(params) {
  return request({
    url: '/api/permission/getall',
    method: 'get',
    params
  })
}
export function addPermission(data) {
  return request({
    url: '/api/permission/add',
    method: 'post',
    data
  })
}
export function updatePermission(data) {
  return request({
    url: '/api/permission/update',
    method: 'post',
    data
  })
}
export function delPermission(data) {
  return request({
    url: '/api/permission/delete',
    method: 'post',
    data
  })
}

export function batchDelPermission(data) {
  return request({
    url: '/api/permission/batch/delete',
    method: 'post',
    data
  })
}
