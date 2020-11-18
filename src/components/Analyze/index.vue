<!--
 * @Author: zzz
 * @LastEditors: zzz
-->
<template lang="pug">
div(style="width:100%; height:100%")
  .content.layout-column
    .query.layout-row
      .layout-row.align-center.mb_10
        span.span-style(style="width: 80px") 设备型号：
        el-select(
          v-model="query.equiType"
          placeholder="请选择设备型号"
          filterable
          style="padding-right:15px; width:220px"
          clearable)
          el-option(
            v-for="(list,index) in equiTypeData"
            :key="index"
            :label="list.label"
            :value="list.value")
      .layout-row.align-center.mb_10.ml_20
        span.span-style(style="width: 50px") 日期：
        el-select(
          v-model="query.dateType"
          placeholder=""
          filterable
          style="padding-right:15px; width:100px"
          @change="dateTypeChange"
          clearable)
          el-option(label="按日" value="day")
          el-option(label="按月" value="mouth")
        el-date-picker(
          v-model="query.date"
          :type="dateType"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :picker-options="pickerOptions")
      div.ml_10
        el-button(
          @click='reset') 重置
        el-button(
          :loading="btnLoading"
          type="primary"
          @click='search') 查询
    .charts-warp(style="width:100%; height: 350px")
      equi-status-chart(
        id="quuistatus",
        width="100%",
        height="100%",
        :showXsplite="false"
        :title="lineData.title"
        :xAxisData="lineData.xAxisData",
        :legend="lineData.legend",
        :colorList='lineData.colorList'
        :seriesData="lineData.seriesData"
      )
    div.layout-row
      .charts-warp(style="width:40%; height: 350px")
        pai-chart(
          id="protype",
          width="100%",
          height="100%",
          :title="paiData.title"
          :legend="paiData.legend"
          :seriesData="paiData.seriesData"
        )
      .charts-warp(style="width:50%; height: 350px")
        equi-status-chart(
          id="barchart",
          width="100%",
          height="100%",
          :showXsplite="false"
          :title="barData.title"
          :xAxisData="barData.xAxisData",
          :legend="barData.legend",
          :colorList='barData.colorList'
          :seriesData="barData.seriesData"
        )
    div.table-warp
      el-table.flex1(
        :data='tableData'
        style='width: 100%'
        :header-cell-style='headerStyle'
        border
        ref="reftable"
        default-expand-all
        empty-text="没有数据")
        el-table-column(label="#" align="center" type="index" :index="indexMethod")
        el-table-column(
          v-for="(item,index) in tableColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :min-width="item.minWidth"
          :width="item.width")
</template>
<script>
import EquiStatusChart from '@/components/Charts/EquiStatusChart'
import PaiChart from '@/components/Charts/PaiChart'

export default {
  name: 'Analyze',
  components: {
    EquiStatusChart,
    PaiChart
  },
  props: {
    equiTypeData: {
      type: Array,
      default() {
        return []
      }
    },
    lineData: {
      type: Object,
      default() {
        return {}
      }
    },
    paiData: {
      type: Object,
      default() {
        return {}
      }
    },
    barData: {
      type: Object,
      default() {
        return {}
      }
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    tableColumns: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      query: {
        dateType: 'day',
        date: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()]
      },
      dateType: 'daterange',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
    }
  },
  created() {
  },
  methods: {
    headerStyle() {
      return 'background-color: rgb(244, 248, 251); color: rgba(0,0,0,.85); font-weight: 500'
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    dateTypeChange(e) {
      if (e === 'day') {
        this.dateType = 'daterange'
        this.$set(this.pickerOptions, 'shortcuts', this.shortcuts)
      } else {
        this.dateType = 'monthrange'
        this.$set(this.pickerOptions, 'shortcuts', null)
      }
    },
    reset() {
      this.query = {
        dateType: 'day',
        date: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date()]
      }
      this.dateType = 'daterange'
    },
    search() {
      this.$emit('onSearch', this.query)
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 84px);
  overflow-y: auto;
}
</style>
