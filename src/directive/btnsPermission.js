/*
 * @Author: your name
 * @Date: 2020-11-05 09:02:32
 * @LastEditTime: 2020-12-11 17:19:24
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\directive\btnsPermission.js
 */
import Vue from 'vue'
import store from '@/store'

const has = Vue.directive('has', {

  inserted: function(el, binding) {
    const id = binding.value
    if (!Vue.prototype.$_has(id)) {
      el.parentNode.removeChild(el)
    }
  }
})

Vue.prototype.$_has = function(val) {
  let isShow = false
  // const btnPowerArr = sessionStorage.getItem('btns')
  // 判断btns中有没有 这些 has001 等于的权限
  const btnPowerArr = store.getters.btns
  if (btnPowerArr === undefined || btnPowerArr == null) {
    return false
  }
  if (btnPowerArr.indexOf(val) > -1) {
    isShow = true
  }
  return isShow
}
export { has }
