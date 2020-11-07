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
          [
            {
              'Id': '975247111765495809',
              'Name': '系统管理',
              'Url': 'System',
              'Type': 4,
              'Icon': 'sys',
              'Children': [
                {
                  'Id': '1151029042405838848',
                  'Name': '单位管理',
                  'ParentId': '975247111765495809',
                  'Url': 'Companys',
                  'Type': 1,
                  'Icon': null,
                  'Children': [],
                  'Btns': ['Company01', 'Company02', 'Company03']
                },
                {
                  'Id': '975247111769690115',
                  'Name': '用户列表',
                  'ParentId': '975247111765495809',
                  'Type': 1,
                  'Url': 'User',
                  'Icon': null,
                  'SortCode': 20,
                  'Children': [],
                  'Btns': ['User01', 'User02', 'User03']
                }, {
                  'Id': '975247111769690114',
                  'Name': '角色管理',
                  'ParentId': '975247111765495809',
                  'Type': 1,
                  'Url': 'Role',
                  'Icon': null,
                  'SortCode': 33,
                  'Children': [],
                  'Btns': ['Role01', 'Role02', 'Role03']
                }, {
                  'Id': '975247111769690115',
                  'Name': '其他管理',
                  'ParentId': '975247111765495809',
                  'Type': 1,
                  'Url': 'Other',
                  'Icon': null,
                  'SortCode': 20,
                  'Children': []
                }
              ]
            }
          ]
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
