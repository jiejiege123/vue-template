<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2019-12-12 11:33:31
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.index.layout-column
  .header.layout-row__between
    .query
      el-input.input-search(placeholder='请输入关键字' v-model='search' size="small" clearable @clear="getDataList")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")
    .operate
      el-button(v-if="userInfo.UserType === 'Company'" type="primary" size="small" @click='showDialog') 添加

  .table-warp.flex1.layout-column
    el-table.flex1(
      v-loading="loading"
      :data='tableData'
      style='width: 100%'
      :header-cell-style='headerStyle'
      height="250"
      border
      fit
      ref="tableList"
      :cell-class-name="cellClassName"
      empty-text="没有数据")
      el-table-column(label="#" align="center" type="index" :index="indexMethod")
      el-table-column(v-if="userInfo.UserType === 'Admin'" label="企业名称" align="left" prop="comname" width="150px")
      el-table-column(
        v-for="(item,index) in tableColumn" :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        )
        template(slot-scope='scope')
          img(
            v-if="item.type==='img' && scope.row[item.prop]"
            :src="scope.row[item.prop]"
            style="width:40px;height:40px;cursor: pointer")
          span.name(v-if="item.prop === 'QF000Zh'" @click="viewRow(scope.row)") {{scope.row[item.prop]}}

          span(v-else) {{scope.row[item.prop]}}
      el-table-column(v-if="userInfo.UserType === 'Company'" label="操作" align="center" width="150")
        template(slot-scope='scope')
          el-button(
            type="primary"
            plain
            @click="updateRow(scope.row)"
            size="small") 编辑
          el-button(
            type="danger"
            plain
            @click="delRow(scope.row)"
            size="small") 删除
    //- //- 分页
    .pages
      el-pagination(
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total")
    //- 列表弹窗
    el-dialog.dialog-class.list-class(
      :title='dialogTitle',
      :visible.sync='dialogVisible'
      width='700px'
      append-to-body
      top="15vh"
      @open="open('ruleForm')"
      :before-close="handleClose"
      :close-on-click-modal='false')
      //- 充值数量
      el-form.demo-ruleForm(
        :model='ruleForm',
        ref='ruleForm',
        label-width='120px')
        .form-warp(v-for="(item,index) in formItems" :class="[item.online?'online':'']")
          el-form-item(
            :key="index"
            :prop='item.prop'
            :label="item.label"
            :class="[(dialogType==='view' || dialogType==='approve' || dialogType==='update')?'default-input':'']"
            :rules="item.rulers || [{ required: true }]")
            el-select(
              v-if="item.type === 'select'"
              v-model="ruleForm[item.prop]"
              placeholder="请选择"
              size="small"
              :ref="item.prop"
              @change="selectChange($event, item.prop)"
              :disabled="dialogType==='view' || dialogType==='approve'")
              el-option(
                v-for="list in item.option"
                :key="list.value"
                :label="list.label"
                :value="list.value")
            el-date-picker(
              v-else-if="item.type === 'date'"
              v-model="ruleForm[item.prop]"
              type="date"
              :placeholder='item.horder || "选择日期"'
              size="small"
              value-format="yyyy-MM-dd"
              :editable="false"
              :disabled="dialogType==='view' || dialogType==='approve'")
            long-date-picker(
              v-else-if="item.type === 'longDate'"
              :valueTime="ruleForm[item.prop]"
              :placeholder='item.horder || "选择日期"'
              @onChange="onChange($event, item.prop, 'add')"
              :editable="false"
              :disabled="dialogType==='view' || dialogType==='approve'")
            el-cascader(
              v-else-if="item.type === 'cascader'"
              :options='dics[item.prop]',
              :show-all-levels='false'
              v-model="ruleForm[item.prop]"
              size="small"
              filterable
              :disabled="dialogType==='view' || dialogType==='approve'")
            el-radio-group(
              v-else-if="item.type === 'radio'"
              v-model='ruleForm[item.prop]')
              el-radio(
                v-for="(list,index) in item.option"
                :key="index"
                :label="list.value") {{list.label}}
            el-input(
              v-else
              v-model='ruleForm[item.prop]'
              size="small"
              :type="item.type?item.type:'text'"
              autocomplete = "new-password"
              :placeholder='item.horder || "请输入"'
              :disabled="dialogType==='view' || dialogType==='approve'")
        el-form-item.pt10(
          v-if="ruleForm.QF007 === 1"
          label='认定书'
          :rules="dialogType==='add' || dialogType === 'update' ?[{required: true}]:[]"
          prop="QF006")
          img.avatar(
            v-if='ruleForm.QF006 && dialogType==="view" || dialogType==="approve"'
            :src='ruleForm.QF006 | filterImg'
            style="margin:10px; cursor: pointer")
          el-upload.avatar-uploader(
            v-else
            :action='action'
            :show-file-list='false'
            :on-success='handleQF006Success'
            :before-upload='beforeAvatarUpload')
            img.avatar(v-if='ruleForm.QF006' :src='ruleForm.QF006 | filterImg')
            i.el-icon-plus.avatar-uploader-icon(v-else)
        el-form-item.dia-footer()
          el-button(type='primary', @click="kpiao('ruleForm')" size="small") 提交
          el-button(@click="closeDialog" size="small") 取消

</template>

<script >
import {
  getInvoiceList,
  addInvoice,
  delInvoice,
  editInvoice
} from '@/api/rmb'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'

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
  data() {
    var check18 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('税务号不能为空'))
      } else {
        if (value.length !== 18) {
          this.$message.error('请输入18位数税务号')
          callback(new Error('请输入18位数税务号'))
        } else {
          callback()
        }
      }
    }
    return {
      search: '',
      dics: {},
      /** *** 表格 *** **/
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'QF000Zh',
          label: '发票类型'
        },
        {
          prop: 'QF001',
          label: '发票抬头'
        },
        {
          prop: 'QF002',
          label: '税务号'
        },
        {
          prop: 'QF007Zh',
          label: '税务类型'
        },
        {
          prop: 'timestamp',
          label: '时间'
        }

      ],
      total: 1,
      currentPage: 1,
      pageSize: 20,
      /** *** 弹窗 *** **/
      dialogTitle: '详情',
      dialogVisible: false,
      ruleForm: {
      },
      formItems: [
        {
          prop: 'QF000',
          label: '发票类型',
          type: 'select',
          option: [
            {
              label: '普通发票',
              value: 0
            },
            {
              label: '增值税专用发票',
              value: 1
            }
          ]
        },
        {
          prop: 'QF001',
          label: '发票抬头'
        },
        {
          prop: 'QF002',
          label: '税务号',
          horder: '请输入18位税务号',
          rulers: [{ validator: check18, required: true, trigger: 'blur' }]
        },
        {
          prop: 'QF007',
          label: '税务类型',
          type: 'select',
          option: [
            {
              label: '小规模',
              value: 0
            },
            {
              label: '一般纳税人',
              value: 1
            }
          ]
        },
        {
          prop: 'QF003',
          label: '开户行'
        },
        {
          prop: 'QF004',
          label: '开户行账号'
        },
        {
          prop: 'QF005',
          label: '开户行地址'
        }
        // {
        //   prop: 'QF006',
        //   label: '认定书',
        //   type: ''
        // }
      ],
      dialogType: 'view',
      kkjeHolder: '',
      viewerCase: '',
      tableLoading: false,
      /** *** 图片弹窗 *** **/
      imageTitle: '',
      imageVisible: false,
      imgUrl: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    action() {
      return `${process.env.VUE_APP_BASE_API}/Basic/UploadImage`
    }
  },
  created() {
    // this.getDataList()
    this.getDicsDataList()
  },
  mounted() {

  },
  methods: {
    /** *** 通用 start *** **/
    headerStyle() {
      return 'background-color: #FAFAFA;'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'stateZh') {
        switch (row.state) {
          case 0:
            // 未提交
            return 'approve-wait'
          default:
            return 'approve-ing'
        }
      }
    },
    indexMethod(index) {
      return (index + 1) + (this.currentPage - 1) * this.pageSize
    },
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    doSearch() {
      this.currentPage = 1
      this.pageSize = 20
      this.getDataList()
    },
    handleClose(done) {
      done()
    },
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    closeDialog() {
      this.dialogVisible = false
    },
    handleQF006Success(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      const url = res.Data.url
      this.$set(this.ruleForm, 'QF006', url)
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
    /** *** 通用 end *** **/

    /** *** 按钮操作 start *** **/
    /**
     * @description: 显示弹出
     * @param {type}
     * @return:
     */
    showDialog() {
      this.dialogTitle = '添加'
      this.dialogType = 'add'
      this.dialogVisible = true
      this.ruleForm = {}
      // this.ruleForm.kptype = 0
    },
    updateRow(row) {
      this.dialogTitle = '编辑'
      this.dialogType = 'update'
      this.dialogVisible = true
      this.ruleForm = Object.assign({}, row)
    },
    delRow(row) {
      this.dialogType = 'del'
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delInvoice({ ID: row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDataList()
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: err + '删除失败'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        })
      })
    },
    /**
     * @description: '点击详情, 查看详情'
     * @param {type} ''
     * @return: ''
     */
    viewRow(row) {
      this.dialogTitle = '查看'
      this.dialogType = 'view'
      this.dialogVisible = true
      this.ruleForm = Object.assign({}, row)
    },
    /** *** 按钮操作 end *** **/

    /** *** 接口请求 start *** **/
    /**
     * @description: 获取列表数据
     * @param {type}
     * @return:
     */
    getDataList() {
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.search
      }
      this.loading = true
      getInvoiceList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        setTimeout(() => {
          this.$refs.tableList.doLayout()
        }, 200)
        const tableData = res.Data.Models
        tableData.forEach(n => {
          n.timestamp = parseTime(n.timestamp)
          switch (n.QF000) {
            case 0:
              n.QF000Zh = '普通发票'
              break
            case 1:
              n.QF000Zh = '增值税专用发票'
              break
            default:
              break
          }
          switch (n.QF007) {
            case 0:
              n.QF007Zh = '小规模'
              break
            case 1:
              n.QF007Zh = '一般纳税人'
              break
            default:
              break
          }
        })
        this.tableData = tableData
        this.total = res.Data.TotalCount
      }).catch((err) => {
        console.error(err)
        this.loading = false
      })
    },
    /**
     * @description: 获取字典值
     * @param {type}
     * @return:
     */
    getDicsDataList() {
      const data = ['爆破类型', '项目等级', '人员类型', '物资分类']
      // this.loading = true
      // this.$store.dispatch('dics/getDicData', data).then(res => {
      //   const dics = {}
      //   for (const key in res) {
      //     // eslint-disable-next-line no-prototype-builtins
      //     if (res.hasOwnProperty(key)) {
      //       const element = res[key]
      //       switch (key) {
      //         case '爆破类型':
      //           dics.bptype = element
      //           break
      //         case '项目等级':
      //           dics.QF0032 = element
      //           break
      //         case '人员类型':
      //           dics.UF002 = element
      //           break
      //         case '物资分类':
      //           dics.wzfl = element
      //           break
      //         default:
      //           break
      //       }
      //     }
      //   }
      //   this.dics = dics
      //   this.getDataList()
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    kpiao(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let method
          switch (this.dialogType) {
            case 'add':
              method = addInvoice
              break
            case 'update':
              method = editInvoice
              break
            case 'del':
              method = delInvoice
              break
            default:
              break
          }
          method(this.ruleForm).then(res => {
            this.dialogType === 'add' ? this.$message.success('开票信息添加成功') : this.$message.success('开票信息编辑成功')
            this.closeDialog()
            this.getDataList()
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    }
    /** *** 获取数据 end *** **/

    /** *** 其他 start *** **/

  }
}
</script>
<style lang="scss" scoped>
/***** 基本设置 start ******/
.index{
  padding: 10px 10px;
  height: calc(100vh - 90px);
}
.header{
  margin: 10px 0 15px;
  .query{
    .input-search{
      width: 200px;
    }
  }
}
.pages{
  margin-top: 20px;
}
/** *** 基本设置 end ******/
.dialog-class{
  ::v-deep .el-dialog{
    // min-width: 720px;
    .el-form-item__error{
      display: none
    }
  }
  ::v-deep .el-dialog__body{
    height: calc(100vh - 240px);
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
.inbtn{
  padding: 5px 8px
}
.list-class{
  ::v-deep .el-dialog__body{
    // padding-top: 15px;
  }
}
.ullist{
  position: absolute;
  z-index: 999;
  background: rgb(48, 65, 86);
  top: 35px;
  list-style:none;
  width: 150px;
  padding: 5px 0;
  color: #f4f4f5;
  li{
    padding: 5px 15px;
    cursor: pointer;
    &:hover{
      background:#1f2d3d;
      color: rgb(64, 158, 255)
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
.demo-ruleForm{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap
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
.name{
  cursor: pointer;
  text-decoration: underline
}
</style>
