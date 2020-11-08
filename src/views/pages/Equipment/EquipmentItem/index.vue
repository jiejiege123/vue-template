<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-06 19:53:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    //- 返回单位管理查单
    .hearer-breadcrumb
      el-button(type="text" style="padding: 0" @click="goCompany") 单位管理
      i.el-icon-arrow-right
      span 用户列表
      span.ml_20(style="color: #000") {{comname}}
    .header.layout-row__between
      .query
        Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='360'
      :hasPages="false"
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
          @click.stop="goUser(row)"
          size="small") 用户
        el-button(
          @click.stop="goRole(row)"
          size="small") 角色
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getUserList, addCom, delCom, updateCom } from '@/api/com'
import { getDicsByName } from '@/api/commom'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'EquipmentItem',
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
          label: '用户姓名',
          prop: 'username',
          holder: '请输入用户姓名',
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
          prop: 'realname',
          label: '用户姓名',
          width: 120
        },
        {
          prop: 'comname',
          label: '所属单位',
          tableOnly: true
        },
        {
          prop: 'username',
          label: '手机号码'
        },
        {
          prop: 'userpass',
          label: '用户密码',
          type: 'password',
          formOnly: true

        },
        {
          prop: 'userroleid',
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
          type: 'select',
          formOnly: true,
          addDisable: true

        },
        {
          prop: 'statuszh',
          label: '用户状态',
          tableOnly: true
        },
        {
          prop: 'address',
          label: '地址',
          formOnly: true,
          online: true,
          formStyle: {
            width: '600px'
          }
        },

        {
          prop: 'sfzzm',
          label: '身份证正面',
          formOnly: true,
          type: 'img'
        },
        {
          prop: 'sfzfm',
          label: '身份证反面',
          formOnly: true,
          type: 'img'
        },
        {
          prop: 'sfzno',
          label: '身份证号码',
          formOnly: true
        },
        {
          prop: 'logo',
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
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      showss: true,
      comname: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.comname = this.$route.query.comname
    this.comcode = this.$route.query.comcode
    this.onSearch({ com: '' })
    // this.getDicsList()
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
              this.dics.comType.push(n)
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
        console.log(res)
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
    goCompany() {
      this.$router.push('/System/Companys')
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
</style>
