<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-12-09 18:45:02
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
.content.layout-column
  //- 返回单位管理查单
  .hearer-breadcrumb(v-if="comcode")
    el-button(type="text" style="padding: 0" @click="goCompany") 单位管理
    i.el-icon-arrow-right
    span 角色列表
    span.ml_20(style="color: #000") {{comname}}
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
    :showSelection="false"
    :showBatchDel="false"
    :showIndex="true"
    :cellClassName="cellClassName"
    @selectFocus="selectFocus"
    @onHandleCurrentChange="handleCurrentChange"
    @onHandleSizeChange="handleSizeChange"
    @onSubmitForm="onSubmitForm"
    :formLoading="formLoading"
    :formRules="formRules"
    :tableData='tableData'
    :columns="tableColumn")
    template(v-slot:operation="{row}")
      el-switch.pr_10(v-model="row.status"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="2"
        @change="statusChange($event, row)")
  //- 权限列表弹出
  el-dialog.add-dialog(
    :title='preTitle',
    :visible.sync='visible'
    width='1000px'
    top="10vh"
    @open="open"
    :close-on-click-modal="false"
    :append-to-body="true")
    el-table.flex1(
      :data='preTableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="350"
      border
      ref="reftable"
      row-key="Id"
      default-expand-all
      :tree-props="{children: 'Children'}"
      @row-click="rowClick"
      @selection-change="selectionChange"
      empty-text="没有数据")
      el-table-column(
        type="selection"
        align="center"
        width="55")
      el-table-column(
        v-for="(item,index) in preTableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"

        :min-width="item.minWidth"
        :width="item.width")
        template(slot-scope='scope')
          span(v-if="item.prop === 'Type'") {{preType.find(n => n.value === scope.row[item.prop]).label}}
          span(v-else) {{scope.row[item.prop]}}
    .footer
      el-button(@click="visible = false" size="small") 取消
      el-button(type='primary', @click="submitPre" size="small") 提交
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getRoleList, addRole, updateRole, enableRole, getRoleDic } from '@/api/com'
// import { getDicsByName } from '@/api/commom'

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
    return {
      /**
       * 查询
       */
      input: '',
      queryList: [
        {
          label: '角色名称',
          prop: 'Name',
          holder: '请输入角色名称',
          queryType: false
        }
      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [
        // {
        //   id: '1234',
        //   Name: '最高权限',
        //   Description: '这是最高权限',
        //   IsSystem: true,
        //   Status: 1
        // }
      ],
      tableColumn: [
        // {
        //   prop: 'Id',
        //   label: 'ID',
        //   width: 100,
        //   tableOnly: true
        // },

        {
          prop: 'Name',
          label: '角色名称',
          editAble: true
        },
        {
          prop: 'ComTypeZh',
          label: '公司类型',
          editAble: false,
          tableOnly: true
        },
        {
          prop: 'PermissionIds',
          label: '权限',
          type: 'select',
          filter: true,
          formOnly: true,
          editAble: true
        },
        {
          prop: 'Description',
          label: '角色描述',
          formOnly: true,
          online: true,
          formStyle: {
            width: '600px'
          },
          editAble: true
        },
        {
          prop: 'IsSystem',
          label: '是否系统角色',
          type: 'select',
          filter: true,
          addDisable: true
        },
        {
          prop: 'Status',
          label: '状态',
          type: 'select',
          filter: true
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
      preTableData: [],
      preTableColumns: [
        {
          prop: 'Name',
          label: '权限名称'
        },
        {
          prop: 'Code',
          label: '权限码'
        },
        {
          prop: 'Type',
          label: '权限类型'
        },
        // {
        //   prop: 'Url',
        //   label: '权限地址'
        // },
        {
          prop: 'Icon',
          label: '图标'
        },
        {
          prop: 'Description',
          label: '描述'
        }
        // {
        //   prop: 'SortCode',
        //   label: '排序'
        // }
      ],
      preType: [
        {
          value: 4,
          label: '节点组'
        },
        {
          value: 3,
          label: '权限项'
        },
        {
          value: 2,
          label: '公共菜单'
        },
        {
          value: 1,
          label: '权限菜单'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.comname = this.$route.query.comname
    this.comcode = this.$route.query.comcode
    this.preTableData = JSON.parse(localStorage.getItem('routers'))
    console.log(this.preTableData)
    this.onSearch({ Name: '' })
    this.getDicsList()
    this.getRoleDic()
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
    getRoleDic() {
      getRoleDic().then(res => {
        console.log(res)
      })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        Keywords: this.query.Name
      }
      this.loading = true
      getRoleList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          n.status = n.Status
        })
        this.tableData = data
        this.$set(this.dics, 'pcode', data)
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    onSubmitForm(ruleForm, dialogType, cb) {
      const params = Object.assign({}, ruleForm)
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addRole
      } else {
        methods = updateRole
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

    goCompany() {
      this.$router.push('/System/Companys')
    },
    statusChange(e, row) { // 启用或者停用
      console.log(row)
      const params = Object.assign({}, row)
      params.status = e
      const item = this.tableData.find(n => n.Id === row.Id)
      enableRole(params).then(res => {
        console.log(res)
        this.$message.success(res.Data)
        this.getDataList()
      }).catch(err => {
        console.log(e)
        if (e === 1) {
          item.status = 2
        } else {
          item.status = 1
        }
        console.error(err)
      })
    },
    selectFocus(prop, ruleForm, cb) {
      if (prop === 'PermissionIds') {
        cb()
        this.preTitle = `权限设置 【${ruleForm.Name}】`
        this.visible = true
      }
    },
    // 权限弹出
    open() {
      this.$refs.reftable.clearSelection()
      // TODO: 获取值
      // this.$refs.reftable.toggleRowSelection(row, true)
    },
    rowClick(row) {
      this.$refs.reftable.toggleRowSelection(row)
    },
    selectionChange(rows) {
      this.preIds = rows
    },
    submitPre() {
      let ids = ''
      this.preIds.forEach(n => {
        ids = ids + n.Id
      })
      this.$refs.editTable.setPermissionIds(ids)
      this.visible = false
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

.add-dialog{
  ::v-deep .el-dialog__body{
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
  }
}
.footer{
  text-align: right;
  margin-top: 15px;
}
</style>
