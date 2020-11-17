<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-17 17:39:54
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList"
        inputWidth="180px" :btnLoading="loading" @onSearch="onSearch" :dics="dics")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='240'
      :hasPages="true"
      :currentPage="currentPage"
      :total="total"
      :pageSize="pageSize"
      :dics="dics"
      dialogWidth='800px'
      :formStyle={width: '220px'}
      :showSelection="true"
      :showBatchDel="true"
      has02="User02"
      :showAdd="false"
      :showEdit="false"
      :showView="false"
      :showDel="true"
      :showIndex="true"
      :cellClassName="cellClassName"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      @onSelectChange="onSelectChange"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:outOperate)
        el-button(
          type="primary"
          size="small"
          @click='addRow') 新增
        el-button(
          type="success"
          size="small"
          :disabled="rows.length === 0"
          @click='setRead') 标记已读
      template(v-slot:operation="{row}")
        el-button.ml_10(type="primary" size="small" @click.stop="viewRow(row)") 详情
        el-button.ml_10(type="success" size="small" @click.stop="editRow(row)") 编辑
    //- 新增和阅读消息
    rich-dialog(
      :dialogTitle="dialogTitleRich"
      :dialogVisible="dialogVisibleRich"
      :dialogType="dialogTypeRich"
      :form="formRich",
      :megtype='dics.megtype'
      @onCloseDialog="dialogVisibleRich = false"
      @onSubmitForm="onSubmitFormRich"
    )
    //- el-dialog.add-dialog(
    //-   :title='dialogTitle',
    //-   width="400px"
    //-   :visible.sync='dialogVisible'
    //-   @open="open('ruleForm')"
    //-   :close-on-click-modal="false"
    //-   :append-to-body="true")

</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import RichDialog from '@/components/RichDialog'
import { getSysMessage, batchDelSmg, delSmg, addSmg, updateSmg } from '@/api/sys'

import { mapGetters } from 'vuex'
export default {
  name: 'SysMsg',
  components: {
    Query,
    EditTableForm,
    RichDialog
  },
  filters: {

  },
  data() {
    return {
      /**
       * 查询
       */
      input: '',
      queryList: [
        {
          label: '标题',
          prop: 'megtitle',
          holder: '请输入标题',
          queryType: false
        },
        {
          label: '类型',
          prop: 'megtype',
          holder: '请输入消息类型',
          type: 'select',
          filter: true,
          clearable: true,
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
          prop: 'megtitle',
          label: '消息标题'
        },
        {
          prop: 'addtime',
          label: '发布时间'
        },
        {
          prop: 'megtypeZh',
          label: '类型'
        }
      ],

      dics: {
        megtype: [
          {
            value: 1,
            label: '系统公告'
          },
          {
            value: 2,
            label: '资费提醒'
          }
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      // 弹窗
      dialogTitle: '',
      dialogType: '',
      dialogVisible: false,
      ruleForm: {},
      dialogLoading: false,
      rows: [],
      // 富文本弹窗
      dialogTypeRich: 'add',
      formRich: {},
      dialogTitleRich: '',
      dialogVisibleRich: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getDataList()
  },
  mounted() {
  },
  methods: {
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'status') {
        switch (row.status) {
          case 1:
            return 'approve-pass'
          case 2:
            return 'approve-refused'
          case 3:
            return 'approve-wait'
          case 0:
            return 'approve-ing'
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
        ...this.query
      }
      this.loading = true
      getSysMessage(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        this.tableData = res.Data.Models
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    onSubmitForm(ruleForm, dialogType, cb) {
      // const params = Object.assign({}, ruleForm)
      // this.formLoading = true
      // let methods
      // if (dialogType === 'add') {
      //   methods = addUser
      // } else {
      //   methods = updateUser
      // }
      // methods(params).then(res => {
      //   cb(true)
      //   this.formLoading = false
      //   this.getDataList()
      // }).catch((err) => {
      //   this.$message.error(err)
      //   this.formLoading = false
      // })
    },
    onDeleted(row) {
      let method, params
      if (row.length > 1) {
        const megids = []
        row.forEach(n => {
          megids.push(n.megid)
        })
        method = batchDelSmg
        params = {
          megids: megids
        }
      } else {
        method = delSmg
        params = {
          megid: row.megid
        }
      }
      method(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    onSelectChange(rows) {
      this.rows = rows
    },

    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    setRead() {

    },
    addRow() {
      this.dialogTypeRich = 'add'
      this.dialogTitleRich = '添加消息'
      this.dialogVisibleRich = true
      this.formRich = {}
    },
    viewRow(row) {
      this.dialogTypeRich = 'view'
      this.dialogTitleRich = '查看消息'
      this.dialogVisibleRich = true
      this.formRich = row
    },
    editRow(row) {
      this.dialogTypeRich = 'update'
      this.dialogTitleRich = '编辑消息'
      this.dialogVisibleRich = true
      this.formRich = row
    },
    onSubmitFormRich(ruleform) {
      console.log(ruleform)
      const method = this.dialogTypeRich === 'add' ? addSmg : updateSmg
      method(ruleform).then(res => {
        this.getDataList()
        this.dialogVisibleRich = false
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
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.hearer-breadcrumb{
  padding-bottom: 15px;
  color: #666;
  font-size: 14px;

}
.dia-footer{
  text-align: right;
}
</style>
