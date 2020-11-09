<!--
 * @Author: your name
 * @Date: 2019-11-01 10:18:26
 * @LastEditTime: 2020-11-09 16:59:28
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-ui\src\views\pages\Info\Staffs\index.vue
 -->
<template lang="pug">
el-dialog.dialogmap-class(
  :title='dialogTitle',
  :visible.sync='dialogMapVisible'
  width='90%'
  :append-to-body="true"
  top="5vh"
  :close-on-click-modal='false'
  @open="openMap"
  @close="closeDialog")
  #container()
  .map-query(v-if="hasQuery")
    el-input.input-search#input-search(placeholder='请输入关键字并选择' v-model='mapSearch' size="small" clearable @clear="searchMap(mapSearch)" @input="onInput")
      el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="searchMap(mapSearch)")
    //- input#input-search(type="text")
    #panel()
  .input-card(v-if="showLnglat")
    p 经纬度-地址：
    .input-item.default-input.layout-column
      div
        el-input#lnglat(size="small" :disabled='true' v-model="lnglat")
        el-button.ml_10(v-if="hasQuery" :disabled="!lnglat" size="small" type="primary" @click="onSure") 确定
      el-input#address.mt_10(style="width:300px" size="small" :disabled='true' v-model="addressIn")
  //- input#tipinput

</template>
<script >
import AMap from 'AMap'
import city from '@/assets/city.json'

export default {
  name: 'Index',
  components: {

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
  props: {
    dialogTitle: {
      type: String,
      default: '地图'
    },
    dialogMapVisible: {
      type: Boolean,
      default: false
    },
    hasQuery: {
      type: Boolean,
      default: false
    },
    showLnglat: {
      type: Boolean,
      default: false
    },
    longitude: {
      type: Number,
      default: 0
    },
    latitude: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 地图
      mapSearch: '',
      map: '', // 地图实例
      searchCity: '',
      marker: [],
      addressIn: '',
      lnglat: '',
      longitudeIn: '',
      latitudeIn: ''
    }
  },
  computed: {

  },
  watch: {
    dialogMapVisible(news, olds) {
      if (news) {
        this.initMap()
        this.addressIn = this.address
        if (this.longitude && this.latitude) {
          this.lnglat = this.longitude + ',' + this.latitude
        }
      }
    }
  },
  created() {
    this.initMap()
  },
  mounted() {
  },
  methods: {
    /** *** 基本设置 start ******/

    /** *** 按钮点击 start ******/
    onSure() {
      this.map = null
      this.$emit('onSure', this.addressIn, this.longitudeIn, this.latitudeIn)
    },
    closeDialog() {
      this.map = null
      this.$emit('closeDialog')
    },
    openMap() {
      this.$emit('openMap')
    },
    initMap() {
      this.$nextTick(() => {
        let option
        if (this.longitude && this.latitude) {
          option = {
            center: [parseFloat(this.longitude), parseFloat(this.latitude)],
            // center: [116.397428, 39.90923],
            resizeEnable: true,
            zoom: 10,
            rotateEnable: true,
            expandZoomRange: true,
            pitchEnable: true,
            pitch: 0, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', // 开启3D视图,默认为关闭
            buildingAnimation: true // 楼块出现是否带动画
          }
        } else {
          option = {
            resizeEnable: true,
            zoom: 10,
            rotateEnable: true,
            expandZoomRange: true,
            pitchEnable: true,
            pitch: 0, // 地图俯仰角度，有效范围 0 度- 83 度
            viewMode: '3D', // 开启3D视图,默认为关闭
            buildingAnimation: true // 楼块出现是否带动画
          }
        }
        this.map = new AMap.Map('container', option)

        const that = this

        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.ControlBar', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.CitySearch', 'AMap.Geocoder'],
          function() { // 异步同时加载多个插件
            var toolbar = new AMap.ToolBar()
            that.map.addControl(toolbar)
            var Scale = new AMap.Scale()// 驾车路线规划
            that.map.addControl(Scale)
            // that.map.addControl(new AMap.Geolocation())

            // that.map.addControl(new AMap.ControlBar({
            //   showZoomBar: false,
            //   showControlButton: true,
            //   position: {
            //     right: '10px',
            //     top: '10px'
            //   }
            // }))

            // 打开定位当前电脑所在位置
            // toolbar.doLocation()

            // 获取当前城市
            var citysearch = new AMap.CitySearch()
            console.log(citysearch)
            // 自动获取用户IP，返回当前城市
            citysearch.getCityByIp(function(status, result) {
              console.log('123')
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                  var cityinfo = result.city
                  // var citybounds = result.bounds
                  // document.getElementById('info').innerHTML = '您当前所在城市：' + cityinfo
                  that.searchCity = cityinfo
                  // 地图显示当前城市
                  // that.map.setBounds(citybounds)
                }
              } else {
              // document.getElementById('info').innerHTML = result.info
              }
            })

            // 如果有经纬度 就生成一个maker
            let marker = ''

            if (this.longitude && this.latitude) {
              marker = new AMap.Marker({
                position: new AMap.LngLat(parseFloat(this.longitude), parseFloat(this.latitude)),
                map: that.map
              })
            }
            this.marker.push(marker)
          })
      })
    },
    onInput(e) {
      const citys = city.find(n => n.name.includes(e))
      if (citys) {
        this.searchCity = citys.name
      }
      // 情空所有标记
      var that = this
      // that.map.remove(that.marker[0])
      that.map.clearMap()
      that.marker[0] ? that.map.add(that.marker[0]) : ''
      const map = that.map
      console.log('城市', that.searchCity)
      AMap.service(['AMap.PlaceSearch'], function() {
        // 构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          pageSize: 4, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: that.searchCity, // 兴趣点城市
          citylimit: true, // 是否强制限制在设置的城市内搜索
          map: map, // 展现结果的地图实例
          panel: 'panel', // 结果列表将在此容器中进行展示。
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        })
        // 关键字查询
        placeSearch.search(that.mapSearch, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // 成功的时候切换当前城市
            that.map.getCity(function(info) {
              that.searchCity = info.city
            })
          } else {
            // log.error('根据经纬度查询地址失败')
          }
        })

        AMap.event.addListener(placeSearch, 'selectChanged', (e) => {
          const data = e.selected.data
          const location = e.selected.data.location

          that.lnglat = location.lng + ',' + location.lat
          that.addressIn = data.pname + data.cityname + data.adname + data.address

          const searchCity = city.find(n => n.name.includes(data.cityname))
          if (searchCity) {
            that.searchCity = data.cityname
          }
        })
      })
    },
    searchMap(serch) {
      this.onInput(serch)
    }

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/

/** *** 基本设置 end ******/
.dialogmap-class{
  ::v-deep .el-dialog{
    .el-dialog__body{
      padding: 0 10px 10px 10px;
      height: calc(100vh - 150px);
      overflow-y: auto;
      position: relative;
      .el-form{
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          width: 100%;
          // margin-bottom: 0;
          .el-form-item__content{
            line-height: 32px;
          }
        }
      }
      .el-input{
        width: 220px
      }
      .el-select{
        width: 100%
      }
      .el-cascader{
        width: 100%

      }
    }
  }
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  // overflow-y: auto;
  top: 35px;
  left: 0px;
  width: 280px;
}
.input-item {
  position: relative;
  width: 100%;
  // ::v-deep input{
  //   width: 200px
  // }
  ::v-deep .is-disabled{
    .el-input__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
  }
}
.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border-radius: .25rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  position: absolute;
  padding: 0.75rem 1.25rem;
  bottom: 40px;
  right: 20px;
}
#container{
  height: 100%;
  width: 100%
}
.map-query{
  position: absolute;
  top: 20px;
  right: 80px;
}
</style>
