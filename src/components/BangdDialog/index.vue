<!--
 * @Author: your name
 * @Date: 2020-11-03 15:12:58
 * @LastEditTime: 2020-12-09 18:05:19
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\components\EditTableForm\index.vue
-->
<template lang="pug">
  el-dialog.add-dialog(
    :title='dialogTitle',
    width="700px"
    :visible='dialogVisible'
    @open="open('ruleForm')"
    :close-on-click-modal="false"
    @close="closeDialog"
    :append-to-body="true")
    el-form.default-input(
      v-loading="dialogLoading"
      :model='ruleForm'
      ref='ruleForm'
      :rules="rules"
      label-width='120px')
      el-form-item(
        v-if="!disIMEI"
        prop='IMEI'
        label="IMEI")
        span(v-if="imei") {{imei}}({{ruleForm.comname}})
        el-autocomplete(
          v-else
          style="width: 400px"
          v-model='ruleForm.IMEI'
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入要添加到IMEI号")
      el-form-item(
        prop='comcode'
        label="安装至单位")
        el-cascader(
          v-model="ruleForm.comcode"
          style="width: 400px"
          placeholder="请选择安装单位"
          :options='comSetData',
          :show-all-levels='false'
          :props="icascaderProps"
          @change="comcodeChange"
          filterable)

      el-form-item(
        prop='jzwid'
        label="安装至建筑物")
        el-select(
          v-loading='jzwLoading'
          v-model="ruleForm.jzwid"
          style="width: 400px"
          placeholder="请选择建筑物"
          filterable
          @change="jzwidChange")
          el-option(
            v-for="(list, index) in jzwData"
            :key="index"
            :label="list.jzwname"
            :value="list.jzwid")
        el-button.ml_10(type="primary" icon="el-icon-plus" circle @click='addJzw')
      el-form-item(
        prop='lcid'
        label="安装至楼层")
        el-select(
          v-loading="lcLoading"
          v-model="ruleForm.lcid"
          placeholder="请选择建筑物"
          style="width: 400px"
          @change="lcChange"
          filterable)
          el-option(
            v-for="(list, index) in lcData"
            :key="index"
            :label="list.lcname"
            :value="list.lcid")
        el-button.ml_10(type="primary" icon="el-icon-plus" circle @click='addLc' :disabled="!ruleForm.jzwid")
      el-form-item(
        v-if="disIMEI"
        prop='azdname'
        label="安装点")
        el-input(
          style="width: 400px"
          v-model='ruleForm.azdname'
          placeholder="请输入安装点名称")
      el-form-item(
        v-else
        prop='azdid'
        label="安装点")
        el-select(
          v-loading="azdLoading"
          v-model="ruleForm.azdid"
          placeholder="请选择安装点"
          style="width: 400px"
          filterable)
          el-option(
            v-for="(list, index) in azdData"
            :key="index"
            :label="list.azdname"
            :value="list.azdid")
    .dia-footer()
      el-button.mr_10(type='primary', @click="submitForm('ruleForm')" size="small") 提交

    //- 新增建筑物弹窗
    //- 新增楼层弹窗
    edit-table-form(
      ref="addDialog"
      @onSubmitForm="onSubmitForm"
      :formRules="formRules"
      :formLoading="formLoading"
      :hasMap="true"
      :inline="true"
      dialogWidth='800px'
      :formStyle={width: '220px'}
      :hiddenTable="true"
      :columns="tableColumn")
</template>
<script>
import EditTableForm from '@/components/EditTableForm'
import { checkPhone, toTree } from '@/utils/index'
import {
  getBuildingList,
  addBuilding,
  getFloorList,
  addFloor,
  // bindInstallpoint,
  getInstallpointList } from '@/api/place'
export default {
  name: 'BangdDialog',
  components: {
    EditTableForm
  },
  filters: {
    filterImg: (val) => {
      if (val) {
        if (val.includes('http')) {
          return val
        } else {
          return process.env.VUE_APP_BASE_API + val
        }
      } else {
        return val
      }
    }

  },
  props: {
    dialogType: {
      type: String,
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogLoading: {
      type: Boolean,
      default: false
    },
    comcode: {
      type: String,
      default: ''
    },
    comname: {
      type: String,
      default: ''
    },
    comData: {
      type: Array,
      default() {
        return []
      }
    },
    imei: {
      type: String,
      default: ''
    },
    disIMEI: {
      type: Boolean,
      default: false
    },
    bangform: {
      type: Object,
      default() {
        return {}
      }
    }
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
      ruleForm: {},
      rules: {

        IMEI: [{ required: true, message: '请输入IMEI号码', trigger: 'blur' }],
        comcode: [{ required: true, message: '请选择安装单位', trigger: 'change' }],
        jzwid: [{ required: true, message: '请选择建筑物' }],
        lcid: [{ required: true, message: '请选择楼层' }],
        azdname: [{ required: true, message: '请输入安装点名称' }],
        azdid: [{ required: true, message: '请输入安装点', trigger: 'blur' }]
      },
      icascaderProps: {
        label: 'comname',
        value: 'comcode',
        emitPath: false,
        checkStrictly: true
      },
      comSetData: [],
      jzwData: [],
      jzwLoading: false,
      azdData: [],
      azdLoading: false,
      lcData: [],
      lcLoading: false,
      // 新增弹窗
      tableColumn: [],
      formRules: {},
      formLoading: false,
      jzwColumn: [
        {
          prop: 'jzwname',
          label: '建筑物名称',
          editAble: true,
          minWidth: 200,
          online: true,
          formStyle: {
            width: '600px'
          }
        },
        {
          prop: 'longitude',
          label: '经度',
          type: 'map',
          editAble: true,
          formOnly: true
        },
        {
          prop: 'latitude',
          type: 'map',
          label: '维度',
          editAble: true,
          formOnly: true
        },
        {
          prop: 'jzwaddress',
          label: '详细地址',
          editAble: true,
          online: true,
          minWidth: 200,
          formStyle: {
            width: '600px'
          }
        },
        {
          prop: 'lcsnum',
          label: '楼层数',
          type: 'number',
          slot: true,
          editAble: true
        },
        {
          prop: 'lxr',
          label: '联系人',
          editAble: true
        },
        {
          prop: 'lxrtel',
          label: '联系电话',
          width: 120,
          editAble: true
        }
      ],
      jzwRules: {
        jzwname: [{ required: true, message: '请输入建筑名称', trigger: 'blur' }],
        comcode: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
        longitude: [{ required: true, message: '请点击图标输入查询', trigger: 'blur' }],
        latitude: [{ required: true, message: '请点击图标输入查询', trigger: 'blur' }],

        jzwaddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        lxr: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        lcsnum: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        lxrtel: [{ validator: isPhone, required: true, trigger: 'blur' }]
      },
      lcColumn: [
        {
          prop: 'lcname',
          label: '所在楼层',
          holder: '例: 1楼',
          formOnly: true
        },
        {
          prop: 'pmt',
          label: '平面图',
          type: 'img',
          width: 100
        }
      ],
      lcRules: {
        lcname: [{ required: true, message: '请输入所在楼层', trigger: 'blur' }]
      },
      type: ''
    }
  },
  computed: {

  },
  watch: {
    comname: {
      handler(newVal) {
        this.ruleForm.comname = newVal
        this.ruleForm.comcode = this.comcode
      },
      deep: true,
      immediate: true
    },
    comData: {
      handler(newVal) {
        if (newVal.length > 0) {
          this.comSetData = toTree(newVal)
          this.comcodeChange(this.comcode)
        }
      },
      deep: true,
      immediate: true
    },
    bangform: {
      handler(newVal) {
        if (newVal.azdid) {
          this.ruleForm = newVal
          this.getBuildingData(this.ruleForm.comname)
          this.getFloorData(this.ruleForm.jzwname)
        } else {
          this.ruleForm = {}
        }
      }
      // deep: true,
      // immediate: true
    }
  },
  created() {
  },
  methods: {
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },

    submitForm(formName) {
      if (this.imei) {
        this.$set(this.ruleForm, 'IMEI', this.imei)
        this.$set(this.ruleForm, 'deviceid', this.deviceid)
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 获取jzwname jzwid    lcname lcid
          this.ruleForm.jzwname = this.jzwData.find(n => n.jzwid === this.ruleForm.jzwid).jzwname
          this.ruleForm.lcname = this.lcData.find(n => n.lcid === this.ruleForm.lcid).lcname
          this.$emit('onSubmitForm', this.ruleForm, this.dialogType, (ok) => {
            if (ok) {
              this.visible = false
            } else { return }
          })

          // 不需要 emit 现在直接绑定
          // bindInstallpoint(this.ruleForm).then(res => {

          // })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
      // const TimeRanges = []
      // this.TimeRanges.forEach(n => {
      //   TimeRanges.push({
      //     StartTime: n.time[0],
      //     EndTime: n.time[1]
      //   })
      // })
      // this.$emit('onArmed', TimeRanges)
    },
    querySearchAsync(queryString, cb) {
      // 根据输入调用接口 查询公司下的IMEI号
      // var restaurants = this.restaurants
      // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants

      // clearTimeout(this.timeout)
      // this.timeout = setTimeout(() => {
      //   cb(results)
      // }, 3000 * Math.random())
    },
    comcodeChange(e, change) {
      let comname = ''
      if (change !== 'change') {
        this.jzwData = []
        this.lcData = []
        this.$set(this.ruleForm, 'jzwid', '')
        this.$set(this.ruleForm, 'lcid', '')
        const now = this.comData.find(n => n.comcode === e)
        this.$set(this.ruleForm, 'comname', now.comname)
        comname = now.comname
      } else {
        comname = e
      }
      this.getBuildingData(comname)
    },
    jzwidChange(e, change) {
      console.log('123', e)
      let jzwname = ''
      if (change !== 'change') {
        this.lcData = []
        this.$set(this.ruleForm, 'lcid', '')
        jzwname = this.jzwData.find(n => n.jzwid === e).jzwname
      } else {
        jzwname = e
      }
      this.getFloorData(jzwname)
    },
    lcChange(e) {
      // 根据条件查询安装的
      const params = this.ruleForm
      this.azdLoading = true
      getInstallpointList(params).then(res => {
        // console.log(res)
        // this.$set(this.dics, '', res.Data.Models)
        this.azdLoading = false
        this.azdData = res.Data.Models
      }).catch(err => {
        this.azdLoading = false
        console.error(err)
      })
    },
    getBuildingData(comname) {
      this.jzwLoading = true
      const params = {
        comname: comname,
        PageIndex: 1,
        PageSize: 99999
      }
      getBuildingList(params).then(res => {
        this.jzwLoading = false
        this.jzwData = res.Data.Models
      }).catch(err => {
        this.jzwLoading = false
        console.error(err)
      })
    },
    getFloorData(jzwname) {
      console.log(jzwname)
      this.lcLoading = true
      const params = {
        jzwname: jzwname,
        PageIndex: 1,
        PageSize: 99999
      }
      getFloorList(params).then(res => {
        this.lcLoading = false
        this.lcData = res.Data.Models
      }).catch(err => {
        this.lcLoading = false
        console.error(err)
      })
    },
    addJzw() {
      this.type = 'jzw'
      this.tableColumn = this.jzwColumn
      this.formRules = this.jzwRules
      this.$refs.addDialog.addRow()
    },
    addLc() {
      this.type = 'lc'
      this.tableColumn = this.lcColumn
      this.formRules = this.lcRules
      this.$refs.addDialog.addRow()
    },
    onSubmitForm(ruleForm, type, cb) {
      let params = {}
      if (this.type === 'jzw') {
        params = Object.assign({}, ruleForm)
        params.comname = this.ruleForm.comname
        addBuilding(params).then(res => {
          this.formLoading = false
          cb(true)
          this.comcodeChange(this.ruleForm.comname, 'change')
        }).catch((err) => {
          this.$message.error(err)
          this.formLoading = false
        })
      } else {
        params = Object.assign({}, ruleForm, this.ruleForm)
        params.jzwname = this.ruleForm.jzwname || this.jzwData.find(n => n.jzwid === this.ruleForm.jzwid).jzwname
        console.log(params)

        addFloor(params).then(res => {
          this.formLoading = false
          cb(true)
          this.jzwidChange(params.jzwname, 'change')
        }).catch((err) => {
          this.$message.error(err)
          this.formLoading = false
        })
      }
    },
    closeDialog() {
      this.$emit('onCloseDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.bufang-content{
  margin: 0 auto;
  width: 600px;
  .title{
    min-height: 30px;
    line-height: 26px;
    color: #e73a03;
  }
}
.add-dialog{
  ::v-deep .el-dialog__body{
    padding-top: 10px;
    .el-form-item__label{
      font-weight: 400;
    }
  }
}
.dia-footer{
  text-align: right;
}

</style>
