<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-02 14:54:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\User\index.vue
-->
<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-06 19:53:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
.content.layout-column

  .header.layout-row__between
    .query
      Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
  edit-table-form(
    ref="editTable"
    :loading='loading'
    :inline="true"
    operateWidth='280'
    :hasPages="false"
    :currentPage="currentPage"
    :total="total"
    :pageSize="pageSize"
    :dics="dics"
    dialogWidth='800px'
    has01="Company01"
    has02="Company02"
    has03="Company03"
    :formStyle={width: '220px'}
    :showEdit='false'
    :showAdd="false"
    :showView="false"
    :showSelection="false"
    :showBatchDel="false"
    :showIndex='true'
    :cellClassName="cellClassName"
    @onHandleCurrentChange="handleCurrentChange"
    @onHandleSizeChange="handleSizeChange"
    @onSubmitForm="onSubmitForm"
    :formLoading="formLoading"
    :formRules="formRules"
    :tableData='tableData'
    :columns="tableColumn")
    template(v-slot:outOperate)
      el-button(
        type="primary"
        size="small"
        @click='addRow') 新增
    template(v-slot:operation="{row}")
      el-button(
        type="success"
        plain
        @click.stop="editRow(row)"
        size="small") 编辑

  el-dialog.add-dialog(
    :title='preTitle',
    :visible.sync='visible'
    width='600px'
    @open="open('ruleForm')"
    :close-on-click-modal="false"
    :append-to-body="true")
    el-form.default-input(
      :model='ruleForm'
      ref='ruleForm'
      :rules="ruleFormRules"
      label-width='120px')
      div(style="width: 500px")
        div.layout-row
          el-form-item(
            prop='date'
            label="日期与序号")
            el-input(
              clearable
              oninput="value=value.replace(/[^\\d]/g,'')"
              style="width: 170px"
              v-model='ruleForm.date')
          el-form-item.ml_15.mp0(
            prop='index'
            label="")
            el-input(
              oninput="value=value.replace(/[^\\d]/g,'')"
              style="width: 100px"
              v-model='ruleForm.index')
        el-form-item(
          prop='desc'
          label="备注")
          el-input(
            style="width: 290px"
            v-model='ruleForm.desc')
        el-form-item(
          prop='pici'
          label="批次")
          span {{userInfo.comcode}}-{{ruleForm.date}}-{{ruleForm.index}}
        el-form-item(
          label="格式")
          span (厂商ID-日期-2位序号)
    .footer
      el-button(@click="visible = false" size="small") 取消
      el-button(type='primary', @click="submitPre" size="small") 提交
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getRoleList, updateComle, addCom, delCom } from '@/api/com'

import { mapGetters } from 'vuex'
export default {
  name: 'Role',
  components: {
    Query,
    EditTableForm
  },
  filters: {

  },
  data() {
    var date = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入六位数日期'))
      } else {
        if (value.length !== 6) {
          callback(new Error('请输入六位数'))
        }
        callback()
      }
    }
    var index = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入两位数序号'))
      } else {
        if (value.length !== 2) {
          callback(new Error('请输入两位数序号'))
        }
        callback()
      }
    }
    return {
      /**
       * 查询
       */
      input: '',
      queryList: [
        {
          label: '批次',
          prop: 'pici',
          holder: '请输入批次',
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
          pici: '333-201031-01',
          desc: '成都',
          creatTime: '2020-10-22'
        }
      ],
      tableColumn: [
        {
          prop: 'pici',
          label: '批次',
          editAble: true
        },
        {
          prop: 'desc',
          label: '备注',
          type: 'textarea',
          online: true,
          editAble: true
        },
        {
          prop: 'creatTime',
          label: '创建时间',
          tableOnly: true
        }

      ],
      formRules: {
        Name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      dics: {
        IsSystem: [
          {
            value: true,
            label: '是'
          },
          {
            value: false,
            label: '否'
          }
        ],
        Status: [
          {
            value: 0,
            label: '不可用'
          },
          {
            value: 1,
            label: '可用'
          }
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      showss: true,
      comname: '',
      // 权限
      preTitle: '',
      visible: false,
      ruleForm: {
        date: '201111',
        index: '01'
      },
      ruleFormRules: {
        date: [{ validator: date, trigger: 'blur' }],
        index: [{ validator: index, trigger: 'blur' }]
      }

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // this.onSearch({ com: '' })
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
    headerStyle() {
      // #fafafa
      return 'background-color: rgb(244, 248, 251); color: rgba(0,0,0,.85); font-weight: 500'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'Status') {
        switch (row.Status) {
          case 1:
            // 通过
            return 'approve-pass'
          // 拒绝
          case 0:
            return 'approve-refused'
          default:
            return 'approve-ing'
        }
      }
    },
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

    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        Keywords: this.query.com
      }
      this.loading = true
      getRoleList(params).then(res => {
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
      params.comTypeZh = this.dics.comType.find(n => n.value === params.comType) ? this.dics.comType.find(n => n.value === params.comType).label : ''
      params.pcodename = this.tableData.find(n => n.comcode === params.pcode) ? this.tableData.find(n => n.comcode === params.pcode).comname : ''
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addCom
      } else {
        methods = updateComle
      }
      methods(params).then(res => {
        console.log(res)
        this.formLoading = true
        cb(true)
      }).catch((err) => {
        this.$message.error(err)
        this.formLoading = false
      })
    },
    onDeleted(row) {
      const params = {
        cid: row.id
      }
      delCom(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    addRow() {
      this.visible = true
      this.preTitle = '添加批次'
    },
    editRow(row) {
      const pici = row.pici.split('-')
      console.log(pici)
      this.ruleForm.date = pici[1]
      this.ruleForm.index = pici[2]
      this.visible = true
      this.preTitle = '修改批次'
    },
    // 弹出
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    submitPre() {

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
    height: calc(100vh - 300px);
    overflow-y: auto;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    .el-form-item__label{
      font-weight: 400;
    }
  }
}
.mp0{
  ::v-deep .el-form-item__content{
    margin-left: 0!important;
  }
}
.footer{
  text-align: right;
  margin-top: 15px;
}
</style>

