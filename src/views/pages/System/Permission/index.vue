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
      :showIndex='true'
      :cellClassName="cellClassName"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:operation="{row}")
        el-switch.pr_10(v-model="row.Status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          @change="statusChange")
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getRoleList, addCom, updateRole, enableRole } from '@/api/com'
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
          prop: 'Pcode',
          label: '上级',
          formOnly: true,
          type: 'cascader',
          showAllLevels: false,
          props: {
            emitPath: false,
            children: 'children',
            value: 'value',
            label: 'label'
          },
          editAble: true
        },
        {
          prop: 'Name',
          label: '权限名称',
          editAble: true
        },
        {
          prop: 'Code',
          label: '权限码',
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
          prop: 'Icon',
          label: '图标',
          editAble: true
        },
        {
          prop: 'Order',
          label: '排序',
          editAble: true
        }

      ],
      formRules: {
        Pcode: [{ required: true, message: '请选择上级', trigger: 'change' }],
        Name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        Code: [{ required: true, message: '请输入权限码', trigger: 'blur' }],
        Type: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
        Url: [{ required: true, message: '请输入权限码', trigger: 'blur' }]
      },
      dics: {
        Type: [
          {
            label: '节点组',
            value: 4
          },
          {
            label: '权限菜单',
            value: 1
          },
          {
            label: '权限项',
            value: 3
          },
          {
            label: '公共菜单',
            value: 2
          }
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // this.onSearch({})
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
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
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
    statusChange(e) {
      enableRole().then(res => {})
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
