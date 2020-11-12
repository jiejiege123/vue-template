<!--
 * @Author: your name
 * @Date: 2020-11-03 15:12:58
 * @LastEditTime: 2020-11-12 09:23:13
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\components\EditTableForm\index.vue
-->
<template lang="pug">
  el-dialog.add-dialog(
    title='一键布防',
    width="700px"
    :visible.sync='dialogVisible'
    :dialogLoading="dialogLoading"
    @open="open('ruleForm')"
    :close-on-click-modal="false"
    :append-to-body="true")
    div.bufang-content
      div.title 1、一键布防将对该建筑物下所有安装点进行布防，确认后将重置建筑物下所有安装点布防状态。
      div.title 2、请在下方设置布防时间段，设置后将对以下时间段进行布防，不设置区间则为全天布防。（时间请勿交叉重复）
      div.title 3、设置后布防生效时间段请在安装点管理查看。
      div.mb_10(v-for="(item,index) in TimeRanges" :key="index")
        el-time-picker(
          is-range
          v-model="item.time"
          :picker-options="pickerOptions"
          value-format="HH:mm"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围")
        el-button.ml_10(type="danger" icon="el-icon-delete" circle @click="delPicker(index)")
      div
        el-button(type="text" @click="addTimePicker")
          i.el-icon-plus
          span 新增定时布防时段
    .dia-footer()
      el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
</template>
<script>

export default {
  name: 'ArmedDialog',
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
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions: {
        format: 'HH:mm'
      },
      TimeRanges: []
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
  },
  methods: {
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    addTimePicker() {
      this.TimeRanges.push({})
    },
    delPicker(index) {
      this.TimeRanges.splice(index, 1)
    },
    submitForm() {
      const TimeRanges = []
      this.TimeRanges.forEach(n => {
        TimeRanges.push({
          StartTime: n.time[0],
          EndTime: n.time[1]
        })
      })
      this.$emit('onArmed', TimeRanges)
    }
  }
}
</script>
<style lang="scss" scoped>
.bufang-content{
  margin: 0 auto;
  width: 600px;
  .title{
    min-height: 30px;
    line-height: 26px;
    color: #e73a03;
  }
}
.add-dialog{
  ::v-deep .el-dialog__body{
    padding-top: 10px;
  }
}
.dia-footer{
  text-align: right;
}

</style>
