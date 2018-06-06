<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="店铺：")
        el-select(v-model="formData.tenant_id",
        filterable,
        clearable,
        :loading="selectLoading",
        placeholder="店铺/ID"
        )
          el-option(v-for="item in tenantList",
          :key="item.id",
          :label="item.principal_name_id",
          :value="item.id")
      el-form-item(label="首次上线：")
        date-picker(:defaultDate="defaultDate", @change = "changeDate", type="datetimerange")
      el-form-item(label="状态：")
        el-select(v-model="formData.status", clearable, placeholder="请选择")
          el-option(v-for="item in allSettleStatus", :key="item.value", :label="item.text", :value="item.value")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="handleSearch") 搜&nbsp索
        el-button(@click="handleReset") 重&nbsp置
</template>

<script>
  import DatePicker from 'src/ui/common/date-range-picker/Index.vue'
  import * as TenantApi from 'src/api/tenant'
  import * as OtherService from 'src/service/other/index'

  export default {
    props: {
      queryParams: {}
    },
    components: {
      DatePicker
    },
    data () {
      return {
        formData: {
          tenant_id: '',
          start: 0,
          end: 0,
          status: ''
        },
        initialData: {},
        defaultDate: [],
        tenantList: [],
        selectLoading: false,
        ...$global.$mapConst({
          'allSettleStatus': OtherService.allSettleStatus
        })
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      changeDate (event) {
        if (event && event.length === 2) {
          this.formData.start = event[0].getTime()
          this.formData.end = event[1].getTime()
        } else {
          this.formData.start = 0
          this.formData.end = 0
        }
      },
      async getTenantList () {
        this.selectLoading = true
        try {
          let res = await TenantApi.getListAll()
          res = res.data.data
          this.tenantList = OtherService.getTenantNameId(res)
        } catch (err) {
          console.log(err)
        }
        this.selectLoading = false
      },
      handleSearch () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.initialData)
        this.defaultDate = []
        this.$emit('submit', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData = {
          tenant_id: this.queryParams.tenant_id,
          start: this.R_.parseDateTick(0, this.queryParams.start),
          end: this.R_.parseDateTick(0, this.queryParams.end),
          status: this.queryParams.status ? parseInt(this.queryParams.status) : ''
        }
        if (this.formData.start && this.formData.end) {
          this.defaultDate = [this.formData.start, this.formData.end]
        } else {
          this.defaultDate = []
        }
      }
    },
    mounted () {
      this.initialData = this.R.clone(this.formData)
      this.convertQueryParamsToForm()
      this.getTenantList()
    }
  }
</script>


<style lang="scss" scoped>

</style>
