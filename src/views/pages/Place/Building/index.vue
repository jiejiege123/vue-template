<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-12 09:18:34
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
        :dics="dics"
        :btnLoading="loading" @onSearch="onSearch")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='360'
      :hasPages="true"
      :currentPage="currentPage"
      :total="total"
      :pageSize="pageSize"
      :dics="dics"
      dialogWidth='800px'
      has01="Company01"
      has02="Company02"
      has03="Company03"
      :hasMap="true"
      :formStyle={width: '220px'}
      :showIndex="true"
      :showSelection="true"
      :showBatchDel="true"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:lcsnum="{row}")
        span {{row.lcsnum + '1'}}
      //- template(v-slot:column)
        el-table-column(label="楼层数" prop="lcsnum" align="center")
          template(slot-scope='scope')
            span {{scope.row.lcsnum}}
      template(v-slot:operation="{row}")
        el-button(
          @click.stop="showBufang(row)"
          size="small") 布防
        el-button(
          type="danger"
          @click.stop="showChefang(row)"
          size="small") 撤防
    //- 不妨dialog
    //- 设置弹窗 用于修改用户状态和密码
    el-dialog.add-dialog(
      title='一键布防',
      width="700px"
      v-loading="dialogLoading"
      :visible.sync='dialogVisible'
      @open="open('ruleForm')"
      :close-on-click-modal="false"
      :append-to-body="true")
      div.bufang-content
        div.title 1、一键布防将对该建筑物下所有安装点进行布防，确认后将重置建筑物下所有安装点布防状态。
        div.title 2、请在下方设置布防时间段，设置后将对以下时间段进行布防，不设置区间则为全天布防。（时间请勿交叉重复）
        div.title 3、设置后布防生效时间段请在安装点管理查看。
        div.mb_10(v-for="(item,index) in TimeRanges" :key="index")
          el-time-picker(
            is-range
            v-model="item.time"
            :picker-options="pickerOptions"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围")
          el-button.ml_10(type="danger" icon="el-icon-delete" circle @click="delPicker(index)")
        div
          el-button(type="text" @click="addTimePicker")
            i.el-icon-plus
            span 新增定时布防时段
      .dia-footer()
        el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getBuildingList, addBuilding, deleteBuilding, updateBuilding, armedBuilding, disarmBuilding } from '@/api/place'
import { getDicsByName } from '@/api/commom'
import { getCompany } from '@/api/com'

import { checkPhone, toTree } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Building',
  components: {
    Query,
    EditTableForm
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
          type: 'cascader',
          prop: 'comname',
          holder: '请选择所属单位',
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comname',
            emitPath: false,
            checkStrictly: true
          },
          queryType: false
        },
        {
          label: '建筑物',
          prop: 'Keywords',
          holder: '请输入建筑物名称或地址',
          queryType: false
        }
      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [
        {
          lcsnum: '12'
        }
      ],
      tableColumn: [
        // {
        //   prop: 'comname',
        //   label: '地图标记',
        //   editAble: true,
        //   minWidth: 300,
        //   formOnly: true
        // },
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
          prop: 'comname',
          label: '所属单位',
          tableOnly: true,
          minWidth: 100
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
          prop: 'comcode',
          label: '所属单位',
          type: 'cascader',
          formOnly: true,
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          }
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
      formRules: {
        jzwname: [{ required: true, message: '请输入建筑名称', trigger: 'blur' }],
        comcode: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
        longitude: [{ required: true, message: '请点击图标输入查询', trigger: 'blur' }],
        latitude: [{ required: true, message: '请点击图标输入查询', trigger: 'blur' }],
        // comname: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        jzwaddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        lxr: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        lcsnum: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        lxrtel: [{ validator: isPhone, required: true, trigger: 'blur' }]
      },
      dics: {
        comcode: [],
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
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      showss: true,
      // 弹窗
      dialogTitle: '',
      dialogType: '',
      dialogVisible: false,
      ruleForm: {},
      dialogLoading: false,
      TimeRanges: [],
      pickerOptions: {
        format: 'HH:mm'
      },
      nowRow: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getCompanyData()
    this.onSearch()
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
    getDicsList() {
      const params = {
        names: '公司类型'
      }
      getDicsByName(params).then(res => {
        // console.log(res)
        const dics = res.Data
        dics.forEach(n => {
          n.value = n.dicvalue
          n.label = n.diczh
          switch (n.groupzh) {
            case '公司类型':
              this.dics.comType.push(n)
              break
            default:
              break
          }
        })
      })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
      }
      this.loading = true
      getBuildingList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })
        this.tableData = res.Data.Models
        this.$set(this.dics, 'pcode', res.Data.Models)
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    onSubmitForm(ruleForm, dialogType, cb) {
      const params = Object.assign({}, ruleForm)
      params.comname = this.dics.comcode.find(n => n.comcode === params.comcode).comname
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addBuilding
      } else {
        methods = updateBuilding
      }
      methods(params).then(res => {
        this.formLoading = true
        cb(true)
      }).catch((err) => {
        this.$message.error(err)
        this.formLoading = false
      })
    },
    onDeleted(row) {
      const params = {
        jzwid: row.jzwid
      }
      deleteBuilding(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    showBufang(row) {
      this.dialogVisible = true
      this.nowRow = row
    },
    showChefang(row) {
      this.$confirm('一键撤防将对该建筑物下所有安装点进行撤防，确认后将重置建筑物下所有安装点撤防状态。', {
        title: '操作提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disarmBuilding({ jzwid: row.jzwid }).then(res => {
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
        const data = res.Data.Models
        // 遍历树形菜单
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })
        const setData = toTree(data)
        this.$set(this.dics, 'comcode', setData)
        this.$set(this.dics, 'comname', setData)
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    //   "jzwid": "",
    // "TimeRanges": [
    // 	{
    // 		"StartTime": "",
    // 		"EndTime": ""
    // 	}
    // ]
    submitForm(formName) {
      const methods = armedBuilding
      const TimeRanges = []
      this.TimeRanges.forEach(n => {
        TimeRanges.push({
          StartTime: n.time[0],
          EndTime: n.time[1]
        })
      })
      const params = {
        jzwid: this.nowRow.jzwid,
        TimeRanges: TimeRanges
      }
      methods(params).then(res => {
        this.dialogLoading = false
        this.dialogVisible = false
        this.$message.success('操作成功')
        this.getDataList()
      }).catch(err => {
        this.dialogLoading = false
        console.error(err)
      })
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     const methods = armedBuilding
      //     const params = {
      //       jzwid: this.nowRow.jzwid
      //     }
      //     console.log(this.TimeRanges)
      //     methods(params).then(res => {
      //       this.dialogLoading = false
      //       this.dialogVisible = false
      //       this.$message.success('操作成功')
      //       this.getDataList()
      //     }).catch(err => {
      //       this.dialogLoading = false
      //       console.error(err)
      //     })
      //   } else {
      //     this.$message.error('请将加*内容填写完整')
      //     console.error('error submit!!')
      //     return false
      //   }
      // })
    },
    addTimePicker() {
      this.TimeRanges.push({})
    },
    delPicker(index) {
      this.TimeRanges.splice(index, 1)
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
.add-dialog{
  ::v-deep .el-dialog__body{
    padding-top: 10px;
  }
}
.bufang-content{
  margin: 0 auto;
  width: 600px;
  .title{
    min-height: 30px;
    line-height: 26px;
    color: #e73a03;
  }
}
.dia-footer{
  text-align: right;
}
.add-btn{
  cursor: pointer;
}
</style>
