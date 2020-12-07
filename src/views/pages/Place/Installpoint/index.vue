<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-18 16:52:31
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList"
        :btnLoading="loading"
        @onSearch="onSearch"
        @selectChange="querySelectChange"
        :dics="dics")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='420'
      :hasPages="true"
      :currentPage="currentPage"
      :total="total"
      :pageSize="pageSize"
      :dics="dics"
      dialogWidth='800px'
      has01="Company01"
      has02="Company02"
      has03="Company03"
      :formStyle={width: '220px'}
      :showSelection="true"
      :showBatchDel="true"
      :showIndex="true"
      :showEdit="false"
      :showAdd="false"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSelectChange="onSelectChange"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:outOperate)
        el-button(
          type="primary"
          size="small"
          @click.stop='addBangding') 新增
        el-button(
          type="danger"
          size="small"
          :disabled="rows.length === 0"
          @click.stop='unBangding') 解绑

      template(v-slot:operation="{row}")
        el-button(
          v-if="row.IMEI && (row.protectvalue === 2 || !row.protectvalue)"
          @click.stop="showBufang(row)"
          size="small") 布防
        el-button(
          v-if="row.IMEI && row.protectvalue === 1"
          type="danger"
          @click.stop="showChefang(row)"
          size="small") 撤防
        el-button(
          type="primary"
          size="small"
          @click.stop='editBangding(row)') 编辑
        el-button(
          v-if="!row.IMEI"
          type="success"
          size="small"
          @click.stop='BangdingrRow(row)') 绑定
    //- 新增弹窗
    BangdDialog(
      :dialogTitle="bangdTitle"
      :dialogVisible="bangdVisible"
      :bangdLoading="bangdLoading"
      :dialogType="bangdType"
      :comcode="userInfo.comcode"
      :comname="userInfo.comname"
      :comData='comData'
      :imei="imei"
      :bangform="bangform"
      :disIMEI="true"
      @onCloseDialog="bangdVisible = false"
      @onSubmitForm="onSubmitFormBangDing"
    )
    //- 绑定安装点和设备
    el-dialog.dialog-pad(
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      @close="dialogVisible === false"
      @open="open('ruleForm')"
      width="600px")
      el-form.default-input(
        v-loading="formLoadingDia"
        :model='ruleForm'
        ref='ruleForm'
        :rules="formRulesDia"
        label-width='80px')
        el-form-item(
          prop='IMEI'
          label="IMEI")
          el-autocomplete(
            style="width: 400px"
            v-model='ruleForm.IMEI'
            :fetch-suggestions="querySearchAsync"
            @select="handleSelectIMEI"
            placeholder="请输入要添加的IMEI号")
        el-form-item.dia-footer()
          el-button(@click="dialogVisible = false" size="small") 取消
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
    //- 布防弹出
    armed-dialog(
      :dialogVisible="dialogVisibleArmed" :dialogLoading="dialogLoadingArmed"
      @onArmed="submitFormArmed")
</template>
<script >
import Query from '@/components/Query'
import ArmedDialog from '@/components/ArmedDialog'
import EditTableForm from '@/components/EditTableForm'
import { getCompany } from '@/api/com'
import {
  getInstallpointList,
  addInstallpoint,
  updateInstallpoint,
  deleteInstallpoint,
  batchDeleteInstallpoint,
  getBuildingList,
  getFloorList,
  bindInstallpoint,
  unbindInstallpoint,
  armedInstallpoint,
  disarmInstallpoint
} from '@/api/place'
import {
  getEquiList
} from '@/api/equipment.js'
// import { getDicsByName } from '@/api/commom'
import BangdDialog from '@/components/BangdDialog'

import { checkPhone, toTree, deepClone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Installpoint',
  components: {
    Query,
    EditTableForm,
    BangdDialog,
    ArmedDialog
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
      /**
       * 查询
       */
      input: '',
      queryList: [
        {
          label: '单位名称',
          prop: 'comcode',
          type: 'cascader',
          holder: '请选择单位',
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          },
          selectClear: ['jzwid', 'lcid'],
          queryType: false
        },
        {
          label: '建筑物',
          prop: 'jzwid',
          holder: '请选择建筑物',
          type: 'select',
          selectClear: ['lcid'],
          queryType: false
        },
        {
          label: '楼层',
          prop: 'lcid',
          holder: '请选择楼层',
          type: 'select',
          selectLabel: 'lcname',
          selectValue: 'lcid',
          queryType: false
        },
        {
          label: '安装点',
          prop: 'azdzh',
          holder: '请输入安装点',
          queryType: false
        },
        {
          label: '设备IMEI',
          prop: 'IMEI',
          holder: '请输入设备IMEI',
          queryType: false
        }

      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'IMEI',
          label: 'IMEI'
        },
        {
          prop: 'azdname',
          label: '安装点名称'
        },
        {
          prop: 'comname',
          label: '所属单位'
        },
        {
          prop: 'jzwname',
          label: '建筑物名称'
        },
        {
          prop: 'lcname',
          label: '楼层名称'
        }
      ],
      formRules: {
        pcode: [{ required: true, message: '请选择上级单位', trigger: 'change' }],
        comname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        comType: [{ required: true, message: '请选择单位属性', trigger: 'change' }],
        showIndex: [{ required: true, message: '请输入排序显示', trigger: 'blur' }],
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      },
      dics: {
        pcode: [],
        comType: [
          // {
          //   value: 1,
          //   label: '进销商'
          // },
          // {
          //   value: 2,
          //   label: '工程商'
          // },
          // {
          //   value: 3,
          //   label: '业主单位'
          // }
        ],
        comcode: []
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      // 新增弹窗
      bangdTitle: '新增安装点',
      bangdVisible: false,
      bangdLoading: false,
      bangdType: 'add',
      comData: [],
      bangform: {},
      imei: '',
      // 绑定设备
      rows: [],
      // 绑定设备弹窗
      dialogTitle: '绑定设备',
      formLoadingDia: false,
      dialogVisible: false,
      ruleForm: {},
      formRulesDia: {
        IMEI: [
          { required: true, message: '请输入IMEI号码', trigger: 'change' }
        ]
      },
      azdid: '',
      // 布防弹窗
      dialogVisibleArmed: false,
      dialogLoadingArmed: false,
      nowRow: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    const IMEI = this.$route.query.IMEI
    console.log(IMEI)
    if (IMEI) {
      const index = this.queryList.findIndex(n => n.prop === 'IMEI')
      const queryList = deepClone(this.queryList)
      queryList[index] = {
        label: '设备IMEI',
        prop: 'IMEI',
        holder: '请输入设备IMEI',
        queryType: false,
        default: IMEI
      }
      this.queryList = queryList
    }
    const query = IMEI ? { IMEI: IMEI } : {}
    this.onSearch(query)
    // 获取单位名
    this.getCompanyData()
    // this.getDicsList()
  },
  activated() {
    // 保持半缓存
    // this.onSearch({ com: '' })
    // this.getDicsList()
  },
  mounted() {
  },
  methods: {
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    onSearch(query) {
      this.currentPage = 1
      this.pageSize = 20
      this.query = query
      this.getDataList()
    },
    onSelectChange(row) {
      this.rows = row
    },
    getDicsList() {
      // const params = {
      //   names: '公司类型'
      // }
      // getDicsByName(params).then(res => {
      //   // console.log(res)
      //   const dics = res.Data
      //   dics.forEach(n => {
      //     n.value = n.dicvalue
      //     n.label = n.diczh
      //     switch (n.groupzh) {
      //       case '公司类型':
      //         this.dics.comType.push(n)
      //         break
      //       default:
      //         break
      //     }
      //   })
      // })
    },
    getCompanyData() {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
      this.loading = true
      getCompany(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        this.comData = deepClone(res.Data.Models)
        const data = res.Data.Models
        // 遍历树形菜单
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })

        const setData = toTree(data)
        this.$set(this.dics, 'comcode', setData)
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
      }
      this.loading = true
      getInstallpointList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        // const data = res.Data.Models
        // data.forEach(n => {
        //   if (n.comcode === this.userInfo.comcode) {
        //     n.delDisabled = true
        //   }
        // })
        this.tableData = res.Data.Models
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    // onSubmitForm(ruleForm, dialogType, cb) {
    //   const params = Object.assign({}, ruleForm)
    //   this.formLoading = true

    //   updateInstallpoint(params).then(res => {
    //     this.formLoading = true
    //     cb(true)
    //   }).catch((err) => {
    //     this.$message.error(err)
    //     this.formLoading = false
    //   })
    // },
    getBuildingListData(comname) {
      const params = {
        PageIndex: 1,
        PageSize: 9999,
        comname: comname
      }
      // this.loading = true
      this.$set(this.dics, 'jzwid', [])
      this.$set(this.dics, 'lcid', [])

      getBuildingList(params).then(res => {
        this.$nextTick(() => {
          // this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          n.label = n.jzwname
          n.value = n.jzwid
        })
        this.$set(this.dics, 'jzwid', data)
      }).catch((err) => {
        this.$message.error(err)
        // this.loading = false
      })
    },
    getLcData(jzwname) {
      this.lcLoading = true
      const params = {
        jzwname: jzwname,
        PageIndex: 1,
        PageSize: 99999
      }
      this.$set(this.dics, 'lcid', [])

      getFloorList(params).then(res => {
        this.lcLoading = false
        this.$set(this.dics, 'lcid', res.Data.Models)
      }).catch(err => {
        this.lcLoading = false
        console.error(err)
      })
    },
    querySelectChange(e, prop, form) {
      // 判断是谁改变
      if (prop === 'comcode') {
        const comname = this.comData.find(n => n.comcode === e).comname
        this.getBuildingListData(comname)
      } else if (prop === 'jzwid') {
        const jzwname = this.dics.jzwid.find(n => n.jzwid === e).jzwname
        this.getLcData(jzwname)
      }
    },
    onDeleted(row) {
      let methods, params
      if (Array.isArray(row)) {
        methods = batchDeleteInstallpoint
        const rows = []
        row.forEach(n => {
          rows.push(n.azdid)
        })
        params = row
      } else {
        methods = deleteInstallpoint
        params = {
          azdid: row.azdid
        }
      }
      methods(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    addBangding(row) {
      this.bangdVisible = true
      this.bangdType = 'add'
    },
    editBangding(row) {
      this.bangform = row
      this.bangdType = 'edit'
      this.bangdVisible = true
    },
    querySearchAsync(queryString, cb) {
      const params = {
        IMEI: queryString,
        bangding: 1,
        PageIndex: 1,
        PageSize: 99999
      }
      getEquiList(params).then(res => {
        const data = res.Data.Models
        data.forEach(n => {
          n.value = n.IMEI
        })
        // this.equiData = data
        cb(data)
      }).catch(err => {
        console.error(err)
      })
    },
    handleSelectIMEI(e) {
      this.ruleForm = e
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          const params = {
            deviceid: this.ruleForm.deviceid,
            azdid: this.azdid
          }
          this.formLoadingDia = true
          bindInstallpoint(params).then(res => {
            console.log(res)
            this.formLoadingDia = false
            this.dialogVisible = false
            this.getDataList()
          }).catch(err => {
            this.formLoadingDia = false
            console.error(err)
          })
        }
      })
    },
    BangdingrRow(row) {
      this.azdid = row.azdid
      this.dialogVisible = true
    },
    unBangding() {
      this.$confirm('解绑后将无法收到报警和故障信息，产生的后果自行承担！确定解绑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.rows.forEach(n => {
          ids.push(n.azdid)
        })
        unbindInstallpoint(ids).then(res => {
          this.getDataList()
        }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解绑'
        })
      })
    },
    // 添加安装点
    onSubmitFormBangDing(ruleform, dialogType, cb) {
      this.bangdLoading = true
      const methods = this.bangdType === 'add' ? addInstallpoint : updateInstallpoint

      methods(ruleform).then(res => {
        this.bangdLoading = false
        this.bangdVisible = false
        cb(true)
        this.getDataList()
      }).catch(err => {
        this.bangdLoading = false
        console.error(err)
      })
    },
    // 撤布放
    showBufang(row) {
      this.dialogVisibleArmed = true
      this.nowRow = row
    },
    showChefang(row) {
      this.$confirm('确认撤防？设备在撤防状态下无法接收到相关报警信息。', {
        title: '操作提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disarmInstallpoint({ azdid: row.azdid }).then(res => {
          this.$message.success('操作成功')
          this.getDataList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitFormArmed(TimeRanges) {
      const params = {
        azdid: this.nowRow.azdid,
        TimeRanges: TimeRanges
      }
      this.dialogLoadingArmed = true
      armedInstallpoint(params).then(res => {
        this.dialogLoadingArmed = false
        this.dialogVisibleArmed = false
        this.$message.success('操作成功')
        this.getDataList()
      }).catch(err => {
        this.dialogLoadingArmed = false
        console.error(err)
      })
    }

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.content{
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.dialog-pad{
  ::v-deep .el-dialog__body{
    height: calc(100vh - 300px);
    padding: 10px 20px 30px;
    .el-form-item__label{
      font-weight: 400;
    }
  }
}
.dia-footer{
  position: relative;
  text-align: right;
  width: 100%;
  padding-right: 20px;
}
</style>
