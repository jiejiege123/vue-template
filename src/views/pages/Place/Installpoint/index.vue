<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-16 09:21:06
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
    edit-table-form(
      :loading='loading'
      :inline="true"
      operateWidth='360'
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
      :showAdd="false"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:outOperate)
        el-button(
          type="primary"
          size="small"
          @click.stop='showBangding') 新增
      template(v-slot:operation="{row}")
    //- 新增弹窗
    BangdDialog(
      :dialogTitle="bangdTitle"
      :dialogVisible="bangdVisible"
      :dialogType="bangdType"
      :comcode="userInfo.comcode"
      :comname="userInfo.comname"
      :comData='comData'
      :imei="imei"
    )
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getCompany, addCom, delCom, updateCom } from '@/api/com'
// import { getDicsByName } from '@/api/commom'
import BangdDialog from '@/components/BangdDialog'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Installpoint',
  components: {
    Query,
    EditTableForm,
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
          label: '单位名称',
          prop: 'comcode',
          type: 'cascader',
          holder: '请选择单位',
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          },
          queryType: false
        },
        {
          label: '建筑物',
          prop: 'jzwid',
          holder: '请选择建筑物',
          type: 'select',
          queryType: false
        },
        {
          label: '楼层',
          prop: 'lcid',
          holder: '请选择楼层',
          type: 'select',
          queryType: false
        },
        {
          label: '安装点',
          prop: 'azdname',
          holder: '请输入安装点',
          queryType: false
        },
        {
          label: '设备ID',
          prop: 'deviceid',
          holder: '请输入设备Id',
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
          prop: 'azdname',
          label: '安装点名称'
        },
        {
          prop: 'comname',
          label: '所属单位'
        },
        {
          prop: 'jzwname',
          label: '建筑物名称'
        },
        {
          prop: 'lcname',
          label: '楼层名称'
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
        pcode: [],
        comType: [
          // {
          //   value: 1,
          //   label: '进销商'
          // },
          // {
          //   value: 2,
          //   label: '工程商'
          // },
          // {
          //   value: 3,
          //   label: '业主单位'
          // }
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      // 新增弹窗
      bangdTitle: '新增安装点',
      bangdVisible: false,
      bangdType: 'azd',
      comData: [],
      imei: ''
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
        Keywords: this.query.com
      }
      this.loading = true
      getCompany(params).then(res => {
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
    showBangding() {
      this.bangdVisible = true
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
</style>
