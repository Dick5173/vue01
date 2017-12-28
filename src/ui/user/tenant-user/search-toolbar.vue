<template lang="pug">
  div
    el-form(:inline="true")
      el-form-item(label="店铺：")
        el-select(v-model="model.tenantId",
        filterable,
        clearable,
        :loading="selectLoading",
        placeholder="请输入关键词"
        )
          el-option(v-for="item in tenantList",
          :key="item.app_id",
          :label="item.principal_name_id",
          :value="item.app_id")
      el-form-item.input
        el-input(style="width: 500px", v-model="model.tenant_user", placeholder="名字/手机号/店铺管理员ID")
          el-button(slot="append" icon="el-icon-search", @click="_submit") 搜索
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
      _submit () {
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
            merge.push(i.app_id)
            merge.push(i.principal_name)
            let str = merge.join('--')
            let data = {
              app_id: i.app_id,
              principal_name_id: str
            }
            return data
          })
          this.tenantList = arr
        } catch (err) {
          this.$my.ErrorPlugin(this, err)
        }
      }
    },
    async mounted () {
      this.getTenantList()
    }
  }
</script>


<style lang="scss" scoped>
  .input {
    margin-left: 20px;
  }

</style>
