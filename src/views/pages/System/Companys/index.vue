<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-02 14:53:48
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
.content.layout-column
  .header.layout-row__between
    .query
      Query(:queryList="queryList")
  .operate
    el-button(
      type="primary"
      size="small") 新增
    el-button(
      type="danger"
      size="small") 删除

  .table-warp.flex1.layout-column
    el-table.flex1(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      :fit="true"
      ref="reftable"
      :cell-class-name="cellClassName"
      @selection-change="selectionChange"
      empty-text="没有数据")
      el-table-column(
        type="selection"
        width="55")
      //- el-table-column(label="#" align="center" type="index" :index="indexMethod" width="55px")
      el-table-column(label="公司名称" align="left" prop="comname" width="150px")
      el-table-column(
        v-for="(item,index) in tableColumn" :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        )
        template(slot-scope='scope')
          span(v-if="item.prop==='xxx'") {{scope.row.xxx | filterXxx}}
          img(
            v-else-if="item.type==='img'"
            :src="scope.row[item.prop] | filterImg"
            @click="showImgDanTable('danTableRef')"
            style="width:40px;height:40px;cursor: pointer")
          span(v-else) {{scope.row[item.prop]}}

      el-table-column(label="操作" align="center" fixed="right" width="220px")
        template(slot-scope='scope')
          el-button(
            type="primary"
            @click="editRow(scope.row)"
            size="small") 编辑
          el-button(
            type="success"
            plain
            @click="viewRow(scope.row)"
            size="small") 详情
          el-button(
            type="danger"
            plain
            @click="deleted(scope.row)"
            size="small") 删除

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
    //- 弹窗
    el-dialog.dialog-class(
      :title='dialogTitle',
      :visible.sync='dialogVisible'
      width='50%'
      :before-close="handleClose"
      top="5vh"
      @open="open('ruleForm')"
      :close-on-click-modal='false')
      el-form.demo-ruleForm(
        v-loading="dialogLoading"
        :model='ruleForm',
        ref='ruleForm',
        label-width='140px'
        :rules="rules")
        dialog-form(
          :ruleForm="ruleForm"
          :dialogType="dialogType"
          :formItems="formItems"
          :rules="rules"
          :dics="dics"
          )
        el-form-item.dia-footer()
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
          el-button(@click="closeDialog" size="small") 取消

</template>
<script >
import DialogForm from '@/components/DialogForm'
import Query from '@/components/Query'
export default {
  name: 'Index',
  components: {
    DialogForm,
    Query
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
    },
    filterXxx: (val) => {
      switch (val) {
        case '1':
          return '生产出库'
        case '2':
          return '销售出库'
        case '3':
          return '爆破出库'
        default:
          return
      }
    }
  },
  data() {
    return {
      /**
       * 查询
       */
      queryList: [
        {
          label: '单位名称',
          holder: '请输入单位名称',
          queryType: false
        },
        {
          label: '查1',
          holder: '请输入单位名称',
          queryType: false
        },
        {
          label: '查2',
          holder: '请输入单位名称',
          queryType: false
        },

        {
          label: '单位名称',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询1',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询2',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询1',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询2',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询1',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询2',
          holder: '请输入单位名称',
          queryType: true
        },
        {
          label: '询1',
          holder: '请输入单位名称',
          queryType: true
        }
      ],
      /**
       * 表格
       */
      loading: false,
      total: 1,
      currentPage: 1,
      pageSize: 20,
      tableData: [],
      tableColumn: [
        {
          prop: 'kqname',
          label: '库区名称'
        },
        {
          prop: 'planname',
          label: '计划名称'
        },
        {
          prop: 'starttime',
          label: '开始时间'
        },
        {
          prop: 'endtime',
          label: '结束时间'
        },
        {
          prop: 'planvalueZh',
          label: '检查状态'
        },
        {
          prop: 'istongzhiZh',
          label: '是否通知'
        },
        {
          prop: 'iseditZh',
          label: '是否编辑'
        }

      ],
      /**
       * 弹框
       */
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: '',
      dialogType: 'add',
      ruleForm: {},
      dics: {},
      formItems: [
        {
          label: '手持终端用户名',
          prop: 'appusername',
          horder: '用户名至少8位数，建议使用手机号',
          disUpdate: true
        },
        {
          label: '手持终端密码',
          prop: 'appuserpass',
          type: 'password'
        },
        {
          label: '姓名',
          prop: 'QF001'
        },
        {
          label: '性别',
          prop: 'QF002',
          type: 'select'
        },
        {
          label: '岗位类型',
          prop: 'QF007',
          type: 'select'
        },
        {
          label: '作业级别',
          prop: 'PlLevle',
          type: 'select'
        },
        {
          label: '证件名称',
          prop: 'XkzName',
          type: 'select'
        },
        {
          label: '证件号',
          prop: 'XkzNo'
        },
        {
          label: '证照有效开始日期',
          prop: 'XkzStartTime',
          type: 'date',
          validator: true
        },
        {
          label: '证照有效结束日期',
          prop: 'XkzEndTime',
          type: 'longDate',
          validator: true
        },
        {
          label: '联系电话',
          prop: 'QF011',
          validator: true
        },
        {
          label: '民族',
          prop: 'QF003',
          type: 'select',
          disUpdate: true
        },
        {
          label: '技术职称',
          prop: 'QF006',
          type: 'select'
        },
        {
          label: '学历',
          prop: 'EDU',
          type: 'select'
        },
        {
          label: '专业',
          prop: 'major',
          // type: 'cascader',
          validator: true
        },
        {
          label: '通讯地址',
          prop: 'QF010'
        },
        {
          label: '身份证号',
          prop: 'QF005',
          validator: true
        },
        {
          label: '身份证发证机关',
          prop: 'QF0051'
        },
        {
          label: '出生日期',
          prop: 'QF004',
          validator: true,
          type: 'brith'
        },
        {
          label: '身份证有效期',
          prop: 'QF0055',
          type: 'img',
          validator: true,
          horder: '截止日期'
        }
      ],
      rules: {

        QF004: [{ required: false }],
        QF0055: [{ required: true, trigger: 'blur' }],
        major: [{ required: false }]
      }

    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    /** *** 基本设置 start ******/
    headerStyle() {
      return 'background-color: #FAFAFA;'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'codespvalueZh') {
        switch (row.codespvalue) {
          case '-1':
            // 未提交
            return 'approve-wait'
          case '0':
            // 审核中
            return 'approve-ing'
          case '1':
            // 通过
            return 'approve-pass'
          // 拒绝
          case '2':
            return 'approve-refused'
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
    selectionChange(rows) {
      // console.log(rows)
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
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
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
}
.query{
 width: 100%;
}
</style>
