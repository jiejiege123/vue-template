/*
 * @Author: your name
 * @Date: 2020-11-02 09:00:14
 * @LastEditTime: 2020-11-05 09:19:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\store\getters.js
 */
const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  btns: state => state.permission.btns,
  permissionType: state => state.permission.permissionType
}
export default getters
