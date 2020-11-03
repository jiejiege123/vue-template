<!--
 * @Author: your name
 * @Date: 2020-11-03 15:12:58
 * @LastEditTime: 2020-11-03 16:49:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\components\EditTableForm\index.vue
-->
<template lang="pug">
  .table-warp.flex1.layout-column
    .operate
      slot(name="outOperate")
      el-button(
        type="primary"
        size="small") 新增
      el-button(
        plain
        type="danger"
        size="small") 删除
    el-table.flex1(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      ref="reftable"
      :cell-class-name="cellClassName"
      @row-click="rowClick"
      @selection-change="selectionChange"
      empty-text="没有数据")
      el-table-column(
        v-if="showSelection"
        type="selection"
        align="center"
        width="55")
      el-table-column(v-if="showIndex" label="#" align="center" type="index")
      el-table-column(
        v-for="(item,index) in tableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :min-width="item.minWidth"
        :width="item.width")
        template(slot-scope='scope')
          span(v-if="item.prop==='file'") {{}}
            a(:href="scope.row.xxx | filterfile") 下载
          img(
            v-else-if="item.type==='img'"
            :src="scope.row[item.prop] | filterImg"
            style="width:40px;height:40px;cursor: pointer")
          span {{scope.row[item.prop]}}
      el-table-column(label="操作" align="center" :width="operateWidth" fixed="right" v-if="!disOperated")
        template(slot-scope='scope')
          slot(name="operation" :row="scope.row")
          el-button(
            v-if="showView"
            type="primary"
            plain
            @click.stop="viewRow(scope.row)"
            size="small") 查看
          el-button(
            v-if="showEdit"
            type="primary"
            plain
            @click.stop="editRow(scope.row)"
            size="small") 编辑
          el-button(
            v-if="showDel"
            plain
            type="danger"
            @click.stop="deleted(scope.row)"
            size="small") 删除

</template>
<script>
// import { randomPassword } from '@/utils'
export default {
  name: 'EditTableForm',
  filters: {
    filterImg: (val) => {
      if (val) {
        if (val.includes('http')) {
          return val
        } else {
          return process.env.VUE_APP_BASE_API + val
        }
      } else {
        return val
      }
    },
    filterfile: (val) => {
      if (val) {
        if (val.includes('http')) {
          return val
        } else {
          return process.env.VUE_APP_BASE_API + val
        }
      } else {
        return val
      }
    }
  },
  props: {
    // 表格
    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    cellClassName: {
      type: String || Function,
      default: ''
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    operateWidth: {
      type: String,
      default: '180px'
    },
    disOperated: {
      type: Boolean,
      default: false
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showView: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showDel: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      columnsSub: this.columns
    }
  },
  computed: {
    tableColumns() {
      console.log('123')
      return this.columnsSub.filter(n => !n.formOnly)
    },
    formColumns() {
      return this.columnsSub.filter(n => !n.tableOnly)
    },
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    }
  },
  watch: {

  },
  created() {
  },
  methods: {
    headerStyle() {
      // #fafafa
      return 'background-color: rgb(244, 248, 251); color: rgba(0,0,0,.85); font-weight: 500'
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    selectionChange(rows) {
      console.log(123)
      this.$emit('onSelectChange', rows)
    },
    rowClick(row) {
      // this.$refs.reftable.clearSelection()
      this.$refs.reftable.toggleRowSelection(row)
    },
    deleted(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('onDeleted', row)
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
.operate{
  border: 1px solid #dfe6ec;
  border-bottom: none;
  text-align: right;
  padding: 10px 0;
  padding-right: 10px;
  text-align: right;
}
.pages{
  margin-top: 10px;
}
</style>
