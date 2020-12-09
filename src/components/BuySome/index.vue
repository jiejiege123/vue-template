<template lang="pug">
div
  el-dialog.dialog-class.list-class(
    :title='dialogTitle',
    :visible.sync='dialogVisible'
    width='500px'
    append-to-body
    :close-on-click-modal='false'
    @open="open('ruleForm')")
    el-tabs.eltabs(v-model="activeName")
      el-tab-pane(label="线上充值" name="xs")
        //- 充值数量
        el-form.demo-ruleForm.default-input(
          :model='ruleForm',
          ref='ruleForm',
          label-width='120px')
          div
            el-form-item.pt10(
              label='选择产品'
              :rules="[{ required: true }]"
              style='width:100%' prop="productid")
              //- el-input(
              //-   :disabled="userInfo.UserType === 'Company' && (userInfo.Companys[userInfo.CompanyCodes[0]].QF003 === '1' || userInfo.Companys[userInfo.CompanyCodes[0]].QF003 === '2')"
              //-   size="small"
              //-   placeholder="请选择充值金额(整数)"
              //-   oninput="value=value.replace(/[^\\d]/g,'')"
              //-   v-model='ruleForm.rmb')
              el-select(
                v-model="ruleForm.productid"
                placeholder="请选择产品"
                size="small")
                el-option(
                  v-for="item in czOption"
                  :key="item.productid"
                  :label="item.productname"
                  :value="item.productid")
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
            el-button(type='primary', @click="submitForm" size="small" :loading="loading") 确认充值
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
      vue-qr(:text="qrcode" :size="200")
</template>
<script>
import {
  getProduct,
  getPayinfo
} from '@/api/rmb'
import { mapGetters } from 'vuex'
import VueQr from 'vue-qr'
export default {
  components: {
    VueQr
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    deviceid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ruleForm: {},
      czOption: [],
      radio: 0,
      dialogEwmVisible: false,
      activeName: 'xs',
      qrcode: '',
      dics: {
        xxcz: []
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getProductData()
  },
  methods: {
    open(formName) {
      this.activeName = 'xs'
      this.radio = 0
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.getEwm()
        } else {
          this.$message.error('请将加*内容填写完整')
          console.error('error submit!!')
          return false
        }
      })
    },
    getEwm() {
      const product = this.czOption.find(n => n.productid === this.ruleForm.productid)
      const params = {
        cztype: 0,
        czly: 0,
        comcode: this.userInfo.comcode,
        codename: this.userInfo.codename,
        userid: this.userInfo.userid,
        username: this.userInfo.username,
        productid: this.ruleForm.productid,
        productname: product.productname,
        rmb: product.productprice
      }
      if (this.deviceid) {
        params.deviceid = this.deviceid
      }
      // 判断是公司类型
      this.loading = true
      getPayinfo(params).then(res => {
        // this.$message.success('请扫码')
        this.loading = false
        this.$nextTick(() => {
          this.dialogEwmVisible = true
          this.qrcode = res.Data
        })
      }).catch(err => {
        this.loading = false
        console.error(err)
      })
    },
    getProductData() {
      const params = {
        PageIndex: 1,
        PageSize: 9999
      }
      getProduct(params).then(res => {
        const data = res.Data.Models
        this.czOption = data
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    closeDialog() {
      this.$emit('onClose')
    },
    handleEwmClose(done) {
      this.$emit('onClose')
      done()
    }
  }
}
</script>
<style lang="scss" scoped>
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
.qrCode-warp{
  justify-content: center;
  // height: 80%;
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
</style>
