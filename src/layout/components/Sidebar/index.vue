<!--
 * @Author: zzz
 * @LastEditors: zzz
-->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div v-if="!isCollapse" class="sidebar-Info">
      <!-- 公司名称 -->
      <div>{{ userInfo.comname }}</div>
      <div class="user-name">● {{ userInfo.realname || userInfo.username }}({{ userInfo.userrole }})</div>
      <!-- 设备数 -->
      <div class="shebei" style="margin-top: 10px">
        <div class="icon-warp">
          <svg-icon icon-class="shebeinum" style="margin: 0 auto" />
        </div>
        <div class="layout-row__between" style="padding: 0 10px 0 5px">
          设备总数 <span>{{ shebeiNum }}</span>
        </div>
      </div>
      <!-- 报警数 -->
      <div class="shebei">
        <div class="icon-warp">
          <svg-icon icon-class="alarm" style="margin: 0 auto" />
        </div>
        <div class="layout-row__between" style="padding: 0 10px 0 5px">
          今日报警  <span>{{ todayalarm }}</span>
        </div>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      shebeiNum: 1111,
      todayalarm: 64,
      todaygz: 5464
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'userInfo'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
  .sidebar-Info{
    font-size: 14px;
    background: #2b2f3a;
    text-align: center;
    color: #fff;
    padding: 20px;
    border-top: 1px solid rgb(90, 89, 89);
    .user-name{
      font-size: 14px;
      color: #5fa4f5;
      line-height: 41px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .shebei{
      line-height: 40px;
      height: 40px;
      background-color: rgba(95,164,245,.2);
      border-radius: 20px;
      overflow: hidden;
      margin-top: 20px;
      .icon-warp{
        float: left;
        color: #fff;
        font-size: 18px;
        text-align: center;
        line-height: 40px;
        width: 40px;
        height: 40px;
        background: rgba(95,164,245,.5);
        border-radius: 50%;
      }
    }
  }
</style>
