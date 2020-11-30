<!--
 * @Author: zzz
 * @LastEditors: zzz
-->
<template lang="pug">
.dashboard-container
  el-row(:gutter="20")
    el-col(:span="18", style="padding: 20px 20px 20px 30px")
      swiper.swiper(ref="swiper", :options="swiperOption" @mouseover.native="showbtn" @mouseout.native="hiddenbtn")
        swiper-slide(v-for="(item, index) in shebeiData", :key="index")
          .slide-item-warp.layout-row__between.align-center(
            :style="{ color: sheOption.find(n => n.deviceType === item.DeviceName).pcColor, height: '100%' }"
          )
            .name-warp.date-warp.layout-column__around.align-center
              svg-icon(:icon-class="sheOption.find(n => n.deviceType === item.DeviceName).icon" style="font-size: 30" )
              span {{ item.DeviceName }}
            .date-warp.layout-column__around.align-center
              span.num {{ item.Quantity }}
              span 设备总数
            .date-warp.layout-column__around.align-center
              span.num {{ item.FaultNum }}
              span 故障
            .date-warp.layout-column__around.align-center
              span.num {{ item.AlarmNum }}
              span 报警
        .swiper-button-prev(v-show="showBtn" slot="button-prev", @click="prev")
        .swiper-button-next(v-show="showBtn" slot="button-next", @click="next")
      el-row(:gutter="20")
        el-col(:span="16")
          //- 设备状态曲线图
          .charts-warp(style="width:100%; height: 350px")
            equi-status-chart(
              id="quuistatus",
              width="100%",
              height="100%",
              :xAxisData="xAxisData",
              :legend="legend",
              :colorList='colorList'
              :seriesData="seriesData"
            )
            el-select.equi-selcet(
              v-model="equiStatus"
              placeholder=""
              style="width: 70px")
              el-option(label='天' value="day")
              el-option(label='月' value="mouth")
        el-col(:span="8")
          //- 产品分类占比
          .charts-warp(style="width:100%; height: 350px")
            pai-chart(
              id="protype",
              width="100%",
              height="100%",
              :colorList='proColorList'
              :seriesData="protypeData"
            )
    el-col(:span="6" style="padding: 20px 30px 20px 0px;")
      //- 系统消息
      div.sysmsg
        div.msg-header.layout-row.align-center
          svg-icon.svgicon.mr_10(icon-class="notice")
          span 最新消息
        div.msg-content.layout-row.align-center(
          v-for="(item,index) in alarmList"
          :key="index"
          @click="goMessage(item)"
          :style="{background: index%2 ===0 ? '#f4f4f4' : '#fff'}")
          .svgwarp.mr_10
            svg-icon.svgicon(icon-class="sysalarm")
          div.layout-column.flex1
            div.mb_10.meg-title {{item.megtitle}}
            div(style="text-align:right") {{item.addtime}}
</template>

<script>
import { mapGetters } from 'vuex'
import EquiStatusChart from '@/components/Charts/EquiStatusChart'
import PaiChart from '@/components/Charts/PaiChart'
// 傻逼一样的轮播图
import Vue from 'vue'
import {
  Swiper as SwiperClass,
  Pagination,
  Mousewheel,
  Autoplay
} from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
import { getSysMessage, getPercent } from '@/api/sys'
SwiperClass.use([Pagination, Mousewheel, Autoplay])
Vue.use(getAwesomeSwiper(SwiperClass))
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
import 'swiper/swiper-bundle.css'
export default {
  name: 'Dashboard',
  components: {
    Swiper,
    SwiperSlide,
    EquiStatusChart,
    PaiChart
  },
  filters: {
    filterEqui: (val) => {
      console.log(this.sheOption)
      return this.sheOption.find(n => n.deviceType === val).pcColor
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          // disableOnInteraction: true
          disableOnInteraction: false
        },
        loop: true,
        spaceBetween: 30,
        direction: 'horizontal',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        on: {
          resize: () => {
            this.$refs.swiper.$swiper.changeDirection(
              window.innerWidth <= 960 ? 'vertical' : 'horizontal'
            )
          }
        }
      },
      showBtn: false,
      shebeiData: [],
      sheOption: require('@/assets/equi.json'),
      // 设备状态
      xAxisData: [
        '2020-05',
        '2020-06',
        '2020-07',
        '2020-08',
        '2020-09',
        '2020-10',
        '2020-11'
      ],
      legend: ['正常', '故障', '报警'],
      colorList: ['#46CCA9', '#FF9424', '#E83B03'],
      colorListArea: ['#dcfff685', '#ffead485', '#ffddd285'],

      seriesData: [],
      equiStatus: 'mouth',
      // 产品分类
      proColorList: [],
      protypeData: [],
      // 最新消息
      alarmList: []

    }
  },
  computed: {
    ...mapGetters([
      // 'roles'
    ])
  },
  created() {
    this.getEquiStatus()
    this.getProType()
    this.getAlarmData()
    this.getPercentData()
  },
  methods: {
    prev() {
      this.$refs.swiper.$swiper.slidePrev()
    },
    next() {
      this.$refs.swiper.$swiper.slideNext()
    },
    showbtn() {
      if (!this.showBtn) {
        this.showBtn = true
      }
    },
    hiddenbtn() {
      if (this.showBtn) {
        this.showBtn = false
      }
    },
    getEquiStatus() {
      // 调用接口获取到data
      const ydata = [
        [23967, 42522, 36069, 49034, 37323, 47031, 38312],
        [5396, 9203, 17672, 23384, 6711, 6045, 5841],
        [3535, 14641, 14785, 28869, 20660, 22436, 28183]
      ]
      const seriesData = []
      ydata.forEach((n, index) => {
        seriesData.push({
          smooth: true,
          name: this.legend[index],
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
                offset: 0, color: this.colorListArea[index] // 0% 处的颜色
              }, {
                offset: 0.6, color: '#ffe' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          data: n
        })
      })
      this.seriesData = seriesData
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
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          // label: {
          //   show: false,
          //   position: 'center'
          // },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 400,
              formatter() {
                return proData.total
              },
              color: '#333'
            }
          },
          label: {
            position: 'center',
            fontSize: '30',
            fontWeight: 400,
            formatter() {
              return proData.total
            },
            color: '#333'

          },
          labelLine: {
            show: false
          },
          data: []
        }
      ]

      const serData = []
      proData.originalData.forEach(n => {
        colorList.push(n.pcColor)
        serData.push({
          value: n.value,
          name: n.name
        })
      })
      this.proColorList = colorList
      protypeData[0].data = serData
      this.protypeData = protypeData
    },
    getAlarmData() {
      // 调用接口
      const params = {
        PageIndex: 1,
        PageSize: 6
      }
      this.alarmList = []
      getSysMessage(params).then(res => {
        // console.log(res)
        this.alarmList = res.Data.Models
      }).catch(err => {
        console.error(err)
      })
    },
    goMessage(item) {
      this.$router.push({
        path: '/Sys/SysMsg',
        query: { megid: item.megid }
      })
    },
    getPercentData() {
      getPercent().then(res => {
        this.shebeiData = res.Data.Items
        console.log(this.shebeiData)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  background: #f6f7fa;
}
.swiper {
  height: 140px;
  .swiper-item {
    height: 140px;
  }
  .slide-item-warp {
    background: #fff;
    border-radius: 5px;
    .date-warp {
      height: 100%;
      padding: 20px 12px 20px 8px;
      box-sizing: border-box;
      .num {
        font-weight: 600;
      }
    }
    .name-warp {
      width: 100px;
    }
  }
}
.charts-warp {
  background: #fff;
  border-radius: 5px;
  margin-top: 20px;
  position: relative;
  .equi-selcet{
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 2;
  }
}
.sysmsg{
  width: 100%;
  height: 510px;
  overflow-y: hidden;
  background: #fff;
  .msg-header{
    padding: 10px 20px;
    line-height: 40px;
    .svgicon{
      // float: left;
      font-size: 25px;
      color: #f2661e;
    }
  }
  .msg-content{
    padding: 14px 20px;
    color: #666;
    .svgwarp{
      border: 1px solid #f2661e;
      padding: 6px;
      border-radius: 20px;
      .svgicon{
        // float: left;
        font-size: 25px;
        color: #f2661e;
      }
    }
    cursor: pointer;
    &:hover{
      background: #eeeeee !important;
      cursor: pointer;
      .meg-title{
        color: #f2661e;
      }
    }
  }
}
</style>
