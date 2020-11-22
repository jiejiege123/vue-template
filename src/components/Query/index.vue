<template lang="pug">
  div.layout-row__between.query-laywarp(ref="queryRef")
    el-row.width100(:gutter="10" v-if="spaceBetween")
      el-col.query-item(v-for="(item,index) in queryShow" :key="index" :span="span" )
        div.layout-row.align-center.mb_10(v-if="item.queryType === queryType")
          span.span-style(:style="{width: width, textAlign:'right'}" ) {{item.label}}：
          el-select(
            v-if="item.type === 'select'"
            v-model="query[item.prop]"
            :placeholder="item.holder"
            filterable
            style="padding-right:15px; width:160px"
            clearable)
            el-option(
              v-for="(list,index) in item.dics"
              :key="index"
              :label="list.label"
              :value="list.value")
          el-input(
            v-else
            v-model="query[item.prop]"
            :placeholder="item.holder"

            style="padding-right:15px; width:160px"
            clearable)
      //- 干掉分开的东西 免得不方便
      el-col(:span="span" :offset="queryHandleOffset")
        .layout-row.align-center.mb_10(style="text-align: right;justify-content: flex-start;")
          el-button(

            @click='reset') 重置
          el-button(
            :loading="btnLoading"
            type="primary"

            @click='search') 查询
          div.ml_10(@click="queryTypeChange" v-if="hasAdvQuery")
            span.el-dropdown-link
              | {{queryType?'通用查询':'高级查询'}}
              i.el-icon--right(:class="[queryType?'el-icon-arrow-down':'el-icon-arrow-up']")
    .width100.layout-row.query-laywarp(v-else)
      .query-item(v-for="(item,index) in queryShow" :key="index")
        div.layout-row.align-center.mb_10(v-if="item.queryType === queryType")
          span.span-style(v-if="!item.hiddenLabel" :style="{width: width, textAlign:'right'}" ) {{item.label}}：
          el-select.mr_15(
            v-if="item.type === 'select'"
            v-model="query[item.prop]"
            :placeholder="item.holder"
            @change="selectChange($event, item)"
            filterable
            :style="{width: inputWidth}"
            :clearable="item.clearable"
            )
            el-option(
              v-for="(list,index) in dics[item.prop]"
              :key="index"
              :label="list.label || list[item.selectLabel]"
              :value="list.value || list[item.selectValue]")
          el-cascader.mr_15(
            v-else-if="item.type === 'cascader'"
            :options='dics[item.prop]',
            :show-all-levels='item.showAllLevels'

            :props="item.props"
            v-model="query[item.prop]"
            @change="selectChange($event, item)"
            :placeholder="item.holder"
            :style="{width: inputWidth}"
            :clearable="item.clearable"
            filterable)
          el-date-picker.mr_15(
            v-else-if="item.type === 'date'"
            v-model="query[item.prop]"
            type="date"

            value-format="yyyy-MM-dd"
            :style="{width:inputWidth}"
            placeholder="请选择日期")
          el-input.mr_15(
            v-else
            :style="{width:inputWidth}"
            v-model="query[item.prop]"
            :placeholder="item.holder"

            clearable)
      //- 干掉分开的东西 免得不方便
      .layout-row.align-center.mb_10(style="text-align: right;justify-content: flex-start;")
        el-button(
          @click='reset') 重置
        el-button(
          :loading="btnLoading"
          type="primary"
          @click='search') 查询
        div.ml_10(@click="queryTypeChange" v-if="hasAdvQuery")
          span.el-dropdown-link
            | {{queryType?'通用查询':'高级查询'}}
            i.el-icon--right(:class="[queryType?'el-icon-arrow-down':'el-icon-arrow-up']")
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'QueryTemplate',
  props: {
    queryList: {
      type: Array,
      default() {
        return []
      }
    },
    dics: {
      type: Object,
      default() {
        return {}
      }
    },
    width: {
      type: String,
      default: '80px'
    },
    spaceBetween: {
      type: Boolean,
      default: false
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    hasAdvQuery: {
      type: Boolean,
      default: false
    },
    inputWidth: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      query: {},
      queryType: false,
      span: 8,
      queryHandleOffset: 1,
      elRow: []
    }
  },
  computed: {
    queryShow() {
      return this.queryList.filter(item => item.queryType === this.queryType)
    },
    ...mapState('showSup', ['showComSup'])
  },
  watch: {
    queryList: {
      handler(newVal) {
        if (newVal.length > 0) {
          newVal.forEach(n => {
            if (n.default !== undefined) {
              this.$set(this.query, n.prop, n.default)
            }
          })
        }
      },
      // immediate: true,
      deep: true
    }
  },
  mounted() {
    if (this.showComSup) {
      this.$nextTick(() => {
        this.span = this.computeSpan(that.$refs.queryRef.offsetWidth)
        this.computeElRow()
      })
      const that = this
      window.onresize = () => {
        return (() => {
          console.log(that.$refs.queryRef.offsetWidth)
          this.span = this.computeSpan(that.$refs.queryRef.offsetWidth)
          this.computeElRow()
        })()
      }
    }
  },
  methods: {
    computeSpan(queryRefWidth) {
      if (queryRefWidth > 1600) {
        return 24 / 6
      } else if (queryRefWidth < 1600) {
        return 24 / 4
      }
    },
    computeElRow() {
      const yue = (this.queryShow.length + 1) % (24 / this.span)
      if (yue === 0) {
        this.queryHandleOffset = 0
      } else {
        this.queryHandleOffset = 24 - yue * this.span
      }
    },
    queryTypeChange() {
      this.queryType = !this.queryType
      this.computeElRow()
    },
    search() {
      // 只传当前queryType相符合的数据
      const query = {}
      this.queryShow.forEach(n => {
        if (n.queryType === this.queryType) {
          query[n.prop] = this.query[n.prop]
        }
      })
      this.$emit('onSearch', query)
    },
    reset() {
      for (const key in this.query) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.query.hasOwnProperty(key)) {
          const rse = this.queryShow.find(n => n.prop === key)
          if (rse) {
            let val
            if (rse.default !== null) {
              val = rse.default
            } else {
              val = ''
            }
            this.$set(this.query, [key], val)
          }
        }
      }
    },
    selectChange(e, item) {
      // 清空一些改清空的值
      if (item.selectClear) {
        item.selectClear.forEach(n => {
          this.$set(this.query, n, '')
        })
      }
      this.$emit('selectChange', e, item.prop, this.query)
    }
  }
}
</script>
<style lang="scss" scoped>
// 1024 1280
.query-laywarp{
  flex-wrap: wrap;
  // justify-content: flex-start;
}
.query-item{

}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
