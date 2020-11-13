<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-13 17:43:34
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    .header.layout-row__between
      .query.layout-row.mb_15
        Query(
          :hasAdvQuery='true'
          :queryList="queryList"
          :dics="dics"
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
      template(v-slot:outOperate)
        el-select(
          v-model="select"
          placeholder="选择操作"
          filterable)
          el-option(
            v-for="(list, index) in selectOption"
            :key="index"
            :label="list.label"
            :value="list.value")
        el-button.ml_10(
          type="success"
          @click='batchHandle') 批量执行
      template(v-slot:operation="{row}")
        el-button(
          type="success"
          plain
          @click.stop="goHistory(row)"
          ) 历史报警
        el-button(
          type="success"
          @click.stop="handle(row)"
          ) 处理
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getAlarmList } from '@/api/alarm'

import { mapGetters } from 'vuex'
export default {
  name: 'WorkOrder',
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
          label: '',
          hiddenLabel: true,
          prop: 'Keywords',
          holder: '请输入IMEI',
          queryType: false
        },
        // {
        //   label: '',
        //   hiddenLabel: true,
        //   prop: 'date',
        //   holder: '请选择日期',
        //   type: 'date',
        //   queryType: false
        // },
        {
          label: '所属单位',
          prop: 'comcode',
          holder: '请选择所属单位',
          type: 'cascader',
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          },
          queryType: true
        },
        {
          label: '故障描述',
          prop: 'decs',
          clearable: false,
          queryType: true
        },
        {
          label: '类型',
          prop: 'devicetype',
          holder: '请选择类型',
          type: 'select',
          selectClear: ['xinhaoid'],
          queryType: true
        },
        {
          label: '型号',
          prop: 'xinhaoid',
          holder: '请选择设备型号',
          type: 'select',
          queryType: true
        },
        {
          label: '工单类型',
          prop: 'orderType',
          holder: '请选择工单类型',
          type: 'select',
          queryType: true
        },
        {
          label: '工单状态',
          prop: 'orderStatus',
          holder: '请选择状态',
          type: 'select',
          queryType: true
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
      // 其他
      select: '',
      selectOption: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // this.onSearch({})
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
      getAlarmList(params).then(res => {
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
    goHistory(row) {
      this.$router.push(
        { path: '/Alarm/AlarmHistroy', query: {
          IMEI: row.IMEI
        }})
    },
    batchHandle() {

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
  height: calc(100vh - 85px);
  overflow-y: auto;
}
.query{
 width: 100%;
}
</style>
