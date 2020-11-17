<template lang="pug">
el-dialog.dialog-class.list-class.default-input(
  :title='dialogTitle',
  :visible='dialogVisible'
  width='70%'
  min-width="1000px"
  append-to-body
  @close="closeDialog"
  top="5vh"
  @open="open"
  :close-on-click-modal='false')
  div.layout-row.align-center.mb_10(v-if="dialogType!=='view'")
    .help-title.layout-row.align-center
      label(style="width:40px") 标题
      el-input(
        style="width: 300px"
        v-model="ruleForm.megtitle"
        @blur="validatedTitle"
        :disabled="dialogType!=='add'")
    .help-tel.layout-row.align-center.ml_20
      label(style="width:70px") 文章类型
      el-select(
        :disabled="dialogType!=='add'"
        v-model="ruleForm.megtype"
        placeholder="请选择消息类型"
        filterable)
        el-option(
          v-for="(list, index) in megtype"
          :key="index"
          @blur="validatedMegtype"
          :label="list.label"
          :value="list.value")
  //- 富文本编辑
  .bj(v-if="dialogType!=='view'")
    tinymce(v-model="ruleForm.megbody" ref="tinymce" :height="350" :open="dialogVisible" :isEdite="dialogType==='view'")
  el-card.card-warp(v-else style="width: 840px;margin:0 auto; overflow-y: auto;")
    div.body-content
      .title.text-center
        span {{ruleForm.megtitle}}
      .time.text-center
        span {{ruleForm.addtime}}
      el-divider
      .bht(v-html="$options.filters.bodyFilter(ruleForm.megbody)")
  //- .help-tel.layout-row.align-center
  //-   label(style="width:70px") 联系方式
  //-   el-input(v-model="ruleForm.tel" size="small" @blur="validatedPhone" :disabled="dialogType!=='add'")
  //- .help-tel.layout-row.align-center(v-if="userInfo.UserType === 'Admin' || (dialogType!=='add' && ruleForm.isdo === '已处理')")
  //-   label(style="width:70px") 处理意见
  //-   el-input(
  //-     v-if="dialogType === 'update'"
  //-     type="textarea"
  //-     :autosize="{ minRows: 3, maxRows: 4}"
  //-     placeholder="请输入内容"
  //-     v-model="ruleForm.dobody")
  //-   span.yijian(v-else) {{ruleForm.dobody}}
  .caozuo.mt_10(style='text-align:right' v-if="dialogType!=='view'")
    el-button(type='primary', @click="submitForm" size="small") 提交
    el-button(@click="closeDialog" size="small") 取消

</template>

<script >

import Tinymce from '@/components/Tinymce'

export default {
  name: 'RichDialog',
  components: {
    Tinymce
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
    },
    bodyFilter: (val) => {
      if (val) {
        return val.replace(/src="Uploads/g, `src="${process.env.VUE_APP_BASE_API}/Uploads/`)
      } else {
        return val
      }
    }
  },
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogType: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    megtype: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      ruleForm: {}
    }
  },
  watch: {
    form(newVal, old) {
      this.ruleForm = newVal
    }
  },
  created() {
  },
  mounted() {

  },
  methods: {
    closeDialog() {
      if (this.dialogType === 'add') {
        this.ruleForm.dobody = ''
      }
      // this.dialogVisible = false
      this.$emit('onCloseDialog')
    },
    open() {
      console.log(this.dialogType)
      if (this.dialogType === 'add') {
        setTimeout(() => {
          this.$refs.tinymce.setContent('')
        }, 500)
      }
    },
    validatedTitle() {
      if (!this.ruleForm.megtitle) {
        this.$message.error('请输入标题')
        return false
      } else {
        return true
      }
    },
    validatedMegtype() {
      if (!this.ruleForm.megtype && this.ruleForm.megtype !== 0) {
        this.$message.error('请输入选择消息类型')
        return false
      } else {
        return true
      }
    },
    submitForm() {
      const title = this.validatedTitle()
      const megtype = this.validatedMegtype()
      this.ruleForm.megtypezh = this.megtype.find(n => n.value === this.ruleForm.megtype).label
      if (title && megtype) {
        this.$emit('onSubmitForm', this.ruleForm)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-class{
  ::v-deep .el-dialog{
    .el-form-item__error{
      display: none
    }
  }
  ::v-deep .el-dialog__body{
    height: calc(100vh - 110px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .plhj-table{
      flex: 1
    }
  }
  .dia-footer{
    width: 100% !important;
    text-align: right;
    ::v-deep .el-form-item__content{
    text-align: right
    }
  }
}

.list-class{
  ::v-deep .el-dialog__body{
    padding-top: 15px;
  }
}
.default-input{
  ::v-deep .is-disabled{
    .el-input__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
    .el-textarea__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
  }
}

.default-input{
  ::v-deep .is-disabled{
    .el-input__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
    .el-textarea__inner{
      background-color: #fff;
      border-color: #e4e7ed;
      color: #606266;
    }
  }
}
.bht{
  ::v-deep .wscnph{
    width: 100%;
  }
}
.yijian{
  // display: block;
  // resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  background-image: none;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}
.body-content{
  padding: 20px 40px;
  .title{
    font-size: 20px;
    font-weight: bold;
    line-height: 56px;
  }
  .time{
    line-height: 40px;
    text-align: center;
    color: #888;
  }
  .text-center{
    text-align: center;
  }
}
.card-warp{
  &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
}
</style>
