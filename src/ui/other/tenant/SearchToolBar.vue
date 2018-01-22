<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="状态：")
        el-select(v-model="formData.status")
          el-option(v-for="item in statusList", :label="item.name", :value="item.status")
      el-form-item(label="首次上线：")
        date-picker(:defaultDate="defaultDate", @change = "changeDate")
      el-form-item
        el-input(v-model="formData.text", placeholder="店铺名称/店铺ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜&nbsp索
</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

  export default {
    props: {},
    components: {
      DatePicker
    },
    data () {
      return {
        formData: {
          status: '',
          start: 0,
          end: 0,
          text: ''
        },
        defaultDate: [],
        statusList: [
          {name: '审核中', status: '0'},
          {name: '已上线', status: '1'},
          {name: '已下线', status: '2'},
          {name: '解除授权', status: '3'}
        ]
      }
    },
    computed: {},
    watch: {},
    methods: {
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

</style>
