<!--
 * @Author: zzz
 * @LastEditors: zzz
-->
<template lang="pug">
  .dashboard-container
    el-row(:gutter='20')
      el-col(:span='18' style="padding: 20px 20px 20px 30px")
        swiper.swiper(ref='swiper' :options='swiperOption')
          swiper-slide(v-for='(item, index) in shebeiData' :key='index')
            .slide-item-warp.layout-row__between.align-center(:style="{color:item.pcColor, height: '100%' }")
              .name-warp.date-warp.layout-column__around.align-center
                svg-icon(:icon-class='item.icon')
                span {{ item.deviceType }}
              .date-warp.layout-column__around.align-center
                span.num {{item.total}}
                span 设备总数
              .date-warp.layout-column__around.align-center
                span.num {{item.faultCount}}
                span 故障
              .date-warp.layout-column__around.align-center
                span.num {{item.alarmCount}}
                span 报警
          .swiper-button-prev(slot='button-prev' @click='prev')
          .swiper-button-next(slot='button-next' @click='next')
      el-col(:span='6')
        div 123
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/swiper-bundle.css'
import Vue from 'vue'
import { Swiper as SwiperClass, Pagination, Mousewheel, Autoplay } from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
SwiperClass.use([Pagination, Mousewheel, Autoplay])
Vue.use(getAwesomeSwiper(SwiperClass))
const { Swiper, SwiperSlide } = getAwesomeSwiper(SwiperClass)
import 'swiper/swiper-bundle.css'
export default {
  name: 'Dashboard',
  components: {
    Swiper,
    SwiperSlide
    // adminDashboard,
    // editorDashboard
  },
  data() {
    return {
      // currentRole: 'adminDashboard',
      // input: ''
      swiperOption: {
        slidesPerView: 3,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: true
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
              window.innerWidth <= 960
                ? 'vertical'
                : 'horizontal'
            )
          }
        }
      },
      shebeiData: [
        {
          'deviceType': '门磁',
          'alarmCount': 1528,
          'deviceTypeId': '31',
          'total': 38720,
          'icon': '&#xe639;',
          'pcColor': '#5fa4f5',
          'faultCount': 51
        },
        {
          'deviceType': '烟雾报警器',
          'alarmCount': 13,
          'deviceTypeId': '21',
          'total': 1246,
          'icon': '&#xe605;',
          'pcColor': '#58c08c',
          'faultCount': 0
        },
        {
          'deviceType': '手动报警器',
          'alarmCount': 91,
          'deviceTypeId': '25',
          'total': 364,
          'icon': '&#xe60e;',
          'pcColor': '#f2661e',
          'faultCount': 0
        },
        {
          'deviceType': '红外报警器',
          'alarmCount': 4,
          'deviceTypeId': '36',
          'total': 235,
          'icon': '&#xe649;',
          'pcColor': '#de8baf',
          'faultCount': 1
        },
        {
          'deviceType': '燃气报警器',
          'alarmCount': 1,
          'deviceTypeId': '22',
          'total': 153,
          'icon': '&#xeca1;',
          'pcColor': '#f59f5f',
          'faultCount': 2
        },
        {
          'deviceType': '水浸',
          'alarmCount': 0,
          'deviceTypeId': '34',
          'total': 60,
          'icon': '&#xe624;\r\n',
          'pcColor': '#b358c0',
          'faultCount': 0
        },
        {
          'deviceType': '声光报警器',
          'alarmCount': 0,
          'deviceTypeId': '28',
          'total': 30,
          'icon': '&#xe62c;',
          'pcColor': '#31bbc7',
          'faultCount': 0
        },
        {
          'deviceType': '消防水压表',
          'alarmCount': 0,
          'deviceTypeId': '23',
          'total': 0,
          'icon': '&#xe61b;',
          'pcColor': '#e7b632',
          'faultCount': 0
        },
        {
          'deviceType': '电弧监测',
          'alarmCount': 0,
          'deviceTypeId': '24',
          'total': 0,
          'icon': '&#xe603;',
          'pcColor': '#99cc2b',
          'faultCount': 0
        },
        {
          'deviceType': '消火栓',
          'alarmCount': 0,
          'deviceTypeId': '26',
          'total': 0,
          'icon': '&#xe61c;',
          'pcColor': '#e05959',
          'faultCount': 0
        },
        {
          'deviceType': '智慧用电',
          'alarmCount': 0,
          'deviceTypeId': '27',
          'total': 0,
          'icon': '&#xe630;',
          'pcColor': '#7d83f9',
          'faultCount': 0
        },
        {
          'deviceType': '消防液位表',
          'alarmCount': 0,
          'deviceTypeId': '29',
          'total': 0,
          'icon': '&#xe62f;',
          'pcColor': '#c7ce71',
          'faultCount': 0
        },
        {
          'deviceType': '温感报警器',
          'alarmCount': 0,
          'deviceTypeId': '30',
          'total': 0,
          'icon': '&#xe63b;',
          'pcColor': '#05c974',
          'faultCount': 0
        },
        {
          'deviceType': '热解粒子探测器',
          'alarmCount': 0,
          'deviceTypeId': '32',
          'total': 0,
          'icon': '&#xe641;',
          'pcColor': '#6c73ff',
          'faultCount': 0
        },
        {
          'deviceType': '电气火灾',
          'alarmCount': 0,
          'deviceTypeId': '33',
          'total': 0,
          'icon': '&#xe643;',
          'pcColor': '#dbd41c',
          'faultCount': 0
        },
        {
          'deviceType': '报警主机',
          'alarmCount': 0,
          'deviceTypeId': '35',
          'total': 0,
          'icon': '&#xe645;',
          'pcColor': '#7bbed2',
          'faultCount': 0
        },
        {
          'deviceType': '摄像机',
          'alarmCount': 0,
          'deviceTypeId': '37',
          'total': 0,
          'icon': '&#xe711;',
          'pcColor': '#c287fa',
          'faultCount': 0
        },
        {
          'deviceType': '一氧化碳',
          'alarmCount': 0,
          'deviceTypeId': '38',
          'total': 0,
          'icon': '&#xe64c;',
          'pcColor': '#2698da',
          'faultCount': 0
        },
        {
          'deviceType': '用户传输装置',
          'alarmCount': 0,
          'deviceTypeId': '39',
          'total': 0,
          'icon': '&#xe650;',
          'pcColor': '#1ac67b',
          'faultCount': 0
        },
        {
          'deviceType': '报警器',
          'alarmCount': 0,
          'deviceTypeId': '40',
          'total': 0,
          'icon': '&#xe65b;\r\n',
          'pcColor': '#ffc45d',
          'faultCount': 0
        },
        {
          'deviceType': '吸烟报警器',
          'alarmCount': 0,
          'deviceTypeId': '42',
          'total': 0,
          'icon': '&#xe676;',
          'pcColor': '#168fff',
          'faultCount': 0
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      // 'roles'
    ])

  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  methods: {
    prev() {
      this.$refs.swiper.$swiper.slidePrev()
    },
    next() {
      this.$refs.swiper.$swiper.slideNext()
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container{

background: #f6f7fa;
}
.swiper{

  height: 140px;
  .swiper-item{
    height: 140px;
  }
  .slide-item-warp{
    background: #fff;
    border-radius: 5px;
    .date-warp{
      height: 100%;
      padding: 20px 12px 20px 8px;
      box-sizing: border-box;
      .num{
        font-weight: 600;
      }
    }
    .name-warp{
      width: 100px;
    }
  }
}
</style>
