<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-11 15:07:08
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    //- 返回单位管理查单
    .hearer-breadcrumb(v-if="comcode")
      el-button(type="text" style="padding: 0" @click="goCompany") 单位管理
      i.el-icon-arrow-right
      span 用户列表
      span.ml_20(style="color: #000") {{comname}}
    .header.layout-row__between
      .query
        Query(:queryList="queryList"
        inputWidth="180px" :btnLoading="loading" @onSearch="onSearch" :dics="queryDics")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='380'
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
      :showIndex="true"
      :cellClassName="cellClassName"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:operation="{row}")
        el-button(
          @click.stop="updateUserState(row)"
          size="small") 状态
        el-button(
          @click.stop="updateUserPsd(row)"
          size="small") 密码
    //- 设置弹窗 用于修改用户状态和密码
    el-dialog.add-dialog(
      :title='dialogTitle',
      width="400px"
      :visible.sync='dialogVisible'
      @open="open('ruleForm')"
      :close-on-click-modal="false"
      :append-to-body="true")
      el-form.default-input(
        v-loading="dialogLoading"
        :model='ruleForm'
        ref='ruleForm')
        el-form-item(
          v-if="dialogType === 'psd'"
          prop="pwdText"
          label="密码"
          :rules="[{required: true, message: '请输入密码', trigger: 'blur' }]")
          el-input(
            style="width: 220px"
            v-model='ruleForm.pwdText'
            placeholder="请输入密码"
            )
        el-form-item(v-else prop="newState" label="用户状态")
          el-select(
            v-model="ruleForm.newState"
            placeholder="请选择用户状态"
            )
            el-option(label="正常" :value="1")
            el-option(label="禁用" :value="2")
            el-option(label="注销" :value="3")
        el-form-item.dia-footer()
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getUserList, addUser, delUser, updateUser, getCompany, getRoleList, changeUserState, updateUserPsd } from '@/api/com'
import { getDicsByName } from '@/api/commom'

import { checkPhone, toTree } from '@/utils/index'
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
          label: '手机号',
          prop: 'username',
          holder: '请输入手机号',
          queryType: false
        },
        {
          label: '角色',
          prop: 'userrole',
          holder: '请选择角色',
          type: 'select',
          queryType: false
        },
        {
          label: '单位限制',
          prop: 'CompanyLimit',
          holder: '请输入单位限制',
          type: 'select',
          default: 1,
          clearable: false,
          queryType: false
        }
      ],
      query: {},
      queryDics: {
        userrole: [],
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
        comname: []
      },
      /**
       * 表格
       */
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'realname',
          editAble: true,
          label: '用户姓名',
          width: 120
        },
        {
          prop: 'comname',
          width: 200,
          label: '所属单位',
          tableOnly: true
        },
        {
          editAble: true,
          prop: 'username',
          label: '手机号码'
        },
        {
          prop: 'userpass',
          label: '用户密码',
          editAble: true,
          type: 'password',
          formOnly: true

        },
        {
          prop: 'userroleid',
          editAble: true,
          label: '角色',
          type: 'select',
          formOnly: true
        },
        {
          prop: 'userrole',
          label: '角色',
          tableOnly: true
        },
        {
          prop: 'status',
          label: '用户状态',
          filter: true,
          type: 'select',
          addDisable: true

        },
        {
          prop: 'address',
          label: '地址',
          formOnly: true,
          editAble: true,
          online: true,
          formStyle: {
            width: '600px'
          }
        },

        {
          prop: 'sfzzm',
          label: '身份证正面',
          editAble: true,
          formOnly: true,
          type: 'img'
        },
        {
          prop: 'sfzfm',
          editAble: true,
          label: '身份证反面',
          formOnly: true,
          type: 'img'
        },
        {
          prop: 'sfzno',
          editAble: true,
          label: '身份证号码',
          formOnly: true
        },
        {
          prop: 'logo',
          editAble: true,
          label: '用户头像',
          formOnly: true,
          type: 'imgCut'
        },
        {
          prop: 'rmb',
          label: '余额',
          formOnly: true,
          addDisable: true
        }

      ],
      formRules: {
        comcode: [{ required: true, message: '请选择所属企业', trigger: 'change' }],
        realname: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: isPhone, trigger: 'blur' }
        ],
        userpass: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        userroleid: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      dics: {
        pcode: [],
        status: [
          {
            value: 0,
            label: '未设置'
          },
          {
            value: 1,
            label: '正常'
          },
          {
            value: 2,
            label: '被禁用'
          },
          {
            value: 3,
            label: '已注销'
          }
        ],
        comtype: [],
        comcode: []
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      comname: '',
      // 弹窗
      dialogTitle: '',
      dialogType: '',
      dialogVisible: false,
      ruleForm: {},
      dialogLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.comname = this.$route.query.comname
    this.comcode = this.$route.query.comcode
    // 如果没有 comcode 新增时 就有获取所有单位
    if (!this.comcode) {
      console.log(this.tableColumn)
      this.tableColumn.unshift({
        prop: 'comcode',
        label: '所属单位',
        editAble: true,
        type: 'cascader',
        online: true,
        holder: '请选择所属单位',
        showAllLevels: false,
        props: {
          label: 'comname',
          value: 'comcode',
          emitPath: false,
          checkStrictly: true
        },
        formOnly: true
      })

      this.queryList.push(
        {
          label: '单位名称',
          type: 'cascader',
          prop: 'comname',
          holder: '请选择所属单位',
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comname',
            emitPath: false,
            checkStrictly: true
          },
          queryType: false
        }
      )
      // 获取公司列表
      this.getCompanyList()
    }
    // 获取角色列表
    this.getRoleList()
    // 获取公司列表 获取角色列表
    this.onSearch({ CompanyLimit: 0 })
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
              this.dics.comtype.push(n)
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
      getUserList(params).then(res => {
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
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addUser
      } else {
        methods = updateUser
      }
      methods(params).then(res => {
        console.log(res)
        this.getDataList()
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
      delUser(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    goCompany() {
      this.$router.push('/System/Companys')
    },
    getCompanyList() {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
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

        this.$set(this.queryDics, 'comname', setData)
        this.$set(this.dics, 'comcode', setData)
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    getRoleList() {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
      getRoleList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const setData = res.Data.Models
        setData.forEach(n => {
          n.value = n.id
          n.label = n.Name
        })
        this.$set(this.queryDics, 'userrole', setData)
        this.$set(this.dics, 'userroleid', setData)
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    updateUserState(row) {
      this.ruleForm = Object.assign({}, row)
      this.$set(this.ruleForm, 'newState', row.status)
      this.dialogType = 'status'
      this.dialogTitle = '修改状态'
      this.dialogVisible = true
    },
    updateUserPsd() {
      this.dialogType = 'psd'
      this.dialogTitle = '修改密码'
      this.dialogVisible = true
    },
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let methods
          let params
          if (this.dialogType === 'psd') {
            methods = updateUserPsd
            params = {
              userId: this.ruleForm.userid,
              pwdText: this.ruleForm.pwdText
            }
          } else {
            methods = changeUserState
            console.log(this.ruleForm)
            params = {
              id: this.ruleForm.userid,
              newState: this.ruleForm.newState
            }
          }
          this.dialogLoading = true
          methods(params).then(res => {
            this.dialogLoading = false
            this.dialogVisible = false
            this.$message.success('操作成功')
            this.getDataList()
          }).catch(err => {
            this.dialogLoading = false
            console.error(err)
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
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
