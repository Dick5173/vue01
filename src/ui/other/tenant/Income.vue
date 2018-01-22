<template lang="pug">
  div
    div
      el-form(:inline="true")
        el-form-item
          date-picker(:defaultDate="defaultDate", @change = "changeDate")
    div
      div list

</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'

  export default {
    props: {},
    components: {DatePicker},
    data () {
      return {
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
