<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="店铺：")
        el-select(v-model="model.tenantId",
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
        el-input.medium-el-input(v-model.trim="model.tenant_user", placeholder="名字/手机号/公司/店铺管理员ID")
      el-form-item
        el-button(type="primary", icon="el-icon-search", @click="submit") 搜索
</template>

<script>
  import * as TenantApi from 'src/api/tenant'

  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {
            tenantId: '',
            tenant_user: ''
          }
        }
      }
    },
    components: {},
    data () {
      return {
        selectLoading: false,
        tenantList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      submit () {
        this.$emit('submit', this.model)
      },
      async getTenantList () {
        let params = {
          limit: 30
        }
        try {
          let res = await TenantApi.getList(params)
          res = res.data.data
          let arr = res.map((i) => {
            let merge = []
            merge.push(i.id)
            merge.push(i.nick_name)
            let str = merge.join('--')
            let data = {
              id: String(i.id),
              principal_name_id: str
            }
            return data
          })
          this.tenantList = arr
        } catch (err) {
        }
      }
    },
    mounted () {
      this.getTenantList()
    }
  }
</script>


<style lang="scss" scoped>
  .input {
    margin-left: 20px;
  }

  @import "../../../assets/scss/el";
</style>
