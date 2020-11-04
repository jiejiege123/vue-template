// import { login, logout, getInfo, getRouter } from '@/api/user'
import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  routers: []

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ Username: username.trim(), Password: password, VCode: '1123' }).then(response => {
        const { Data } = response

        commit('SET_TOKEN', Data.token)
        setToken(Data.token)
        if (!Data.user.RoleIds) {
          Data.user.RoleIds = ['admin']
        }
        commit('SET_USERINFO', Data.user)

        localStorage.setItem('userInfo', JSON.stringify(Data.user))

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('userInfo')) {
        const user = JSON.parse(localStorage.getItem('userInfo'))
        const { RoleIds, Name, HeadIcon, Description } = user

        commit('SET_ROLES', RoleIds)
        commit('SET_NAME', Name)
        commit('SET_AVATAR', HeadIcon)
        commit('SET_INTRODUCTION', Description)
        commit('SET_USERINFO', user)
        resolve(user)
      } else {
        reject('getInfo error')
      }

      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  getRouters({ commit }, roles) {
    return new Promise((resolve, reject) => {
      if (roles) {
        resolve(
          [{
            'Id': '975247111765495809',
            'Name': '系统管理',
            'ParentId': null,
            'Type': 4,
            'Url': 'System',
            'Icon': 'sys',
            'SortCode': 999,
            'Children': [{
              'Id': '1151029042405838848',
              'Name': '企业管理',
              'ParentId': '975247111765495809',
              'Type': 1,
              'Url': 'Companys',
              'Icon': null,
              'SortCode': 2,
              'Children': []
            }, {
              'Id': '975247111769690113',
              'Name': '用户管理',
              'ParentId': '976092881406267392',
              'Type': 1,
              'Url': 'User',
              'Icon': null,
              'SortCode': 20,
              'Children': []
            }, {
              'Id': '975247111769690114',
              'Name': '角色管理',
              'ParentId': '976094018385612800',
              'Type': 1,
              'Url': 'Role',
              'Icon': null,
              'SortCode': 33,
              'Children': []
            }, {
              'Id': '975247111769690117',
              'Name': '权限管理',
              'ParentId': '976094340222947328',
              'Type': 1,
              'Url': 'Permission',
              'Icon': null,
              'SortCode': 39,
              'Children': []
            }]
          }]
        )
      } else {
        reject('getRouters error')
      }

      // getRouter({ roles: roles }).then((res) => {
      //   commit('SET_ROUTERS', res.data)
      //   resolve(res.data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
