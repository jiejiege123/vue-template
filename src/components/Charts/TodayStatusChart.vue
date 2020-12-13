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
  name: 'TodayStatusChart',
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
      type: Object,
      default() {
        return {
          text: '每日设备状态',
          left: '10px',
          top: '10px'
        }
      }
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
    },
    showXsplite: {
      type: Boolean,
      default: false
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
          top: '20px',
          right: 10,
          icon: 'circle',
          itemHeight: 10,
          itemWidth: 10,
          textStyle: {
            color: 'rgb(62, 202, 252)',
            fontWeight: '400',
            fontSize: 10,
            padding: [0, 0, 0, -2]

          }
        },
        grid: this.grid,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xAxisData,
            axisLine: {
              lineStyle: {
                // color: '#999'
                color: 'rgb(62, 202, 252)'
                // type: 'dotted'
              }
            },
            axisLabel: {
              fontSize: 10
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: this.showXsplite,
              lineStyle: {
                color: '#b8b7b7',
                type: 'dotted'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                // color: '#999'
                color: 'rgb(62, 202, 252)'
                // type: 'dashed'
              }
            },
            axisLabel: {
              fontSize: 10
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#b8b7b7',
                type: 'dotted'
              }
            },
            minInterval: 1
          }
        ],
        series: this.seriesData
      })
    }
  }
}
</script>
<style lang="scss">

</style>
