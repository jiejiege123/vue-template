<!--
 * @Author: zzz
 * @LastEditors: zzz
-->
<template lang="pug">
analyze(:lineData="lineData" :paiData="paiData" :tableColumns="tableColumns" :tableData='tableData' :barData="barData")
</template>
<script>
import Analyze from '@/components/Analyze'
export default {
  name: 'FaultAnalyze',
  components: {
    Analyze
  },
  data() {
    return {
      lineData: {},
      paiData: {},
      tableColumns: [
        {
          prop: 'date',
          label: '日期'
        },
        {
          prop: 'type',
          label: '人工报障'
        },
        {
          prop: 'all',
          label: '汇总'
        }
      ],
      tableData: [],
      barData: []
    }
  },
  created() {
    this.getLineData()
    this.getPaiData() // pai 和 bar 共用数据
  },
  methods: {
    getLineData() {
      const data = {
        yAxis: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]],
        xAxis: [
          '11-03',
          '11-04',
          '11-05',
          '11-06',
          '11-07',
          '11-08',
          '11-09',
          '11-10',
          '11-11',
          '11-12',
          '11-13',
          '11-14',
          '11-15',
          '11-16',
          '11-17',
          '11-18'
        ],
        legend: ['人工报障']
      }
      const colorList = ['#46CCA9', '#FF9424', '#E83B03']
      const seriesData = []
      data.yAxis.forEach((n, index) => {
        seriesData.push({
          smooth: true,
          name: data.legend[index],
          type: 'line',
          // stack: '总量',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: colorList[index] + '85' // 0% 处的颜色
              }, {
                offset: 0.6, color: '#ffe' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          data: n
        })
      })

      const lineData = {
        xAxisData: data.xAxis,
        legend: data.legend,
        colorList: colorList,
        seriesData: seriesData,
        title: {
          text: '设备故障分析曲线图',
          left: '3%',
          top: '10px'
        }
      }
      this.lineData = lineData
    },
    getPaiData() {
      const data = [{
        'name': '人工报障',
        'value': 1
      }]
      // const colorList = ['#46CCA9']
      const paiData = [
        {
          name: '产品类别',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: []
        }
      ]

      const barSData = [
        {
          type: 'bar',
          barWidth: '60%',
          barMaxWidth: '80px',
          data: []
        }
      ]
      const serData = []
      const barXdata = []
      const barSeriesData = []
      data.forEach(n => {
        serData.push({
          value: n.value,
          name: n.name
        })
        barXdata.push(n.name)
        barSeriesData.push(n.value)
      })

      paiData[0].data = serData
      barSData[0].data = barSeriesData
      const pData = {
        seriesData: paiData,
        title: {
          text: '设备故障分析扇形图',
          left: '50px',
          top: '10px'
        }
      }
      this.paiData = pData

      // 设置 bar 数据
      const barData = {
        title: {
          text: '设备故障分析柱状图',
          left: '3%',
          top: '10px'
        },
        xAxisData: barXdata,
        seriesData: barSData
      }

      this.barData = barData
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
