<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- <lang-select class="right-menu-item hover-effect" /> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <!-- <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div> -->
        <div class="layout-column__center align-center" style="height: 100%">
          <i class="el-icon-s-tools" style="font-size: 24px" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link> -->
          <!-- <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="showModify">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      append-to-body
      width="30%"
      class="dialog-class"
      @open="open('pwdform')"
    >
      <el-form ref="pwdform" :model="form" :rules="rules">
        <el-form-item prop="oldPassword" label="原密码" label-width="80px">
          <el-input
            :key="oldPasswordType"
            ref="oldPasswordType"
            v-model="form.oldPassword"
            :type="oldPasswordType"
            placeholder="请输入旧密码"
            name="password"
            tabindex="2"
            size="small"
            auto-complete="on"
          />
          <span slot="suffix" class="show-pwd" @click="showPwd('oldPasswordType')">
            <svg-icon :icon-class="oldPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>

        </el-form-item>

        <el-form-item prop="newPassword" label="新密码" label-width="80px">

          <el-input
            :key="newPasswordType"
            ref="newPasswordType"
            v-model="form.newPassword"
            :type="newPasswordType"
            placeholder="请输入新密码"
            name="password"
            tabindex="2"
            size="small"
            auto-complete="on"
          />
          <span slot="suffix" class="show-pwd" @click="showPwd('newPasswordType')">
            <svg-icon :icon-class="newPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>

        </el-form-item>

        <el-form-item prop="checkPassword" label="确认密码" label-width="80px">

          <el-input
            :key="checkPasswordType"
            ref="checkPasswordType"
            v-model="form.checkPassword"
            :type="checkPasswordType"
            placeholder="请再次输入新密码"
            name="password"
            size="small"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handlePost('pwdform')"
          />
          <span slot="suffix" class="show-pwd" @click="showPwd('checkPasswordType')">
            <svg-icon :icon-class="checkPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handlePost('pwdform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import { changepwd } from '@/api/com'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.pwdform.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {},
      oldPasswordType: 'password',
      newPasswordType: 'password',
      checkPasswordType: 'password',
      // "UserId": "",
      // 	"OldPassowrd": "",
      // 	"NewPassowrd": ""
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ validator: validatePass, required: true, trigger: 'blur' }],
        checkPassword: [{ validator: validatePass2, required: true, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userInfo'
    ])
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    showModify() {
      this.dialogFormVisible = true
    },
    /**
     * @description: '提交修改密码'
     * @param {type} ''
     * @return: ''
     */
    handlePost(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            'UserId': this.userInfo.userid,
            'OldPassowrd': this.form.oldPassword,
            'NewPassowrd': this.form.newPassword
          }
          changepwd(params).then(res => {
            this.$message.success('密码修改成功')
            this.logout()
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    showPwd(type) {
      if (this[type] === 'password') {
        this[type] = ''
      } else {
        this[type] = 'password'
      }
      this.$nextTick(() => {
        this.$refs[type].focus()
      })
    },
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
        this.form = {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.sidebar-Info{
  float: right;
  width: 400px;
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
  }
}
</style>
