<template lang="pug">
.avatar-uploader.upload
  .upload-warp()
    label(for='uploads')
      img.avatar(v-if='imgFile' :src='imgFile | filterImg' style='cursor: pointer')
      i.el-icon-plus.avatar-uploader-icon(v-else style='cursor: pointer')
    input(
      type="file"
      id="uploads"
      :value="imgValue"
      style="position:absolute; clip:rect(0 0 0 0);top: 0;right: 0;"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="uploadImg($event, 1)")
  //- 图片裁剪弹窗
  el-dialog.imgcut-dialog(
    :title='dialogImgcutTitle',
    :visible.sync='dialogImgcutVisible'
    width='800px'
    :append-to-body='true'
    top="5vh"
    :close-on-click-modal='false')
    .cropper-warp
      vueCropper(
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="false"
        :fixed="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixedBox="option.fixedBox"
        :centerBox="option.centerBox"
        @realTime="realTime"
        @imgLoad="imgLoad")
      span.dialog-footer(slot="footer")
    div.preview.layout-row
      div.mr_15
        .imageF(:style="previewStyle1")
          div(:style="previews.div")
            img(:src="previews.url" :style="previews.img")
      div.mr_15
        .imageC(:style="previewStyle1")
          div(:style="previews.div")
            img(:src="previews.url" :style="previews.img")
    div.operation
      label.btn.mr_10(for="uploads") 更换图片
      input(type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)")

      el-button(type="primary" icon="el-icon-refresh-right" circle @click="rotateRight")
      el-button(type="primary" icon="el-icon-refresh-left" circle @click="rotateLeft")

    div.footer
      el-button(@click="dialogImgcutVisible = false" size="small") 取消
      el-button(:loading="btnLoading" type="primary" @click="finish('blob')" size="small") 确 定

</template>
<script>
import { VueCropper } from 'vue-cropper'
import { uploadImage } from '@/api/commom'

export default {
  name: 'ImgCropper',
  components: {
    VueCropper
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
      btnLoading: false,
      imgValue: '',
      imgFile: '',
      dialogImgcutTitle: '图片裁剪',
      dialogImgcutVisible: false,
      previews: {},
      option: {
        img: '',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 280,
        autoCropHeight: 280,
        fixedBox: true,
        centerBox: true
      },
      fileName: '', // 本机文件地址
      previewStyle1: {}
    }
  },
  methods: {
    // 坐旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    // 选择本地图片
    // 上传图片（点击上传按钮）
    finish(type) {
      const _this = this
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          formData.append('file', data, this.fileName)
          this.btnLoading = true
          uploadImage(formData).then((res) => {
            _this.$message({ // element-ui的消息Message消息提示组件
              type: 'success',
              message: '上传成功'
            })
            const url = res.Data
            this.imgFile = url
            this.$emit('getUrl', url)
            this.btnLoading = false
            this.dialogImgcutVisible = false
          }).catch((err) => {
            this.btnLoading = false
            console.error(err)
          })
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    // 实时预览函数
    realTime(data) {
      var previews = data
      // eslint-disable-next-line no-unused-vars
      const h = 0.5
      // eslint-disable-next-line no-unused-vars
      const w = 0.2
      this.previewStyle1 = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        // margin: '0',
        zoom: (100 / previews.h)
      }
      this.previews = data
    },

    // 选择本地图片
    uploadImg(e, num) {
      var _this = this
      // 上传图片
      var file = e.target.files[0]
      _this.fileName = file.name
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
          _this.dialogImgcutVisible = true
        } else if (num === 2) {
          _this.example2.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    imgLoad(msg) {
    }

  }
}
</script>
<style lang="scss" scoped>
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

.imgcut-dialog{
  ::v-deep .el-dialog{
    .el-dialog__body{
      width: 100%;
      height: calc(95vh - 135px);
      min-height: 560px;
      padding: 10px 30px 30px;
      position: relative;
    }
  }
}
.cropper-warp{
  width: 450px;
  height: 450px;
}
.footer{
  text-align: right;
  padding-bottom: 10px;
}
.operation{
  padding: 10px 0;
}
.btn{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFFFFF;
  border: 1px solid #DCDFE6;
  border-color: #DCDFE6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: none;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 400;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;

  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  &:active {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
    outline: none;
  }
  &:focus, &:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
}
.preview{
  position: absolute;
  top: 10px;
  right: 30px;
  .imageF {
    border: 1px solid #999;
  }
  .imageC {
    border-radius: 140px;
    border: 1px solid #999;
  }
}
</style>
