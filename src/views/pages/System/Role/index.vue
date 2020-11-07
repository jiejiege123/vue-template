<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-06 18:55:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Role\index.vue
-->
<template lang="pug">
  el-input(v-model="input")
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Role',
  data() {
    return {
      input: 'Role'
    }
  },
  created() {
    this.setShowComSup(false)
    console.log('inRole')
  },
  beforeDestroy() {
    this.setShowComSup(true)
    console.log('inRoleshowComSup')
  },
  methods: {
    ...mapMutations('showSup', ['setShowComSup'])
  }
}
</script>
