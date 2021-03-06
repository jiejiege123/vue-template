/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-05 09:46:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\mock\user.js
 */

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    RoleIds: ['admin'],
    introduction: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    token: 'afasfdasdf',
    user: {
      Name: 'Super Admin',
      HeadIcon: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      Description: 'I am a super administrator',
      RoleIds: ['admin']
    }
  },
  'editor-token': {
    RoleIds: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    token: 'afasfdasdf',
    user: {
      Name: 'Normal Editor',
      HeadIcon: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      Description: 'I am an editor',
      RoleIds: ['editor']
    }
  }
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { Username } = config.body
      const token = tokens[Username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        Data: users[token.token]
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 菜单
  {
    url: '/vue-element-admin/user/GetClientsDataJson',
    type: 'get',
    response: config => {
      const { roles } = config.query // 写死的数据
      console.log(roles)
      let router
      if (roles[0] === 'admin') {
        router = [{
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
      } else {
        router = []
      }
      return {
        code: 20000,
        data: router
      }
    }
  }
]
