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
      type: Array,
      default() {
        return []
      }
    },
    colorList: {
      type: Array,
      default() {
        return ['#46CCA9', '#FF9424', '#E83B03']
      }
    },
    title: {
      type: String,
      default: '设备状态曲线图'
    },
    grid: {
      type: Object,
      default() {
        return {
          left: '3%',
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
        title: {
          text: this.title,
          left: '10px',
          top: '10px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: this.legend,
          top: '20px'
        },
        grid: this.grid,
        series: this.seriesData
      })
    }
  }
}
</script>
<style lang="scss">

</style>
