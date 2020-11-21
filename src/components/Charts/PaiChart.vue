<!--
 * @Author: zzz
 * @LastEditors: zzz
-->
<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'EquiStatus',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    seriesData: {
      type: Array,
      default() {
        return []
      }
    },
    xAxisData: {
      type: Array,
      default() {
        return []
      }
    },
    legend: {
      type: Object,
      default() {
        return {
          top: '20px',
          data: []
        }
      }
    },
    colorList: {
      type: Array,
      default() {
        return ['#46CCA9', '#FF9424', '#E83B03']
      }
    },
    title: {
      type: Object,
      default() {
        return {
          text: '产品分类占比',
          left: '10px',
          top: '10px'
        }
      }
    },
    grid: {
      type: Object,
      default() {
        return {
          left: '20%',
          right: '5%',
          bottom: '3%',
          top: '18%',
          containLabel: true
        }
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    seriesData(newval, old) {
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        color: this.colorList,
        title: this.title,
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: this.legend,
        grid: this.grid,
        series: this.seriesData
      })
    }
  }
}
</script>
<style lang="scss">

</style>
