<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-12-14 19:01:24
 * @LastEditors: zzz
 -->
<template lang="pug">
.index.layout-column
  .header.layout-row__between
    .query
      el-input.input-search(placeholder='请输入关键字' v-model='search' size="small" clearable @clear="getDataList")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")
    .operate
      el-button(v-has="'Expresslist01'" type="primary" size="small" @click='showDialog') 添加

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
      el-table-column(label="企业名称" align="left" prop="comname" width="150px")
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
          span.name(v-if="item.prop === 'lxr'" @click="viewRow(scope.row)") {{scope.row[item.prop]}}

          span(v-else) {{scope.row[item.prop]}}
      el-table-column(label="操作" align="center" width="150")
        template(slot-scope='scope')
          el-button(
            v-has="'Expresslist01'"
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
      width='450px'
      append-to-body
      top="15vh"
      @open="open('ruleForm')"
      :before-close="handleClose"
      :close-on-click-modal='false')
      //- 充值数量
      el-form(
        :model='ruleForm',
        ref='ruleForm',
        :rules="rules"
        label-width='120px')
        .form-warp(v-for="(item,index) in formItems" :class="[item.online?'online':'']")
          el-form-item(
            :key="index"
            :prop='item.prop'
            :label="item.label"
            :class="[(dialogType==='view' || dialogType==='approve' || dialogType==='update')?'default-input':'']"
            )
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
              v-else-if="item.type === 'textarea'"
              type='textarea',
              :autosize='{ minRows: 2, maxRows: 4}',
              placeholder='请输入内容',
              v-model='ruleForm[item.prop]'
              :disabled="dialogType==='view' || dialogType==='approve'")

            el-input(
              v-else
              v-model='ruleForm[item.prop]'
              size="small"
              :type="item.type?item.type:'text'"
              autocomplete = "new-password"
              :placeholder='item.horder || "请输入"'
              :disabled="dialogType==='view' || dialogType==='approve'")
        el-form-item.dia-footer(v-if="dialogType !== 'view'")
          el-button(type='primary', @click="kpiao('ruleForm')" size="small") 提交
          el-button(@click="closeDialog" size="small") 取消
    //- 图片弹窗

</template>

<script >
import {
  getExpressList,
  addExpress,
  delExpress,
  editExpress
} from '@/api/rmb'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/index'
import { checkPhone } from '@/utils/index'
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
    var isPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('电话不能为空'))
      } else {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的电话号码'))
          this.$message.error('请输入正确的电话号码')
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
          prop: 'lxr',
          label: '联系人'
        },
        {
          prop: 'lxrtel',
          label: '联系电话'
        },
        {
          prop: 'lxaddress',
          label: '邮寄地址'
        },
        {
          prop: 'QF004',
          label: '邮寄说明'
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
      dialogTitle: '添加',
      dialogVisible: false,
      ruleForm: {
      },
      formItems: [
        {
          prop: 'lxr',
          label: '联系人',
          validator: true
        },
        {
          prop: 'lxrtel',
          label: '联系电话',
          validator: true
        },
        {
          prop: 'lxaddress',
          label: '邮寄地址',
          validator: true
        },
        {
          prop: 'QF004',
          label: '邮寄说明',
          type: 'textarea'
        }
      ],
      rules: {
        lxr: [{ required: true, trigger: 'blur' }],
        lxrtel: [{ validator: isPhone, required: true, trigger: 'blur' }],
        lxaddress: [{ required: true, trigger: 'blur' }],
        QF004: [{ required: false }]
      },
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
    this.getDataList()
    // this.getDicsDataList()
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
        delExpress({ ID: row.id }).then(res => {
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
      this.dialogTitle = '详情'
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
      getExpressList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })

        setTimeout(() => {
          this.$refs.tableList.doLayout()
        }, 200)
        const tableData = res.Data.Models
        tableData.forEach(n => {
          n.timestamp = parseTime(n.timestamp)
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
              method = addExpress
              break
            case 'update':
              method = editExpress
              break
            case 'del':
              method = delExpress
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
    padding-right: 20px;
    .el-form-item__error{
      display: none
    }
  }
  ::v-deep .el-dialog__body{
    // height: calc(100vh - 240px);
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
  // width: 50%;
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
