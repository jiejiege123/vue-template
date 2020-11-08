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
    //- 返回单位管理查单
    .hearer-breadcrumb
      el-button(type="text" style="padding: 0" @click="goCompany") 角色管理
      i.el-icon-arrow-right
      span 角色列表
      span.ml_20(style="color: #000") {{comname}}
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
import { getDicsByName } from '@/api/commom'

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
          prop: 'id',
          label: 'ID',
          tableOnly: true
        },
        {
          prop: 'Name',
          label: '角色名称',
          editAble: true
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
      comname: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.comname = this.$route.query.comname
    this.comcode = this.$route.query.comcode
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
