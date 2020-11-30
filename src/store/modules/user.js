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
        const router = [
          {
            'Id': '1326708790602633230',
            'Name': '报警管理',
            'Url': 'Alarm',
            'Type': 4,
            'Icon': 'alarm',
            'Children': [
              {
                'Id': '1326708790602633210',
                'Name': '报警记录',
                'ParentId': '1326708790602633230',
                'Url': 'AlarmRecord',
                'Type': 1,
                'Icon': null,
                'Children': [],
                'Btns': ['EquipmentLists01', 'EquipmentLists02', 'EquipmentLists03']
              },
              {
                'Id': '1326708790602633212',
                'Name': '报警历史记录',
                'ParentId': '1326708790602633230',
                'Url': 'AlarmHistroy',
                'Type': 1,
                'Icon': null,
                'Children': [],
                'Btns': ['EquipmentLists01', 'EquipmentLists02', 'EquipmentLists03']
              },
              {
                'Id': '1326708790602633211',
                'Name': '工单处理',
                'ParentId': '1326708790602633230',
                'Type': 1,
                'Url': 'WorkOrder',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['EquipmentItem01', 'EquipmentItem02', 'EquipmentItem03']
              },
              {
                'Id': '1326708790602633213',
                'Name': '工单详情',
                'ParentId': '1326708790602633230',
                'Type': 1,
                'Url': 'OrderItem',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['EquipmentItem01', 'EquipmentItem02', 'EquipmentItem03']
              },
              {
                'Id': '1326708790602633214',
                'Name': '历史工单记录',
                'ParentId': '1326708790602633230',
                'Type': 1,
                'Url': 'OrderHistory',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['EquipmentItem01', 'EquipmentItem02', 'EquipmentItem03']
              }
            ]
          },
          {
            'Id': '975247111765495811',
            'Name': '设备管理',
            'Url': 'Equipment',
            'Type': 4,
            'Icon': 'shebei',
            'Children': [
              {
                'Id': '975247111769690112',
                'Name': '设备列表',
                'ParentId': '975247111765495811',
                'Url': 'EquipmentLists',
                'Type': 1,
                'Icon': null,
                'Children': [],
                'Btns': ['EquipmentLists01', 'EquipmentLists02', 'EquipmentLists03']
              },
              {
                'Id': '975247111769690113',
                'Name': '设备详情',
                'ParentId': '975247111765495811',
                'Type': 1,
                'Url': 'EquipmentItem',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['EquipmentItem01', 'EquipmentItem02', 'EquipmentItem03']
              },
              {
                'Id': '975247111769690114',
                'Name': '批次管理',
                'ParentId': '975247111765495811',
                'Type': 1,
                'Url': 'DeviceBatch',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['EquipmentItem01', 'EquipmentItem02', 'EquipmentItem03']
              },
              {
                'Id': '975247111769690115',
                'Name': '型号管理',
                'ParentId': '975247111765495811',
                'Type': 1,
                'Url': 'Model',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['EquipmentItem01', 'EquipmentItem02', 'EquipmentItem03']
              }
            ]
          },
          {
            'Id': '985247111765495811',
            'Name': '安装管理',
            'Url': 'Place',
            'Type': 4,
            'Icon': 'anzhuang',
            'Children': [
              {
                'Id': '985247111769690122',
                'Name': '建筑物管理',
                'ParentId': '985247111765495811',
                'Url': 'Building',
                'Type': 1,
                'Icon': null,
                'Children': [],
                'Btns': ['Building01', 'Building02', 'Building03']
              },
              {
                'Id': '985247111769690132',
                'Name': '楼层管理',
                'ParentId': '985247111765495811',
                'Type': 1,
                'Url': 'Floor',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['Floor01', 'Floor02', 'Floor03']
              },
              {
                'Id': '985247111769690142',
                'Name': '安装点管理',
                'ParentId': '985247111765495811',
                'Type': 1,
                'Url': 'Installpoint',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['Installpoint01', 'Installpoint02', 'Installpoint03']
              },
              {
                'Id': '985247111769690143',
                'Name': '接警联系人',
                'ParentId': '985247111765495811',
                'Type': 1,
                'Url': 'Linkman',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['Installpoint01', 'Installpoint02', 'Installpoint03']
              }
            ]

          },
          {
            'Id': '985247111765495820',
            'Name': '统计分析',
            'Url': 'Analyze',
            'Type': 4,
            'Icon': 'tongji',
            'Children': [
              {
                'Id': '985247111765495821',
                'Name': '设备故障分析',
                'ParentId': '985247111765495820',
                'Url': 'FaultAnalyze',
                'Type': 1,
                'Icon': null,
                'Children': [],
                'Btns': ['FaultAnalyze01', 'FaultAnalyze02', 'FaultAnalyze03']
              },
              {
                'Id': '985247111765495822',
                'Name': '设备报警分析',
                'ParentId': '985247111765495820',
                'Type': 1,
                'Url': 'AlarmAnalyze',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['AlarmAnalyze01', 'AlarmAnalyze02', 'AlarmAnalyze03']
              },
              {
                'Id': '985247111765495823',
                'Name': '设备状态分析',
                'ParentId': '985247111765495820',
                'Type': 1,
                'Url': 'StatusAnalyze',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['StatusAnalyze01', 'StatusAnalyze02', 'StatusAnalyze03']
              }
            ]

          },
          {
            'Id': '975247111765495809',
            'Name': '权限管理',
            'Url': 'System',
            'Type': 4,
            'Icon': 'quanxian',
            'Children': [
              {
                'Id': '1151029042405838848',
                'Name': '单位管理',
                'ParentId': '975247111765495809',
                'Url': 'Companys',
                'Type': 1,
                'Icon': null,
                'Children': [
                  {
                    'Id': '1251029042405838848',
                    'Name': '添加',
                    'ParentId': '1151029042405838848',
                    'Url': 'Company01',
                    'Type': 3,
                    'Icon': null
                  },
                  {
                    'Id': '1351029042405838848',
                    'Name': '删除',
                    'ParentId': '1151029042405838848',
                    'Url': 'Company02',
                    'Type': 3,
                    'Icon': null
                  },
                  {
                    'Id': '1451029042405838848',
                    'Name': '修改',
                    'ParentId': '1151029042405838848',
                    'Url': 'Company03',
                    'Type': 3,
                    'Icon': null
                  }
                ],
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
              },
              {
                'Id': '975247111769690116',
                'Name': '权限列表',
                'ParentId': '975247111765495809',
                'Type': 1,
                'Url': 'Permission',
                'Icon': null,
                'SortCode': 33,
                'Children': [],
                'Btns': ['Permission01', 'Permission02', 'Permission03']
              }
              // {
              //   'Id': '97115247111769690115',
              //   'Name': '其他管理',
              //   'ParentId': '975247111765495809',
              //   'Type': 1,
              //   'Url': 'Other',
              //   'Icon': null,
              //   'SortCode': 20,
              //   'Children': []
              // }
            ]
          },
          {
            'Id': '976247111765495809',
            'Name': '系统设置',
            'Url': 'Sys',
            'Type': 4,
            'Icon': 'sys',
            'Children': [
              {
                'Id': '976229042405838848',
                'Name': '平台设置',
                'ParentId': '976247111765495809',
                'Url': 'CompanyInfo',
                'Type': 1,
                'Icon': null,
                'Children': []
              },
              {
                'Id': '976229042405838849',
                'Name': '问题反馈',
                'ParentId': '976247111765495809',
                'Type': 1,
                'Url': 'Query',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['User01', 'User02', 'User03']
              },
              {
                'Id': '976229042405838850',
                'Name': '系统消息',
                'ParentId': '976247111765495809',
                'Type': 1,
                'Url': 'SysMsg',
                'Icon': null,
                'SortCode': 20,
                'Children': [],
                'Btns': ['User01', 'User02', 'User03']
              }
              // {
              //   'Id': '975247111769690116',
              //   'Name': '权限列表',
              //   'ParentId': '975247111765495809',
              //   'Type': 1,
              //   'Url': 'Permission',
              //   'Icon': null,
              //   'SortCode': 33,
              //   'Children': [],
              //   'Btns': ['Permission01', 'Permission02', 'Permission03']
              // },
            ]
          },
          {
            'Id': '976247111765495810',
            'Name': '资费管理',
            'Url': 'Postage',
            'Type': 4,
            'Icon': 'zifei',
            'Children': [
              {
                'Id': '976247111765495811',
                'Name': '充值记录',
                'ParentId': '976247111765495810',
                'Url': 'Recharg',
                'Type': 1,
                'Icon': null,
                'Children': []
              }
              // {
              //   'Id': '976247111765495811',
              //   'Name': '资费概况',
              //   'ParentId': '976247111765495810',
              //   'Url': 'CompanyInfo',
              //   'Type': 1,
              //   'Icon': null,
              //   'Children': []
              // },
              // {
              //   'Id': '976247111765495812',
              //   'Name': '购买资源',
              //   'ParentId': '976247111765495810',
              //   'Type': 1,
              //   'Url': 'User',
              //   'Icon': null,
              //   'SortCode': 20,
              //   'Children': [],
              //   'Btns': ['User01', 'User02', 'User03']
              // },
              // {
              //   'Id': '976247111765495813',
              //   'Name': '用量统计',
              //   'ParentId': '976247111765495810',
              //   'Type': 1,
              //   'Url': 'User',
              //   'Icon': null,
              //   'SortCode': 20,
              //   'Children': [],
              //   'Btns': ['User01', 'User02', 'User03']
              // },
              // {
              //   'Id': '976247111765495814',
              //   'Name': '资费配置',
              //   'ParentId': '976247111765495810',
              //   'Type': 1,
              //   'Url': 'User',
              //   'Icon': null,
              //   'SortCode': 20,
              //   'Children': [],
              //   'Btns': ['User01', 'User02', 'User03']
              // },
              // {
              //   'Id': '976247111765495815',
              //   'Name': '设备配额管理',
              //   'ParentId': '976247111765495810',
              //   'Type': 1,
              //   'Url': 'User',
              //   'Icon': null,
              //   'SortCode': 20,
              //   'Children': [],
              //   'Btns': ['User01', 'User02', 'User03']
              // },
              // {
              //   'Id': '976247111765495816',
              //   'Name': '充值记录',
              //   'ParentId': '976247111765495810',
              //   'Type': 1,
              //   'Url': 'User',
              //   'Icon': null,
              //   'SortCode': 20,
              //   'Children': [],
              //   'Btns': ['User01', 'User02', 'User03']
              // }
            ]
          }

        ]
        resolve(router)
        localStorage.setItem('routers', JSON.stringify(router))
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
