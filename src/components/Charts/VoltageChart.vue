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
    data: {
      type: String,
      default: '1.5'
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
        grid: {
          left: '3%',
          right: '3%',
          bottom: '4%',
          top: '10%',
          containLabel: true
        },
        tooltip: {
          formatter: '{a} <br/>{c} {b}'
        },
        series: [

          {
            name: '电压',
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '90%',
            min: 0,
            max: 5,
            startAngle: 180,
            endAngle: 0,
            splitNumber: 5,
            axisLine: { // 坐标轴线
              lineStyle: { // 属性lineStyle控制线条样式
                width: 2
              }
            },
            axisTick: { // 坐标轴小标记
              length: 10, // 属性length控制线长
              lineStyle: { // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            splitLine: { // 分隔线
              length: 15, // 属性length控制线长
              lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              width: 5
            },
            title: {
              fontSize: 34,
              color: '#666'
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              // fontWeight: 'bolder'
            },
            data: [{ value: this.data, name: 'V' }]
          }
        ]
      })
    }
  }
}
</script>
