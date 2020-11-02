<template lang="pug">
  div.layout-row.query-laywarp
    .query-item(v-for="item in queryShow" :key="item.id")
      div.layout-row.align-center.mb_10(v-if="item.queryType === queryType")
        span(:style="{width: width, textAlign:'right'}" ) {{item.label}}：
        el-select(
          v-if="item.type === 'select'"
          v-model="query[item.prop]"
          :placeholder="item.holder"
          filterable
          style="padding-right:15px; width:160px"
          size="small"
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
          size="small"
          clearable)
    div.layout-row.align-center.mb_10(style="margin-left: auto")
      el-button(
        size="small"
        @click='reset') 重置
      el-button(
        type="primary"
        size="small"
        @click='search') 查询
      div.ml_10(@click="queryType = !queryType")
        span.el-dropdown-link
          | {{queryType?'高级查询':'通用查询'}}
          i.el-icon--right(:class="[queryType?'el-icon-arrow-down':'el-icon-arrow-up']")
</template>
<script>
export default {
  name: 'QueryTemplate',
  props: {
    queryList: {
      type: Array,
      default() {
        return []
      }
    },
    width: {
      type: String,
      default: '120px'
    }
  },
  data() {
    return {
      query: {},
      queryType: true
    }
  },
  computed: {
    queryShow() {
      return this.queryList.filter(item => item.queryType === this.queryType)
    }
  },
  mounted() {

  },
  methods: {
    search() {

    },
    reset() {
      if (this.queryType) {

      } else {

      }
    },
    handleQueryType(e) {
      console.log(this.queryType)
      console.log(e)
    }
  }
}
</script>
<style lang="scss" scoped>
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
