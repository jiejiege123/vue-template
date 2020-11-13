<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-13 16:10:43
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
.content.layout-column
  //- 返回单位管理查单
  .hearer-breadcrumb(v-if="IMEI")
    el-button(type="text" style="padding: 0" @click="goAlarm") 单位管理
    i.el-icon-arrow-right
    span 角色列表
    span.ml_20(style="color: #000") {{comname}}
  .header.layout-row__between
    .query.layout-row.mb_15
      Query(
        :queryList="queryList"
        :btnLoading="loading"
        @onSearch="onSearch")
  edit-table-form(
    :loading='loading'
    :inline="true"
    operateWidth='280'
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
    :showSelection="false"
    :showBatchDel="false"
    :showView="true"
    :showDel="false"
    :showEdit="false"
    :showIndex="true"
    :showAdd="false"
    @onHandleCurrentChange="handleCurrentChange"
    @onHandleSizeChange="handleSizeChange"
    :formLoading="formLoading"
    :formRules="formRules"
    :tableData='tableData'
    :columns="tableColumn")
    template(v-slot:operation="{row}")
      el-button(
        type="success"
        @click.stop="handle(row)"
        ) 处理
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getAlarmHistory } from '@/api/alarm'

// import { getDicsByName } from '@/api/commom'

import { mapGetters } from 'vuex'
export default {
  name: 'AlarmHistroy',
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
          label: '',
          hiddenLabel: true,
          prop: 'date',
          holder: '请选择日期',
          type: 'date',
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
          prop: 'IMEI',
          label: 'IMEI'
        },
        {
          label: '设备类型',
          prop: 'shebeitype',
          formOnly: true
        },
        {
          label: '设备型号',
          prop: 'xinhaoname'
        },
        {
          label: '设备属性',
          prop: 'shebeishuxing',
          formOnly: true
        },
        {
          label: '安装点位',
          prop: 'azdname'
        },
        {
          label: '摄像头',
          prop: 'shexiang',
          formOnly: true
        },
        {
          label: '责任人',
          formOnly: true,
          prop: 'zheren'
        },
        {
          label: '报警原因',
          prop: 'alarmyinyin'
        },

        {
          label: '电话通知',
          formOnly: true,
          prop: 'telTz'
        },
        {
          label: '短信通知',
          formOnly: true,
          prop: 'msgTz'
        },
        {
          label: '报警时间',
          prop: 'alarmtime'
        },
        {
          label: '处理人',
          prop: 'douser'
        },
        {
          prop: 'addtime',
          label: '最后处理时间',
          tableOnly: true
        }

      ],
      formRules: {
      },
      dics: {

      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      IMEI: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.IMEI = this.$route.query.IMEI
    this.preTableData = JSON.parse(localStorage.getItem('routers'))
    console.log(this.preTableData)
    this.onSearch({ Name: '' })
    this.getDicsList()
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
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        IMEI: this.IMEI,
        ...this.query
      }
      this.loading = true
      getAlarmHistory(params).then(res => {
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

    goAlarm() {
      this.$router.push('/Alarm/AlarmRecord')
    },
    handle() {

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
