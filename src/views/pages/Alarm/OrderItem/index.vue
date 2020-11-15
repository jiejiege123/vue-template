<!--
 * @Author: your name
 * @Date: 2020-11-02 14:47:25
 * @LastEditTime: 2020-11-13 17:24:16
 * @LastEditors: zzz
 * @Description: In User Settings Edit
 * @FilePath: \bpsp-uie:\doit\vue admin\vue-template\src\views\pages\System\Companys\index.vue
-->
<template lang="pug">
.content
  //- 返回单位管理查单
  .hearer-breadcrumb(v-if="Workorderid")
    el-button(type="text" style="padding: 0" @click="goAlarm") 工单处理
    i.el-icon-arrow-right
    span 工单详情
    //- span.ml_20(style="color: #000") {{comname}}
  .form-warp
    el-form.default-input.layout-row.flex-wrap(
      v-loading="formLoading"
      :model='ruleForm'
      ref='ruleForm'
      label-width='120px')
      div(
          style="width: 33%"
          v-for="(item,index) in formColumns"
          :key="index")
          el-form-item(
            :prop='item.prop'
            :label="item.label+ ':'")
            div()
              span {{ruleForm[item.prop]}}
      //- 附件 下载
      el-form-item(
        style="width: 33%"
        prop='files'
        label="附件:")
        el-button(type="primary" @click="download(ruleForm.files)") 点击下载
  //- 处理情况
  p.mb_10 处理情况
  el-table(
    :data='tableData'
    style='width: 100%'
    :header-cell-style='headerStyle'
    border
    ref="reftable"
    :cell-class-name="cellClassName"
    empty-text="没有数据")
    el-table-column(
      v-for="(item,index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :align="item.align"
      :min-width="item.minWidth"
      :width="item.width")
  p.mb_10 反馈内容
  el-input(
    type='textarea',
    placeholder="请输入反馈内容"
    :autosize='{ minRows: 5, maxRows: 6}'
    v-model='fknr')
  p.mb_10 上传附件
  div
    el-upload.upload-demo(
      :action="action"
      :headers="headers"
      accept=".jpg, .png, gif, .doc, .docx, .xls, .xlsx, .pfd, .mp4, .zip, .rar, .7z"
      :on-success='handleFileSuccess'
      :before-upload='beforeFileUpload'
      :limit='1')
      el-button(size="small" type="primary") 点击上传
      span(slot="tip" style='font-size:12px')  多个文件请上传压缩包
  div.mt_15.text-center()
    el-button(
      type="primary"
      plain
      @click.stop="goHistory(row)"
      ) 反馈工单
    el-button(
      type="success"
      @click.stop="handle(row)"
      ) 完结工单
</template>
<script >
import Query from '@/components/Query'
import EditTableForm from '@/components/EditTableForm'
import { getAlarmHistory } from '@/api/alarm'
import { getToken } from '@/utils/auth'

// import { getDicsByName } from '@/api/commom'

import { mapGetters } from 'vuex'
export default {
  name: 'OrderItem',
  components: {
    Query,
    EditTableForm
  },
  filters: {

  },
  data() {
    return {

      formLoading: false,
      formColumns: [
        {
          prop: 'IMEI',
          label: 'IMEI'
        },
        {
          label: '安装点位',
          prop: 'azdname'
        },
        {
          label: '工单类型',
          prop: 'worderType'
        },
        {
          label: '故障描述',
          prop: 'workorderbody'
        },
        {
          label: '申报人',
          prop: 'sbUser'
        },

        {
          label: '状态',
          prop: 'worderStatus'
        },
        {
          label: '创建时间',
          prop: 'creattime'
        },
        {
          label: '更新时间',
          prop: 'updatetime'
        }
      ],

      Workorderid: '',
      ruleForm: {},
      tableData: [],
      tableColumns: [
        {
          prop: 'fkbody',
          label: '反馈内容',
          width: '500px'
        },
        {
          prop: 'files',
          label: '附件'
        },
        {
          prop: 'douser',
          label: '处理人'
        },
        {
          prop: 'fktime',
          label: '反馈时间'
        }

      ],
      fknr: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    action() {
      return `${process.env.VUE_APP_BASE_API}/api/common/photo/upload/single`
    },
    headers() {
      return {
        Authorization: 'Bearer ' + getToken()
      }
    }
  },
  created() {
    this.Workorderid = this.$route.query.Workorderid
    // this.onSearch({})
    // this.getDicsList()
  },
  activated() {
    // 保持半缓存
    // this.onSearch({ com: '' })
    // this.getDicsList()
  },
  mounted() {
  },
  methods: {
    headerStyle() {
      // #fafafa
      return 'background-color: rgb(244, 248, 251); color: rgba(0,0,0,.85); font-weight: 500'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'Status') {
        switch (row.Status) {
          case 1:
            // 通过
            return 'approve-pass'
          // 拒绝
          case 0:
            return 'approve-refused'
          default:
            return 'approve-ing'
        }
      }
    },
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
    handleFileSuccess(res) {
      if (res.Status === 200) {
        const url = res.Data
        this.$set(this.ruleForm, 'files', url)
      } else {
        this.$message.error(res.Msg)
      }
    },
    beforeFileUpload() {

    },
    getDicsList() {
      // const params = {
      //   names: '公司类型'
      // }
      // getDicsByName(params).then(res => {
      //   // console.log(res)
      //   const dics = res.Data
      //   dics.forEach(n => {
      //     n.value = n.dicvalue
      //     n.label = n.diczh
      //     switch (n.groupzh) {
      //       case '公司类型':
      //         this.dics.comType.push(n)
      //         break
      //       default:
      //         break
      //     }
      //   })
      // })
    },
    getDataList() {
      const params = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        IMEI: this.IMEI,
        ...this.query
      }
      this.loading = true
      getAlarmHistory(params).then(res => {
        this.$nextTick(() => {
          this.loading = false
        })
        const data = res.Data.Models
        this.tableData = data
        this.total = res.Data.TotalCount
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },

    goAlarm() {
      this.$router.push('/Alarm/WorkOrder')
    },
    handle() {

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

  }
}
</script>
<style lang="scss" scoped>
/** *** 基本设置 start ******/
.content{
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 84px);
}
.query{
 width: 100%;
}
.hearer-breadcrumb{
  padding-bottom: 15px;
  color: #666;
  font-size: 14px;

}

.footer{
  text-align: right;
  margin-top: 15px;
}
.form-warp{
  ::v-deep .el-form{
    .el-form-item{
      width: 100%;
      .el-form-item__label{
        font-weight: normal;
      }
    }

  }

}
</style>
