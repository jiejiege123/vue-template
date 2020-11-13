<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'MixChart',
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
    }
  },
  data() {
    return {
      chart: null
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
        color: ['#3398DB'],
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //   }
        // },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '8%',
          top: '2%',
          containLabel: false
        },
        xAxis: [
          {
            show: false,
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'aaa'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value'
          }
        ],
        series: [
          {
            data: [150, 200, 250, 300, 350, 400, 450, 500],
            type: 'bar',
            itemStyle: {
              color: '#ddd',
              barBorderRadius: [5, 5, 0, 0]
            },
            silent: true,
            barWidth: 30,
            barGap: '-100%'

          },
          {
            data: [150, 200, 250, 300, 0, 0, 0, 0],
            type: 'bar',
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            },
            silent: true,
            barWidth: 30,
            barGap: '-100%'

          }
        ]
      })
    }
  }
}
</script>
