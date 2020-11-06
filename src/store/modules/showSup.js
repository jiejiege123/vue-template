/*
 * @Author: your name
 * @Date: 2020-11-06 19:14:27
 * @LastEditTime: 2020-11-06 19:41:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\store\modules\showSup.js
 */
const state = {
  showComSup: true
}

const mutations = {
  setShowComSup(state, payload) {
    state.showComSup = payload
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
