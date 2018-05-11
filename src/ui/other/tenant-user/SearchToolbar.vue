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
      el-form-item.input
        el-input.medium-el-input(v-model.trim="formData.key", placeholder="名字/手机号/公司/店铺管理员ID", clearable)
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="submit") 搜&nbsp索
        el-button(@click="handleReset") 重&nbsp置
</template>

<script>
  import * as TenantApi from 'src/api/tenant'
  import { getTenantNameId } from 'src/service/other/index'

  export default {
    props: {
      /* model: {
        type: Object,
        default: () => {
          return {
            tenant_id: '',
            key: ''
          }
        }
      } */
      queryParams: {}
    },
    components: {},
    data () {
      return {
        selectLoading: false,
        tenantList: [],
        formData: {
          tenant_id: '',
          key: ''
        }
      }
    },
    computed: {},
    watch: {
      queryParams () {
        this.convertQueryParamsToForm()
      }
    },
    methods: {
      submit () {
        this.$emit('submit', this.formData)
      },
      handleReset () {
        this.formData = this.R.clone(this.tenantList)
        this.$emit('submit', this.formData)
      },
      async getTenantList () {
        try {
          this.selectLoading = true
          let res = await TenantApi.getListAll()
          res = res.data.data
          this.tenantList = getTenantNameId(res)
          this.selectLoading = false
        } catch (err) {
          this.selectLoading = false
        }
      },
      convertQueryParamsToForm () {
        this.formData = {
          tenant_id: this.queryParams.tenant_id,
          key: this.queryParams.key
        }
      }
    },
    mounted () {
      this.getTenantList()
      this.convertQueryParamsToForm()
    }
  }
</script>


<style lang="scss" scoped>
  .input {
    margin-left: 20px;
  }

  @import "../../../assets/scss/el";
</style>
