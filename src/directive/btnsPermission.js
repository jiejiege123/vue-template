import Vue from 'vue'

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
  const btnPowerArr = sessionStorage.getItem('btns')
  if (btnPowerArr === undefined || btnPowerArr == null) {
    return false
  }
  if (btnPowerArr.indexOf(val) > -1) {
    isShow = true
  }
  return isShow
}
export { has }
