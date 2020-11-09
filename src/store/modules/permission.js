/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-09 10:59:13
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\store\modules\permission.js
 */
import { constantRoutes } from '@/router'
import Layout from '@/layout'

import { findItem } from '@/utils/index'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const state = {
  routes: [],
  addRoutes: [],
  btns: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BTNS: (state, btns) => {
    state.btns = btns
  }
}
const view404 = resv => require([`@/views/error-page/404.vue`], resv)

const actions = {
  generateRoutes({ commit }, routesRes) {
    return new Promise(resolve => {
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      const addRoutes = []
      let btns = []
      // 将数组写成路由标准路由格式
      // 应该使用递归来写
      function calleArr(array, fatherUrl, pushAraay) {
        array.forEach((n, index) => {
          if (n.Type === 4 || n.Type === 1) {
            if (n.Btns) {
              btns = btns.concat(n.Btns)
            }
            let path, component, hidden, activeMenu, noCache, noTagView, activeTags
            // 找到上一级的 item
            if (n.Type === 4) {
              path = `/${n.Url}`
              component = Layout
            } else {
              path = fatherUrl + `/${n.Url}`
              let comp
              try { comp = require(`@/views/pages${path}/index.vue`) } catch (e) {
                console.log(e)
              }
              if (comp && comp.default) {
                component = (res) => require([`@/views/pages${path}/index.vue`], res)
              } else {
                component = view404
              }
            }
            const breadcrumbItem = []
            if (n.Url === 'User' || n.Url === 'Role') {
              hidden = true
              activeMenu = '/System/Companys'
              noCache = true
              noTagView = true
              findItem(addRoutes, item => {
                return item.name === 'Companys'
              }, breadcrumbItem, 'children')
            } else if (n.Url === 'EquipmentItem') {
              hidden = true
              activeMenu = '/Equipment/EquipmentLists'
              noCache = true
              noTagView = true
              findItem(addRoutes, item => {
                return item.name === 'EquipmentLists'
              }, breadcrumbItem, 'children')
            } else {
              hidden = false
              noCache = true
              // noCache = false
              activeMenu = ''
              noTagView = false
            }

            if (n.Url === 'Companys') {
              activeTags = '/System/Role,/System/User'
            } else if (n.Url === 'EquipmentLists') {
              activeTags = '/Equipment/EquipmentItem'
            } else {
              activeTags = ''
            }

            pushAraay.push({
              path: path,
              hidden: hidden, // 侧边栏隐藏
              redirect: n.Children[0] && (n.Children[0].Type === '4' || n.Children[0].Type === '1') ? `${path}/${n.Children[0].Url}` : '',
              alwaysShow: false, // 总是显示根路由
              component: component,
              name: n.Url, // 必填 且不重名

              meta: {
                breadcrumbItem: breadcrumbItem[0],
                title: n.Name,
                icon: n.Icon,
                noCache: noCache, // 不缓存
                breadcrumb: true, // 面包屑
                affix: false, // tags-view 固定
                noTagView: noTagView, // tags-view 默认显示
                activeTags: activeTags, // tags-view 不显示 的高亮tag
                activeMenu: activeMenu // 路由条件高亮
              },
              children: []
            })
            if (n.Children.length > 0) {
              calleArr(n.Children, path, pushAraay[index].children)
            }
          }
        })
      }
      calleArr(routesRes, '', addRoutes)

      localStorage.setItem('addRoutes', JSON.stringify(addRoutes))
      commit('SET_ROUTES', addRoutes)
      commit('SET_BTNS', btns)
      resolve(state.routes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
