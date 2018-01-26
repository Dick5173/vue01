<template lang="pug">
  el-form(:inline="true")
    el-form-item(label="状态")
      el-select.status-select(v-model="formData.status", multiple, clearable)
        el-option(v-for="item in optionsStatus", :key="item.value", :label="item.label", :value="item.value")
    el-form-item(label="下单")
      date-range-picker(:start.sync="formData.start_time", :end.sync="formData.end_time", placeholder="选择日期")
    el-form-item(label="店铺")
      select-tenant(v-model!="formData.tenant_id")
    el-form-item
      div.input-div
        el-input.input-data(:placeholder="moreCondition[formData.searchType]", v-model!="formData.searchKey")
        el-dropdown(trigger="click", @command="clickMoreConditions", :show-timeout="10", :hide-timeout="10")
          el-button.more-btn(type="primary") 更多条件
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(v-for="(val, key) in moreCondition", :key="key", :command="key") {{val}}
    el-form-item
      el-button(type="primary", icon="el-icon-search", @click="search") 搜索
      el-button(@click="reset") 重置

</template>

<script>
  import {DateRangePicker} from '@baibao/zeratul'
  import SelectTenant from './SelectTenant'

  export default {
    components: {
      DateRangePicker,
      SelectTenant
    },
    props: {
      queryParams: {},
      tenants: []
    },
    data () {
      return {
        formData: {
          status: [],
          searchKey: '',
          searchType: 'prod',
          tenant_id: 0,
          start_time: 0,
          end_time: 0
        },
        initialData: null,
        optionsStatus: [
          {value: '3', label: '待发货'},
          {value: '1', label: '待付款'},
          {value: '4', label: '待收货'},
          {value: '5', label: '已完成'},
          {value: '2', label: '已关闭'},
          {value: '6', label: '已退款'}
        ],
        moreConditions: [
          {value: '1', label: '商品/订单号', text: ''},
          {value: '2', label: '买家姓名/手机', text: ''},
          {value: '3', label: '物流单号', text: ''},
          {value: '4', label: '用户昵称/ID', text: ''}
        ],
        moreCondition: {
          prod: '商品/订单号',
          user: '买家姓名/手机',
          dev_no: '物流单号',
          buyer: '用户昵称/ID'
        }
      }
    },
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      clickMoreConditions (key) {
        if (key !== this.formData.searchType) {
          this.formData.searchKey = ''
          this.formData.searchType = key
        }
      },
      search () {
        this.$emit('search', this.formData)
      },
      convertQueryParamsToForm () {
        this.formData.status = this.queryParams.status
        this.formData.start_time = this.queryParams.start_time
        this.formData.end_time = this.queryParams.end_time
        this.formData.tenant_id = this.queryParams.tenant_id
        this.formData.searchKey = this.queryParams.searchKey
        this.formData.searchType = this.queryParams.searchType
      },
      async initData () {
        this.initialData = this.R.clone(this.formData)
      },
      reset () {
        this.formData = this.R.clone(this.initialData)
        this.$emit('search', this.formData)
      }
    },
    async mounted () {
      this.convertQueryParamsToForm()
      this.initData()
    }
  }
</script>

<style lang="scss" scoped>
  .status-select {
    width: 260px;
  }

  .input-div {
    width: 80vw;
    display: flex;

    .input-data {
      width: 350px;
    }

    .more-btn {
      margin-left: 10px;
    }
  }

</style>
