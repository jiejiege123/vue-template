<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-13 15:56:00
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query.layout-row.mb_15
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
      :showIndex="true"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")

</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getModelList, addModel, delModel, updateModel } from '@/api/equipment'

import { mapGetters } from 'vuex'
export default {
  name: 'Model',
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
      queryList: [
        {
          label: '型号名称',
          prop: 'Keywords',
          holder: '请输入型号名称',
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
        // {
        //   prop: 'comname',
        //   label: '上级单位',
        //   type: 'cascader',
        //   formOnly: true,
        //   showAllLevels: false,
        //   props: {
        //     label: 'comname',
        //     value: 'comcode',
        //     emitPath: false,
        //     checkStrictly: true
        //   }
        // },

        {
          prop: 'xinhaoname',
          label: '型号',
          editAble: true
        },
        {
          prop: 'netconnettype',
          label: '网络类型',
          type: 'select',
          editAble: true,
          filter: true,
          formOnly: true
        },
        {
          prop: 'netconnettypezh',
          label: '网络类型',
          tableOnly: true
        },
        {
          prop: 'comname',
          label: '单位名称',
          addDisable: true
        },
        {
          prop: 'addtime',
          label: '创建时间',
          tableOnly: true
        }
      ],
      formRules: {
        xinhaoname: [{ required: true, message: '请输入排序显示', trigger: 'blur' }]
      },
      dics: {
        netconnettype: [
          {
            value: 0,
            label: '移动'
          },
          {
            value: 1,
            label: '电信'
          },
          {
            value: 2,
            label: '联通'
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
    this.onSearch({})
    this.getDicsList()
  },
  activated() {
    // 保持半缓存
    this.onSearch({})
    this.getDicsList()
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
      //         this.dics.comtype.push(n)
      //         break
      //       default:
      //         break
      //     }
      //   })
      // })
    },
    getDataList() {
      const params = {
        PageIndex: 1,
        PageSize: 9999,
        ...this.query
      }
      this.loading = true
      getModelList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models

        this.tableData = data
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    onSubmitForm(ruleForm, dialogType, cb) {
      const params = Object.assign({}, ruleForm)
      params.netconnettypezh = this.dics.netconnettype.find(n => n.value === params.netconnettype) ? this.dics.netconnettype.find(n => n.value === params.netconnettype).label : ''
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addModel
      } else {
        methods = updateModel
      }
      methods(params).then(res => {
        this.formLoading = true
        this.getDataList()
        cb(true)
      }).catch((err) => {
        this.$message.error(err)
        this.formLoading = false
      })
    },
    onDeleted(row) {
      const params = {
        xinhaoid: row.xinhaoid
      }
      delModel(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
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
</style>
