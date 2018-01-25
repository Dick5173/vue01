<template lang="pug">
  el-form(:inline="true")
    el-form-item(label="状态")
      el-select.status-select(v-model="formData.status", multiple, clearable)
        el-option(v-for="item in optionsStatus", :key="item.value", :label="item.label", :value="item.value")
    el-form-item(label="下单")
      date-tool-bar(:start.sync="formData.start_time", :end.sync="formData.end_time", placeholder="选择日期")
    el-form-item(label="店铺")
      select-tenant(v-model!="formData.tenant_id")
    el-form-item
      div.input-div
        el-input.input-data(:placeholder="selectMoreValue.label", v-model="searchText")
        el-dropdown(trigger="click", @command="clickMoreConditions", :show-timeout="10", :hide-timeout="10")
          el-button.more-btn(type="primary") 更多条件
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(v-for="item in moreConditions", :key="item.value", :command="item") {{item.label}}
    el-form-item
      el-button(type="primary", icon="el-icon-search", @click="search") 搜索
      el-button(@click="reset") 重置

</template>

<script>
  import DateToolBar from 'src/ui/common/date-range-picker/Index'
  import SelectTenant from './SelectTenant'

  export default {
    components: {
      DateToolBar,
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
          prod: '',
          user: '',
          buyer: '',
          dev_no: '',
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
        selectMoreValue: {value: '1', label: '商品/订单号', text: ''}
      }
    },
    watch: {
      queryParams () {
        console.log('======queryParams====')
        console.log(this.queryParams)
        this.convertQueryParamsToForm()
      }
    },
    computed: {
      getSearchFiled () {
        if (this.selectMoreValue.value === '1') {
          return 'prod'
        } else if (this.selectMoreValue.value === '2') {
          return 'buyer'
        } else if (this.selectMoreValue.value === '3') {
          return 'dev_no'
        } else if (this.selectMoreValue.value === '4') {
          return 'user'
        }
      },
      searchText: {
        get () {
          return this.formData[this.getSearchFiled]
        },
        set (val) {
          this.formData[this.getSearchFiled] = val
        }
      }
    },
    methods: {
      clickMoreConditions (item) {
        if (item.value !== this.selectMoreValue.value) {
          this.formData.prod = ''
          this.formData.user = ''
          this.formData.buyer = ''
          this.formData.dev_no = ''
          this.selectMoreValue = item
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
        let filedName = ''
        let filedValue = ''
        if (this.queryParams.prod) {
          filedName = 'prod'
          filedValue = this.queryParams.prod
          this.selectMoreValue = {value: '1', label: '商品/订单号', text: ''}
        } else if (this.queryParams.buyer) {
          filedName = 'buyer'
          filedValue = this.queryParams.buyer
          this.selectMoreValue = {value: '2', label: '买家姓名/手机', text: ''}
        } else if (this.queryParams.user) {
          filedName = 'user'
          filedValue = this.queryParams.user
          this.selectMoreValue = {value: '4', label: '用户昵称/ID', text: ''}
        } else if (this.queryParams.dev_no) {
          filedName = 'dev_no'
          filedValue = this.queryParams.dev_no
          this.selectMoreValue = {value: '3', label: '物流单号', text: ''}
        }
        this.formData.prod = ''
        this.formData.user = ''
        this.formData.buyer = ''
        this.formData.dev_no = ''
        if (filedName) {
          this.formData[filedName] = filedValue
        }
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
