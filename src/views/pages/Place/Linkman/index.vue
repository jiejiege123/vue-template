<template lang="pug">
.content.layout-column
  .header.layout-row__between
    .query.layout-row.mb_15
      Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
  edit-table-form(
    :loading='loading'
    :inline="true"
    operateWidth='220'
    :hasPages="true"
    :currentPage="currentPage"
    :total="total"
    :pageSize="pageSize"
    :dics="dics"
    dialogWidth='800px'
    :formStyle={width: '220px'}
    :showSelection="false"
    :showBatchDel="false"
    :showIndex='true'
    :showEdit='false'
    :showAdd="false"
    :showDel="false"
    :showView="false"
    @onHandleCurrentChange="handleCurrentChange"
    @onHandleSizeChange="handleSizeChange"
    :tableData='tableData'
    :columns="tableColumn")
    template(v-slot:outOperate)
      el-button.ml_10(
        type="primary"
        @click='addRow') 新增
    template(v-slot:operation="{row}")
      el-button(
        type="primary"
        plain
        @click.stop="viewRow(row)"
        size="small") 查看
      el-button(
        type="success"
        plain
        @click.stop="editRow(row)"
        size="small") 编辑
      el-button(
        :disabled="row.delDisabled"
        plain
        type="danger"
        @click.stop="deleted(row)"
        size="small") 删除
  el-dialog.add-dialog(
    :title='title',
    :visible.sync='visible'
    :width='dialogWidth'
    top="10vh"
    @open="open('ruleForm')"
    :close-on-click-modal="false"
    :append-to-body="true")
    el-form.default-input(
      v-loading="formLoading"
      :model='ruleForm'
      ref='ruleForm'
      :disabled="dialogType === 'view'"
      :rules="formRules"
      :label-width='labelWidth')
      div.pr_15
        el-form-item(prop="comcode" label='所属单位')
          el-cascader(
            :options='comData',
            :show-all-levels='false'
            :props="comProps"
            v-model="ruleForm.comcode"
            placeholder="请选择公司"
            filterable)
        el-form-item(prop="name" label='姓名')
          el-input(
            placeholder="请输入姓名"
            v-model='ruleForm.name')
        el-form-item(prop="tel" label='报警电话')
          el-input(
            placeholder="请输入电话"
            v-model='ruleForm.tel')
          .tel-span 请您确保填写的接警号码真实有效，填入未经授权使用的号码带来的法律责任需自行承担
        el-form-item(label='通知方式')
          el-checkbox(border v-model="ruleForm.telway") 电话
          el-checkbox(border v-model="ruleForm.msgway") 短信
        el-form-item(label='头衔' prop='touhead')
          el-input(
            placeholder="请输入头衔"
            v-model='ruleForm.touhead')
        el-form-item(label='邮箱' prop='email')
          el-input(
            placeholder="请输入邮箱"
            v-model='ruleForm.email')
      el-form-item.dia-footer(v-if="dialogType !== 'view'")
        el-button(@click="closeDialog" size="small") 取消
        el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
</template>
<script>
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { mapGetters } from 'vuex'
import { getCompany, addCom, delCom, updateCom } from '@/api/com'
import { checkPhone, toTree } from '@/utils/index'

export default {
  name: 'Linkman',
  components: {
    Query,
    EditTableForm
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
      // 查询
      queryList: [
        {
          label: '关键字',
          prop: 'Keywords',
          holder: '姓名/电话/邮箱/单位名称',
          queryType: false
        }
      ],
      query: {},
      // 表格
      loading: false,
      total: 1,
      currentPage: 1,
      pageSize: 20,
      formLoading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'comname',
          label: '所属单位',
          tableOnly: true
        },
        {
          prop: 'comcode',
          label: '所属单位',
          formOnly: true,
          type: 'cascader',
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          }
        },
        {
          prop: 'touhead',
          label: '头衔'
        },
        {
          prop: 'tel',
          label: '电话'
        },
        {
          prop: 'email',
          label: '邮箱'
        },
        {
          prop: 'bingdstatus',
          label: '绑定状态'
        }
      ],
      dics: {},
      // 表单
      formRules: {
        comcode: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
        name: [{ required: true, message: '请输入报警人姓名', trigger: 'blur' }],
        tel: [{ validator: isPhone, required: true, trigger: 'blur' }]
      },
      ruleForm: {
        telway: true,
        msgway: true
      },
      title: '',
      visible: false,
      dialogWidth: '600px',
      dialogType: 'add',
      labelWidth: '120px',
      comData: [],
      comProps: {
        label: 'comname',
        value: 'comcode',
        emitPath: false,
        checkStrictly: true
      }

    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {

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
    getDataList() {
      const params = {
        PageIndex: 1,
        PageSize: 9999,
        Keywords: this.query.com
      }
      this.loading = true
      getCompany(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        // 遍历树形菜单
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })

        const setData = toTree(data)
        console.log(setData)
        this.tableData = setData
        this.$set(this.dics, 'pcode', setData)
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    onSubmitForm(ruleForm, dialogType, cb) {
      const params = Object.assign({}, ruleForm)
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addCom
      } else {
        methods = updateCom
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
        comid: row.comid
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
    addRow() {
      this.visible = true
      const ruleForm = {
        telway: true,
        msgway: true
      }
      this.ruleForm = Object.assign({}, ruleForm)
      this.title = '添加'
      this.dialogType = 'add'
    },
    viewRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.visible = true
      this.title = '详情'
      this.dialogType = 'view'
    },
    editRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.visible = true
      this.title = '编辑'
      this.dialogType = 'update'
    },
    deleted(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('onDeleted', row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    closeDialog() {
      this.ruleForm = {}
      this.visible = false
    },
    submitForm() {

    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.dia-footer{
  position: relative;
  text-align: right;
  width: 100%;
  padding-right: 20px;
}
.add-dialog{
  ::v-deep .el-dialog__body{
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding-top: 10px;
  }
}
.default-input{
  ::v-deep .is-disabled {
    .el-input__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
    .el-textarea__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
  }
}
.tel-span{
  line-height: 16px;
  font-size: 12px;
  color: #ff4949;
}
</style>
