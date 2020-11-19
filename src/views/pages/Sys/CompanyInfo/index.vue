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
      el-collapse-item(name='2')
        template(slot="title" )
          span(style="font-size: 16px") 安装点名称设置
        //- 设置
        .form-contetn(v-loading='azdLoading' style="width:100%; padding-left: 50px")
          el-form(ref='azdform' :model='azdform' label-width='180px')
            el-form-item(label='安装点名称设置: ' prop="azdnameSet")
              el-checkbox-group(v-model="azdset" @change="handleCheckedCitiesChange")
                el-checkbox(label="ishsowjzw_azd") 建筑物名称
                el-checkbox(label="ishsowlc_azd") 楼层名称
                el-checkbox(label="isshowazd_azd") 安装点名称
              div 显示结果: {{azd.ishsowjzw_azd}} {{azd.ishsowlc_azd}} {{azd.isshowazd_azd}}  (不勾选默认显示全部)
            el-form-item(label='设备列表安装点名称设置: ' prop="shebAzdnameSet")
              el-checkbox-group(v-model="azdset" @change="handleCheckedCitiesChange")
                el-checkbox(label="ishsowjzw_sblb") 建筑物名称
                el-checkbox(label="ishsowlc_sblb") 楼层名称
                el-checkbox(label="isshowazd_sblb") 安装点名称
              div 平台显示结果: {{azd.ishsowjzw_sblb}} {{azd.ishsowlc_sblb}} {{azd.isshowazd_sblb}}  (不勾选默认显示安装点)
            el-form-item
              el-button(type='primary' @click='onSubmitAzdform') 确定
      el-collapse-item(name='3')
        template(slot="title" )
          span(style="font-size: 16px") 设备类型显示设置
        //- 设置
        .form-contetn(v-loading='equiLoading' style="width:100%; padding-left: 50px")
          el-form(ref='equiform' :model='equiform' label-width='180px')
            el-form-item(label='设备类型: ' prop="equinameSet")
              el-checkbox-group(v-model="equiset" @change="handleCheckedEquiChange")
                el-checkbox(v-for="(item,index) in equiTypeData" :key="item.id" :label="item.value") {{item.label}}
      el-collapse-item(name='4')
        template(slot="title" )
          span(style="font-size: 16px")  报警语音设置

</template>
<script >
import ImgCropper from '@/components/ImgCropper'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
import { getDicsByName } from '@/api/commom'
import { updateComInfo, getComInfo } from '@/api/sys'
import { setAzdConfig, getAzdConfig } from '@/api/place'
import { setConfigEqui, getConfigEqui } from '@/api/equipment'
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
      activeNames: ['1', '2', '3', '4'],
      comform: {},
      comInfoLoading: true,
      comformRules: {
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      },
      // 安装的
      azdform: {},
      azdset: [],
      azdLoading: false,
      azdTitle: {
        ishsowjzw_azd: '深圳市华源科技创新园B1区',
        ishsowlc_azd: '2楼',
        isshowazd_azd: '212会议室',
        ishsowjzw_sblb: '深圳市华源科技创新园B1区',
        ishsowlc_sblb: '2楼',
        isshowazd_sblb: '212会议室'
      },
      azd: {},
      azdData: {},
      // 设备
      equiLoading: false,
      equiform: {},
      equiset: [],
      equiTypeData: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getDicsList()
    this.getComInfoData()
    this.getAzdData()
    this.getConfigEquiData()
    // this.comcode = this.$route.query.comcode
    // this.onSearch({ com: '' })
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
    },
    handleCheckedCitiesChange(e) {
      this.azd = {}
      e.forEach(n => {
        this.$set(this.azd, n, this.azdTitle[n])
      })
      const data = {}
      for (const key in this.azdTitle) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.azdTitle.hasOwnProperty(key)) {
          if (e.find(n => n === key)) {
            data[key] = 1
          } else {
            data[key] = 0
          }
        }
      }
      this.setAzd(data)
      this.azdData = data
      console.log(this.azdData)
    },
    setAzd(data) { // data 是对象
      if (!data.ishsowjzw_azd && !data.ishsowlc_azd && !data.isshowazd_azd) {
        this.$set(this.azd, 'ishsowjzw_azd', this.azdTitle['ishsowjzw_azd'])
        this.$set(this.azd, 'ishsowlc_azd', this.azdTitle['ishsowlc_azd'])
        this.$set(this.azd, 'isshowazd_azd', this.azdTitle['isshowazd_azd'])
      }

      if (!data.ishsowjzw_sblb && !data.ishsowlc_sblb && !data.isshowazd_sblb) {
        this.$set(this.azd, 'isshowazd_sblb', this.azdTitle['isshowazd_sblb'])
      }
    },
    getAzdData() {
      this.azdLoading = true
      getAzdConfig().then(res => {
        this.azdLoading = false
        const data = res.Data
        const azdset = []
        for (const key in data) {
          // eslint-disable-next-line no-prototype-builtins
          if (data.hasOwnProperty(key)) {
            const n = data[key]
            if (n) {
              azdset.push(key)
              this.$set(this.azd, key, this.azdTitle[key])
            }
          }
        }
        this.setAzd(data)
        this.azdset = azdset
        console.log(this.azdset)
      }).catch(err => {
        this.azdLoading = false
        console.error(err)
      })
    },
    onSubmitAzdform() {
      this.azdLoading = true
      setAzdConfig(this.azdData).then(res => {
        this.$message.success('安装点名称设置成功')
        this.azdLoading = false
      }).catch(err => {
        console.error(err)
        this.azdLoading = false
      })
    },
    // 设备
    getDicsList() {
      const params = {
        names: '设备类型'
      }
      getDicsByName(params).then(res => {
        // console.log(res)
        const dics = res.Data
        const equiTypeData = []
        dics.forEach(n => {
          n.value = n.dicvalue
          n.label = n.diczh
          switch (n.groupzh) {
            case '设备类型':
              equiTypeData.push(n)
              break
            default:
              break
          }
        })
        this.equiTypeData = equiTypeData
      })
    },
    getConfigEquiData() {
      this.equiLoading = true
      getConfigEqui().then(res => {
        this.equiLoading = false
        console.log(res)
      }).catch(err => {
        this.equiLoading = false
        console.error(err)
      })
    },
    handleCheckedEquiChange(e) {

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
