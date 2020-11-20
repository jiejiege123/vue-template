<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-20 11:18:55
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query.layout-row.mb_15
        //- Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
        el-dropdown(
          size="small"
          @command="searchTypeChange" trigger="click")
          el-button(style="margin-right: 5px") {{searchTitle}}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot='dropdown')
            el-dropdown-item(command="comname") 单位名称
            //- el-dropdown-item(command="comcode") 单位ID

        el-input.mr_15(
          style="width: 200px"
          v-model="search"
          :placeholder="queryHolder"
          clearable)
        el-button(
          :loading="loading"
          type="primary"
          @click='onSearch({comname: search})') 查询

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
import { getCompany, addCom, delCom, updateCom } from '@/api/com'
import { getDicsByName } from '@/api/commom'

import { checkPhone, toTree } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Companys',
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
      searchTitle: '单位名称',
      searchProp: 'comname',
      input: '',
      queryHolder: '请输入单位名称',
      queryList: [
        {
          label: '单位名称',
          prop: 'com',
          holder: '请输入单位名称',
          queryType: false
        }
      ],
      query: {},
      search: '',
      /**
       * 表格
       */
      loading: false,
      tableData: [],
      tableColumn: [
        // {
        //   prop: 'comcode',
        //   label: '单位ID',
        //   width: 200,
        //   tableOnly: true
        // },
        {
          prop: 'pcode',
          label: '上级单位',
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
        // {
        //   prop: 'pcodename',
        //   label: '上级单位',
        //   tableOnly: true
        // },
        {
          prop: 'comname',
          label: '单位名称',
          editAble: true,
          minWidth: 220
          // minWidth: 220
        },
        {
          prop: 'comtype',
          label: '单位属性',
          width: 130,
          formOnly: true,
          type: 'select'
        },
        {
          prop: 'comtypeZh',
          label: '单位属性',
          width: 130,
          tableOnly: true
        },
        {
          prop: 'lowercomnum',
          label: '下级数量',
          width: 80,
          tableOnly: true
        },
        {
          prop: 'sortno',
          label: '显示排序',
          width: 80,
          default: '0',
          inputFilter: "value=value.replace(/[^\\d]/g,'')",
          editAble: true
        },
        {
          prop: 'address',
          label: '单位地址',
          addDisable: true,
          formOnly: true,
          editAble: false,
          online: true,
          formStyle: {
            width: '600px'
          }
        },
        {
          prop: 'comtel',
          label: '单位电话',
          addDisable: true,
          formOnly: true,
          editAble: false
        },
        {
          prop: 'fzr',
          addDisable: true,
          label: '负责人',
          formOnly: true,
          editAble: false
        },
        {
          prop: 'rmb',
          label: '余额',
          formOnly: true,
          addDisable: true
        },

        {
          prop: 'comtitle',
          label: '网站名称',
          addDisable: true,
          formOnly: true,
          editAble: false
        },
        {
          prop: 'comlogo',
          addDisable: true,
          label: '网站logo',
          formOnly: true,
          editAble: false,
          type: 'img'
        },
        {
          prop: 'addtime',
          label: '创建时间',
          width: 160,
          tableOnly: true
        }
      ],
      formRules: {
        pcode: [{ required: true, message: '请选择上级单位', trigger: 'change' }],
        comname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        comtype: [{ required: true, message: '请选择单位属性', trigger: 'change' }],
        sortno: [{ required: true, message: '请输入排序显示', trigger: 'blur' }],
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      },
      dics: {
        pcode: [],
        comtype: [
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
    this.onSearch({ comname: '' })
    this.getDicsList()
  },
  activated() {
    // 保持半缓存
    this.onSearch({ comname: '' })
    this.getDicsList()
  },
  mounted() {
  },
  methods: {
    searchTypeChange(e) {
      this.searchProp = e
      switch (e) {
        case 'comname':
          this.searchTitle = '单位名称'
          this.queryHolder = '请输入单位名称'
          break
        case 'comcode':
          this.searchTitle = '单位ID'
          this.queryHolder = '请输入单位ID'

          break
        default:
          break
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
        PageIndex: 1,
        PageSize: 9999,
        ...this.query
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
      params.comtypeZh = this.dics.comtype.find(n => n.value === params.comtype) ? this.dics.comtype.find(n => n.value === params.comtype).label : ''
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
