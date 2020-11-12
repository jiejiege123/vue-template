<!--
 * @Author: your name
 * @Date: 2020-11-03 15:12:58
 * @LastEditTime: 2020-11-11 14:28:23
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\components\EditTableForm\index.vue
-->
<template lang="pug">
  .table-warp.flex1.layout-column(v-loading="loading")
    .operate(v-if="hasOutOperat")
      el-button(
        v-if="showAdd"
        v-has="has01"
        type="primary"
        size="small"
        @click='addRow') 新增
      el-button(
        plain
        v-if="showBatchDel"
        v-has="has02"
        type="danger"
        size="small"
        :disabled="batchDelDisAble"
        :deleted="deleted") 删除
      slot(name="outOperate")

    el-table.flex1(
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      ref="reftable"
      default-expand-all
      row-key="comid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :cell-class-name="cellClassName"
      @row-click="rowClick"
      @selection-change="selectionChange"
      empty-text="没有数据")
      el-table-column(
        v-if="showSelection"
        type="selection"
        align="center"
        width="55")
      el-table-column(v-if="showIndex" label="#" align="center" type="index")
      slot(name="columnHead")
      el-table-column(
        v-for="(item,index) in tableColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :min-width="item.minWidth"
        :width="item.width")
        template(slot-scope='scope')
          span(v-if="item.prop==='file'") {{}}
            a(:href="scope.row.xxx | filterfile") 下载
          el-image(
            v-else-if="item.type==='img'"
            :src="scope.row[item.prop] | filterImg"
            :preview-src-list="[scope.row[item.prop] | filterImg]"
            style="width:40px;height:40px;cursor: pointer")
          span(v-else-if="item.filter") {{dics[item.prop].find(n => n.value === scope.row[item.prop]) ? dics[item.prop].find(n => n.value === scope.row[item.prop]).label : scope.row[item.prop]}}
          slot(v-else-if="item.slot" :name="item.prop" :row="scope.row")

          span(v-else) {{scope.row[item.prop]}}
      slot(name="columnFoot")
      el-table-column(label="操作" align="center" :width="operateWidth" fixed="right" v-if="!disOperated")
        template(slot-scope='scope')
          slot(name="operation" :row="scope.row")
          el-button(
            v-if="showView"
            type="primary"
            plain
            @click.stop="viewRow(scope.row)"
            size="small") 查看
          el-button(
            v-if="showEdit"
            type="success"
            v-has="has03"
            plain
            @click.stop="editRow(scope.row)"
            size="small") 编辑
          el-button(
            v-if="showDel"
            v-has="has02"
            :disabled="scope.row.delDisabled"
            plain
            type="danger"
            @click.stop="deleted(scope.row)"
            size="small") 删除
    .pages(v-if="hasPages")
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
    //- 弹窗
    el-dialog.add-dialog(
      :title='title',
      :visible.sync='visible'
      :width='dialogWidth'
      top="10vh"
      @open="open('ruleForm')"
      :close-on-click-modal="false"
      :append-to-body="true")
      el-form.default-input(
        v-loading="formLoading"
        :model='ruleForm'
        :class="{'inline': inline}"
        ref='ruleForm'
        :disabled="dialogType === 'view'"
        :rules="formRules"
        :label-width='labelWidth')
        div(
          v-for="(item,index) in formColumns"
          :class="{'wd50': inline, 'online': item.online}"
          :key="index")
          el-form-item(
            v-if="item.type==='password'"
            :prop='item.prop'
            :label="item.label")
            div.width100(:style="formStyle")
              el-input(
                :key='passwordType'
                autocomplete="new-password"
                ref='password'
                v-model='ruleForm[item.prop]'
                :type='passwordType'
                :placeholder="item.holder"
                name='password'
                tabindex='2')
              span.show-pwd(@click='showPwd')
                svg-icon(:icon-class="passwordType === 'password' ? 'eye' : 'eye-open'")
              el-button(v-if="1 === 2" type='success', @click="createdPwd" size="small" style='margin-left:15px') 随机生成

          el-form-item(
            v-else
            :prop='item.prop'
            :label="item.label")
            el-select(
              v-if="item.type === 'select'"
              v-model="ruleForm[item.prop]"
              :placeholder="item.holder"
              :style="formStyle"
              filterable
              :multiple="item.multiple"
              :ref="item.prop"
              @focus="selectFocus($event, item.prop)"
              )
              el-option(
                v-for="(list, index) in dics[item.prop]"
                :key="index"
                :label="list.label"
                :value="list.value")
            el-date-picker(
              v-else-if="item.type === 'date'"
              v-model="ruleForm[item.prop]"
              value-format="yyyy-MM-dd"
              type="date"
              :style="formStyle"
              :placeholder="item.holder"
              )
            el-date-picker(
              v-else-if="item.type === 'datetime'"
              v-model="ruleForm[item.prop]"
              type="datetime"
              :style="formStyle"
              value-format="yyyy-MM-dd HH:mm:ss"
              :placeholder="item.holder"
              )
            el-cascader(
              v-else-if="item.type === 'cascader'"
              :options='dics[item.prop]',
              :show-all-levels='item.showAllLevels'
              :props="item.props"
              v-model="ruleForm[item.prop]"

              :placeholder="item.holder"
              :style="formStyle"
              filterable)
            el-input(
              v-else-if="item.type==='textarea'"
              type='textarea',
              :placeholder="item.holder"
              :style="[formStyle, item.formStyle]"
              :autosize='{ minRows: 2, maxRows: 4}'
              v-model='ruleForm[item.prop]')
            div(v-else-if="item.type === 'img'")
              img.avatar(
                v-if='ruleForm[item.prop] && (dialogType==="view")'
                :src='ruleForm[item.prop] | filterImg'
                style="margin:10px; cursor: pointer")
              el-upload.avatar-uploader(
                v-else-if='!ruleForm[item.prop] && (dialogType==="view")')
                i.el-icon-picture-outline.avatar-uploader-icon
              el-upload.avatar-uploader(
                v-else
                :action='action'
                :headers="headers"
                :show-file-list='false'
                :on-success='(value)=> handleFileSuccess(item.prop, value)'
                :before-upload='beforeAvatarUpload')
                img.avatar(v-if='ruleForm[item.prop]' :src='ruleForm[item.prop] | filterImg')
                i.el-icon-plus.avatar-uploader-icon(v-else)
            el-upload.upload-demo(
              v-else-if='item.type === "upload"'
              :action="action"
              :headers="headers"
              :on-success='(value)=> handleFileSuccess(item.prop, value)'
              :before-upload='beforeFileUpload'
              :limit='1')
              el-button(size="small" type="primary") 点击上传
              span(slot="tip" style='font-size:12px')  只能上传一个文件
            ImgCropper(v-else-if="item.type === 'imgCut'" @getUrl="getImgCutUrl($event, item.prop)")
            el-input(
              :style="[formStyle, item.formStyle]"
              v-else-if="item.type === 'map'"
              v-model='ruleForm[item.prop]'
              placeholder='请输入'
              :disabled="true")
              el-button(slot="append" icon="el-icon-map-location" type="primary" size="small" @click="inputFocus")
            el-input-number(
              v-else-if="item.type === 'number'"
              v-model='ruleForm[item.prop]'
              :style="[formStyle, item.formStyle]"
              :oninput="item.inputFilter"
              :placeholder="item.holder"
              controls-position="right"
              :min="1" :max="300"
              )
            el-input(
              v-else
              v-model='ruleForm[item.prop]'
              :style="[formStyle, item.formStyle]"
              :oninput="item.inputFilter"
              :placeholder="item.holder"
              )
        el-form-item.dia-footer(v-if="dialogType !== 'view'")
          el-button(@click="closeDialog" size="small") 取消
          el-button(type='primary', @click="submitForm('ruleForm')" size="small") 提交
    //- 地图弹窗
    MapDialog(
      v-if="hasMap"
      dialogTitle="地图"
      :hasQuery="dialogType !== 'view'"
      :showLnglat="true"
      :dialogMapVisible="dialogMapVisible"
      :longitude="longitude"
      :latitude="latitude"
      :address="address"
      @onSure="mapSure"
      @closeDialog="dialogMapVisible = false"
    )
</template>
<script>
import { randomPassword } from '@/utils'
import { getToken } from '@/utils/auth'
import ImgCropper from '@/components/ImgCropper'
import MapDialog from '@/components/MapDialog'

export default {
  name: 'EditTableForm',
  components: {
    ImgCropper,
    MapDialog
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
    filterfile: (val) => {
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
    hasOutOperat: {
      type: Boolean,
      default: true
    },
    // 表格
    loading: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    cellClassName: {
      type: Function,
      default() {
        return function() {}
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    operateWidth: {
      type: String,
      default: '180px'
    },
    disOperated: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showBatchDel: {
      type: Boolean,
      default: true
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showView: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showDel: {
      type: Boolean,
      default: true
    },
    has01: {
      type: String,
      default: ''
    },
    has02: {
      type: String,
      default: ''
    },
    has03: {
      type: String,
      default: ''
    },
    // 分页
    hasPages: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 20
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    // 弹窗
    dialogWidth: {
      type: String,
      default: '550px'
    },
    inline: {
      type: Boolean,
      default: false
    },
    formRules: {
      type: Object,
      default() {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    dics: {
      type: Object,
      default() {
        return {}
      }
    },
    formStyle: {
      type: Object,
      default() {
        return {
          width: '280px'
        }
      }
    },
    formLoading: {
      type: Boolean,
      default: false
    },
    hasMap: {
      type: Boolean,
      default: false
    },
    hasQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columnsSub: this.columns,
      batchDelDisAble: true,
      title: '',
      visible: false,
      ruleForm: {

      },
      dialogType: 'add',
      passwordType: 'password',
      test: 'value=value.replace(/[^\\d.]/g,"")',
      longitude: 0,
      latitude: 0,
      address: '',
      dialogMapVisible: false
    }
  },
  computed: {
    tableColumns() {
      return this.columnsSub.filter(n => !n.formOnly)
    },
    formColumns() {
      if (this.dialogType === 'update') {
        return this.columnsSub.filter(n => n.editAble === true)
      } else if (this.dialogType === 'add') {
        return this.columnsSub.filter(n => !n.tableOnly && !n.addDisable)
      } else {
        return this.columnsSub.filter(n => !n.tableOnly)
      }
    },
    action() {
      return `${process.env.VUE_APP_BASE_API}/api/common/photo/upload/single`
    },
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  watch: {
    tableData() {
      this.$refs.reftable.doLayout()
    }
  },
  created() {
  },
  methods: {
    // 表格
    headerStyle() {
      // #fafafa
      return 'background-color: rgb(244, 248, 251); color: rgba(0,0,0,.85); font-weight: 500'
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    selectionChange(rows) {
      if (rows.length > 0) {
        this.batchDelDisAble = false
      } else {
        this.batchDelDisAble = true
      }
      this.$emit('onSelectChange', rows)
    },
    rowClick(row) {
      this.$refs.reftable.toggleRowSelection(row)
    },
    // 分页
    handleCurrentChange(e) {
      this.$emit('onHandleCurrentChange', e)
    },
    handleSizeChange(e) {
      this.$emit('onHandleSizeChange', e)
    },
    // 弹窗
    open(ruleForm) {
      this.$nextTick(() => {
        if (this.$refs[ruleForm]) {
          this.$refs[ruleForm].clearValidate()
        }
      })
    },
    closeDialog() {
      this.ruleForm = {}
      this.visible = false
    },
    // 上传成功
    handleFileSuccess(prop, res, file) {
      if (res.Status === 200) {
        const url = res.Data
        this.$set(this.ruleForm, prop, url)
      } else {
        this.$message.error(res.Msg)
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
      // const fileExt = file.name.substr(file.name.lastIndexOf('.')).toLowerCase()
      // const isZip = file.type === 'application/x-zip-compressed'
      // const iszip = file.type === 'application/zip'
      // const isRar = fileExt === '.rar'
      // if (!isZip && !iszip && !isRar) {
      //   this.$message.error('上传文件是必须是.zip或者.rar格式的压缩文件!')
      // }
      // return (isZip || iszip || isRar)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    /**
     * @description: 生成随机密码
     * @param {type}
     */
    createdPwd() {
      const password = randomPassword(6)
      this.$set(this.ruleForm, 'Password', password)
    },
    // 弹窗状态
    addRow() {
      this.visible = true
      const ruleForm = {}
      this.formColumns.map(n => {
        ruleForm[n.prop] = n.default || ''
      })
      this.ruleForm = Object.assign({}, ruleForm)
      this.title = '添加'
      this.dialogType = 'add'
    },
    viewRow(row) {
      this.ruleForm = Object.assign({}, row)
      this.visible = true
      this.title = '详情'
      this.dialogType = 'view'
    },
    editRow(row) {
      // if (this.checkIf.findIndex(n => n === row.id) >= 0) {
      //   this.columnsSub = this.checkColums
      // } else {
      //   this.columnsSub = this.columns
      // }
      // this.columnsSub = this.columns.filter(n => n.editAble === true)
      this.ruleForm = Object.assign({}, row)
      this.visible = true
      this.title = '编辑'
      this.dialogType = 'update'
    },
    // 提交
    deleted(row) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('onDeleted', row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('onSubmitForm', this.ruleForm, this.dialogType, (ok) => {
            if (ok) {
              this.visible = false
            } else { return }
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    getImgCutUrl(url, prop) {
      this.$set(this.ruleForm, prop, url)
    },
    selectFocus(e, prop) {
      const cb = () => {
        this.$refs.PermissionIds[0].blur()
      }
      this.$emit('selectFocus', prop, this.ruleForm, cb)
    },
    // 权限专用
    setPermissionIds(ids) {
      this.$set(this.ruleForm, 'PermissionIds', ids)
    },
    // 地图专用
    inputFocus() {
      this.longitude = parseFloat(this.ruleForm.longitude) || 0
      this.latitude = parseFloat(this.ruleForm.latitude) || 0
      this.address = this.ruleForm.address
      this.dialogMapVisible = true
    },
    mapSure(address, longitude, latitude) {
      this.dialogMapVisible = false
      console.log(address, longitude, latitude)
      this.$set(this.ruleForm, 'jwzaddress', address)
      this.$set(this.ruleForm, 'longitude', longitude)
      this.$set(this.ruleForm, 'latitude', latitude)
    }
  }
}
</script>
<style lang="scss" scoped>
.operate{
  border: 1px solid #dfe6ec;
  border-bottom: none;
  text-align: right;
  padding: 10px 0;
  padding-right: 10px;
  text-align: right;
}
.pages{
  margin-top: 10px;
}
// 表单
.show-pwd {
  position: absolute;
  // left: 170px;
  right: 50px;
  top: 0px;
  font-size: 16px;
  color: #C0C4CC;
  cursor: pointer;
  user-select: none;
}
.inline{
  display: flex;
  flex-wrap: wrap;
}
.wd50{
  width: 50%;
}
.online{
  width: 100%;
}
.line{
  width: 100% !important
}
.upload-demo{
  ::v-deep .el-upload-list__item{
    margin-top: 0
  }
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
.dia-footer{
  position: relative;
  text-align: right;
  width: 100%;
  padding-right: 20px;
}
.add-dialog{
  ::v-deep .el-dialog__body{
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding-top: 10px;
  }
}
.default-input{
  ::v-deep .is-disabled {
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
</style>
