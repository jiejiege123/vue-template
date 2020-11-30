<template lang="pug">
.container.layout-column
  el-image.bg-image(:src="bging", fit="fill")
    //- div.image-slot(slot="error")
    //-   el-image.logo-image(:src="bglocal")
  .header.layout-row__between
    el-image.header-image(:src="headerImg", fit="fill")
    .header-time
      i.el-icon-time
      |
      | {{ nowTime }}
    .title.layout-row.align-center
      el-image.log-img(:src="logo", fit="fill")
      span.web-title 智能监控云平台
    .header-user
      .hand(style="display: inline-block;", @click="goDash")
        i.el-icon-user
        span {{ userInfo.realname || userInfo.username }}({{ userInfo.userrole }})
      i.hand.el-icon-switch-button(@clicl="quit")
  .middle.layout-row
    .left.layout-column
      .equi-count.layout-row
        img(style="height:100%", :src="equigif")
        .equi-content.flex1
          img(
            style="height:100%;width:100%;position: absolute;",
            :src="equiBg"
          )
          .layout-row__between.equi-row(style="padding-top: 5%")
            .equi-item.layout-row__between.align-center.equi-bor
              div 设备
              .count-num {{ equiData.DeviceNum }}
            .equi-item.layout-row__between.align-center.equi-bor
              div 单位数
              div {{ equiData.CompanyNum }}
          .layout-row__between.equi-row(style="padding-bottom: 4%")
            .equi-item.layout-row__between.align-center
              div 安装点
              div {{ equiData.InstallPointNum }}
            .equi-item.layout-row__between.align-center
              div 建筑物
              div {{ equiData.BuildingNum }}
      //- 设备健康指数 饼状图
      .flex1.healthy(style="width:100%")
        .layout-row__center.align-center.img-wrap
          img(style="width: 22%;", :src="proBg")
        .charts-warp(style="width:100%; height: 100%")
          pai-chart(
            id="healthy"
            width="100%",
            height="100%",
            :grid="healthyGrid",
            :title="healthyTitle",
            :colorList="healthyColorList",
            :seriesData="healthytypeData"
          )

    .map
    .right.layout-column
      img.godashbord(:src="goBg", @click="goDash")
      .gif-warp.layout-row__around
        img(style="height: 65%", :src="alarmgif")
        img(style="height: 65%", :src="falsegif")
      .handle-warp
        .layout-row__between
          .layout-column
            .handle-title 今日报警
            .alarm-color {{ alarmInfo.todayAlarm }}起
          .layout-column
            .handle-title 已处理({{ alarmInfo.handleAlarmB }}%)
            .alarm-color {{ alarmInfo.handleAlarm }}起
          .layout-column
            .handle-title 今日故障
            .false-color {{ alarmInfo.todayFalse }}起
          .layout-column
            .handle-title 已处理({{ alarmInfo.handleFalseB }}%)
            .false-color {{ alarmInfo.handleFalse }}起
      .handle-list.flex1.layout-row__around
        .alarm-list.layout-column(style="width:49%")
          .title 未处理报警
          .flex1.layout-column__around
            .handle-item(v-for="(item, index) in handleAlarm", :key="index")
              span {{ item.address }}
        .false-list.layout-column(style="width:49%")
          .title 未处理故障
          .flex1.layout-column__around
            .handle-item(v-for="(item, index) in handleFalse", :key="index")
              span {{ item.address }}
  .footer.flex1.layout-row
    .chart-item
      .charts-warp(style="width:100%; height: 100%")
        today-status-chart(
          id="quuistatus"
          width="100%",
          height="100%",
          :grid="lineGrid",
          :title="lineTitle",
          :xAxisData="xAxisData",
          :legend="legend",
          :colorList="colorList",
          :seriesData="seriesData"
        )
    .chart-item
      .charts-warp(style="width:100%; height: 100%")
        mouth-status-chart(
          id="yuestatus"
          width="100%",
          height="100%",
          :grid="barGrid",
          :title="barTitle",
          :xAxisData="barTitleXAxisData",
          :legend="legend",
          :colorList="colorList",
          :seriesData="seriesBarData"
        )
    .chart-item
      .charts-warp(style="width:100%; height: 100%")
         pai-chart(
          id="protype",
          width="100%",
          height="100%",
          :title="proTitle"
          :colorList='proColorList'
          :seriesData="protypeData"
        )
    .chart-item
      .charts-warp(style="width:100%; height: 100%")
         pai-chart(
          id="alarmReason",
          width="100%",
          height="100%",
          :title="alarmTitle"
          :colorList='alarmColorList'
          :seriesData="alarmtypeData"
        )
  .comshow(:style="{ 'background-image': combg }")
    span {{ userInfo.comname }}
    //- img(style="width:100%;height:100%" :src="combg")
</template>
<script>
import TodayStatusChart from '@/components/Charts/TodayStatusChart'
import MouthStatusChart from '@/components/Charts/MouthStatusChart'
import PaiChart from '@/components/Charts/PaiChart'
import { mapGetters } from 'vuex'

import { getLefttopdata } from '@/api/sys'

export default {
  name: 'Home',
  components: {
    PaiChart,
    TodayStatusChart,
    MouthStatusChart
  },
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
    }
  },
  data() {
    return {
      bging: require('@/assets/img/bgc.png'),
      headerImg: require('@/assets/img/headerBg.png'),
      logo: require('@/assets/img/logo.png'),
      equigif: require('@/assets/img/equi.gif'),
      equiBg: require('@/assets/img/equiBg.png'),
      proBg: require('@/assets/img/proBg.png'),
      goBg: require('@/assets/img/goBg.png'),
      alarmgif: require('@/assets/img/alarm.gif'),
      falsegif: require('@/assets/img/false.gif'),
      combg: 'url(' + require('@/assets/img/combg.png') + ')',
      nowTime: '',
      // 设备数据
      equiData: {},
      // 设备健康指数 饼状图
      healthyColorList: ['#0CD48D', '#FF730A'],
      healthytypeData: [],
      healthyTitle: {
        text: '设备健康指数',
        left: '10px',
        top: '15px',
        textStyle: {
          color: 'rgb(62, 202, 252)',
          fontWeight: '400'
        }
      },
      healthyGrid: {},
      // 设备故障报警数量
      alarmInfo: {
        todayAlarm: 2255,
        handleAlarmB: 4,
        handleAlarm: 80,
        todayFalse: 4255,
        handleFalseB: 0,
        handleFalse: 0
      },
      handleAlarm: [
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        }
      ],
      handleFalse: [
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        },
        {
          address: '某某某某地方啊啊啊啊',
          id: '123444'
        }
      ],
      // 每日设备状态
      // 设备状态
      lineGrid: {
        left: '3%',
        right: '5%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      barGrid: {
        left: '5%',
        right: '5%',
        bottom: '3%',
        top: '25%',
        containLabel: true
      },
      lineTitle: {
        text: '每日设备状态',
        left: '30px',
        top: '10px',
        textStyle: {
          color: 'rgb(62, 202, 252)',
          fontWeight: '400'
        }
      },
      xAxisData: [
        '11-15',
        '11-16',
        '11-17',
        '11-18',
        '11-19',
        '11-20',
        '11-21'
      ],
      legend: ['正常', '故障', '报警'],
      colorList: ['#46CCA9', '#FF9424', '#E83B03'],
      colorListArea: ['#46CCA955', '#FF942455', '#E83B0355'],
      seriesData: [],
      // 每月设备柱状图
      barTitle: {
        text: '每月设备状态',
        left: '30px',
        top: '10px',
        textStyle: {
          color: 'rgb(62, 202, 252)',
          fontWeight: '400'
        }
      },
      barTitleXAxisData: [
        '2020-07',
        '2020-08',
        '2020-09',
        '2020-10',
        '2020-11'
      ],
      seriesBarData: [],
      // 产品分类占比
      proColorList: [],
      protypeData: [],
      proTitle: {
        text: '产品分类占比',
        left: '10px',
        top: '15px',
        textStyle: {
          color: 'rgb(62, 202, 252)',
          fontWeight: '400'
        }
      },
      proGrid: {
        top: 55
      },
      // 设备报警原因
      alarmTitle: {
        text: '设备报警原因',
        left: '10px',
        top: '15px',
        textStyle: {
          color: 'rgb(62, 202, 252)',
          fontWeight: '400'
        }
      },
      alarmColorList: [],
      alarmtypeData: []
    }
  },
  computed: {
    ...mapGetters(['sysInfo', 'userInfo'])
  },
  created() {
    // 获取设备数据
    this.getLefttopData()
    this.nowTimes()
    // 获取饼状图数据
    this.getEquiHealthy()
    // 每日设备状态
    this.getEquiStatus()
    // 每月设备状态
    this.getMouthEquiStatus()
    // 产品分类占比
    this.getProType()
    // 设备报警原因
    this.getAlarmReason()
  },
  methods: {
    timeFormate(timeStamp) {
      const year = new Date(timeStamp).getFullYear()
      const month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? '0' + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1
      const date =
        new Date(timeStamp).getDate() < 10
          ? '0' + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate()
      const hh =
        new Date(timeStamp).getHours() < 10
          ? '0' + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours()
      const mm =
        new Date(timeStamp).getMinutes() < 10
          ? '0' + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes()
      const ss =
        new Date(timeStamp).getSeconds() < 10
          ? '0' + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds()
      this.nowTime =
        year +
        '年' +
        month +
        '月' +
        date +
        '日' +
        ' ' +
        hh +
        ':' +
        mm +
        ':' +
        ss
    },
    nowTimes() {
      this.timeFormate(new Date())
      setInterval(this.nowTimes, 1000)
      this.clear()
    },
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null
    },
    goDash() {
      this.$router.push('/')
    },
    async quit() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    getEquiHealthy() {
      const protypeData = [
        {
          name: '设备健康指数',
          type: 'pie',
          radius: ['32%', '52%'],
          // avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: `{b}: \n{c} ({d}%)`,
            color: '#999'
            // rotate: 45
          },
          labelLine: {
            show: true
          },
          data: [
            {
              value: 9058,
              name: '正常'
            },
            {
              value: 55,
              name: '故障'
            }
          ]
        }
      ]

      this.healthytypeData = protypeData
    },
    getEquiStatus() {
      // 调用接口获取到data
      const ydata = [
        [16387, 16841, 16483, 16255, 16283, 16457, 16526],
        [1554, 1554, 1555, 1555, 1553, 1552, 1551],
        [7560, 7606, 7623, 7645, 7616, 7936, 7831]
      ]
      const seriesData = []
      ydata.forEach((n, index) => {
        seriesData.push({
          smooth: true,
          name: this.legend[index],
          type: 'line',
          showSymbol: false,
          // stack: '总量',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: this.colorListArea[index] // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#00000000' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          data: n
        })
      })
      this.seriesData = seriesData
    },
    getMouthEquiStatus() {
      // 调用接口获取到data
      const ydata = [
        [17514, 20796, 18501, 18361, 16454],
        [4326, 5770, 1704, 1563, 1552],
        [4126, 7236, 5484, 5913, 7939]
      ]
      const seriesData = []
      ydata.forEach((n, index) => {
        seriesData.push({
          name: this.legend[index],
          type: 'bar',
          barGap: 0,
          barWidth: 12,
          // stack: '总量',
          data: n
        })
      })
      this.seriesBarData = seriesData
    },
    getProType() {
      var proData = {
        'total': 40808,
        'originalData': [
          {
            'name': '烟雾报警器',
            'value': 1246,
            'pcColor': '#58c08c'
          },
          {
            'name': '燃气报警器',
            'value': 153,
            'pcColor': '#f59f5f'
          },
          {
            'name': '消防水压表',
            'value': 0,
            'pcColor': '#e7b632'
          },
          {
            'name': '电弧监测',
            'value': 0,
            'pcColor': '#99cc2b'
          },
          {
            'name': '手动报警器',
            'value': 364,
            'pcColor': '#f2661e'
          },
          {
            'name': '消火栓',
            'value': 0,
            'pcColor': '#e05959'
          },
          {
            'name': '智慧用电',
            'value': 0,
            'pcColor': '#7d83f9'
          },
          {
            'name': '声光报警器',
            'value': 30,
            'pcColor': '#31bbc7'
          },
          {
            'name': '消防液位表',
            'value': 0,
            'pcColor': '#c7ce71'
          },
          {
            'name': '温感报警器',
            'value': 0,
            'pcColor': '#05c974'
          },
          {
            'name': '门磁',
            'value': 38720,
            'pcColor': '#5fa4f5'
          },
          {
            'name': '热解粒子探测器',
            'value': 0,
            'pcColor': '#6c73ff'
          },
          {
            'name': '电气火灾',
            'value': 0,
            'pcColor': '#dbd41c'
          },
          {
            'name': '水浸',
            'value': 60,
            'pcColor': '#b358c0'
          },
          {
            'name': '报警主机',
            'value': 0,
            'pcColor': '#7bbed2'
          },
          {
            'name': '红外报警器',
            'value': 235,
            'pcColor': '#de8baf'
          },
          {
            'name': '摄像机',
            'value': 0,
            'pcColor': '#c287fa'
          },
          {
            'name': '一氧化碳',
            'value': 0,
            'pcColor': '#2698da'
          },
          {
            'name': '用户传输装置',
            'value': 0,
            'pcColor': '#1ac67b'
          },
          {
            'name': '报警器',
            'value': 0,
            'pcColor': '#ffc45d'
          },
          {
            'name': 'NB/433网关',
            'value': 0,
            'pcColor': ''
          },
          {
            'name': '吸烟报警器',
            'value': 0,
            'pcColor': '#168fff'
          }
        ]
      }
      const colorList = []
      const protypeData = [
        {
          name: '产品类别',
          type: 'pie',
          radius: '50%',
          center: ['50%', '60%'],
          // avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: `{b}: \n{c} ({d}%)`
            // position: 'outer',
            // alignTo: 'labelLine'
          },
          labelLine: {
            show: true
          },
          data: []
        }
      ]

      const serData = []
      proData.originalData.forEach(n => {
        colorList.push(n.pcColor)
        serData.push({
          value: n.value === 0 ? null : n.value,
          name: n.name
        })
      })
      this.proColorList = colorList
      protypeData[0].data = serData
      this.protypeData = protypeData
    },
    getAlarmReason() {
      var proData = {
        'total': 40808,
        'originalData': [
          {
            'name': '测试',
            'value': 0,
            'pcColor': '#909399'
          },
          {
            'name': '报警',
            'value': 0,
            'pcColor': '#E6A23C'
          }
        ]
      }
      const colorList = []
      const protypeData = [
        {
          name: '产品类别',
          type: 'pie',
          radius: ['50%', '55%'],
          center: ['50%', '60%'],
          // avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: `{b}: \n{c} ({d}%)`
            // position: 'outer',
            // alignTo: 'labelLine'
          },
          labelLine: {
            show: true
          },
          // itemStyle: {
          //   shadowColor: ['#909399', '#E6A23C'],
          //   shadowBlur: 10
          // },
          data: []
        }
      ]

      const serData = []
      proData.originalData.forEach(n => {
        colorList.push(n.pcColor)
        serData.push({
          value: n.value,
          name: n.name,
          itemStyle: {
            shadowColor: n.pcColor,
            shadowBlur: 10
          }
        })
      })
      this.alarmColorList = colorList
      protypeData[0].data = serData
      this.alarmtypeData = protypeData
    },
    getLefttopData() {
      getLefttopdata().then(res => {
        // console.log(res)
        this.equiData = res.Data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .header {
    max-height: 100px;
    height: 10vh;
    width: 100%;
    position: relative;
    .header-image {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .header-time {
      color: #fff;
      line-height: 6vh;
      text-indent: 1em;
      width: 25%;
      position: relative;
    }
    .title {
      position: relative;
      .log-img {
        height: 5vh;
        width: 5vh;
      }
      .web-title {
        color: #fff;
        font-size: 28px;
        // font-family: fangzheng-font;
        text-shadow: 0 0 0.2em #2caee4;
        overflow-x: hidden;
        max-width: 800px;
        white-space: nowrap;
      }
    }
    .header-user {
      color: #fff;
      line-height: 6vh;
      text-indent: 1em;
      width: 25%;
      position: relative;
      text-align: right;
      padding-right: 20px;
    }
  }
  .middle {
    height: 55%;
    .left {
      width: 29%;
      padding: 0 10px 0 20px;
      .equi-count {
        height: 20%;
        // padding: 10px 0;
        .equi-content {
          position: relative;
          .equi-row {
            height: 50%;
            padding: 0 12px;
            .equi-item {
              width: 48%;
              color: #3ecafc;
              font-size: 16px;
              // height: 50%;
              // margin-top: 5%;
              .count-num {
                font-family: "math-font";
              }
            }
            .equi-bor {
              border-bottom: 1px solid #3ecafc;
            }
          }
        }
      }
      .healthy {
        position: relative;
        .img-wrap {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      }
    }
    .map {
      width: 42%;
      background: royalblue;
    }
    .right {
      width: 29%;
      position: relative;
      padding: 0 10px;
      .godashbord {
        cursor: pointer;
        width: 145px;
        height: 40px;
        position: absolute;
        right: 30px;
        top: -20px;
        &:hover {
          opacity: 0.8;
        }
      }
      .gif-warp {
        height: 30%;
        justify-content: space-evenly;
        flex-wrap: wrap-reverse;
      }
      .handle-warp {
        color: #fff;
        padding: 0 20px;
        .handle-title {
          line-height: 40px;
        }
      }
      .handle-list {
        color: #28a4d5;
        font-size: 14px;
        .title {
          line-height: 50px;
        }
        .handle-item {
          // line-height: 40px;
          font-size: 14px;
          padding-left: 10px;
          padding-right: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }
      }
    }
  }
  .footer {
    .chart-item {
      width: 25%;
      height: 100%;
    }
  }
  .comshow {
    height: 30px;
    line-height: 30px;
    background-repeat: no-repeat;
    background-size: 100% auto;
    text-align: center;
    color: #fff;
    font-size: 12px;
  }
}
.bg-image {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
}
.alarm-color {
  font-size: 20px;
  color: #e83b03;
}
.false-color {
  font-size: 20px;
  color: #ff9424;
}
</style>
