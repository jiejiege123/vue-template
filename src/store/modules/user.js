// import { login, logout, getInfo, getRouter } from '@/api/user'
import { login, logout } from '@/api/user'
import { getTotalEqui, gettotalnum } from '@/api/equipment'
import { getPermissionByRoleId } from '@/api/com'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: '',
  routers: [],
  equiNum: '',
  todayalarm: '',
  todaygz: ''

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
  },
  SET_EQUINUM: (state, equiNum) => {
    state.equiNum = equiNum
  },
  SET_FaultNum: (state, num) => {
    state.todaygz = num
  },
  SET_AlarmNum: (state, num) => {
    state.todayalarm = num
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
        localStorage.setItem('userInfo', JSON.stringify(Data.user))
        // commit('SET_USERINFO', Data.user)
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
        commit('SET_USERINFO', user)
        const { userroleid, Name, HeadIcon, Description } = user
        commit('SET_ROLES', userroleid)
        commit('SET_NAME', Name)
        commit('SET_AVATAR', HeadIcon)
        commit('SET_INTRODUCTION', Description)
        console.log('123')
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
        commit('SET_ROLES', '')
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
      commit('SET_ROLES', '')
      removeToken()
      resolve()
    })
  },
  getRouters({ commit }, roles) {
    return new Promise((resolve, reject) => {
      if (roles) {
        const params = {
          id: roles
        }
        getPermissionByRoleId(params).then(res => {
          const router = res.Data.permissions
          router.forEach(n => {
            // if (!n.ParentId) {
            //   n.ParentId = '0'
            // }
            if (n.Url === 'Equipment') {
              n.Children.push(
                {
                  'Id': '1326708790602633231',
                  'Name': '设备详情',
                  'Code': '',
                  'ParentId': '1326708790602633233',
                  'Type': 1,
                  'Url': 'EquipmentItem',
                  'Icon': '',
                  'Description': '',
                  'SortCode': 3,
                  'Children': []
                }
              )
            }
          })
          // console.log(router)
          resolve(router)
          localStorage.setItem('routers', JSON.stringify(router))
        }).catch(err => {
          reject(err)
        })
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
  },
  getTotalEqui({ commit }) {
    return new Promise((resolve, reject) => {
      getTotalEqui().then(res => {
        commit('SET_EQUINUM', res.Data)
        resolve()
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  },
  gettotalnum({ commit }) {
    return new Promise((resolve, reject) => {
      gettotalnum().then(res => {
        commit('SET_FaultNum', res.Data.FaultNum)
        commit('SET_AlarmNum', res.Data.AlarmNum)
        resolve()
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
