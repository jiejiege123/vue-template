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
        el-button.ml_10(
          type="success"
          @click='exportWorder') 导出工单
        el-button.ml_10(
          type="success"
          @click='addAlarm') 新增报障
        el-button.ml_10(
          type="primary"
          @click='overAlarm') 完结工单
      template(v-slot:operation="{row}")
        el-button(
          type="success"
          plain
          @click.stop="goHistory(row)"
          ) 历史记录
        el-button(
          type="success"
          @click.stop="handle(row)"
          ) 处理
    //- 新增工单
    el-dialog.add-dialog(
      title='新增报障工单',
      :visible.sync='visible'
      width='550px'
      @open="open('ruleForm')"
      :close-on-click-modal="false"
      :append-to-body="true")
      el-form.default-input(
        v-loading="dialogLoading"
        :model='ruleForm'
        ref='ruleForm'
        :rules="dialogRules"
        label-width='120px')
        div(style="width:400px")
          el-form-item(
            prop='azdid'
            label="安装点位")
            el-autocomplete(
              style="width: 100%"
              v-model='ruleForm.azdid'
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入安装点位")
          el-form-item(
            prop='workorderbody'
            label="故障描述")
            el-input(
              style="width: 100%"
              type='textarea',
              v-model='ruleForm.workorderbody'
              :autosize='{ minRows: 4, maxRows: 5}'
              placeholder="请输入故障描述")
          el-form-item(
            prop='wordordertype'
            label="故障类型")
            el-select(
              v-model="ruleForm.wordordertype"
              placeholder="请选择故障类型"
              filterable)
              el-option(
                v-for="(list, index) in dics.wordordertype"
                :key="index"
                :label="list.label"
                :value="list.value")
          el-form-item(
            label="上传附件")
            el-upload.upload-demo(
              :action="action"
              :headers="headers"
              accept=".jpg, .png, .zip, .rar, .7z"
              :on-success='handleFileSuccess'
              :before-upload='beforeFileUpload'
              :limit='1')
              el-button(size="small" type="primary") 点击上传
              span(slot="tip" style='font-size:12px')  多个文件请上传压缩包
        el-form-item.dia-footer()
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getWorkorder } from '@/api/alarm'
import { getInstallpointList } from '@/api/place'
import { getToken } from '@/utils/auth'
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
      tableData: [{}],
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
          label: '安装点位',
          prop: 'azdname'
        },
        {
          label: '工单类型',
          prop: 'wordordertype'
        },
        {
          label: '故障描述',
          prop: 'workorderbody'
        },
        {
          label: '申报人',
          prop: 'putUser'
        },
        {
          label: '创建时间',
          prop: 'creatTime'
        },
        {
          label: '状态',
          prop: 'workordervalue'
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
      // 弹窗
      visible: false,
      dialogLoading: false,
      ruleForm: {},
      dialogRules: {
        azdid: [{ required: true, message: '请输入安装点', tigger: 'change' }],
        workorderbody: [{ required: true, message: '请输入故障描述', tigger: 'blur' }],
        wordordertype: [{ required: true, message: '请选择故障类型', tigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    action() {
      return `${process.env.VUE_APP_BASE_API}/api/common/photo/upload/single`
    },
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    }
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
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
      }
      this.loading = true
      getWorkorder(params).then(res => {
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
        { path: '/Alarm/OrderHistory', query: {
          Workorderid: row.Workorderid
        }})
    },
    addAlarm() {
      this.visible = true
    },
    overAlarm() {

    },
    exportWorder() {

    },
    handle(row) {
      // 跳转到工单详情
      this.$router.push(
        { path: '/Alarm/OrderItem', query: {
          Workorderid: row.Workorderid || 111111
        }})
    },
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    querySearchAsync(queryString, cb) {
      const params = {
        PageIndex: 1,
        PageSize: 99999,
        azdname: queryString
      }
      getInstallpointList(params).then(res => {
        cb(res.Data.Models)
      }).catch(err => {
        console.error(err)
      })
    },
    handleFileSuccess(res) {
      if (res.Status === 200) {
        const url = res.Data
        this.$set(this.ruleForm, 'imglist', url)
      } else {
        this.$message.error(res.Msg)
      }
    },
    beforeFileUpload() {

    },
    submitForm(formName) {

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
.add-dialog{
  ::v-deep .el-dialog__body{
    padding: 10px 30px;
    .el-form-item__label{
      font-weight: normal;
    }
  }
}
.dia-footer{
  text-align: right;
}
</style>
