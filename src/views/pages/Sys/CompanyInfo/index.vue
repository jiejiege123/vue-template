<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-11 11:19:28
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content
    el-collapse(v-model='activeNames')
      el-collapse-item(name='1')
        template(slot="title" )
          span(style="font-size: 16px") 公司信息设置
        //- 表单
        .form-contetn(v-loading='comInfoLoading')
          el-form(ref='comform' :model='comform' label-width='120px' :rules='comformRules')
            el-form-item(label='单位名称' prop="comtitle")
              span {{userInfo.comname}}
            el-form-item(label='网站中文标题' prop="comtitle")
              el-input(v-model='comform.comtitle')
            el-form-item(label='单位地址' prop="address")
              el-input(v-model='comform.address')
            el-form-item(label='单位电话' prop="comtel")
              el-input(v-model='comform.comtel')
            el-form-item(label='负责人' prop="fzr")
              el-input(v-model='comform.fzr')
            el-form-item(label='单位自定义logo' prop="comlogo")
              //- el-input(v-model='comform.comlogo')
              ImgCropper(:srcOpen="comform.comlogo" @getUrl="getImgCutUrl")

            el-form-item
              el-button(type='primary' @click='onSubmitComform') 确定
              el-button 取消
      el-collapse-item(name='2')
        template(slot="title" )
          span(style="font-size: 16px") 安装点名称设置

      el-collapse-item(name='3')
        template(slot="title" )
          span(style="font-size: 16px") 设备类型显示设置

      el-collapse-item(name='4')
        template(slot="title" )
          span(style="font-size: 16px")  报警语音设置

</template>
<script >
import ImgCropper from '@/components/ImgCropper'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'

import { updateComInfo, getComInfo } from '@/api/sys'
export default {
  name: 'CompanyInfo',
  components: {
    ImgCropper
  },
  filters: {

  },
  data() {
    var isPhone = (rule, value, callback) => {
      if (value) {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
    return {
      activeNames: '1',
      comform: {},
      comInfoLoading: true,
      comformRules: {
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getComInfoData()
    // this.comcode = this.$route.query.comcode
    // this.onSearch({ com: '' })
    // this.getDicsList()
  },
  mounted() {
  },
  methods: {
    getImgCutUrl(url) {
      this.$set(this.comform, 'comlogo', url)
    },
    getComInfoData() {
      this.comInfoLoading = true
      getComInfo().then(res => {
        this.comform = res.Data
        this.comInfoLoading = false
        console.log(res)
      }).catch(err => {
        this.comInfoLoading = false
        console.error(err)
      })
    },
    onSubmitComform() {
      const params = this.comform
      updateComInfo(params).then(res => {
        this.$message.success('编辑成功')
        this.getComInfoData()
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.content{
  padding: 30px;
  font-size: 16px;
  box-sizing: border-box;
  // height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.hearer-breadcrumb{
  padding-bottom: 15px;
  color: #666;
  font-size: 14px;

}
.card-form{
  ::v-deep .el-form-item {
    margin-bottom: 0px;
    .el-form-item__label{
      font-weight: 400;
    }
  }
}
.form-contetn{
  width: 800px;
  padding-left: 100px;
  ::v-deep .el-form-item__label{
    font-weight: 400;
  }
}
</style>
