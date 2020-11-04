<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-04 17:02:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
.content.layout-column
  .header.layout-row__between
    .query
      Query(:queryList="queryList" :btnLoading="loading" @onSearch="onSearch")
  edit-table-form(
    :loading='loading'
    operateWidth='280'
    :dics="dics"
    :formRules="formRules"
    :tableData='tableData'
    :columns="tableColumn")
    template(v-slot:operation="{row}")
      el-button(
        type="primary"
        @click.stop="viewRow(row)"
        size="small") 用户
      el-button(
        type="primary"
        @click.stop="viewRow(row)"
        size="small") 角色
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
export default {
  name: 'Index',
  components: {
    Query,
    EditTableForm
  },
  filters: {

  },
  data() {
    return {
      /**
       * 查询
       */
      queryList: [
        {
          label: '单位名称',
          prop: 'com',
          holder: '请输入单位名称',
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
          prop: 'comId',
          label: '单位ID',
          width: 120,
          tableOnly: true
        },
        {
          prop: 'subCom',
          label: '所属单位',
          minWidth: 300,
          type: 'cascader'
        },
        {
          prop: 'comName',
          label: '单位名称',
          formOnly: true,
          editAble: true
        },
        {
          prop: 'comType',
          label: '单位属性',
          width: 130,
          default: 1,
          type: 'select'
        },
        {
          prop: 'subNum',
          label: '下级数量',
          width: 80,
          tableOnly: true
        },

        {
          prop: 'showIndex',
          label: '显示排序',
          width: 80,
          default: '0',
          inputFilter: "value=value.replace(/[^\\d]/g,'')",
          editAble: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 160,
          tableOnly: true
        }
      ],
      formRules: {
        subCom: [{ required: true, message: '请选择上级单位', trigger: 'change' }],
        comName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        comType: [{ required: true, message: '请选择单位属性', trigger: 'change' }],
        showIndex: [{ required: true, message: '请输入排序显示', trigger: 'blur' }]
      },
      dics: {
        subCom: [],
        comType: [
          {
            value: 1,
            label: '进销商'
          },
          {
            value: 2,
            label: '工程商'
          },
          {
            value: 3,
            label: '业主单位'
          }
        ]
      }

    }
  },
  computed: {
  },
  created() {
    this.getDataList()
  },
  mounted() {
  },
  methods: {

    onSearch(query) {
      this.currentPage = 1
      this.pageSize = 20
      this.query = query
      this.getDataList()
    },
    getDataList() {
      this.tableData = [
        {
          comId: '1223',
          subCom: '12234',
          subNum: '1',
          comType: '1',
          showIndex: '11',
          createTime: '2020-11-03 14:33'
        },
        {
          comId: '1224',
          subCom: '12244',
          subNum: '1',
          comType: '1',
          showIndex: '11',
          createTime: '2020-11-03 14:33'
        }
      ]
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
