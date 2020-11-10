<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList"
        :dics="dics"
        :hasAdvQuery='true'  :btnLoading="loading" @onSearch="onSearch")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='220'
      :hasPages="true"
      :currentPage="currentPage"
      :total="total"
      :pageSize="pageSize"
      :dics="dics"
      :showIndex="true"
      dialogWidth='800px'
      has01="Company01"
      has02="Company02"
      has03="Company03"
      :formStyle={width: '220px'}
      :showAdd="false"
      :showView="false"
      :showEdit="false"
      :showDel="false"
      :showSelection="true"
      :showBatchDel="false"
      :cellClassName="cellClassName"
      @onSelectChange="onSelectChange"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:columnHead)
        el-table-column(label="IMEI" align="center" width="180px" type="index" prop="IMEI")
          template(slot-scope='scope')
            .layout-row.align-center
              span#imei(onselectstart="return false" style="-moz-user-select:none;") {{scope.row.IMEI}}
              svg-icon.clr_b2.hand(icon-class="copy"
              onselectstart="return false" style="font-size: 20px;margin-left:5px;-moz-user-select:none" @click.stop="copyImei(scope.row.IMEI)")
      template(v-slot:columnFoot)
        el-table-column(label="设备状态" align="center" width="80px" type="index" prop="devicevaluezh")
          template(slot-scope='scope')
            span.hand(@click="showTableDialog('devicevalue')") {{scope.row.devicevaluezh}}
            //- svg vue-qr(:text="scope.row.IMEI" :size="25")
      template(v-slot:outOperate)
        el-button(
          type="primary"
          size="small"
          @click='addRow') 新增
        el-dropdown.ml_10()
          el-button(type="primary" size="small" :disabled="moreDisable")
            | 更多菜单
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu.more-opeareat(slot="dropdown")
            el-dropdown-item(:disabled="moreOne" style="width:120px") 修改设备
            el-dropdown-item(style="width:120px") 删除设备
            el-dropdown-item(style="width:120px") 设备过户
            el-dropdown-item(style="width:120px") 批量导入
            el-dropdown-item(style="width:120px") 导出设备
            el-dropdown-item(:disabled="moreOne" style="width:120px") 事件记录
            el-dropdown-item(:disabled="moreOne" style="width:120px") 故障记录
            el-dropdown-item(:disabled="moreOne" style="width:120px") 设备日志
            el-dropdown-item(style="width:120px") 打印编码
            el-dropdown-item(style="width:120px") 设为个人模式
            el-dropdown-item(style="width:120px") 设为工程模式
            el-dropdown-item(style="width:120px") 状态复位
      template(v-slot:operation="{row}")
        svg-icon.clr_b2.hand(icon-class="qr" style="font-size: 18px;vertical-align: middle;" @click.stop="showQr(row.IMEI)")
        el-button.ml_10(type="primary" size="small" @click.stop="goDetail(row)") 详情
    //- 二维码 弹窗
    el-dialog.dialog-pr(
      title="二维码"
      :append-to-body="true"
      :visible.sync="qrVisible"
      @close="qrVisible === false"
      width="300px")
      div.center(slot="title") 二维码
      div.center
        vue-qr(:text="qrValue" :size="200")
    //- 其他弹窗
    el-dialog.dialog-pad(
      :title="dialogTitle"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      @close="qrVisible === false"
      width="600px")
      el-form.default-input(
        v-loading="formLoadingDia"
        :model='ruleForm'
        ref='ruleForm'
        :rules="formRulesDia"
        label-width='80px')
        //- 开始各种判断
        el-form-item(
          prop='IMEI'
          label="IMEI")
          el-input(
            style="width: 400px"
            v-model='ruleForm.IMEI'
            placeholder="请输入要添加到IMEI号")
        el-form-item.dia-footer()
          el-button(@click="dialogVisible = false" size="small") 取消
          el-button(type='primary', @click="submitForm" size="small") 提交
    //- 列表弹窗
    el-dialog.dialog-table(
      :title="tableDialogTitle"
      :append-to-body="true"
      :visible.sync="tableDialogVisible"
      @close="tableDialogVisible === false"
      :top="tableDialogTop"
      :width="tableDialogWidth")
      .layout-column(style="height: 100%")
        .header.layout-row__between
          .query
            Query(
              :queryList="tableQueryList"
              :hasAdvQuery='false'
              :dics="tableQueryDics"
              :btnLoading="tableLoading"
              @onSearch="onSearchTable")
        edit-table-form(
          :loading='tableLoading'
          :hasOutOperat="false"
          :tableData="tableDialogData"
          :columns="tableDialogColums"
          :disOperated="tableDisOperated"
          operateWidth="220"
          :showSelection="false"
          :showIndex="false"
          :showView="false"
          :showEdit="false"
          :showDel="false"
          :hasPages="true"
          :currentPage="tableCurrentPage"
          :total="tableTotal"
          :pageSize="tablePageSize"
          :dics="tableDics"
          @onHandleCurrentChange="handleCurrentChangeTable"
          @onHandleSizeChange="handleSizeChangeTable")
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getEquiList, addCom, delCom, updateCom } from '@/api/equipment.js'
import { getDicsByName } from '@/api/commom'
import VueQr from 'vue-qr'
import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'EquipmentLists',
  components: {
    Query,
    EditTableForm,
    VueQr
  },
  filters: {

  },
  data() {
    var isPhone = (rule, value, callback) => {
      if (value) {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
    return {
      /**
       * 查询
       */
      input: '',
      queryList: [
        {
          label: 'IMEI',
          prop: 'IMEI',
          holder: '请输入IMEI号码',
          queryType: false
        },
        {
          label: '所属单位',
          prop: 'comcode',
          holder: '请选择公司',
          type: 'select',
          queryType: true
        },
        {
          label: '单位限制',
          prop: 'CompanyLimit',
          type: 'select',
          default: 0,
          queryType: true
        },
        {
          label: '批次',
          prop: 'piciid',
          holder: '请选择批次',
          type: 'select',
          queryType: true
        },
        {
          label: '模式',
          default: '',
          prop: 'mode',
          holder: '请选择模式',
          type: 'select',
          queryType: true
        },
        {
          label: '类型',
          prop: 'devicetype',
          holder: '请选择类型',
          type: 'select',
          queryType: true
        },
        {
          label: '设备型号',
          prop: 'xinhaoid',
          holder: '请选择公司',
          type: 'select',
          queryType: true
        },
        {
          label: '建筑物',
          prop: 'jzwid',
          holder: '请选择公司',
          type: 'select',
          queryType: true
        },
        {
          label: '安装点',
          prop: 'azdid',
          holder: '请选择公司',
          type: 'select',
          queryType: true
        },
        {
          label: '设备状态',
          prop: 'devicevalue',
          default: '',
          holder: '请选择公司',
          type: 'select',
          queryType: true
        },
        {
          label: '绑定状态',
          prop: 'bangding',
          holder: '请选择公司',
          type: 'select',
          default: '',
          queryType: true
        },
        {
          label: '库存状态',
          prop: 'kcvalue',
          holder: '请选择公司',
          type: 'select',
          default: '',
          queryType: true
        }
      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [
        {
          IMEI: '867884040554676',
          devicetypezh: '门磁',
          xinhaozh: 'RT-M11-N',
          picizh: '333-201031-01',
          comname: '最高公司',
          modezh: '工程',
          devicevaluezh: '正常'
        }
      ],
      tableColumn: [
        // {
        //   label: 'IMEI',
        //   prop: 'IMEI',
        //   width: '140px'
        // },
        {
          label: '所属单位',
          prop: 'comname',
          holder: '请选择公司'
        },

        {
          label: '批次',
          prop: 'picizh'
        },
        {
          label: '模式',
          prop: 'modezh'
        },
        {
          label: '类型',
          prop: 'devicetypezh'
        },
        {
          label: '设备型号',
          prop: 'xinhaozh'
        },
        // {
        //   label: '设备状态',
        //   prop: 'devicevaluezh'
        // },
        {
          label: '在线状态',
          prop: 'onlinevaluezh'
        }
      ],
      formRules: {
        pcode: [{ required: true, message: '请选择上级单位', trigger: 'change' }],
        comname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        comType: [{ required: true, message: '请选择单位属性', trigger: 'change' }],
        showIndex: [{ required: true, message: '请输入排序显示', trigger: 'blur' }],
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      },
      dics: {
        CompanyLimit: [
          {
            value: 0,
            label: '包含下级单位设备'
          },
          {
            value: 1,
            label: '仅本单位设备'
          }
        ]

      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      moreDisable: true,
      qrVisible: false,
      qrValue: '',
      // 弹窗
      dialogTitle: '',
      dialogVisible: false,
      formLoadingDia: false,
      ruleForm: {},
      formRulesDia: {
        IMEI: [
          { required: true, message: '请输入IMEI号码', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur' }
        ]
      },
      moreOne: false,
      // 表格弹窗
      tableType: 'devicevalue',
      tableDialogTitle: '',
      tableDialogVisible: false,
      tableDialogWidth: '1000px',
      tableDialogTop: '10vh',
      tableQueryList: [],
      tableQuery: {},
      tableQueryDics: {},
      tableDialogData: [],
      tableDialogColums: [],
      tableDisOperated: true,
      tableCurrentPage: 1,
      tableTotal: 1,
      tablePageSize: 20,
      tableDics: {}

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
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
      if (column.property === 'devicevaluezh') {
        switch (row.devicevaluezh) {
          case '正常':
            // 通过
            return 'approve-pass'
          // 拒绝
          case '不正常':
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
              // this.dics.comType.push(n)
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
      getEquiList(params).then(res => {
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
        methods = updateCom
      }
      methods(params).then(res => {
        this.formLoading = true
        cb(true)
      }).catch((err) => {
        this.$message.error(err)
        this.formLoading = false
      })
    },
    onDeleted(row) {
      const params = {
        cid: row.id
      }
      delCom(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    onSelectChange(rows) {
      console.log(rows)
      if (rows.length > 0) {
        this.moreDisable = false
      } else {
        this.moreDisable = true
      }
      if (rows.length === 1) {
        this.moreOne = false
      } else {
        this.moreOne = true
      }
    },
    addRow() {
      this.dialogTitle = '新增'
      this.dialogVisible = true
    },
    showQr(val) {
      this.qrVisible = true
      this.qrValue = val
    },
    goDetail(row) {
      this.$router.push(
        { path: '/Equipment/EquipmentItem', query: {
          IMEI: row.IMEI
        }})
    },
    copyImei(imei) {
      var val = document.getElementById('imei')// 此处为需要复制文本的包裹元素
      window.getSelection().selectAllChildren(val)
      document.execCommand('Copy')
      this.$notify({
        title: '复制成功',
        message: imei,
        type: 'success',
        duration: 2000
      })
    },
    showTableDialog(type) {
      this.tableType = type
      this.tableDialogVisible = true
      this.tableQueryList = [
        {
          label: '事件名称',
          prop: 'IMEI',
          holder: '请选择事件名称',
          queryType: false
        }
      ]
      this.tableDialogColums = [
        {
          prop: '',
          label: ''
        }
      ]
      this.getWhatDataList()
    },
    handleCurrentChangeTable(e) {
      this.tableCurrentPage = e
      this.getWhatDataList()
    },
    handleSizeChangeTable(e) {
      this.tablePageSize = e
      this.getWhatDataList()
    },
    onSearchTable(query) {
      this.tableCurrentPage = 1
      this.tablePageSize = 20
      this.tableQuery = query
    },
    getWhatDataList() {

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
  overflow-y: auto;
}
.query{
 width: 100%;
}
.dialog-pad{
  ::v-deep .el-dialog__body{
    height: calc(100vh - 300px);
    padding: 10px 20px 30px;
  }
}
.dialog-pr{
  ::v-deep .el-dialog__body{
    padding: 10px 20px 30px;
  }
}
.dia-footer{
  position: relative;
  text-align: right;
  width: 100%;
  padding-right: 20px;
}
.inline{
  display: flex;
  flex-wrap: wrap;
}
.dialog-table{
  ::v-deep .el-dialog__body{
    height: calc(100vh - 150px);
    padding: 10px 20px 30px;
  }
}
</style>
