<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-17 23:54:33
 * @LastEditTime: 2020-03-30 10:08:34
 * @LastEditors: Please set LastEditors
 -->
<template lang="pug">
.index.layout-column
  .header.layout-row__between
    .query
      el-input.input-search(placeholder='请输入关键字' v-model='search' size="small" clearable @clear="getDataList")
        el-button(slot="append" icon="el-icon-search" type="primary" size="small" @click="doSearch")

      span.base-info(style="margin-right:15px; margin-left:15px") 余额:
        span {{baseInfo.yeCNum}}元
      //- span.base-info(style="margin-right:15px") 充值总金额:
      //-   span {{baseInfo.czCNum}}元
      span.base-info(style="margin-right:15px") 消费总金额:
        span {{baseInfo.xfCNum}}元
      span.base-info(style="margin-right:15px") 待开票金额:
        span {{baseInfo.wkpNum}}元
    .operate
      el-button(type="primary" size="small" @click='createdRow') 充值
      //- el-button(type="primary" size="small" @click='createdRowKq') 续费

  .flex1.layout-column
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
          span(v-else) {{scope.row[item.prop] || '-'}}
      //- el-table-column(label="操作" align="center" width="120")
      //-   template(slot-scope='scope')
      //-     el-button(type="success" plain size="small" @click="showDialog(scope.row)") 明细
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
    //- 库区列表
    el-dialog.kq-dialog(
      :visible.sync='kqDialogVisible'
      :title='kqDialogTitle'
      width='1200px'
      append-to-body
      :close-on-click-modal='false')
      .flex1.layout-column
        el-table.flex1(
          v-loading="loadingKq"
          :data='tableDataKq'
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
            v-for="(item,index) in tableColumnQk" :key="index"
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
              span(v-else) {{scope.row[item.prop] || '-'}}
          el-table-column(label="操作" align="center" width="120")
            template(slot-scope='scope')
              el-button(:disabled="scope.row.d1 !== '1'" type="success" plain size="small" @click="showDialog(scope.row)") 续费
    //- 列表弹窗
    el-dialog.dialog-class.list-class(
      :title='dialogTitle',
      :visible.sync='dialogVisible'
      width='500px'
      append-to-body
      :before-close="handleClose"
      :close-on-click-modal='false'
      @open="open('ruleForm')")
      //- 如果是生产，销售，显示公司库区
      //- .layout-row.align-center
      //-   span.chioes(style="margin-right: 15px") 选择库区
      //-   el-select(
      //-     v-model="kqid"
      //-     placeholder="请选择充值库区"
      //-     filterable
      //-     style="padding-right:15px; width:160px"
      //-     size="small"
      //-     clearable
      //-     @change="kqSelect")
      //-     el-option(
      //-       v-for="(item,index) in kqData"
      //-       :key="index"
      //-       :label="item.label"
      //-       :value="item.value")
      el-tabs.eltabs(v-model="activeName")
        el-tab-pane(label="线上充值" name="xs")
          //- 充值数量
          el-form.demo-ruleForm.default-input(
            :model='ruleForm',
            ref='ruleForm',
            label-width='120px')
            div
              el-form-item.pt10(
                label='充值金额(元)'
                :rules="[{ required: true }]"
                style='width:100%' prop="rmb")
                el-input(
                  :disabled="userInfo.UserType === 'Company' && (userInfo.Companys[userInfo.CompanyCodes[0]].QF003 === '1' || userInfo.Companys[userInfo.CompanyCodes[0]].QF003 === '2')"
                  size="small"
                  placeholder="请选择充值金额(整数)"
                  oninput="value=value.replace(/[^\\d]/g,'')"
                  v-model='ruleForm.rmb')
                //- el-select(
                //-   v-model="ruleForm.rmb"
                //-   placeholder="请选择充值金额"
                //-   size="small")
                //-   el-option(
                //-     v-for="item in czOption"
                //-     :key="item.value"
                //-     :label="item.label"
                //-     :value="item.value")
              el-form-item.pt10(
                label='备注'
                style='width:100%'
                prop="demo")
                el-input(
                  type='textarea',
                  :autosize='{ minRows: 2, maxRows: 4}',
                  v-model='ruleForm.demo')
              el-form-item.pt10(
                label='支付方式'
                style='width:100%'
                prop="rechargettype")
                el-radio-group(v-model="radio")
                  el-radio(:label="0")
                    .svg-container
                      svg-icon(icon-class="wxpay" className="svgitem")
                  el-radio(:label="1" disabled)
                    .svg-container
                      svg-icon(icon-class="alpay" className="svgitem" )
            el-form-item.dia-footer()
              el-button(type='primary', @click="submitForm" size="small") 确认充值
              el-button(@click="closeDialog" size="small") 取消
        el-tab-pane(label="线下充值" name="xx" style='padding: 10px 20px')
          .xx-dric
            span.xx-title() 开户名称:
            span {{dics.xxcz.find(n => n.label === 'comname') ? dics.xxcz.find(n => n.label === 'comname').value : ''}}
          .xx-dric
            span.xx-title() 开户行:
            span {{dics.xxcz.find(n => n.label === 'bankname') ? dics.xxcz.find(n => n.label === 'bankname').value : ''}}
          .xx-dric
            span.xx-title() 汇款账号:
            span {{dics.xxcz.find(n => n.label === 'bankNo') ? dics.xxcz.find(n => n.label === 'bankNo').value : ''}}
          .xx-dric
            span.xx-title() 邮箱:
            span {{dics.xxcz.find(n => n.label === 'email') ? dics.xxcz.find(n => n.label === 'email').value : ''}}
          .tips
            div(style='font-size:10px; margin: 0px 0px 5px ') 温馨提示:
            div(style='font-size:10px; margin-left: 10px') 受银行处理时间影响，采用外汇或者线下汇款方式到账会有延误，强烈建议采用支付宝、网银实时到账。线下汇款直接向阿里的专属账户汇款，系统会将汇款直接匹配到您的阿里云账户。各种方式的到账时间一般为:招行1-2天，跨行2-5天(具体到账时间以银行的实际到账时间为准)。更多详情请避免北京时间21: 00-00: 00进行汇款，否则受银行出账时间影响，可能出现延迟-天到账情况。
          div(v-if="userInfo.UserType === 'Company' && (userInfo.Companys[userInfo.CompanyCodes[0]].QF003 === '3')" style='color: red; padding-top: 15px; font-size: 12px') 汇款成功后请将汇款凭证发到上文邮箱中，并请注明充值账户吗、联系人及联系电话
          div(v-else style='color: red; padding-top: 15px; font-size: 12px') 汇款成功后请将汇款凭证发到上文邮箱中，并请注明续费库区、充值账户、联系人及联系电话
    //- 图片弹窗
    image-dialog(
      :imageTitle="imageTitle"
      :imageVisible="imageVisible"
      :imgUrl="imgUrl"
      @onClose="imageVisible=false")
    el-dialog.dialog-class.list-class(
      :visible.sync='dialogEwmVisible'
      width='500px'
      append-to-body
      :before-close="handleEwmClose"
      :close-on-click-modal='false')
      .layout-column.align-center.qrCode-warp
        p 请手机微信扫码支付,
          b 支付完成后请关闭弹窗
        .svg-container1(v-if="radio === 0" style='margin-bottom: 10px')
          svg-icon(icon-class="wxpay" className="svgitem")
        div#qrCode(ref="qrCodeDiv")
</template>

<script >
import {
  getRechargetlist,
  getbaseinfo,
  getweixinpayinfo,
  getweixinpayinfoByKq,
  comkuqulist } from '@/api/rmb'
import { mapGetters } from 'vuex'
// import QRCode from 'qrcodejs2'
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
    return {
      search: '',
      dics: {
        xxcz: []
      },
      /** *** 表格 *** **/
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'money',
          label: '余额(元)'
        },
        {
          prop: 'realmoney',
          label: '实际余额(元)'
        },
        {
          prop: 'rechargettypeZh',
          label: '充值类型'
        },
        {
          prop: 'onlinetypeZh',
          label: '支付方式'
        },
        {
          prop: 'orderno',
          label: '订单号'
        },
        {
          prop: 'd1',
          label: '凭证',
          type: 'img'
        },
        {
          prop: 'timestamp',
          label: '支付时间'
        }

      ],
      total: 1,
      currentPage: 1,
      pageSize: 20,
      viewerCase: '',
      /** *** 弹窗 *** **/
      dialogTitle: '详情',
      dialogVisible: false,
      ruleForm: {},
      czOption: [
        {
          label: 0.1,
          value: 0.1
        },
        {
          label: 1,
          value: 1
        },
        {
          label: 1000,
          value: 1000
        },
        {
          label: 2000,
          value: 2000
        },
        {
          label: 5000,
          value: 5000
        },
        {
          label: 10000,
          value: 10000
        }
      ],
      radio: 0,
      dialogEwmVisible: false,
      activeName: 'xs',
      qrcode: '',
      baseInfo: {},
      /** *** 图片弹窗 *** **/
      imageTitle: '',
      imageVisible: false,
      imgUrl: '',
      kqid: '',
      kqData: [],
      startime: '',
      /** *** k库区列表 *** **/
      kqDialogVisible: false,
      loadingKq: false,
      tableDataKq: [],
      tableColumnQk: [
        {
          label: '库区名称',
          prop: 'kqname'
        },
        {
          label: '库区说明',
          prop: 'kqdemo'
        },
        {
          label: '缴费金额(元)',
          prop: 'rmbnum'
        },
        {
          label: '缴费时间',
          prop: 'rmbstarttime'
        },
        {
          label: '结束时间',
          prop: 'rmbsendtime'
        }
      ],
      kqDialogTitle: ''
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
    this.getBaseData()
  },
  mounted() {

  },
  methods: {
    /** *** 通用 start *** **/
    headerStyle() {
      return 'background-color: #FAFAFA;'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      // if (column.property === 'codespvalueZh') {
      //   switch (row.codespvalue) {
      //     case '-1':
      //       // 未提交
      //       return 'approve-wait'
      //     default:
      //       return 'approve-ing'
      //   }
      // }
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
    handleEwmClose(done) {
      this.closeDialog()
      this.getDataList()
      done()
    },
    open(formName) {
      this.activeName = 'xs'
      this.radio = 0
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    /** *** 通用 end *** **/

    /** *** 按钮操作 start *** **/
    /**
     * @description: 显示弹出
     * @param {type}
     * @return:
     */
    showDialog(row) {
      this.dialogVisible = true
      const t = row.rmbsendtime.split('-')
      const t1 = parseInt(t[0]) + 1
      t[0] = t1
      const endTime = t.join('-')
      this.ruleForm = {
        rmb: row.rmbnum,
        startime: row.rmbsendtime,
        endtime: endTime,
        kqid: row.kqid
      }
      console.log(this.ruleForm)
      // this.ruleForm.wpnum_list.forEach(n => {
      //   n.timestamp = parseTime(new Date(n.timestamp), 'yyyy-MM-dd hh:mm:ss')
      // })
      // this.tableDialogData = this.ruleForm.wpnum_list
    },
    createdRow() {
      this.dialogVisible = true
      this.dialogTitle = '充值'
    },
    createdRowKq() {
      this.kqDialogVisible = true
      this.kqDialogTitle = '设备续费'
      this.getBaseData()
    },
    /**
     * @description: '确认充值'
     * @param {type} ''
     * @return: ''
     */
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // const flag = this.userInfo.Companys[this.userInfo.CompanyCodes[0]].QF003 === '1' || this.userInfo.Companys[this.userInfo.CompanyCodes[0]].QF003 === '2'
          // if ((flag && this.kqid) || !flag) {
          //   this.getEwm()
          //   this.$message.success('请扫码')
          // } else {
          //   this.$message.error('请将加*内容填写完整')
          // }
          this.getEwm()
          this.$message.success('请扫码')
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    kqSelect(e) {
      const row = this.kqData.find(n => n.id === e)
      this.ruleForm = row
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
      // getRechargetlist(params).then(res => {
      //   this.$nextTick(() => {
      //     this.loading = false
      //   })
      //   setTimeout(() => {
      //     this.$refs.tableList.doLayout()
      //   }, 200)
      //   const tableData = res.Data.Models
      //   tableData.forEach(n => {
      //     n.timestamp = parseTime(n.timestamp)
      //     n.onlinetype === '0' ? n.onlinetypeZh = '线上支付' : n.onlinetypeZh = '线下支付'
      //     // n.rechargettype === '0' ? n.rechargettype = '微信支付' : n.rechargettype = '支付宝支付'
      //     switch (n.rechargettype) {
      //       case '0':
      //         n.rechargettypeZh = '微信支付'
      //         break
      //       case '1':
      //         n.rechargettypeZh = '支付宝支付'
      //         break
      //       default:
      //         n.rechargettypeZh = '线下汇款'

      //         break
      //     }
      //     if (n.onlinetype === '1') {
      //       n.rechargettypeZh = '线下汇款'
      //     }
      //   })
      //   this.tableData = tableData
      //   this.total = res.Data.TotalCount
      // }).catch((err) => {
      //   console.error(err)
      //   this.loading = false
      // })
      // getbaseinfo().then(res => {
      //   this.baseInfo = res.Data
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
      const data = ['爆破类型', '项目等级', '企业性质', '人员类型', '物资分类', '线下充值']
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
              case '线下充值':
                dics.xxcz = element
                break
              case '企业性质':
                dics.QF004 = element
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
    getBaseData() {
      const params = {
        page: 1,
        pageSize: 2000
      }
      this.loadingKq = true
      // getComKuQuData(params).then(res => {
      comkuqulist(params).then(res => {
        const data = res.Data.Models
        data.forEach(n => {
          n.value = n.id
          n.label = n.kqname
        })
        this.kqData = data
        this.tableDataKq = res.Data.Models
        this.$nextTick(() => {
          this.loadingKq = false
        })
      }).catch(() => {
        this.loadingKq = false
      })
    },
    /**
     * @description: '确认充值获取二维码'
     * @param {type} ''
     * @return: ''
     */
    getEwm() {
      const flag = this.userInfo.Companys[this.userInfo.CompanyCodes[0]].QF003 === '1' || this.userInfo.Companys[this.userInfo.CompanyCodes[0]].QF003 === '2'
      let params = {}
      let methods
      if (flag) {
        methods = getweixinpayinfoByKq
        params = {
          rmb: this.ruleForm.rmb * 1,
          demo: this.ruleForm.demo,
          kqid: this.ruleForm.kqid,
          startime: this.ruleForm.startime,
          endtime: this.ruleForm.endtime
        }
      } else {
        params = {
          rmb: this.ruleForm.rmb * 1,
          demo: this.ruleForm.demo
        }
        methods = getweixinpayinfo
      }

      // 判断是公司类型
      methods(params).then(res => {
        this.dialogEwmVisible = true
        this.$nextTick(() => {
          if (this.qrcode) {
            this.qrcode.clear()
            this.$refs.qrCodeDiv.innerHTML = ''
          }
          // window.open(res.Data, '_blank', 'width=1000,height=800,menubar=no,toolbar=no,status=no,scrollbars=yes')
          this.qrcode = new QRCode(this.$refs.qrCodeDiv, {
            text: res.Data,
            width: 200,
            height: 200,
            colorDark: '#333333', // 二维码颜色
            colorLight: '#ffffff', // 二维码背景色
            correctLevel: QRCode.CorrectLevel.L// 容错率，L/M/H
          })
        })
        // params.demo = res.Data
        // getweixinpayinfo(params).then(res => {
        //   console.log(res)
        // })
      }).catch(err => {
        console.error(err)
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
    height: calc(100vh - 350px);
    padding-top: 0;
    padding-bottom: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .plhj-table{
      flex: 1
    }
    .el-input{
      width: 220px
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

}
.demo-ruleForm{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between
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
.eltabs{
  height: 100%;
  ::v-deep .el-tabs__content{
    height: calc(100% - 60px);
    overflow-y: auto;
    .el-tab-pane{
      height: 100%;
    }
  }
}
$dark_gray:#889aa4;
.svg-container {
  // padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  // width: 30px;
  font-size: 70px;
  height: 30px;
  overflow: hidden;
  display: inline-block;
  .svgitem{
    font-size: 70px;
    height: 30px;
    vertical-align: top
  }
}
.svg-container1 {
  // padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  // width: 30px;
  font-size: 80px;
  height: 40px;
  overflow: hidden;
  display: inline-block;
  .svgitem{
    font-size: 80px;
    height: 30px;
    vertical-align: top
  }
}
.qrCode-warp{
  justify-content: center;
  // height: 80%;
}
.xx-dric{
  margin-bottom: 10px;
  .xx-title{
    margin-right: 10px;
    display: inline-block;
    width: 60px;
    text-align: left
  }
}
.tips{
  padding: 10px;
  background: #ececec;
  line-height: 1.5;
}
.chioes{
  font-weight: bold;
  &::before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
  }
}
.kq-dialog{
  ::v-deep .el-dialog__body{
    padding-top: 5px;
    height: calc(100vh - 340px);
    padding-bottom: 25px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
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
</style>
