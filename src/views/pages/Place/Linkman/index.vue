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
    :showSelection="true"
    :showBatchDel="true"
    has02="Company02"
    :showIndex='true'
    :showEdit='false'
    :showAdd="false"
    :showDel="false"
    :showView="false"
    @onDeleted="onDeleted"
    @onHandleCurrentChange="handleCurrentChange"
    @onHandleSizeChange="handleSizeChange"
    :tableData='tableData'
    :columns="tableColumn")
    template(v-slot:columnFoot)
      el-table-column(label="电话通知" align="center" width="80px" type="index" prop="isphonenotice")
        template(slot-scope='scope')
          el-switch(v-model="scope.row.isphonenotice"
            @change="switchChange($event, 'isphonenotice', scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949")
      el-table-column(label="短信通知" align="center" width="80px" type="index" prop="issmsnotice")
        template(slot-scope='scope')
          el-switch(v-model="scope.row.issmsnotice"
            @change="switchChange($event, 'issmsnotice', scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949")
      el-table-column(label="公众号" align="center" width="80px" type="index" prop="isgzhnotice")
        template(slot-scope='scope')
          el-switch(v-model="scope.row.isgzhnotice"
            @change="switchChange($event, 'isgzhnotice', scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949")
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
        el-form-item(prop="username" label='姓名')
          el-input(
            placeholder="请输入姓名"
            v-model='ruleForm.username')
        el-form-item(prop="usertel" label='报警电话')
          el-input(
            placeholder="请输入电话"
            v-model='ruleForm.usertel')
          .tel-span 请您确保填写的接警号码真实有效，填入未经授权使用的号码带来的法律责任需自行承担
        el-form-item(label='通知方式')
          el-checkbox(border v-model="ruleForm.isphonenotice") 电话
          el-checkbox(border v-model="ruleForm.issmsnotice") 短信
          //- el-checkbox(border v-model="ruleForm.isgzhnotice") 公众号
        el-form-item(label='头衔' prop='title')
          el-input(
            placeholder="请输入头衔"
            v-model='ruleForm.title')
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
import { getCompany } from '@/api/com'
import { getAlarmuserList, addAlarmuser, delAlarmuser, updateAlarmuser, batchdelAlarmuser } from '@/api/place'
import { checkPhone, toTree, deepClone } from '@/utils/index'

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
          prop: 'username',
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
          prop: 'usertel',
          label: '电话'
        },
        {
          prop: 'title',
          label: '头衔'
        },
        {
          prop: 'email',
          label: '邮箱'
        },
        {
          prop: 'status',
          label: '绑定状态',
          filter: true
        }
      ],
      dics: {
        status: [
          {
            value: 0,
            label: '未绑定'
          },
          {
            value: 1,
            label: '已绑定'
          }
        ]
      },
      // 表单
      formRules: {
        comcode: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
        username: [{ required: true, message: '请输入报警人姓名', trigger: 'blur' }],
        usertel: [{ validator: isPhone, required: true, trigger: 'blur' }]
      },
      ruleForm: {
        isphonenotice: true,
        issmsnotice: true
        // isgzhnotice: true
      },
      title: '',
      visible: false,
      dialogWidth: '600px',
      dialogType: 'add',
      labelWidth: '120px',
      comData: [],
      oldComData: [],
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
    this.getCompanyData()
    this.getDataList()
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
    getCompanyData() {
      const params = {
        PageIndex: 1,
        PageSize: 9999,
        Keywords: this.query.com
      }
      getCompany(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        this.oldComData = deepClone(res.Data.Models)
        // 遍历树形菜单
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })

        const setData = toTree(data)
        this.comData = setData
        this.$set(this.dics, 'comcode', setData)
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
      }
      this.loading = true
      getAlarmuserList(params).then(res => {
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
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addAlarmuser
      } else {
        methods = updateAlarmuser
      }
      params.comname = this.oldComData.find(n => n.comcode === params.comcode).comname
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
      console.log(row)
      let params, methods
      if (row.length > 1) {
        methods = batchdelAlarmuser
        const ids = []
        row.forEach(n => {
          ids.push(n.jjlxrid)
        })
        params = {
          jjlxrids: ids
        }
      } else {
        methods = delAlarmuser
        params = {
          jjlxrid: row.jjlxrid
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
    },
    addRow() {
      this.visible = true
      const ruleForm = {
        isphonenotice: true,
        // isgzhnotice: true,
        issmsnotice: true
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
        this.onDeleted(row)
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSubmitForm(this.ruleForm, 'add', (pd) => {
            if (pd) {
              this.visible = false
            }
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    switchChange(e, prop, row) {
      let tip
      if (prop === 'isphonenotice') {
        if (e) {
          tip = '开启电话接收，此联系人将接收到平台发出的报警或故障电话，请您确认是否继续操作？'
        } else {
          tip = '关闭电话接收，此联系人将无法收到平台发出的报警或故障电话，请您知晓该操作带来的影响？'
        }
      } else if (prop === 'issmsnotice') {
        if (e) {
          tip = '开启公众号通知，此联系人可通过微信端收到平台发出的报警或故障消息通知，请您确保关注微信公众号“消防物联网云平台”，并至少登录过一次微信小程序“消防物联网云助手”。'
        } else {
          tip = '关闭公众号通知，此联系人将无法在微信端收到平台发出的报警或故障消息通知，相关责任自行承担！'
        }
      } else {
        if (e) {
          tip = '开启短信接收，此联系人将接收到平台发出的报警或故障短信，请您确认是否继续操作？'
        } else {
          tip = '关闭短信接收，此联系人将无法收到平台发出的报警或故障短信，请您知晓该操作带来的影响？'
        }
      }
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onSubmitForm(row, 'update', (pd) => {
          if (pd) {
            this.getDataList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        // e = !e
        row[prop] = !e
      })
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
