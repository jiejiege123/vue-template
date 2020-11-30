<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-03-10 12:10:26
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.index.layout-column
  .header.layout-row__between
    .query
      el-date-picker(
        v-model="searchTime"
        type="datetimerange"
        range-separator="至"
        clearable
        size="small"
        value-format="yyyy-MM-dd HH:mm:ss"
        style="margin-right:15px"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange")
      el-select(
        v-model="isinvoice"
        placeholder="请选择开票状态"
        filterable
        style="padding-right:15px; width:160px"
        size="small"
        clearable
        @change="doSearch")
        el-option(
          v-for="(item,index) in isinvoiceList"
          :key="index"
          :label="item.label"
          :value="item.value")
      el-input.input-search(placeholder='请输入关键字' v-model='search' size="small" clearable @clear="getDataList")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")
    .operate
      //- el-button(type="primary" size="small" @click='createdRow') 充值

  .table-warp.flex1.layout-column
    el-table.flex1(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      fit
      ref="reftable"
      :cell-class-name="cellClassName"
      empty-text="没有数据")
      el-table-column(label="#" align="center" type="index" :index="indexMethod")
      el-table-column(v-if="userInfo.UserType === 'Admin'" label="企业名称" align="left" prop="comname" width="150px")
      el-table-column(
        v-for="(item,index) in tableColumn" :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        )
        template(slot-scope='scope')
          span {{scope.row[item.prop]}}
      //- el-table-column(label="操作" align="center" width="120")
      //-   template(slot-scope='scope')
      //-     el-button(type="success" plain size="small" @click="showDialog(scope.row)") 明细
    //- 分页
    .pages
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
    //- 列表弹窗
    el-dialog.dialog-class.list-class(
      :title='dialogTitle',
      :visible.sync='dialogVisible'
      width='70%'
      append-to-body
      :before-close="handleClose"
      top="5vh"
      :close-on-click-modal='false')
      //- 物品列表

</template>

<script >
import {
  getComUselistQer } from '@/api/rmb'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
export default {
  name: 'Index',
  components: {
  },
  filters: {
    filterImg: (val) => {
      if (val) {
        if (val.includes('http')) {
          return val
        } else {
          return process.env.VUE_APP_BASE_API + val
        }
      } else {
        return val
      }
    }
  },
  data() {
    const year = new Date().getFullYear() - 1
    const month = new Date().getMonth()
    const date = new Date().getDate()
    const hour = new Date().getHours()
    const minute = new Date().getMinutes()
    return {
      isinvoiceList: [
        {
          value: '0',
          label: '未开票'
        },
        {
          value: '1',
          label: '已开票'
        }
      ],
      isinvoice: '',
      searchTime: [new Date(year, month, date, hour, minute), new Date()],
      starttime: '',
      endtime: '',
      search: '',
      dics: {},
      /** *** 表格 *** **/
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'producttypeZh',
          label: '产品类型'
        },
        {
          prop: 'productname',
          label: '产品名称'
        },
        {
          prop: 'productnumZh',
          label: '使用数量'
        },
        {
          prop: 'Price',
          label: '溯源服务费(元)'
        },
        {
          prop: 'statusZh',
          label: '状态'
        },
        {
          prop: 'isinvoiceZh',
          label: '发票申请状态'
        },
        {
          prop: 'timestamp',
          label: '时间'
        }

      ],
      total: 1,
      currentPage: 1,
      pageSize: 20,
      /** *** 弹窗 *** **/
      dialogTitle: '详情',
      dialogVisible: false,
      ruleForm: {},

      /** *** 图片弹窗 *** **/
      imageTitle: '',
      imageVisible: false,
      imgUrl: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    }
  },
  created() {
    // this.getDataList()
    this.getDicsDataList()
  },
  mounted() {

  },
  methods: {
    /** *** 通用 start *** **/
    headerStyle() {
      return 'background-color: #FAFAFA;'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'isinvoiceZh') {
        switch (row.isinvoice) {
          case 0:
            // 未提交
            return 'approve-wait'
          default:
            return 'approve-ing'
        }
      }
      if (column.property === 'statusZh') {
        switch (row.status) {
          case 0:
            // 未提交
            return 'approve-wait'
          default:
            return 'approve-ing'
        }
      }
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    doSearch() {
      this.currentPage = 1
      this.pageSize = 20
      this.getDataList()
    },
    handleClose(done) {
      done()
    },
    closeDialog() {
      this.dialogVisible = false
    },
    dateChange(e) {
      console.log(e)
      this.starttime = e[0]
      this.endtime = e[1]
      this.doSearch()
    },
    /** *** 通用 end *** **/

    /** *** 按钮操作 start *** **/
    /**
     * @description: 显示弹出
     * @param {type}
     * @return:
     */
    showDialog(row) {
      this.dialogVisible = true
      this.ruleForm = Object.assign({}, row)
      this.ruleForm.wpnum_list.forEach(n => {
        // n.timestamp = dateForamt(new Date(n.timestamp), 'yyyy-MM-dd hh:mm:ss')
      })
      this.tableDialogData = this.ruleForm.wpnum_list
    },
    /** *** 按钮操作 end *** **/

    /** *** 接口请求 start *** **/
    /**
     * @description: 获取列表数据
     * @param {type}
     * @return:
     */
    getDataList() {
      console.log(this.starttime)
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.search,
        starttime: this.starttime || parseTime(new Date()),
        endtime: this.endtime || parseTime(new Date().getTime() + 24 * 60 * 60 * 1000 * 365),
        isinvoice: this.isinvoice
      }
      this.loading = true
      getComUselistQer(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        setTimeout(() => {
          this.$refs.reftable.doLayout()
        }, 200)
        const tableData = res.Data.Models
        tableData.forEach(n => {
          // n.timestamp = dateForamt(new Date(n.timestamp), 'yyyy-MM-dd hh:mm:ss')
          n.timestamp = parseTime(n.timestamp)
          switch (n.producttype) {
            case '0':
              n.producttypeZh = '普通雷管'
              n.productnumZh = n.productnum + ' (枚)'

              break
            case '1':
              n.producttypeZh = '数码雷管'
              n.productnumZh = n.productnum + ' (枚)'

              break
            case '2':
              n.producttypeZh = '炸药'
              n.productnumZh = n.productnum + ' (公斤)'
              break
            case '库区手持':
              n.producttypeZh = '库区手持'
              n.productnumZh = n.productnum
              break
            default:
              break
          }
          n.Price = (n.Price * 0.01).toFixed(2)
          switch (n.status) {
            case 0:
              n.statusZh = '使用'
              break
            case 1:
              n.statusZh = '退还'
              break
            default:
              break
          }
          switch (n.isinvoice) {
            case 0:
              n.isinvoiceZh = '未申请'
              break
            case 1:
              n.isinvoiceZh = '已申请'
              break
            default:
              break
          }
        })
        this.tableData = tableData
        this.total = res.Data.TotalCount
      }).catch((err) => {
        console.error(err)
        this.loading = false
      })
    },
    /**
     * @description: 获取字典值
     * @param {type}
     * @return:
     */
    getDicsDataList() {
      const data = ['爆破类型', '项目等级', '人员类型', '物资分类']
      this.loading = true
      this.$store.dispatch('dics/getDicData', data).then(res => {
        const dics = {}
        for (const key in res) {
          // eslint-disable-next-line no-prototype-builtins
          if (res.hasOwnProperty(key)) {
            const element = res[key]
            switch (key) {
              case '爆破类型':
                dics.bptype = element
                break
              case '项目等级':
                dics.QF0032 = element
                break
              case '人员类型':
                dics.UF002 = element
                break
              case '物资分类':
                dics.wzfl = element
                break
              default:
                break
            }
          }
        }
        this.dics = dics
        this.getDataList()
      }).catch(() => {
        this.loading = false
      })
    }
    /** *** 获取数据 end *** **/

    /** *** 其他 start *** **/

  }
}
</script>
<style lang="scss" scoped>
/***** 基本设置 start ******/
.index{
  padding: 10px 10px;
  height: calc(100vh - 90px);
}
.header{
  margin: 10px 0 15px;
  .query{
    .input-search{
      width: 200px;
    }
  }
}
.pages{
  margin-top: 20px;
}
/** *** 基本设置 end ******/
.dialog-class{
  ::v-deep .el-dialog{
    min-width: 720px;
    .el-form-item__error{
      display: none
    }
  }
  ::v-deep .el-dialog__body{
    height: calc(100vh - 150px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .plhj-table{
      flex: 1
    }
  }
  .dia-footer{
    width: 100% !important;
    text-align: right;
    ::v-deep .el-form-item__content{
    text-align: right
    }
  }
}
.inbtn{
  padding: 5px 8px
}
.list-class{
  ::v-deep .el-dialog__body{
    padding-top: 15px;
  }
}
.ullist{
  position: absolute;
  z-index: 999;
  background: rgb(48, 65, 86);
  top: 35px;
  list-style:none;
  width: 150px;
  padding: 5px 0;
  color: #f4f4f5;
  li{
    padding: 5px 15px;
    cursor: pointer;
    &:hover{
      background:#1f2d3d;
      color: rgb(64, 158, 255)
    }
  }
}
</style>
