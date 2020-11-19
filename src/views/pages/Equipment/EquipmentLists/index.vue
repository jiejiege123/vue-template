<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList"
        :dics="dics"
        :hasAdvQuery='true'
        :btnLoading="loading"
        @selectChange="querySelectChange"
        @onSearch="onSearch")
    edit-table-form(
      ref="tableForm"
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
      :showAdd="true"
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
              //- svg-icon.clr_b2.hand(icon-class="copy"
              //- onselectstart="return false" style="font-size: 20px;margin-left:5px;-moz-user-select:none" @click.stop="copyImei(scope.row.IMEI)")
      template(v-slot:columnFoot)
        el-table-column(label="设备状态" align="center" width="80px" type="index" prop="devicevaluezh")
          template(slot-scope='scope')
            span.hand(@click="showTableDialog('devicevalue')") {{scope.row.devicevaluezh}}
        el-table-column(label="安装点位" align="center" width="80px" type="index" prop="anzhungdid")
          template(slot-scope='scope')
            span.hand.clr_b2(v-if="scope.row.anzhungdid") {{scope.row.anzhungdid}}
            el-button(v-else type="primary" size="small" @click.stop='showBangding(scope.row)') 绑定
            //- svg vue-qr(:text="scope.row.IMEI" :size="25")
      template(v-slot:outOperate)
        el-button(
          type="primary"
          size="small"
          @click='addRow') 添加

        el-dropdown.ml_10.mr_10(@command="dropCommand")
          el-button(type="primary" size="small")
            | 更多菜单
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu.more-opeareat(slot="dropdown")
            el-dropdown-item(command="delRow" style="width:120px" :disabled="moreDisable") 删除设备
            el-dropdown-item(command="guohu" style="width:120px" :disabled="moreDisable") 设备过户
            el-dropdown-item(command="import" style="width:120px") 批量导入
            el-dropdown-item(command="export"
             style="width:120px") 导出设备
            el-dropdown-item(command="eventRecord" :disabled="moreOne || moreDisable" style="width:120px") 事件记录
            el-dropdown-item(command="faultRecord" :disabled="moreOne || moreDisable" style="width:120px") 故障记录
            el-dropdown-item(command="deviceLog" :disabled="moreOne || moreDisable" style="width:120px") 设备日志
            el-dropdown-item(:disabled="true" command="print" style="width:120px") 打印编码
            el-dropdown-item(command="personalModel" style="width:120px" :disabled="moreOne || moreDisable") 设为个人模式
            el-dropdown-item(command="EngineerModel" style="width:120px" :disabled="moreOne || moreDisable") 设为工程模式
            el-dropdown-item(:disabled="moreOne || moreDisable" command="resetStatus" style="width:120px") 状态复位
      template(v-slot:operation="{row}")
        svg-icon.clr_b2.hand(icon-class="qr" style="font-size: 18px;vertical-align: middle;" @click.stop="showQr(row.IMEI)")
        el-button.ml_10(type="primary" size="small" @click.stop="goDetail(row)") 详情

        el-button.ml_10(type="success" size="small" @click.stop="showAlarmuser(row)") 接警联系人
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
      @close="dialogVisible === false"
      @open="open('ruleForm')"
      width="600px")
      el-form.default-input(
        v-loading="formLoadingDia"
        :model='ruleForm'
        ref='ruleForm'
        :rules="formRulesDia"
        label-width='80px')
        //- 开始各种判断
        el-form-item(
          v-if="rowStatus === 'add'"
          prop='IMEI'
          label="IMEI")
          el-autocomplete(
            style="width: 400px"
            v-model='ruleForm.IMEI'
            :fetch-suggestions="querySearchAsync"
            @select="handleSelectIMEI"
            placeholder="请输入要添加的IMEI号")
        el-form-item(
          v-if="rowStatus === 'guohu'"
          prop='comcode'
          label="单位名称")
          el-cascader(
            :options='dics.comcode',
            :show-all-levels='true'
            :props="{label: 'comname',value: 'comcode',emitPath: false,checkStrictly: true}"
            v-model="ruleForm.comcode"
            placeholder="请选择公司"
            filterable)
        //- 只有生产厂家有 批次和设备型号选项 根据 comtype === '1' 判断
        el-form-item(
          v-if="rowStatus === 'import'"
          prop='piciid'
          label="批次")
          el-select(
            v-model="ruleForm.piciid"
            placeholder="请选择批次"
            filterable)
            el-option(
              v-for="(list, index) in dics.piciid"
              :key="index"
              :label="list.piciname"
              :value="list.piciid")
        el-form-item(
          v-if="rowStatus === 'import'"
          prop='xinhaoid'
          label="设备型号")
          el-select(
            v-model="ruleForm.xinhaoid"
            placeholder="请选择设备型号"
            filterable)
            el-option(
              v-for="(list, index) in dics.xinhaoid"
              :key="index"
              :label="list.xinhaoname"
              :value="list.xinhaoid")
        el-form-item(
          v-if="rowStatus === 'import'"
          prop='file'
          label="文件")
          .layout-row
            el-upload.upload-demo(
              :action="importAction"
              :headers="headers"
              accept=".xls, .xlsx"
              :on-success='handleFileSuccess'
              :before-upload='beforeFileUpload'
              :limit='1')
              el-button(size="small" type="primary") 点击上传
              span(slot="tip" style='font-size:12px')  只能上传Excel格式文件
            el-button.ml_10(type="text" @click="downLoad") 下载模板
        el-form-item(
          v-if="rowStatus === 'jiejin'"
          prop='jjlxrids'
          label="")
          el-checkbox(:indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange") 全选
          div(style="margin: 15px 0;")
          el-checkbox-group(v-model="checkedUsers" @change="handleCheckedCitiesChange")
            el-checkbox(v-for="(item,index) in usersOptions"
            :label="item.jjlxrid" :key="index") {{item.username}}({{item.usertel}})
        el-form-item.dia-footer()
          el-button(@click="dialogVisible = false" size="small") 取消
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交

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
          :dics="dics"
          @onHandleCurrentChange="handleCurrentChangeTable"
          @onHandleSizeChange="handleSizeChangeTable")
    //- 绑定弹窗
    BangdDialog(
      :dialogTitle="bangdTitle"
      :dialogVisible="bangdVisible"
      :dialogType="bangdType"
      :dialogLoading="bangdLoading"
      :comcode="userInfo.comcode"
      :comname="userInfo.comname"
      :comData='comData'
      :imei="imei"
      :deviceid='deviceid'
      @onCloseDialog="onCloseDialog"
      @onSubmitForm="onSubmitFormBangDing"
    )
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import BangdDialog from '@/components/BangdDialog'
import { getToken } from '@/utils/auth'
import {
  getEquiList,
  // getEquiByid,
  addEqui,
  delEqui,
  updateEqui,
  getPiciList,
  getModelList,
  batchDelEqui,
  getAlarmuser,
  bindAlarmuser,
  unbindAlarmuser,
  transferEqui,
  setModeEqui,
  exportEqui
  // importEqui
} from '@/api/equipment.js'
import { getCompany } from '@/api/com'
import { getBuildingList, getInstallpointList } from '@/api/place'
import { getDicsByName } from '@/api/commom'
import VueQr from 'vue-qr'
import { checkPhone, toTree, deepClone } from '@/utils/index'
import { mapGetters } from 'vuex'
import { getAlarmuserList, bindInstallpoint } from '@/api/place'

export default {
  name: 'EquipmentLists',
  components: {
    Query,
    EditTableForm,
    VueQr,
    BangdDialog
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
          holder: '请选择所属单位',
          type: 'cascader',
          queryType: true,
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          },
          selectClear: ['jzwid', 'azdid', 'piciid', 'xinhaoid']
        },
        {
          label: '单位限制',
          prop: 'CompanyLimit',
          clearable: false,
          type: 'select',
          default: 1,
          queryType: true
        },
        {
          label: '批次',
          prop: 'piciid',
          holder: '请选择批次',
          type: 'select',
          clearable: true,
          selectLabel: 'piciname',
          selectValue: 'piciid',
          queryType: true
        },
        {
          label: '模式',
          prop: 'mode',
          clearable: true,
          holder: '请选择模式',
          type: 'select',
          queryType: true
        },
        {
          label: '类型',
          prop: 'devicetype',
          clearable: true,
          holder: '请选择类型',
          type: 'select',
          queryType: true
        },
        {
          label: '设备型号',
          prop: 'xinhaoid',
          clearable: true,
          holder: '请选择设备型号',
          type: 'select',
          selectLabel: 'xinhaoname',
          selectValue: 'xinhaoid',
          queryType: true
        },
        {
          label: '建筑物',
          prop: 'jzwid',
          holder: '请选择建筑物',
          selectClear: ['azdid'],
          type: 'select',
          queryType: true
        },
        {
          label: '安装点',
          prop: 'azdid',
          holder: '请选择安装点',
          type: 'select',
          queryType: true
        },
        {
          label: '设备状态',
          prop: 'devicevalue',
          clearable: true,
          holder: '请选择设备状态',
          type: 'select',
          queryType: true
        },
        {
          label: '绑定状态',
          prop: 'bangding',
          clearable: true,
          holder: '请选择绑定状态',
          type: 'select',
          queryType: true
        },
        {
          label: '库存状态',
          prop: 'kcvalue',
          clearable: true,
          holder: '请选择库存状态',
          type: 'select',
          queryType: true
        }
      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [
        // {
        //   IMEI: '867884040554676',
        //   devicetypezh: '门磁',
        //   xinhaozh: 'RT-M11-N',
        //   piciname: '333-201031-01',
        //   comname: '最高公司',
        //   modezh: '工程',
        //   devicevaluezh: '正常'
        // }
      ],
      tableColumn: [
        {
          label: 'IMEI',
          prop: 'IMEI',
          width: '140px',
          editAble: true,
          formOnly: true
        },
        {
          label: '所属单位',
          prop: 'comname',
          holder: '请选择公司',
          addDisable: true
        },
        {
          label: '批次',
          width: 135,
          prop: 'piciname',
          tableOnly: true
        },
        {
          label: '批次',
          prop: 'piciid',
          editAble: true,
          selectLabel: 'piciname',
          selectValue: 'piciid',
          type: 'select',
          formOnly: true
        },
        {
          label: '模式',
          prop: 'mode',
          editAble: true,
          type: 'select',
          formOnly: true
        },
        {
          label: '模式',
          prop: 'modezh',
          tableOnly: true
        },
        {
          label: '类型',
          prop: 'devicetypezh',
          tableOnly: true
        },
        {
          label: '类型',
          prop: 'devicetype',
          editAble: true,
          type: 'select',
          formOnly: true
        },
        {
          label: '设备型号',
          editAble: true,
          formOnly: true,
          type: 'select',
          prop: 'xinhaoid',
          selectLabel: 'xinhaoname',
          selectValue: 'xinhaoid'
        },
        {
          label: '设备型号',
          prop: 'xinhaozh',
          tableOnly: true
        },
        // {
        //   label: '设备状态',
        //   prop: 'devicevaluezh'
        // },
        {
          label: '在线状态',
          addDisable: true,
          prop: 'onlinevaluezh'
        }
      ],
      formRules: {
        IMEI: [{ required: true, message: '请输入设备IMEI', trigger: 'blur' }],
        piciid: [{ required: true, message: '请选择批次', trigger: 'change' }],
        xinhaoid: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        mode: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        devicetype: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        // comname: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        // comType: [{ required: true, message: '请选择单位属性', trigger: 'change' }],
        // showIndex: [{ required: true, message: '请输入排序显示', trigger: 'blur' }],
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      },
      dics: {
        CompanyLimit: [
          {
            value: 1,
            label: '包含下级单位用户'
          },
          {
            value: 0,
            label: '仅本单位用户'
          }
        ]

      },
      dicsForm: {
        CompanyLimit: [
          {
            value: 1,
            label: '包含下级单位用户'
          },
          {
            value: 0,
            label: '仅本单位用户'
          }
        ],
        comcode: [],
        comtype: [],
        mode: []
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
      dialogType: '',
      dialogVisible: false,
      formLoadingDia: false,
      ruleForm: {},
      formRulesDia: {
        comcode: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        piciid: [
          { required: true, message: '请选择批次', trigger: 'change' }
        ],
        xinhaoid: [
          { required: true, message: '请选择设备型号', trigger: 'change' }
        ],
        file: [
          { required: true, message: '请上传文件' }
        ],
        IMEI: [
          { required: true, message: '请输入IMEI号码', trigger: 'change' },
          { min: 1, max: 25, message: '长度在 3 到 25 个字符', trigger: 'change' }
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
      tableDics: {},
      tableLoading: false,
      // 绑定弹窗
      bangdTitle: '绑定安装点',
      bangdVisible: false,
      bangdType: 'shebei',
      bangdLoading: false,
      comData: [],
      imei: '',
      deviceid: '',
      // 勾选行数据
      row: {},
      rowStatus: '',
      // 接警人
      checkAll: false,
      checkedUsers: [],
      usersOptions: [],
      isIndeterminate: false,
      oldCheckedUsers: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    action() { // 上传文件
      return `${process.env.VUE_APP_BASE_API}/api/common/photo/upload/single`
    },
    importAction() {
      return `${process.env.VUE_APP_BASE_API}/api/device/batch/import`
    },
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  created() {
    // 获取单位
    this.getCompanyData()
    // 批次
    this.getPiciData()
    // 设备型号
    this.getModelListData()

    this.getDicsList()
    this.onSearch({})
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
        names: '公司类型;设备模式;设备类型;设备运行状态;设备安装状态'
      }
      getDicsByName(params).then(res => {
        // console.log(res)
        const dics = res.Data
        const dicsData = {
          comtype: [],
          mode: [],
          devicetype: [],
          devicevalue: [],
          bangding: []

        }
        dics.forEach(n => {
          n.value = n.dicvalue
          n.label = n.diczh
          switch (n.groupzh) {
            case '公司类型':
              dicsData.comtype.push(n)
              break
            case '设备模式':
              dicsData.mode.push(n)
              break
            case '设备类型':
              dicsData.devicetype.push(n)
              break
            case '设备运行状态':
              dicsData.devicevalue.push(n)
              break
            case '设备安装状态':
              dicsData.bangding.push(n)
              break

            default:
              break
          }

          this.$set(this.dics, 'comtype', dicsData.comtype)
          this.$set(this.dics, 'mode', dicsData.mode)
          this.$set(this.dics, 'devicetype', dicsData.devicetype)
          this.$set(this.dics, 'devicevalue', dicsData.devicevalue)
          this.$set(this.dics, 'bangding', dicsData.bangding)
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
      getEquiList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
          n.piciname = n.picizh
          n.xinhaozh = n.xinghaoname
          n.xinhaoid = n.xinghaoid
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

      params.modezh = this.dics.mode.find(n => n.value === params.mode) ? this.dics.mode.find(n => n.value === params.mode).label : ''
      params.devicetypezh = this.dics.devicetype.find(n => n.value === params.devicetype) ? this.dics.devicetype.find(n => n.value === params.devicetype).label : ''

      params.picizh = this.dics.piciid.find(n => n.piciid === params.piciid) ? this.dics.piciid.find(n => n.piciid === params.piciid).piciname : ''

      params.xinghaoname = this.dics.xinhaoid.find(n => n.xinhaoid === params.xinhaoid) ? this.dics.xinhaoid.find(n => n.xinhaoid === params.xinhaoid).xinhaoname : ''

      params.xinghaoid = params.xinhaoid

      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addEqui
      } else {
        methods = updateEqui
      }
      // console.log(params)
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
      // const params = {
      //   cid: row.id
      // }
      // delCom(params).then(res => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   })
      //   this.getDataList()
      // }).catch(err => {
      //   console.error(err)
      // })
    },
    onSelectChange(rows) {
      console.log(rows)
      this.row = rows
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
      this.rowStatus = 'add'
      this.dialogVisible = true
      this.ruleForm = {}
    },
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },

    showQr(val) {
      this.qrVisible = true
      this.qrValue = val
    },
    goDetail(row) {
      this.$router.push(
        { path: '/Equipment/EquipmentItem', query: {
          deviceid: row.deviceid
        }})
    },
    // copyImei(imei) {
    //   var val = document.getElementById('imei')// 此处为需要复制文本的包裹元素
    //   window.getSelection().selectAllChildren(val)
    //   document.execCommand('Copy')
    //   this.$notify({
    //     title: '复制成功',
    //     message: imei,
    //     type: 'success',
    //     duration: 2000
    //   })
    // },
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

    },
    getCompanyData() {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
      this.loading = true
      getCompany(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        this.comData = deepClone(res.Data.Models)
        const data = res.Data.Models
        // 遍历树形菜单
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })

        const setData = toTree(data)
        this.$set(this.dics, 'comcode', setData)
        this.$set(this.dicsForm, 'comcode', setData)
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    getPiciData() {
      const params = {
        'PageIndex': 1,
        'PageSize': 9999
      }
      getPiciList(params).then(res => {
        this.$set(this.dics, 'piciid', res.Data.Models)
      }).catch(err => {
        console.error(err)
      })
    },
    getModelListData() {
      const params = {
        'PageIndex': 1,
        'PageSize': 9999
      }
      getModelList(params).then(res => {
        this.$set(this.dics, 'xinhaoid', res.Data.Models)
      }).catch(err => {
        console.error(err)
      })
    },
    getBuildingListData(comname) {
      const params = {
        PageIndex: 1,
        PageSize: 9999,
        comname: comname
      }
      // this.loading = true

      this.$set(this.dics, 'jzwid', [])
      this.$set(this.dics, 'azdid', [])

      getBuildingList(params).then(res => {
        this.$nextTick(() => {
          // this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          n.label = n.jzwname
          n.value = n.jzwid
        })
        this.$set(this.dics, 'jzwid', data)
      }).catch((err) => {
        this.$message.error(err)
        // this.loading = false
      })
    },
    getInstallpointListData(jzwid) {
      const params = {
        PageIndex: 1,
        PageSize: 9999,
        jzwid: jzwid
      }
      // this.loading = true

      this.$set(this.dics, 'azdid', [])
      getInstallpointList(params).then(res => {
        this.$nextTick(() => {
          // this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          n.label = n.azdname
          n.value = n.azdid
        })
        this.$set(this.dics, 'azdid', data)
      }).catch((err) => {
        this.$message.error(err)
        // this.loading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.rowStatus === 'add') {
            console.log(this.ruleForm)
          } else if (this.rowStatus === 'guohu') {
            console.log(this.ruleForm)
            const DeviceIds = []
            this.row.forEach(n => {
              DeviceIds.push(n.deviceid)
            })
            const params = {
              DeviceIds: DeviceIds,
              ComCode: this.ruleForm.comcode
            }
            this.formLoadingDia = true
            transferEqui(params).then(res => {
              console.log(res)
              this.formLoadingDia = false
              this.dialogVisible = false
              this.getDataList()
            }).catch(err => {
              console.log(err)
              this.formLoadingDia = false
            })
          } else if (this.rowStatus === 'jiejin') {
            // TODO: 判断哪些是被勾选的 那些是被取消的
            // this.oldCheckedUsers // 之前勾选的
            // this.checkedUsers // 当前勾选的
            // 取消勾选
            const unAddUsers = this.oldCheckedUsers.filter(n => this.checkedUsers.indexOf(n) === -1)
            const addUsers = this.checkedUsers.filter(n => this.oldCheckedUsers.indexOf(n) === -1)
            this.formLoadingDia = true
            if (addUsers.length > 0) {
              bindAlarmuser({ 'deviceid': this.ruleForm.deviceid,
                'jjlxrids': addUsers }).then(res => {
                this.formLoadingDia = false
                this.dialogVisible = false
                this.$message.success('接警联系人设置成功')
              }).catch(err => {
                this.formLoadingDia = false
                console.error(err)
              })
            }
            if (unAddUsers.length > 0) {
              unbindAlarmuser({ 'deviceid': this.ruleForm.deviceid,
                'jjlxrids': unAddUsers }).then(res => {
                this.formLoadingDia = false
                this.dialogVisible = false
                this.$message.success('接警联系人解绑成功')
              }).catch(err => {
                this.formLoadingDia = false
                console.error(err)
              })
            }
          } else if (this.rowStatus === 'import') {
            //
          }
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    querySelectChange(e, prop, form) {
      // 判断是谁改变
      if (prop === 'comcode') {
        const comname = this.comData.find(n => n.comcode === e).comname
        this.getBuildingListData(comname)
      } else if (prop === 'jzwid') {
        this.getInstallpointListData(e)
      }
    },
    showBangding(row) {
      this.bangdVisible = true
      this.imei = row.IMEI
      this.deviceid = row.deviceid
    },
    dropCommand(e) {
      this.rowStatus = e
      if (e === 'editRow') {
        this.$refs.tableForm.editRow(this.row[0])
      } else if (e === 'delRow') { // 删除
        this.$confirm('删除设备后会导致设备无法与平台连接，无法收到相关报警与提示，及产生的后果自行承担，确认将该设备删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          // 调用接口
          let methods
          let params
          if (this.row.length > 1) {
            methods = batchDelEqui
            const rows = []
            this.row.forEach(n => {
              rows.push(n.deviceid)
            })
            // params = {
            //   deviceids: rows
            // }
            params = rows
          } else {
            methods = delEqui
            params = {
              deviceid: this.row[0].deviceid
            }
          }
          methods(params).then(res => {
            // console.log();
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDataList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (e === 'guohu') { // 过户
        this.dialogVisible = true
        this.dialogTitle = '设备过户'
      } else if (e === 'import') { // 导入
        this.dialogVisible = true
        this.dialogTitle = '设备类型'
      } else if (e === 'export') { // 导出
        this.$confirm('将根据当前查询结果要导出设备, 确定吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 直接根据查询条件导出数据
          const params = this.query
          exportEqui(params).then(res => {
            console.log(res.Data)
            const url = res.Data
            let ur
            if (url.includes('http')) {
              ur = url
            } else {
              ur = process.env.VUE_APP_BASE_API + url
            }
            window.open(ur)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (e === 'eventRecord') {
        this.tableDialogTitle = '事件日志'
        this.tableQueryList = [
          {
            label: '事件名称',
            prop: 'IMEI',
            type: 'select',
            holder: '请选择事件',
            queryType: false
          }
        ]
        this.tableDialogColums = [
          {
            label: '事件事件',
            prop: 'IMEI'
          },
          {
            label: '事件名称',
            prop: 'IMEI'
          },
          {
            label: '设备上报内容',
            prop: 'IMEI'
          }
        ]
        this.tableDialogVisible = true
      } else if (e === 'EngineerModel' || e === 'personalModel') {
        const Mode = e === 'EngineerModel' ? 2 : 1
        const DeviceIds = []
        this.row.forEach(n => {
          DeviceIds.push(n.deviceid)
        })
        const params = {
          DeviceIds: DeviceIds,
          Mode: Mode
        }
        setModeEqui(params).then(res => {
          console.log(res)
        })
      }
    },
    handleFileSuccess(res) {
      if (res.Status === 200) {
        const url = res.Data
        this.$set(this.ruleForm, 'file', url)
      } else {
        this.$message.error(res.Msg)
      }
    },
    beforeFileUpload(file) {
      const fileExt = file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
      // const isZip = file.type === 'application/x-zip-compressed'
      // const iszip = file.type === 'application/zip'
      const xls = fileExt === '.xls'
      const xlsx = fileExt === '.xlsx'
      if (!xlsx && !xls) {
        this.$message.error('上传文件是Excel格式文件!')
      }
      return (xls || xlsx)
    },
    downLoad() {
      const url = process.env.VUE_APP_BASE_API + 'file'
      window.open(url)
    },
    showAlarmuser(row) {
      this.ruleForm = Object.assign({}, row)
      this.rowStatus = 'jiejin'
      this.checkedUsers = []
      this.dialogVisible = true
      this.dialogTitle = '选择接警联系人'
      this.getAlarmuserListData(row)
    },
    getAlarmuserListData(row) {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
      this.formLoadingDia = true
      getAlarmuserList(params).then(res => {
        const data = res.Data.Models
        this.usersOptions = data
        // let usersOptions = []
        // data.forEach(n => {
        //   usersOptions.push(n.jjlxrid)
        // });
        // this.usersOptions = usersOptions
        getAlarmuser({ deviceid: row.deviceid }).then(resA => {
          console.log(resA)
          const data = resA.Data
          const userList = []
          data.forEach(n => {
            userList.push(n.jjlxrid)
          })
          console.log(userList)
          this.checkedUsers = userList
          this.oldCheckedUsers = deepClone(userList)
          this.formLoadingDia = false
        }).catch((err) => {
          this.$message.error(err)
          this.formLoadingDia = false
        })
      }).catch((err) => {
        this.$message.error(err)
        this.formLoadingDia = false
      })
    },
    handleCheckAllChange(val) {
      console.log(val)
      if (val) {
        const checkedUsers = []
        this.usersOptions.forEach(n => {
          checkedUsers.push(n.jjlxrid)
        })
        this.checkedUsers = checkedUsers
      } else {
        this.checkedUsers = []
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      console.log(value)
      const checkedCount = value.length
      this.checkAll = checkedCount === this.usersOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.usersOptions.length
    },
    onSubmitFormBangDing(ruleform, dialogType, cb) {
      // 调用绑定接口
      const params = {
        azdid: ruleform.azdid,
        deviceid: this.deviceid
      }
      this.bangdLoading = true
      bindInstallpoint(params).then(res => {
        this.bangdLoading = false
        this.bangdVisible = false
        this.$message.success('绑定成功')
        cb(true)
        this.getDicsList()
      }).catch(err => {
        this.bangdLoading = false
        console.error(err)
      })
    },
    onCloseDialog() {
      this.bangdVisible = false
    },
    querySearchAsync(queryString, cb) {
      const params = {
        PageIndex: 1,
        PageSize: 99999,
        IMEI: queryString
      }
      getEquiList(params).then(res => {
        console.log(res.Data.Models)
        const data = res.Data.Models
        data.forEach(n => {
          n.value = n.IMEI
        })
        cb(data)
      }).catch(err => {
        console.error(err)
      })
    },
    handleSelectIMEI(e) {
      console.log(e)
      console.log(this.ruleForm.IMEI)
      // this.ruleForm.IMEI = e.IMEI
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
    .el-form-item__label{
      font-weight: 400;
    }
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
