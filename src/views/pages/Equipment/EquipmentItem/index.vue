<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-12-14 11:29:53
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    //- 返回单位管理查单
    .hearer-breadcrumb
      el-button(type="text" style="padding: 0" @click="goBack") 设备列表
      i.el-icon-arrow-right
      span 设备详情
      //- span.ml_20(style="color: #000") {{comname}}
    el-card.box-card.mb_10
      div.clr_b2(slot="header")
        | 资费信息
        el-button.ml_10(type="primary" size="mini" @click.stop="goBuy(row)") 购买
      div.layout-row__around.zifei-warp
        div.layout-row
          .zifei-title 短信信息
          .zifei-content.layout-column
            div.zifei-content-item
              span 账户短信剩余
              span.num  {{ ruleForm.zhmsg || 0 }}
              span  条
            div.zifei-content-item
              span 当前设备已使用
              span.num  {{ ruleForm.zhmsg || 0 }}
              span  条
            div.zifei-content-item
              span 当前设备剩余
              span.num  {{ ruleForm.zhmsg || 0 }}
              span  条
        div.layout-row
          .zifei-title 语音信息
          .zifei-content.layout-column
            div.zifei-content-item
              span 账户语言剩余
              span.num  {{ ruleForm.zhmsg || 0 }}
              span  条
            div.zifei-content-item
              span 当前设备已使用
              span.num  {{ ruleForm.zhmsg || 0 }}
              span  条
            div.zifei-content-item
              span 当前设备剩余
              span.num  {{ ruleForm.zhmsg || 0 }}
              span  条
      //- div 短信信息 账户短信剩余 当前设备已使用 当前设备剩余
    el-card.box-card.mb_10
      div.clr_b2(slot="header") 设备信息
      //- 数据开始了
      el-form.default-input.inline(
        v-loading="listLoading"
        :model='ruleForm'
        ref='ruleForm'
        label-width='130px')
        .layout-row.flex-wrap
          div.card-form(v-for="item in formList" :key="item.id" style="width: 30%")
            el-form-item(
              style="height: 36px"
              :prop='item.prop'
              :label="item.label")
              span.span-style.clr_b2.hand(
                v-if="item.prop === 'dwaddress'"
                @click="dialogMapVisible = true"
                style="width:100%") {{ruleForm[item.prop]}}
              span.span-style(v-else style="width:100%") {{ruleForm[item.prop]}}
    el-card.box-card.mb_10
      div.clr_b2(slot="header") 设备属性
      //- 数据开始了
      el-form.default-input.inline(
        v-loading="listLoading"
        :model='ruleForm'
        ref='ruleForm'
        label-width='120px')
        .layout-row__around.flex-wrap
          div.card-form(style="")
            el-form-item(
              v-if="ruleForm.devicetype === 11"
              prop='menciType'
              label="门磁状态")
              span {{ruleForm.menciType}}
          div.card-form(style="")
            el-form-item(
              prop='xinhaozh'
              label="信号强度")
              span {{ruleForm.xinhaozh}}
          div.card-form(style="")
            el-form-item(
              prop='dianya'
              label="电池电压")
              span {{ruleForm.dianya}}V
          div.card-form(style="")
            el-form-item(
              prop='protectvaluezh'
              label="布防状态")
              span {{ruleForm.protectvaluezh}}

    //- 型号强度
    el-radio-group.mb_10(v-model="radio1")
      el-radio-button(label="信号强度")
      el-radio-button(label="电池电压")
    div
      el-row(:gutter="20")
        el-col(:span="8")
          el-card.box-card.mb_10.chart-warp(style="height: 320px")
            div.clr_b2(slot="header") {{radio1}}
            //- 数据开始了
            msg-chart(v-if="radio1 === '信号强度'" id="msg-chart" width="100%" height="100%")
            voltage-chart(v-else id="vol-chart" width="100%" height="100%" :data="parseFloat(ruleForm.dianya) + ''")
        el-col(:span="16")
          el-card.box-card.mb_10.chart-warp
            div.clr_b2(slot="header") {{radio1}}
            //- 数据开始了
            msg-line-chart(id="msg-line-chart" width="100%" height="100%")
    .layout-column(style="height: 100%")
      .header.layout-row__between
        .query
          Query(
            :queryList="tableQueryList"
            :hasAdvQuery='false'
            :dics="tableQueryDics"
            :btnLoading="tableLoading"
            @onSearch="onSearch")
      edit-table-form(
        :loading='tableLoading'
        :hasOutOperat="false"
        :tableData="tableDialogData"
        :columns="tableDialogColums"
        :disOperated="tableDisOperated"
        operateWidth="220"
        :showSelection="false"
        :showIndex="false"
        :showView="false"
        :showEdit="false"
        :showDel="false"
        :hasPages="true"
        :currentPage="tableCurrentPage"
        :total="tableTotal"
        :pageSize="tablePageSize"
        :dics="tableDics"
        @onHandleCurrentChange="handleCurrentChange"
        @onHandleSizeChange="handleSizeChange")
    //- 地图弹窗
    MapDialog(
      dialogTitle="地图"
      :hasQuery="false"
      :showLnglat="true"
      :dialogMapVisible="dialogMapVisible"
      :longitude="ruleForm.longitude"
      :latitude="ruleForm.latitude"
      :address="ruleForm.dwaddress"
      @closeDialog="dialogMapVisible = false"
    )
    //- 购买弹窗
    buy-some(:dialogTitle="buyTitle" :dialogVisible="buyVisible" :deviceid="buyDeviceid" @onClose="buyVisible = false")
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import MapDialog from '@/components/MapDialog'
import { getEquiByid } from '@/api/equipment'
// import { getDicsByName } from '@/api/commom'
import MsgChart from '@/components/Charts/MsgChart'
import MsgLineChart from '@/components/Charts/MsgLineChart'
import VoltageChart from '@/components/Charts/VoltageChart'
import VoltageLineChart from '@/components/Charts/VoltageLineChart'
// import { checkPhone } from '@/utils/index'
import BuySome from '@/components/BuySome'
import { mapGetters } from 'vuex'
export default {
  name: 'EquipmentItem',
  components: {
    Query,
    EditTableForm,
    MsgChart,
    MsgLineChart,
    MapDialog,
    VoltageChart,
    VoltageLineChart,
    BuySome
  },
  filters: {

  },
  data() {
    // var isPhone = (rule, value, callback) => {
    //   if (value) {
    //     if (!checkPhone(value)) {
    //       callback(new Error('请输入正确的电话号码'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
    return {
      /**
       * 查询
       */
      queryList: [
        {
          label: '用户姓名',
          prop: 'username',
          holder: '请输入用户姓名',
          queryType: false
        }
      ],
      query: {},

      // 设备信息
      ruleForm: {},
      IMEI: '',
      listLoading: false,
      formList: [
        {
          prop: 'IMEI',
          label: 'IMEI'
        },
        {
          prop: 'comname',
          label: '所属单位'
        },

        {
          prop: 'jzwzh',
          label: '建筑物'
        },
        {
          prop: 'ICCID',
          label: 'ICCID'
        },
        {
          prop: 'picizh',
          label: '批次'
        },
        {
          prop: 'IMSI',
          label: 'IMSI'
        },
        {
          prop: 'devicevaluezh',
          label: '状态'
        },
        {
          prop: 'lcname',
          label: '楼层'
        },
        {
          prop: 'devicetypezh',
          label: '类型'
        },
        {
          prop: 'bangdingzh',
          label: '绑定状态'
        },
        {
          prop: 'azdzh',
          label: '安装位置'
        },
        {
          prop: 'xinghaoname',
          label: '设备型号'
        },
        {
          prop: 'regtime',
          label: '注册日期'
        },
        {
          prop: 'installtime',
          label: '安装时间'
        },
        {
          prop: 'strattime',
          label: '服务开始时间'
        },
        {
          prop: 'endtime',
          label: '服务到期时间'
        },
        {
          prop: 'fristnum',
          label: '首次开通服务时间'
        },
        {
          prop: 'alarmtime',
          label: '最近报警时间'
        },
        {
          prop: 'hearttime',
          label: '最近心跳时间'
        },
        // {
        //   prop: 'kcvaluezh',
        //   label: '库存状态'
        // },

        {
          prop: 'modezh',
          label: '模式'
        },

        {
          prop: 'onlinevaluezh',
          label: '在线状态'
        },

        {
          prop: 'swichvaluezh',
          label: '开关状态'
        },
        {
          prop: 'protectvaluezh',
          label: '布防状态'
        },
        {
          prop: 'dwaddress',
          label: '定位地址'
        }
        // {
        //   prop: 'sxtid',
        //   label: '摄像头'
        // },
        // {
        //   prop: 'sxtid',
        //   label: '最近事件时间'
        // },
        // {
        //   prop: 'sxtid',
        //   label: '责任人'
        // },
        // {
        //   prop: 'sxtid',
        //   label: '出货时间'
        // },
        // {
        //   prop: 'installtime',
        //   label: '首次安装时间'
        // },
        // {
        //   prop: 'sxtid',
        //   label: '其他责任人'
        // },
        // {
        //   prop: 'sxtid',
        //   label: '经纬度'
        // }

      ],
      radio1: '信号强度',
      // 事件表格
      tableQueryList: [
        {
          label: '事件名称',
          prop: 'IMEI',
          type: 'select',
          holder: '请选择事件',
          queryType: false
        }
      ],
      tableQuery: {},
      tableQueryDics: {},
      tableDialogData: [],
      tableDialogColums: [
        {
          label: '事件事件',
          prop: 'IMEI'
        },
        {
          label: '事件名称',
          prop: 'IMEI'
        },
        {
          label: '设备上报内容',
          prop: 'IMEI'
        }
      ],
      tableDisOperated: true,
      tableCurrentPage: 1,
      tableTotal: 1,
      tablePageSize: 20,
      tableDics: {},
      tableLoading: false,
      // 地图
      dialogMapVisible: false,
      // 购买弹窗
      buyTitle: '',
      buyVisible: false,
      buyDeviceid: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.deviceid = this.$route.query.deviceid
    // this.comcode = this.$route.query.comcode
    this.onSearch({})
    this.getDicsList()
  },
  mounted() {
  },
  methods: {
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    onSearch(query) {
      this.currentPage = 1
      this.pageSize = 20
      this.query = query
      this.getDataList()
    },
    getDicsList() {
      // const params = {
      //   names: '公司类型'
      // }
      // getDicsByName(params).then(res => {
      //   // console.log(res)
      //   const dics = res.Data
      //   dics.forEach(n => {
      //     n.value = n.dicvalue
      //     n.label = n.diczh
      //     switch (n.groupzh) {
      //       case '公司类型':
      //         this.dics.comtype.push(n)
      //         break
      //       default:
      //         break
      //     }
      //   })
      // })
    },
    getDataList() {
      const params = {
        deviceid: this.deviceid
        // PageIndex: this.currentPage,
        // PageSize: this.pageSize,
        // ...this.query
      }
      this.loading = true
      getEquiByid(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data
        console.log(data)
        this.ruleForm = data
        // TODO: 测试 设置地址 经纬度

        // this.$set(this.ruleForm, 'dwaddress', '四川省成都市武侯区益州大道中段1800号')
        // this.$set(this.ruleForm, 'latitude', '30.538572')
        // this.$set(this.ruleForm, 'longitude', '104.056046')
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },

    goBack() {
      this.$router.push('/Equipment/EquipmentLists')
    },
    showMap() {

    },
    // 购买
    goBuy(row) {
      this.buyVisible = true
      this.buyDeviceid = row.deviceid
      this.buyTitle = `设备${row.IMEI}购买产品`
    }
  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.content{
  padding: 20px;
  box-sizing: border-box;
  // height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.hearer-breadcrumb{
  padding-bottom: 15px;
  color: #666;
  font-size: 14px;

}
.card-form{
  ::v-deep .el-form-item {
    margin-bottom: 0px;
    .el-form-item__label{
      font-weight: 400;
    }
  }
}
.box-card{
  ::v-deep .el-card__header{
    padding: 14px 20px;
  }
}
.chart-warp{
  height: 320px;
  ::v-deep .el-card__body{
    height: calc(100% - 50px);
  }
}
// 资费
.zifei-warp{
  font-size: 14px;
  .zifei-title{
    color: #606266;
    margin-right: 15px;
  }
  .zifei-content{
    .zifei-content-item{
      margin-bottom: 5px;
    }
  }
  .num{
    font-size: 14px;
    color: #000;
  }
}
</style>
