<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-12-11 17:51:32
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='220'
      :hasPages="false"
      :currentPage="currentPage"
      :total="total"
      :pageSize="pageSize"
      :dics="dics"
      dialogWidth='800px'
      has01="Permission01"
      has02="Permission02"
      has03="Permission03"
      :formStyle={width: '220px'}
      :showSelection="true"
      :showBatchDel="true"
      :showIndex='true'
      rowKey="Id"
      :showDel="false"
      :treeProps="{ children: 'Children', hasChildren: 'hasChildren' }"
      :cellClassName="cellClassName"
      @selectChange="selectChange"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onDeleted="onDeleted"
      @onSubmitForm="onSubmitForm"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:operation="{row}")
        //- el-switch.pr_10(v-model="row.Status"
        //-   active-color="#13ce66"
        //-   inactive-color="#ff4949"
        //-   :active-value="1"
        //-   :inactive-value="0"
        //-   @change="statusChange")
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getPermissionAll, getPermission, addPermission, updatePermission, batchDelPermission } from '@/api/com'
// import { getDicsByName } from '@/api/commom'

import { mapGetters } from 'vuex'
export default {
  name: 'Permission',
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
          label: '权限名称',
          prop: 'Keywords',
          holder: '请输入权限名称',
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
          id: '1234',
          Name: '最高权限',
          Description: '这是最高权限',
          IsSystem: true,
          Status: 1
        }
      ],
      tableColumn: [
        {
          prop: 'ParentId',
          label: '上级',
          formOnly: true,
          type: 'cascader',
          showAllLevels: false,
          props: {
            emitPath: false,
            checkStrictly: true,
            children: 'Children',
            value: 'Id',
            label: 'Name'
          },
          editAble: true
        },
        {
          prop: 'Name',
          label: '权限名称',
          width: '200px',
          editAble: true
        },
        {
          prop: 'Type',
          label: '权限类型',
          type: 'select',
          filter: true,
          editAble: true
        },
        {
          prop: 'Url',
          label: '连接',
          editAble: true
        },
        {
          prop: 'SortCode',
          label: '排序',
          editAble: true,
          inputFilter: "value=value.replace(/[^\\d]/g,'')"
        },
        {
          prop: 'Code',
          label: '权限码',
          editAble: true
        },
        {
          prop: 'Icon',
          label: '图标',
          editAble: true
        },
        {
          prop: 'Description',
          label: '描述',
          type: 'textarea',
          editAble: true,
          // formOnly: true,
          online: true,
          formStyle: {
            width: '600px'
          }
        }

      ],
      formRules: {
        ParentId: [{ required: true, message: '请选择上级', trigger: 'change' }],
        Name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        SortCode: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        Type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
        Url: [{ required: true, message: '请输入访问地址', trigger: 'blur' }],
        Code: [{ required: true, message: '请输入权限码', trigger: 'blur' }]
      },
      dics: {
        Type: []
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permissionType'])
  },
  created() {
    this.onSearch({})
    this.getDicsList()
    // this.dics
    this.$set(this.dics, 'Type', this.permissionType)
  },
  activated() {
    // 保持半缓存
    // this.onSearch({ com: '' })
    // this.getDicsList()
  },
  mounted() {
  },
  methods: {
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
      getPermissionAll().then(res => {
        const data = res.Data
        data.unshift({ Id: '0', Name: '无' })
        // 递归如果 Children.length === 0 删除
        const delChildren = (array) => {
          for (let i = 0; i < array.length; i++) {
            const n = array[i]
            if (n.Type === 3) {
              // array.splice(i, 1) // 将使后面的元素依次前移，数组长度减1
              // i-- // 如果不减，将漏掉一个元素
              n.disabled = true
            }
            if (n.Children && n.Children.length === 0) {
              delete n.Children
            } else if (n.Children) {
              delChildren(n.Children)
            }
          }
        }
        delChildren(data)
        this.$set(this.dics, 'ParentId', data)
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
      }
      this.loading = true
      getPermission(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          if (!n.ParentId) {
            n.ParentId = '0'
          }
        })
        this.tableData = res.Data.Models
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
        // TODO: 新增无效
        methods = addPermission
      } else {
        methods = updatePermission
      }
      if (params.ParentId === '0') {
        params.ParentId = ''
      }
      params.SortCode = parseInt(params.SortCode)
      methods(params).then(res => {
        this.formLoading = false
        cb(true)
        this.getDataList()
        this.getDicsList()
      }).catch((err) => {
        this.$message.error(err)
        this.formLoading = false
      })
    },
    onDeleted(row) {
      let methods, params
      if (Array.isArray(row)) {
        methods = batchDelPermission
        const rows = []
        row.forEach(n => {
          rows.push(n.Id)
        })
        params = rows
      } else {
        methods = ''
        params = {
          ids: row.Id
        }
      }
      methods(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
        this.getDicsList()
      }).catch(err => {
        console.error(err)
      })
    },
    selectChange(e, prop, cb) {
      if (prop === 'Type') {
        if (e === 3) {
          this.$set(this.formRules, 'Code', [{ required: true, message: '请输入权限码', trigger: 'blur' }])
          this.$set(this.formRules, 'Url', [{ required: false, message: '请输入访问地址', trigger: 'blur' }])
        } else {
          this.$set(this.formRules, 'Code', [{ required: false, message: '请输入权限码', trigger: 'blur' }])
          this.$set(this.formRules, 'Url', [{ required: true, message: '请输入访问地址', trigger: 'blur' }])
        }
      }
      cb()
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
</style>
