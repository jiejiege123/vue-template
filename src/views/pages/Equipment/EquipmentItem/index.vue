<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-10 17:51:40
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
  .content.layout-column
    //- 返回单位管理查单
    .hearer-breadcrumb
      el-button(type="text" style="padding: 0" @click="goBack") 设备管理
      i.el-icon-arrow-right
      span 用户列表
      span.ml_20(style="color: #000") {{comname}}
    el-card.box-card.mb_20
      div.clr_b2(slot="header") 设备信息
      //- 数据开始了
      el-form.default-input.inline(
        v-loading="listLoading"
        :model='ruleForm'
        ref='ruleForm'
        label-width='120px')
        .layout-row.flex-wrap
          div.card-form(v-for="item in formList" :key="item.id" style="width: 360px")
            el-form-item(
              :prop='item.prop'
              :label="item.label")
              span {{ruleForm[item.prop]}}
    el-card.box-card
      div.clr_b2(slot="header") 设备属性
      //- 数据开始了
      el-form.default-input.inline(
        v-loading="listLoading"
        :model='ruleForm'
        ref='ruleForm'
        label-width='120px')
        .layout-row.flex-wrap
          div.card-form(style="width: 360px")
            el-form-item(
              prop='menci'
              label="门磁状态")
              span {{ruleForm.menci}}
          div.card-form(style="width: 360px")
            el-form-item(
              prop='menci'
              label="信号强度")
              span {{ruleForm.menci}}
          div.card-form(style="width: 360px")
            el-form-item(
              prop='menci'
              label="电池电压")
              span {{ruleForm.menci}}

</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getUserList } from '@/api/com'
import { getDicsByName } from '@/api/commom'

import { checkPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
export default {
  name: 'EquipmentItem',
  components: {
    Query,
    EditTableForm
  },
  filters: {

  },
  data() {
    var isPhone = (rule, value, callback) => {
      if (value) {
        if (!checkPhone(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
    return {
      /**
       * 查询
       */
      queryList: [
        {
          label: '用户姓名',
          prop: 'username',
          holder: '请输入用户姓名',
          queryType: false
        }
      ],
      query: {},
      /**
       * 表格
       */
      loading: false,
      tableData: [],
      tableColumn: [
        {
          prop: 'realname',
          label: '用户姓名',
          width: 120
        },
        {
          prop: 'comname',
          label: '所属单位',
          tableOnly: true
        },
        {
          prop: 'username',
          label: '手机号码'
        },
        {
          prop: 'userpass',
          label: '用户密码',
          type: 'password',
          formOnly: true

        },
        {
          prop: 'userroleid',
          label: '角色',
          type: 'select',
          formOnly: true
        },
        {
          prop: 'userrole',
          label: '角色',
          tableOnly: true
        },
        {
          prop: 'status',
          label: '用户状态',
          type: 'select',
          formOnly: true,
          addDisable: true

        },
        {
          prop: 'statuszh',
          label: '用户状态',
          tableOnly: true
        },
        {
          prop: 'address',
          label: '地址',
          formOnly: true,
          online: true,
          formStyle: {
            width: '600px'
          }
        },

        {
          prop: 'sfzzm',
          label: '身份证正面',
          formOnly: true,
          type: 'img'
        },
        {
          prop: 'sfzfm',
          label: '身份证反面',
          formOnly: true,
          type: 'img'
        },
        {
          prop: 'sfzno',
          label: '身份证号码',
          formOnly: true
        },
        {
          prop: 'logo',
          label: '用户头像',
          formOnly: true,
          type: 'imgCut'
        },
        {
          prop: 'rmb',
          label: '余额',
          formOnly: true,
          addDisable: true
        }

      ],
      formRules: {
        realname: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: isPhone, trigger: 'blur' }
        ],
        userpass: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        userroleid: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      dics: {
        pcode: [],
        status: [
          {
            value: 1,
            label: '正常'
          },
          {
            value: 2,
            label: '被禁用'
          },
          {
            value: 3,
            label: '已注销'
          }
        ]
      },
      currentPage: 1,
      pageSize: 9000,
      total: 0,
      formLoading: false,
      // 设备信息
      ruleForm: {},
      IMEI: '',
      listLoading: false,
      formList: [
        {
          prop: 'IMEI',
          label: 'IMEI'
        },
        {
          prop: 'comname',
          label: '所属单位'
        },
        {
          prop: 'IMEI',
          label: 'IMEI'
        },
        {
          prop: 'jzwname',
          label: '建筑物'
        },
        {
          prop: 'ICCID',
          label: 'ICCID'
        },
        {
          prop: 'picizh',
          label: '批次'
        },
        {
          prop: 'IMSI',
          label: 'IMSI'
        },
        {
          prop: 'devicevaluezh',
          label: '状态'
        },
        {
          prop: 'louce',
          label: '楼层'
        },
        {
          prop: 'devicetypezh',
          label: '类型'
        },
        {
          prop: 'bangdingzh',
          label: '绑定状态'
        },
        {
          prop: 'azdid',
          label: '安装位置'
        },
        {
          prop: 'xinhaoid',
          label: '设备型号'
        },
        {
          prop: 'zhucetiem',
          label: '注册日期'
        },
        {
          prop: 'sxtid',
          label: '摄像头'
        },
        {
          prop: 'kucunid',
          label: '库存状态'
        },
        {
          prop: 'sxtid',
          label: '摄像头'
        },
        {
          prop: 'sxtid',
          label: '最近事件时间'
        },
        {
          prop: 'sxtid',
          label: '责任人'
        },
        {
          prop: 'sxtid',
          label: '出货时间'
        },
        {
          prop: 'sxtid',
          label: '首次安装时间'
        },
        {
          prop: 'sxtid',
          label: '其他责任人'
        },
        {
          prop: 'sxtid',
          label: '经纬度'
        }

      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.IMEI = this.$route.query.IMEI
    // this.comcode = this.$route.query.comcode
    // this.onSearch({ com: '' })
    // this.getDicsList()
  },
  mounted() {
  },
  methods: {
    handleCurrentChange(e) {
      this.currentPage = e
      this.getDataList()
    },
    handleSizeChange(e) {
      this.pageSize = e
      this.getDataList()
    },
    onSearch(query) {
      this.currentPage = 1
      this.pageSize = 20
      this.query = query
      this.getDataList()
    },
    getDicsList() {
      const params = {
        names: '公司类型'
      }
      getDicsByName(params).then(res => {
        // console.log(res)
        const dics = res.Data
        dics.forEach(n => {
          n.value = n.dicvalue
          n.label = n.diczh
          switch (n.groupzh) {
            case '公司类型':
              this.dics.comType.push(n)
              break
            default:
              break
          }
        })
      })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        Keywords: this.query.com
      }
      this.loading = true
      getUserList(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        data.forEach(n => {
          if (n.comcode === this.userInfo.comcode) {
            n.delDisabled = true
          }
        })
        this.tableData = res.Data.Models
        this.$set(this.dics, 'pcode', res.Data.Models)
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },

    goBack() {
      this.$router.push('/Equipment/EquipmentLists')
    }
  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.content{
  padding: 20px;
  box-sizing: border-box;
  // height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.hearer-breadcrumb{
  padding-bottom: 15px;
  color: #666;
  font-size: 14px;

}
.card-form{
  ::v-deep .el-form-item {
    margin-bottom: 0px;
    .el-form-item__label{
      font-weight: 400;
    }
  }
}
</style>
