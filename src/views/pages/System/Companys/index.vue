<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-03 16:40:12
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
    :operateWidth='280'
    :tableData='tableData'
    :columns="tableColumn")

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
          width: 120
        },
        {
          prop: 'subCom',
          label: '所属单位',
          minWidth: 300
        },
        {
          prop: 'comType',
          label: '单位属性',
          width: 130
        },
        {
          prop: 'subNum',
          label: '下级数量',
          width: 80
        },

        {
          prop: 'showIndex',
          label: '显示排序',
          width: 80
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 160
        }
      ]

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
      console.log('123')
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
      setTimeout(() => {
        this.$refs.reftable.doLayout()
      }, 200)
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
