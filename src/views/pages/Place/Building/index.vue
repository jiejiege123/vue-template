<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-09 17:27:13
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
      :hasMap="true"
      :formStyle={width: '220px'}
      :showIndex="true"
      :showSelection="true"
      :showBatchDel="true"
      @onHandleCurrentChange="handleCurrentChange"
      @onHandleSizeChange="handleSizeChange"
      @onSubmitForm="onSubmitForm"
      @onDeleted="onDeleted"
      :formLoading="formLoading"
      :formRules="formRules"
      :tableData='tableData'
      :columns="tableColumn")
      template(v-slot:lcsnum="{row}")
        span {{row.lcsnum + '1'}}
      //- template(v-slot:column)
        el-table-column(label="楼层数" prop="lcsnum" align="center")
          template(slot-scope='scope')
            span {{scope.row.lcsnum}}
      template(v-slot:operation="{row}")
        el-button(
          @click.stop="goUser(row)"
          size="small") 布防
        el-button(
          type="danger"
          @click.stop="naggoRole(row)"
          size="small") 撤防
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getCompany, addCom, delCom, updateCom } from '@/api/com'
import { getDicsByName } from '@/api/commom'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Building',
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
          label: '单位名称',
          prop: 'comname',
          holder: '请输入单位名称',
          queryType: false
        },
        {
          label: '建筑物',
          prop: 'Keywords',
          holder: '请输入建筑物名称或地址',
          queryType: false
        }
      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [
        {
          lcsnum: '12'
        }
      ],
      tableColumn: [
        // {
        //   prop: 'comname',
        //   label: '地图标记',
        //   editAble: true,
        //   minWidth: 300,
        //   formOnly: true
        // },
        {
          prop: 'jwzname',
          label: '建筑物名称',
          editAble: true,
          minWidth: 200,
          online: true,
          formStyle: {
            width: '600px'
          }
        },
        {
          prop: 'comname',
          label: '所属单位',
          tableOnly: true,
          minWidth: 100
        },
        {
          prop: 'longitude',
          label: '经度',
          type: 'map',
          editAble: true,
          formOnly: true
        },
        {
          prop: 'latitude',
          type: 'map',
          label: '维度',
          editAble: true,
          formOnly: true
        },
        {
          prop: 'jwzaddress',
          label: '详细地址',
          editAble: true,
          online: true,
          minWidth: 200,
          formStyle: {
            width: '600px'
          }
        },
        {
          prop: 'lcsnum',
          label: '楼层数',
          type: 'number',
          slot: true,
          editAble: true
        },
        {
          prop: 'comcode',
          label: '所属单位',
          type: 'cascader',
          formOnly: true,
          showAllLevels: false,
          props: {
            label: 'comname',
            value: 'comcode',
            emitPath: false,
            checkStrictly: true
          }
        },

        {
          prop: 'lxr',
          label: '联系人',
          editAble: true
        },
        {
          prop: 'lxrtel',
          label: '联系人电话',
          editAble: true
        }

      ],
      formRules: {
        jwzname: [{ required: true, message: '请输入建筑名称', trigger: 'blur' }],
        comcode: [{ required: true, message: '请选择所属单位', trigger: 'change' }],
        longitude: [{ required: true, message: '请点击图标输入查询', trigger: 'blur' }],
        latitude: [{ required: true, message: '请点击图标输入查询', trigger: 'blur' }],
        // comname: [
        //   { required: true, message: '请输入活动名称', trigger: 'blur' },
        //   { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        jwzaddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        lxr: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        lcsnum: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        lxrtel: [{ validator: isPhone, required: true, trigger: 'blur' }]
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
      showss: true
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
}
.query{
 width: 100%;
}
</style>
