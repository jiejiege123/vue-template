<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-06 19:53:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
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
      :showSelection="true"
      :showBatchDel="false"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:outOperate)
        el-dropdown.ml_10()
          el-button(type="primary" size="small")
            | 更多菜单
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu.more-opeareat(slot="dropdown")
            el-dropdown-item(style="width:120px") 修改设备
            el-dropdown-item(style="width:120px") 删除设备
            el-dropdown-item(style="width:120px") 设备过户
            el-dropdown-item(style="width:120px") 批量导入
            el-dropdown-item(style="width:120px") 导出设备
            el-dropdown-item(style="width:120px") 事件记录
            el-dropdown-item(style="width:120px") 故障记录
            el-dropdown-item(style="width:120px") 设备日志
            el-dropdown-item(style="width:120px") 打印编码
            el-dropdown-item(style="width:120px") 设为个人模式
            el-dropdown-item(style="width:120px") 设为工程模式
            el-dropdown-item(style="width:120px") 状态复位
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getEquiList, addCom, delCom, updateCom } from '@/api/equipment.js'
import { getDicsByName } from '@/api/commom'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'EquipmentLists',
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

        }
      ],
      tableColumn: [
        {
          label: 'IMEI',
          prop: 'IMEI'
        },
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
        {
          label: '设备状态',
          prop: 'devicevaluezh'
        },
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
      showss: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // this.onSearch({ com: '' })
    this.getDicsList()
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
    goUser(row) {
      console.log(row)
      // this.showComSup = false
      this.$router.push(
        { path: '/System/User', query: {
          comcode: row.comcode,
          comname: row.comname
        }}
      )
    },
    goRole(row) {
      this.$router.push(
        { path: '/System/Role', query: {
          comcode: row.comcode,
          comname: row.comname
        }})
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
</style>
