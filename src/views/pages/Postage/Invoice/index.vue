<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-03-30 10:07:02
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.index.layout-column
  .header.layout-row__between
    .query
      el-input.input-search(placeholder='请输入关键字' v-model='search' size="small" clearable @clear="getDataList")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")
    .operate
      el-button(type="primary" size="small" @click='showDialog') 开票

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
          span(v-else) {{scope.row[item.prop]}}
      el-table-column(label="操作" align="center" width="120")
        template(slot-scope='scope')
          el-button(type="success" plain size="small" @click="showDialog(scope.row)") 明细
          //- el-button(type="success" plain size="small" @click="kpiao(scope.row)") 开票
    //- 分页
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
      width='800px'
      append-to-body
      top="5vh"
      @open="open('ruleForm')"
      :before-close="handleClose"
      :close-on-click-modal='false')
      div(v-if="kpnumAll === '0' && dialogType !== 'view'")
        h2(style="text-align:center") 当前没有可开票额
      //- 充值数量
      el-form.demo-ruleForm(
        v-else
        :model='ruleForm',
        ref='ruleForm',
        v-loading="formLoading"
        label-width='110px')
        .form-list-warp
          el-form-item.pt10.online.default-input(
            label='开票金额(元)'
            :rules="[{ required: true, trigger: 'blur' }]"
            style='width:100%'
            prop="kpnum")
            el-input(
              size="small"
              disabled
              oninput="value=value.replace(/[^\\d.]/g,'')"
              :placeholder="kkjeHolder"
              v-model='ruleForm.kpnum')
          //- el-form-item.pt10.default-input(
          //-   label='发票类型'
          //-   style='width:100%'
          //-   :rules="[{ required: true }]"
          //-   prop="kptype")
          //-   el-radio-group(
          //-     v-model="ruleForm.invoQF000"
          //-     @change="fptypeChange"
          //-     :disabled="dialogType === 'view'")
          //-     el-radio(:label="0") 普通发票
          //-     el-radio(:label="1") 增值税专用发票
          el-form-item.pt10.default-input(
            label='开票内容'
            style='width:100%'
            :rules="[{ required: true }]"
            prop="usertype")
            el-radio-group(
              :disabled="dialogType === 'view'"
              v-model="ruleForm.usertype"
              @change="userTypeChange")
              el-radio(:label="0") 全部开票
              el-radio(:label="1") 部分开票
          el-form-item.pt10.online.xin-label.default-input(
            v-if="dialogType === 'add'"
            label='开票信息'
            style='width:100%')
            el-button(
              type='primary'
              plain
              @click="userTypeChange($event, 'invoiceinfoS')"
              size="small") 请选择
            //- el-input(
            //-   size="small"
            //-   placeholder="请选择"
            //-   @focus="userTypeChange($event, 'invoiceinfoS')"
            //-   v-model='ruleForm.invoiceinfoS')

            //- el-select(
            //-   v-model="ruleForm.invoiceinfoS"
            //-   placeholder="请选择"
            //-   size="small")
            //-   el-option(
            //-     v-for="(item,index) in invoiceinfoList"
            //-     :key="index"
            //-     :label="item.QF001+'/'+item.QF002"
            //-     :value="item.id")
          //- 开票相关数据
          div.form-list-warp(v-if="showDetailkp || dialogType !== 'add'")
            el-form-item.pt10.default-input(
              label='发票类型'
              style='width:100%'
              :rules="[{ required: true }]"
              prop="invoQF000")
              el-select(
                v-model="ruleForm.invoQF000"
                placeholder="请选择"
                :disabled="dialogType === 'view'"
                size="small")
                el-option(label="普通发票" :value="0")
                el-option(label="增值税专用发票" :value="1")
            el-form-item.pt10.default-input(
              label='发票抬头'
              style='width:100%'
              :rules="[{ required: true }]"
              prop="invoQF001")
              el-input(
                :disabled="dialogType === 'view'"
                size="small"
                placeholder="请选择"
                v-model='ruleForm.invoQF001')
            el-form-item.pt10.default-input(
              label='税务号'
              style='width:100%'
              :rules="rules.invoQF002"
              prop="invoQF002")
              el-input(
                size="small"
                :disabled="dialogType === 'view'"
                placeholder="请输入18位数税务号"
                v-model='ruleForm.invoQF002')
            el-form-item.pt10.default-input(
              label='开户行'
              style='width:100%'
              :rules="[{ required: true }]"
              prop="invoQF003")
              el-input(
                size="small"
                :disabled="dialogType === 'view'"
                placeholder="请选择"
                v-model='ruleForm.invoQF003')
            el-form-item.pt10.default-input(
              label='开户行账号'
              style='width:100%'
              :rules="[{ required: true }]"
              prop="invoQF004")
              el-input(
                size="small"
                :disabled="dialogType === 'view'"
                placeholder="请选择"
                v-model='ruleForm.invoQF004')
            el-form-item.pt10.default-input(
              label='开户行地址'
              style='width:100%'
              :rules="[{ required: true }]"
              prop="invoQF005")
              el-input(
                size="small"
                :disabled="dialogType === 'view'"
                placeholder="请选择"
                v-model='ruleForm.invoQF005')

          el-form-item.pt10.online.default-input(
            v-if="dialogType === 'add'"
            label='快递信息'
            style='width:100%'
            :class="[ruleForm.invoQF000 ? 'xin-label' : '']")
            el-button(
              type='primary'
              plain
              @click="userTypeChange($event, 'expressinfoS')"
              size="small") 请选择
            //- el-input(
            //-   size="small"
            //-   placeholder="请选择"
            //-   @focus="userTypeChange($event, 'expressinfoS')"
            //-   v-model='ruleForm.expressinfoS')
          div.form-list-warp(v-if="showDetailDz || dialogType !== 'add'")
            el-form-item.pt10.default-input(
              label='联系人'
              style='width:100%'
              :rules="ruleForm.invoQF000 ? [{ required: true }] :[]"
              prop="expQF001")
              el-input(
                size="small"
                :disabled="dialogType === 'view'"
                placeholder="请选择"
                v-model='ruleForm.expQF001')
            el-form-item.pt10.default-input(
              label='联系电话'
              style='width:100%'
              :rules="ruleForm.invoQF000 ? rules.expQF002 :[]"
              prop="expQF002")
              el-input(
                :disabled="dialogType === 'view'"
                size="small"
                placeholder="请选择"
                v-model='ruleForm.expQF002')
            el-form-item.pt10.default-input(
              label='邮寄地址'
              style='width:100%'
              :rules="ruleForm.invoQF000 ? [{ required: true }] :[]"
              prop="expQF003")
              el-input(
                :disabled="dialogType === 'view'"
                size="small"
                placeholder="请选择"
                v-model='ruleForm.expQF003')
            el-form-item.pt10.default-input(
              label='邮寄说明'
              style='width:100%'
              :rules="ruleForm.invoQF000 ? [{ required: true }] :[]"
              prop="expQF004")
              el-input(
                size="small"
                :disabled="dialogType === 'view'"
                placeholder="请选择"
                v-model='ruleForm.expQF004')
            //- el-select(
            //-   v-model="ruleForm.expressinfoS"
            //-   placeholder="请选择"
            //-   size="small")
            //-   el-option(
            //-     v-for="(item,index) in expressinfoList"
            //-     :key="index"
            //-     :label="item.QF001 +'/'+item.QF002"
            //-     :value="item.id")
          //- 地址相关数据
        el-form-item.dia-footer(v-if="dialogType === 'add'")
          el-button(type='primary', @click="kpiao('ruleForm')" size="small") 确认开票
          el-button(@click="dialogVisible = false" size="small") 取消
    //- 图片弹窗
    image-dialog(
      :imageTitle="imageTitle"
      :imageVisible="imageVisible"
      :imgUrl="imgUrl"
      @onClose="imageVisible=false")
    el-dialog.tree-dialog(
      :title='treeDataTitle',
      :visible.sync='dialogTreeVisible'
      width='900px'
      top="5vh"
      append-to-body
      :before-close="handleClose"
      :close-on-click-modal='false')
      //- el-tree(
      //-   v-loading="treeLoading"
      //-   :data="xfList"
      //-   show-checkbox
      //-   node-key="id"
      //-   :props="defaultProps")
      el-table.flex1(
        v-loading="treeLoading"
        :data='treeTableData'
        style='width: 100%; margin-bottom: 15px'
        :class='[(dialogTreeName === "expressinfoS" || dialogTreeName === "invoiceinfoS" ) ? "check-noall" : ""]'
        :header-cell-style='headerStyle'
        height="200"
        border
        fit
        ref="treeData"
        @select="handleSelectionChange"
        :cell-class-name="cellTreeClassName"
        empty-text="没有数据")
        el-table-column(
          type="selection"
          width="55"
          align="center")
        //- el-table-column(v-if="userInfo.UserType === 'Admin'" label="企业名称" align="left" prop="comname" width="150px")
        el-table-column(
          v-for="(item,index) in tableTreeColumn" :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width"
          )
          template(slot-scope='scope')
            span {{scope.row[item.prop]}}
      .dia-footer()
        el-button(type='primary', @click="sureXfList" size="small") 确认
        el-button(@click="dialogTreeVisible = false" size="small") 取消
</template>

<script >
import {
  invoicelist,
  getbaseinfo,
  newkaipiao,
  comUselistNo,
  getExpressList,
  getInvoiceList } from '@/api/rmb'
import { mapGetters } from 'vuex'
import { parseTime, checkPhone, isJSON } from '@/utils/index'

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
          this.$message.error('请输入正确的手机号码')
        } else {
          callback()
        }
      }
    }
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
          prop: 'invoicetypeZh',
          label: '发票类型'
        },
        {
          prop: 'swh',
          label: '税务号'
        },
        // {
        //   prop: 'zpxx',
        //   label: '专票信息'
        // },
        {
          prop: 'price',
          label: '发票金额(元)'
        },
        {
          prop: 'pdfurl',
          label: '电子发票地址',
          type: 'img'
        },
        {
          prop: 'stateZh',
          label: '状态'
        },
        {
          prop: 'dzstateZh',
          label: '发票状态'
        },
        {
          prop: 'timestamp',
          label: '更新时间'
        }

      ],
      total: 1,
      currentPage: 1,
      pageSize: 20,
      /** *** 弹窗 *** **/
      dialogTitle: '申请开票',
      dialogType: 'add',
      dialogVisible: false,
      ruleForm: {
        kptype: 0,
        usertype: 0
      },
      kkjeHolder: '',
      kpnumAll: 0,
      viewerCase: '',
      tableLoading: false,
      expressinfoList: [],
      invoiceinfoList: [],
      formLoading: false,
      rules: {

        expQF002: [{ required: true, validator: isPhone, trigger: 'blur' }],
        invoQF002: [{ validator: check18, required: true, trigger: 'blur' }]
      },
      showDetailkp: false,
      showDetailDz: false,
      /** *** 图片弹窗 *** **/
      imageTitle: '',
      imageVisible: false,
      imgUrl: '',
      /** *** 列表弹窗 *** **/
      dialogTreeVisible: false,
      treeLoading: false,
      dialogTreeName: '',
      treeTableData: [],
      defaultProps: {
      },
      tableTreeColumn: [],
      xfListColumn: [
        {
          prop: 'producttypeZh',
          label: '产品类型'
        },
        {
          prop: 'productname',
          label: '产品名称'
        },
        {
          prop: 'productnumZh',
          label: '产品数量'
        },
        {
          prop: 'Price',
          label: '产品总价(元)'
        },
        {
          prop: 'statusZh',
          label: '状态'
        },
        // {
        //   prop: 'isinvoiceZh',
        //   label: '开票状态'
        // },
        {
          prop: 'timestamp',
          label: '时间'
        }
      ],
      expressinfoListColumn: [
        {
          prop: 'QF001',
          label: '联系人'
        },
        {
          prop: 'QF002',
          label: '联系电话'
        },
        {
          prop: 'QF003',
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
      invoiceinfoListColumn: [
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
      treeDataTitle: ''
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
    cellTreeClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'isinvoiceZh') {
        switch (row.isinvoice) {
          case 0:
            // 未提交
            return 'approve-wait'
          default:
            return 'approve-ing'
        }
      }
      if (column.property === 'statusZh') {
        switch (row.status) {
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
    closeDialog() {
      this.dialogVisible = false
    },
    open(formName) {
      this.$nextTick(() => {
        this.$refs[formName] ? this.$refs[formName].clearValidate() : ''
      })
    },
    /** *** 通用 end *** **/

    /** *** 按钮操作 start *** **/
    /**
     * @description: 发票类型改变, 普通发票快递信息不必填
     * @param {type}
     * @return:
     */
    fptypeChange(e) {
      // if (e === 0) {

      // }
    },
    /**
     * @description: 显示弹出
     * @param {type}
     * @return:
     */
    showDialog(row) {
      if (row.id) {
        this.dialogTitle = '开票明细'
        this.dialogType = 'view'
        row.kpnum = row.price
        // row.kptype = parseInt(row.invoicetype)
        row.kptype = parseInt(row.invoicetype)
        row.invoQF000 = row.d7.QF000
        row.invoQF001 = row.d7.QF001
        row.invoQF002 = row.d7.QF002
        row.invoQF003 = row.d7.QF003
        row.invoQF004 = row.d7.QF004
        row.invoQF005 = row.d7.QF005
        row.expQF001 = row.d8.QF001
        row.expQF002 = row.d8.QF002
        row.expQF003 = row.d8.QF003
        row.expQF004 = row.d8.QF004

        this.ruleForm = Object.assign({}, row)
      } else {
        this.dialogType = 'add'
        this.dialogTitle = '申请开票'
        this.formLoading = true
        this.ruleForm = {
          kptype: 0,
          usertype: 0,
          kpnum: this.kpnumAll
        }
        this.showDetailkp = false
        this.showDetailDz = false
        // 获取开票信息和地址信息
        const params = {
          page: 1,
          pageSize: 10000
        }
        Promise.all([getExpressList(params), getInvoiceList(params)]).then(resS => {
          this.$nextTick(() => {
            this.formLoading = false
          })
          const invoiceinfoList = resS[1].Data.Models
          invoiceinfoList.forEach(n => {
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
          this.invoiceinfoList = invoiceinfoList
          const expressinfoList = resS[0].Data.Models

          expressinfoList.forEach(n => {
            n.timestamp = parseTime(n.timestamp)
          })
          this.expressinfoList = expressinfoList
        }).catch((err) => {
          console.error(err)
          this.formLoading = false
        })
      }
      this.dialogVisible = true
    },
    /**
     * @description: 开票类型选择
     * @param {type}
     * @return:
     */
    userTypeChange(val, name) {
      if (val !== 0) {
        this.dialogTreeVisible = true
        if (val === 1) {
          this.dialogTreeName = ''
          this.tableTreeColumn = this.xfListColumn
          this.treeDataTitle = '选择开票消费记录'
          const params = {
            page: 1,
            pageSize: 10000
          }
          this.treeLoading = true
          comUselistNo(params).then(res => {
            this.$nextTick(() => {
              this.treeLoading = false
            })
            setTimeout(() => {
              this.$refs.treeData.doLayout()
            }, 200)
            const tableData = res.Data.Models
            tableData.forEach(n => {
              // n.timestamp = dateForamt(new Date(n.timestamp), 'yyyy-MM-dd hh:mm:ss')
              n.timestamp = parseTime(n.timestamp)
              switch (n.producttype) {
                case '0':
                  n.producttypeZh = '普通雷管'
                  n.productnumZh = n.productnum + ' (枚)'

                  break
                case '1':
                  n.producttypeZh = '数码雷管'
                  n.productnumZh = n.productnum + ' (枚)'

                  break
                case '2':
                  n.producttypeZh = '炸药'
                  n.productnumZh = n.productnum + ' (公斤)'
                  break
                default:
                  n.producttypeZh = '其他'
                  n.productnumZh = n.productnum
                  break
              }
              n.Price = (n.Price * 0.01).toFixed(2)
              switch (n.status) {
                case 0:
                  n.statusZh = '使用'
                  break
                case 1:
                  n.statusZh = '退还'
                  break
                default:
                  break
              }
              switch (n.isinvoice) {
                case 0:
                  n.isinvoiceZh = '未开票'
                  break
                case 1:
                  n.isinvoiceZh = '已开票'
                  break
                default:
                  break
              }
            })
            this.treeTableData = tableData
          }).catch(err => {
            console.error(err)
          })
        } else if (name === 'invoiceinfoS') {
          this.dialogTreeName = name
          this.treeDataTitle = '选择开票信息'
          this.tableTreeColumn = this.invoiceinfoListColumn
          this.treeTableData = this.invoiceinfoList
        } else if (name === 'expressinfoS') {
          this.dialogTreeName = name
          this.treeDataTitle = '选择开票地址'
          this.tableTreeColumn = this.expressinfoListColumn
          this.treeTableData = this.expressinfoList
        }
        setTimeout(() => {
          this.$refs.treeData.doLayout()
        }, 200)
      } else {
        this.$set(this.ruleForm, 'kpnum', this.kpnumAll)
        setTimeout(() => {
          this.$refs.treeData.doLayout()
        }, 200)
      }
    },
    handleSelectionChange(list, row) {
      if (this.dialogTreeName === 'invoiceinfoS' || this.dialogTreeName === 'expressinfoS') {
        this.$refs.treeData.clearSelection()
        if (list.length === 0) {
	        return false
        }
        this.$refs.treeData.toggleRowSelection(row, true)
        if (this.dialogTreeName === 'invoiceinfoS') {
          this.showDetailkp = true
          const zhi = `${row.QF000Zh} ${row.QF001} ${row.QF002} ${row.QF007Zh} ${row.QF003} ${row.QF004}${row.QF005}`
          this.$set(this.ruleForm, 'invoiceinfoS', zhi)
          this.$set(this.ruleForm, 'invoQF000', row.QF000)
          this.$set(this.ruleForm, 'invoQF001', row.QF001)
          this.$set(this.ruleForm, 'invoQF002', row.QF002)
          this.$set(this.ruleForm, 'invoQF003', row.QF003)
          this.$set(this.ruleForm, 'invoQF004', row.QF004)
          this.$set(this.ruleForm, 'invoQF005', row.QF005)
          this.$set(this.ruleForm, 'invoQF006', row.QF006)
          this.$set(this.ruleForm, 'invoQF007', row.QF007)
        } else if (this.dialogTreeName === 'expressinfoS') {
          this.showDetailDz = true
          const zhi = `${row.QF001} ${row.QF002} ${row.QF003} ${row.QF004}`
          this.$set(this.ruleForm, 'expressinfoS', zhi)
          this.$set(this.ruleForm, 'expQF001', row.QF001)
          this.$set(this.ruleForm, 'expQF002', row.QF002)
          this.$set(this.ruleForm, 'expQF003', row.QF003)
          this.$set(this.ruleForm, 'expQF004', row.QF004)
        }
      } else {
        this.ruleForm.useID = []
        this.ruleForm.kpnum = 0
        list.forEach(n => {
          this.ruleForm.useID.push(n.id)
          this.ruleForm.kpnum = this.ruleForm.kpnum * 1 + n.Price * 1
        })
      }
    },
    /**
     * @description: 开票类型选择确定
     * @param {type}
     * @return:
     */
    sureXfList() {
      // 如果是开票信息和地址
      if (this.dialogTreeName === 'invoiceinfoS') {
        if (this.ruleForm.invoiceinfS === '') {
          this.$message.error('请选择一项开票信息')
        } else {
          this.dialogTreeVisible = false
        }
      } else if (this.dialogTreeName === 'expressinfoS') {
        if (this.ruleForm.invoiceinfS === '') {
          this.$message.error('请选择一项地址信息')
        } else {
          this.dialogTreeVisible = false
        }
      } else {
        if (this.ruleForm.useID.length < 1) {
          this.$message.error('请至少选择一项消费')
        } else {
          this.dialogTreeVisible = false
        }
      }
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
      // this.loading = true
      // invoicelist(params).then(res => {
      //   this.$nextTick(() => {
      //     this.loading = false
      //   })
      //   setTimeout(() => {
      //     this.$refs.tableList.doLayout()
      //   }, 200)
      //   const tableData = res.Data.Models
      //   tableData.forEach(n => {
      //     n.timestamp = parseTime(n.timestamp)
      //     n.price = (n.price * 0.01).toFixed(2)
      //     switch (n.invoicetype) {
      //       case '0':
      //         n.invoicetypeZh = '普通发票'
      //         break
      //       case '1':
      //         n.invoicetypeZh = '增值税专用发票'
      //         break
      //       default:
      //         break
      //     }
      //     switch (n.state) {
      //       case 0:
      //         n.stateZh = '未开票'
      //         break
      //       case 1:
      //         n.stateZh = '已开票'
      //         break
      //       default:
      //         break
      //     }
      //     switch (n.dzstate) {
      //       case 0:
      //         n.dzstateZh = '开票失败'
      //         break
      //       case 1:
      //         n.dzstateZh = '开票成功'
      //         break
      //       default:
      //         break
      //     }
      //     // 转换d7 d8
      //     // n.d7 = JSON.parse(JSON.stringify(n.d7))
      //     if (isJSON(n.d7)) {
      //       n.d7 = JSON.parse(n.d7)
      //     } else {
      //       n.d7 = {
      //         QF002: ''
      //       }
      //     }
      //     if (isJSON(n.d8)) {
      //       n.d8 = JSON.parse(n.d8)
      //     }
      //     n.swh = n.d7.QF002
      //   })
      //   this.tableData = tableData
      //   this.total = res.Data.TotalCount

      //   // 图片如果存在就销毁
      //   this.viewerCase ? this.viewerCase.destroy() : ''
      //   this.$nextTick(() => {
      //     this.viewerCase = new this.Viewer(this.$refs.tableList.$el, {
      //       toolbar: {
      //         zoomIn: 2,
      //         zoomOut: 2,
      //         oneToOne: 2,
      //         reset: 2,
      //         prev: false,
      //         play: {
      //           show: false,
      //           size: 'large'
      //         },
      //         next: false,
      //         rotateLeft: 2,
      //         rotateRight: 2,
      //         flipHorizontal: 2,
      //         flipVertical: 2
      //       },
      //       navbar: false
      //     })
      //   })
      // }).catch((err) => {
      //   console.error(err)
      //   this.loading = false
      // })
      // getbaseinfo().then(res => {
      //   // this.baseInfo = res.Data
      //   this.kkjeHolder = '可开票金额' + res.Data.wkpNum + '元'
      //   this.kpnumAll = res.Data.wkpNum
      // }).catch(err => {
      //   console.error(err)
      // })
    },
    /**
     * @description: 获取字典值
     * @param {type}
     * @return:
     */
    getDicsDataList() {
      const data = ['爆破类型', '项目等级', '人员类型', '物资分类']
      // this.loading = true
      this.$store.dispatch('dics/getDicData', data).then(res => {
        const dics = {}
        for (const key in res) {
          // eslint-disable-next-line no-prototype-builtins
          if (res.hasOwnProperty(key)) {
            const element = res[key]
            switch (key) {
              case '爆破类型':
                dics.bptype = element
                break
              case '项目等级':
                dics.QF0032 = element
                break
              case '人员类型':
                dics.UF002 = element
                break
              case '物资分类':
                dics.wzfl = element
                break
              default:
                break
            }
          }
        }
        this.dics = dics
        this.getDataList()
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * @description: 提交开票请求
     * @param {type}
     * @return:
     */
    kpiao(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.showDetailkp && (this.showDetailDz || this.ruleForm.invoQF000 === 0)) {
          this.ruleForm.invoiceinfo = {
            'QF000': this.ruleForm.invoQF000,
            'QF001': this.ruleForm.invoQF001,
            'QF002': this.ruleForm.invoQF002,
            'QF003': this.ruleForm.invoQF003,
            'QF004': this.ruleForm.invoQF004,
            'QF005': this.ruleForm.invoQF005,
            'QF007': this.ruleForm.invoQF007,
            'QF006': this.ruleForm.invoQF006
          }
          this.ruleForm.expressinfo = {
            'QF001': this.ruleForm.expQF001,
            'QF002': this.ruleForm.expQF002,
            'QF003': this.ruleForm.expQF003,
            'QF004': this.ruleForm.expQF004
          }
          this.ruleForm.kptype = this.ruleForm.invoQF000
          // 赋值处理
          newkaipiao(this.ruleForm).then(res => {
            this.$message.success('开票成功')
            this.dialogVisible = false
            this.getDataList()
          }).catch(err => {
            console.error(err)
          })
        } else {
          this.$message.error('请将加*内容填写完整并且选择信息')
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
    height: calc(100vh - 150px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .plhj-table{
      flex: 1
    }
  }

}
.dia-footer{
  width: 100% !important;
  text-align: right;
  ::v-deep .el-form-item__content{
  text-align: right
  }
}
.inbtn{
  padding: 5px 8px
}
.list-class{
  ::v-deep .el-dialog__body{
    padding-top: 15px;
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
.form-list-warp{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  ::v-deep .el-form-item{
    width: 50% !important;

    // width: 100% !important;

    // display: flex !important;
    margin-bottom: 10px;
    .el-form-item__content{
      // flex: 1 !important;
      // margin-left: 0 !important;
      .el-input, .el-select, .el-cascader {
        // width: 100% !important
        width: 220px !important;
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
}
.tree-dialog{
  ::v-deep .el-dialog{
    // min-width: 720px;
    .el-form-item__error{
      display: none
    }

  }
  ::v-deep .el-dialog__body{
    height: calc(100vh - 150px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
}
.check-noall{
  ::v-deep th .el-checkbox {
    display: none
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
.xin-label{
  ::v-deep label{
    &::before{
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }
  }

}
</style>
