<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-06 19:31:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\User\index.vue
-->
<template lang="pug">
  el-input(v-model="input")
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'User',
  data() {
    return {
      input: ''
    }
  },
  created() {
    this.setShowComSup(false)
    console.log('inUser')
  },
  beforeDestroy() {
    this.setShowComSup(true)
    console.log('inUsershowComSup')
  },

  methods: {
    ...mapMutations('showSup', ['setShowComSup'])
  }
}
</script>
