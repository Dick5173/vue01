<template lang="pug">
  div.el-table.list-el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition.draggable-table()
    slot
    table-header(v-if="showHeader")
    table-body(v-show="dataList && dataList.length > 0")
    empty(v-show="!dataList || dataList.length <= 0")


</template>

<script>
  import TableHeader from './TableHeader.jsx'
  import TableBody from './TableBody.jsx'
  import Empty from './Empty.vue'

  import TableStore from './TableStore'

  export default {
    components: {
      TableHeader,
      TableBody,
      Empty
    },
    props: {
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      rowKey: {
        type: String,
        default: ''
      }
    },
    data () {
      const store = new TableStore(this)
      return {
        store
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
