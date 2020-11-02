<!--
 * @Author: your name
 * @Date: 2019-11-01 10:18:26
 * @LastEditTime: 2020-06-12 16:22:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-ui\src\views\pages\Info\Staffs\index.vue
 -->
<template lang="pug">
.dialog-form.default-input
  .form-warp(v-for="(item,index) in formItems" :class="[item.online?'online':'']")
    el-form-item(
      :key="index"
      :prop='item.prop'
      :label="item.label")
      el-select(
        v-if="item.type === 'select'"
        v-model="ruleForm[item.prop]"
        :placeholder="item.horder || ('请选择' + item.label)"
        size="small"
        :ref="item.prop"
        filterable
        @change="selectChange($event, item.prop)"
        :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
        el-option(
          v-for="list in dics[item.prop]"
          :key="list.value"
          :label="list.label"
          :value="list.value")
      el-date-picker(
        v-else-if="item.type === 'date'"
        v-model="ruleForm[item.prop]"
        type="date"
        :placeholder="item.horder || ('请选择' + item.label)"
        size="small"
        value-format="yyyy-MM-dd"
        :editable="false"
        :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")

      el-cascader(
        v-else-if="item.type === 'cascader'"
        :options='dics[item.prop]',
        :show-all-levels='false'
        v-model="ruleForm[item.prop]"
        size="small"
        filterable
        :placeholder="item.horder || ('请选择' + item.label)"
        :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
      el-input(
        v-else-if="item.type === 'textarea'"
        type='textarea'
        style="margin-bottom:4px"
        :autosize='{ minRows: 2, maxRows: 4}',
        :placeholder="item.horder || ('请输入' + item.label)"
        v-model='ruleForm[item.prop]'
        :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")
      div(v-else-if="item.type === 'img'")
        div(v-if='(dialogType==="view") || (dialogType === "update" && item.disUpdate)')
          img.avatar(
            v-if='ruleForm[item.prop]'
            :src='ruleForm[item.prop] | filterImg'
            style="margin:10px; cursor: pointer")
          span(v-else) -
        el-upload.avatar-uploader(
          v-else
          :action='action'
          :show-file-list='false'
          :on-success='(value)=> handleFileSuccess(item.prop, value)'
          :before-upload='beforeAvatarUpload')
          img.avatar(v-if='ruleForm[item.prop]' :src='ruleForm[item.prop] | filterImg')
          i.el-icon-plus.avatar-uploader-icon(v-else)

      el-upload.upload-demo(
        v-else-if='item.type === "upload"'
        :action="action"
        :on-success='(value)=> handleFileSuccess(item.prop, value)'
        :before-upload='beforeFileUpload'
        :limit='1')
        div(v-if='(dialogType==="view") || (dialogType === "update" && item.disUpdate)')
          el-button(v-if='ruleForm[item.prop]' size="small" type="primary" @click="download(ruleForm[item.prop])") 点击下载
          span(v-else) -
        div(v-else)
          el-button(size="small" type="primary") 点击上传
          span(slot="tip" style='font-size:12px')  {{item.tip || '只能上传一个文件'}}
      el-input(
        v-else
        v-model='ruleForm[item.prop]'
        size="small"
        :type="item.type?item.type:'text'"
        autocomplete = "new-password"
        :placeholder="item.horder || ('请输入' + item.label)"
        :disabled="dialogType==='view' || (dialogType === 'update' && item.disUpdate)")

</template>
<script >
import { mapGetters } from 'vuex'

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
    dialogType: {
      type: String,
      default: 'add'
    },
    ruleForm: {
      type: Object,
      default() {
        return {}
      }
    },
    formItems: {
      type: Array,
      default() {
        return []
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    dics: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    },
    ...mapGetters(['sysInfo', 'userInfo'])
  },
  created() {
  },
  mounted() {
  },
  methods: {
    /** *** 基本设置 start ******/
    // 上传成功
    handleFileSuccess(prop, res, file) {
      if (res.Status === 101) {
        this.$message.error(res.Msg)
      } else {
        const url = res.Data.url
        this.$set(this.ruleForm, prop, url)
        // this.$emit('onFileSuccess', prop, url)
      }
    },
    // 上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    beforeFileUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isLt2M
      // const fileExt = file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
      // const isZip = file.type === 'application/x-zip-compressed'
      // const iszip = file.type === 'application/zip'
      // const isRar = fileExt === '.rar'
      // if (!isZip && !iszip && !isRar) {
      //   this.$message.error('上传文件是必须是.zip或者.rar格式的压缩文件!')
      // }
      // return (isZip || iszip || isRar)
    },
    /** *** 按钮点击 start ******/

    /**
     * @description: 下拉框改变
     * @param {value} 下拉的value
     * @return:
     */
    selectChange(value, type) {
      this.$emit('onSelectChange', value, type)
    },

    /**
     * @description: 修改日期
     * @param {type} ''
     * @return: ''
     */
    onChange(val, name) {
      // this.$emit('onChange', name, val)
      this.ruleForm[name] = val
    },
    download(url) {
      let ur
      if (url.includes('http')) {
        ur = url
      } else {
        ur = process.env.VUE_APP_BASE_API + url
      }
      window.open(ur)
    }
    /** *** 接口调用 start ******/

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/

/** *** 基本设置 end ******/

.margin0{
  margin-bottom: 0px !important;
  width: 50%;
  ::v-deep .el-form-item__content{
    line-height: 30px;
  }
}
.approve{
  width: 100%;
  border: 1px solid #888;
  flex-wrap: wrap;
  ::v-deep .el-form-item__label{
    line-height: 30px;
  }
  margin-bottom: 15px;
}
.name{
  cursor: pointer;
  text-decoration: underline
}
.upload{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  text-align: center;
  outline: 0;
  &:hover{
    border-color: #409EFF;
  }
}
.avatar-uploader {
  cursor: pointer;
  ::v-deep .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover{
      border-color: #409EFF;
    }
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.pt10{
  padding-top: 10px;
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
.form-warp{
  width: 50%;

  ::v-deep .el-form-item{
    width: 100% !important;
    display: flex !important;
    .el-form-item__content{
      flex: 1 !important;
      margin-left: 0 !important;
      .el-input, .el-select, .el-cascader {
        width: 100% !important
      }
    }
  }
}
.online{
  width: 100% !important;
  ::v-deep .el-form-item{
    width: 100% !important;
  }
  ::v-deep .el-input{
    width: 100% !important
  }
}
.dialog-form{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.upload-demo{
  ::v-deep .el-upload-list__item{
    margin-top: 0
  }
}
</style>
