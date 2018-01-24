<template lang="pug">
  div
    div.head
      div.head-cover(v-lazy:background-image="")
      div.head-name name
    div.margin
      el-form(:inline="true")
        el-form-item
          date-picker(:defaultDate="defaultDate", @change = "changeDate")
    div.margin
      el-table.list-el-table(:data="dataList.data", @sort-change="sortChanged", :defaultSort!='dataListSortInfo', border)
        el-table-column(prop="", label="统计周期", sortable)
        el-table-column(prop="", label="销售额（元）", sortable)
        el-table-column(prop="", label="货款（元）", sortable)
        el-table-column(prop="", label="平台服务费（元）", sortable)
        el-table-column(prop="", label="利润（元）", sortable)
      div.total
        span 销售总额：万，货款合计：万，平台服务费合计：万，利润合计：万
      el-pagination(:currentPage="queryPager.page", :pageSize="queryPager.limit", :total="dataListTotal",  @current-change="changePage")
</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'
  import LoadPagerData from 'src/mixins/load-pager-data'
  //  import { dateFormat } from 'src/util/format'

  export default {
    mixins: [
      LoadPagerData
    ],
    props: {},
    components: {DatePicker},
    data () {
      return {
        dataList: {
          data: []
        },
        formData: {
          start: 0,
          end: 0
        },
        defaultDate: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      getQueryApi (params) {
//        return TenantApi.getList(this.R.mapObjIndexed((val, key, obj) => {
//          if (key === 'start' || key === 'end') {
//            if (val === 0) {
//              return ''
//            } else {
//              return dateFormat(val, 'YYYY-MM-DD')
//            }
//          }
//          return val
//        })(params))
      },
      changeDate (event) {
        if (event && event.length === 2) {
          this.formData.start = event[0].getTime()
          this.formData.end = event[1].getTime()
        } else {
          this.formData.start = 0
          this.formData.end = 0
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../../assets/scss/other";

  .margin {
    margin-left: 60px;
  }

  .total {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
