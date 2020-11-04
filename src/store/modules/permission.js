/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-02 16:25:47
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
  btnsPermission: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
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
      const btnsPermission = []
      // 将数组写成路由标准路由格式
      // 应该使用递归来写

      // function calleArr(array) {
      //   array.forEach(n => {
      //     addRoutes.push({
      //       path: `/${n.Url}`,
      //       hidden: false, // 侧边栏隐藏
      //       redirect: `/${n.Url}/${n.Children[0].Url}`,
      //       alwaysShow: true, // 总是显示根路由
      //       component: Layout,
      //       name: n.Id, // 必填 且不重名
      //       meta: {
      //         title: n.Name,
      //         icon: n.Icon,
      //         noCache: false, // 不缓存
      //         breadcrumb: true, // 面包屑
      //         affix: false, // tags-view 固定
      //         activeMenu: '' // 路由条件高亮
      //       },
      //       children: childrenComponents
      //     })
      //     if (n.Children.length > 0) {
      //       calleArr(n.Children)
      //     }
      //   })
      // }
      // calleArr(routesRes)
      commit('SET_ROUTES', addRoutes)
      console.log(btnsPermission)
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
