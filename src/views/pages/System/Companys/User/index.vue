<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-06 19:31:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\User\index.vue
-->
<template lang="">
  <div />
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'User',
  created() {
    console.log('123')
  },
  beforeDestroy() {
    this.setShowComSup(true)
  },
  methods: {
    ...mapMutations('showSup', ['setShowComSup'])
  }
}
</script>
