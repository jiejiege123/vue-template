<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-20 14:28:56
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    //- 返回单位管理查单
    //- .hearer-breadcrumb(v-if="comcode")
    //-   el-button(type="text" style="padding: 0" @click="goCompany") 单位管理
    //-   i.el-icon-arrow-right
    //-   span 用户列表
    //-   span.ml_20(style="color: #000") {{comname}}
    .header.layout-row__between
      .query
        Query(:queryList="queryList"
        inputWidth="180px" :btnLoading="loading" @onSearch="onSearch" :dics="queryDics")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='300'
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
      :showIndex="false"
      :cellClassName="cellClassName"
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
import {
  getProduct,
  addProduct,
  delProduct,
  updateProduct,
  batchDelProduct } from '@/api/rmb'
import { getDicsByName } from '@/api/commom'

import { mapGetters } from 'vuex'
export default {
  name: 'User',
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
          label: '关键词',
          prop: 'Keywords',
          holder: '请输入关键词',
          queryType: false
        }
      ],
      query: {},
      queryDics: {
      },
      /**
       * 表格
       */
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'productname',
          label: '产品名称',
          editAble: true
        },
        {
          prop: 'productprice',
          label: '产品价格',
          inputFilter: "value=value.replace(/[^\\d.]/g,'')",
          editAble: true
        },
        {
          prop: 'producttype',
          label: '产品类型',
          type: 'select',
          editAble: true,
          formOnly: true
        },
        {
          prop: 'producttypezh',
          label: '产品类型',
          editAble: true,
          tableOnly: true
        },
        {
          prop: 'productnum',
          label: '产品数量',
          inputFilter: "value=value.replace(/[^\\d]/g,'')",
          editAble: true
        },
        {
          prop: 'productbody',
          label: '产品说明',
          type: 'textarea',
          online: true,
          formStyle: {
            width: '600px'
          },
          formOnly: true
        }
      ],
      formRules: {
        productname: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        productprice: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
        producttype: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
        productnum: [{ required: true, message: '请输入产品数量', trigger: 'blur' }]
        // productbody: [{ required: true, message: '请输入产品说明', trigger: 'blur' }]
      },
      dics: {
        producttype: []
      },
      currentPage: 1,
      pageSize: 20,
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
    getDicsList() {
      const params = {
        names: '产品类型'
      }
      getDicsByName(params).then(res => {
        // console.log(res)
        const dics = res.Data
        dics.forEach(n => {
          n.value = n.dicvalue
          n.label = n.diczh
          switch (n.groupzh) {
            case '产品类型':
              this.dics.producttype.push(n)
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
      getProduct(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          if (n.userid === this.userInfo.userid) {
            n.delDisabled = true
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

      params.producttypezh = this.dics.producttype.find(n => n.value === params.producttype).label

      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addProduct
      } else {
        methods = updateProduct
      }
      methods(params).then(res => {
        cb(true)
        this.formLoading = false
        this.getDataList()
      }).catch((err) => {
        this.$message.error(err)
        this.formLoading = false
      })
    },
    onDeleted(row) {
      let methods, params
      if (Array.isArray(row)) {
        methods = batchDelProduct
        const rows = []
        row.forEach(n => {
          rows.push(n.productid)
        })
        params = row
      } else {
        methods = delProduct
        params = {
          productid: row.productid
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
