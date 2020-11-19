<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-12 17:27:10
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .header.layout-row__between
      .query
        Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch" :dics="dics")
    edit-table-form(
      :loading='loading'
      :inline="false"
      operateWidth='320'
      :hasPages="true"
      :currentPage="currentPage"
      :total="total"
      :pageSize="pageSize"
      :dics="dics"
      dialogWidth='420px'
      has01="Company01"
      has02="Company02"
      has03="Company03"
      :formStyle={width: '220px'}
      :showIndex="true"
      :showView="false"
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
          @click.stop="showBufang(row)"
          size="small") 布防
        el-button(
          type="danger"
          @click.stop="showChefang(row)"
          size="small") 撤防
    armed-dialog(:dialogVisible="dialogVisible" :dialogLoading="dialogLoading" @onArmed="submitForm")
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getBuildingList, getFloorList, addFloor, deleteFloor, updateFloor, armedFloor, disarmFloor } from '@/api/place'
import { getDicsByName } from '@/api/commom'

import ArmedDialog from '@/components/ArmedDialog'
import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Floor',
  components: {
    Query,
    EditTableForm,
    ArmedDialog
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
          label: '建筑物',
          prop: 'jzwid',
          holder: '请输入建筑物名称',
          type: 'select',
          queryType: false
        },

        {
          label: '楼层',
          prop: 'lcname',
          holder: '请输入楼层名称',
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
          prop: 'lcname',
          label: '楼层',
          tableOnly: true,
          width: 120
        },
        {
          prop: 'lcname',
          label: '所在楼层',
          holder: '例: 1楼',
          formOnly: true
        },

        {
          prop: 'jzwid',
          label: '建筑物名称',
          type: 'select',
          formOnly: true
        },

        {
          prop: 'jzwname',
          label: '建筑物名称',
          tableOnly: true
        },
        {
          prop: 'comname',
          label: '所属单位',
          tableOnly: true
        },
        {
          prop: 'pmt',
          label: '平面图',
          type: 'img',
          width: 100
        },

        {
          prop: 'addtime',
          label: '创建时间',
          width: 160,
          tableOnly: true
        }
      ],
      formRules: {
        lcname: [{ required: true, message: '请输入所在楼层', trigger: 'blur' }],
        comname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        jzwid: [{ required: true, message: '请选择建筑物', trigger: 'change' }],
        showIndex: [{ required: true, message: '请输入排序显示', trigger: 'blur' }],
        comtel: [{ validator: isPhone, trigger: 'blur' }]
      },
      dics: {
        jzwid: [],
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
      // 布防弹窗
      dialogVisible: false,
      nowRow: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getBuildingData()
    this.onSearch({})
    // this.getDicsList()
  },
  activated() {
    // 保持半缓存
    this.onSearch()
    this.getDicsList()
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
      if (this.query.jzwid) {
        this.query.jzwname = this.dics.jzwid.find(n => n.value === this.query.jzwid).jzwname
      }
      this.query.jzwid
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        ...this.query
      }
      this.loading = true
      getFloorList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })

        this.tableData = res.Data.Models
        // this.$set(this.dics, 'pcode', res.Data.Models)
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    onSubmitForm(ruleForm, dialogType, cb) {
      const params = Object.assign({}, ruleForm)

      params.jzwname = this.dics.jzwid.find(n => n.value === params.jzwid).jzwname
      this.formLoading = true
      let methods
      if (dialogType === 'add') {
        methods = addFloor
      } else {
        methods = updateFloor
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
        lcid: row.lcid
      }
      deleteFloor(params).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getDataList()
      }).catch(err => {
        console.error(err)
      })
    },
    getBuildingData() {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
      getBuildingList(params).then(res => {
        this.$nextTick(() => {
        })
        const data = res.Data.Models
        data.forEach(n => {
          n.value = n.jzwid
          n.label = n.jzwname
        })
        this.$set(this.dics, 'jzwid', data)
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    showBufang(row) {
      this.dialogVisible = true
      this.nowRow = row
    },
    submitForm(TimeRanges) {
      const params = {
        lcid: this.nowRow.lcid,
        TimeRanges: TimeRanges
      }
      this.dialogLoading = true
      armedFloor(params).then(res => {
        this.dialogLoading = false
        this.dialogVisible = false
        this.$message.success('操作成功')
        this.getDataList()
      }).catch(err => {
        this.dialogLoading = false
        console.error(err)
      })
    },
    showChefang(row) {
      this.$confirm('一键撤防将对该建筑物下所有安装点进行撤防，确认后将重置建筑物下所有安装点撤防状态。', {
        title: '操作提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disarmFloor({ lcid: row.lcid }).then(res => {
          this.$message.success('操作成功')
          this.getDataList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
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
</style>
