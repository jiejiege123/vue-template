/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-05 09:56:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\store\modules\permission.js
 */
import { constantRoutes } from '@/router'
import Layout from '@/layout'
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
          if (n.Btns) {
            btns = btns.concat(n.Btns)
          }
          let path, component
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

          pushAraay.push({
            path: path,
            hidden: false, // 侧边栏隐藏
            redirect: n.Children[0] ? `${path}/${n.Children[0].Url}` : '',
            alwaysShow: false, // 总是显示根路由
            component: component,
            name: n.Url, // 必填 且不重名
            meta: {
              title: n.Name,
              icon: n.Icon,
              noCache: false, // 不缓存
              breadcrumb: true, // 面包屑
              affix: false, // tags-view 固定
              activeMenu: '' // 路由条件高亮
            },
            children: []
          })
          if (n.Children.length > 0) {
            calleArr(n.Children, path, pushAraay[index].children)
          }
        })
      }
      calleArr(routesRes, '', addRoutes)
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
