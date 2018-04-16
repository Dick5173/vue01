<template lang="pug">
  el-dialog(title="定向供货", v-loading="loading", :visible.sync="dialogVisible", width="400px")
    div.radio-content
      el-radio(v-for="item in allSupplyType", :key="item.value", :label="item.value", v-model="paramsTenant.supply_scope_tp", @change="typeChange") {{item.text}}
    div.selected-content
      div 已选：
      div.sel {{showSelectItem}}
    div.search-el-input
      el-input(placeholder="店铺/ID", v-model.trim="queryParams.key")
        el-button(slot="append", icon="el-icon-search", @click="handleSearch") 搜索
    el-checkbox-group(v-model="checkedItemIdsProxy")
      el-table.table-content(:data="dataList.data", border, :showHeader="false", @row-click="handleRowClick")
        el-table-column
          template(slot-scope="scope")
            div.ck
              el-checkbox(:label="scope.row.id", :disabled="disableProduct()") {{scope.row.id}}-{{scope.row.nick_name}}
    div.bottom
      el-pagination(:currentPage="dataList.page", :pageSize="dataList.limit", :total="dataList.total",  @current-change="changePage")
    div(slot="footer")
      el-button(size="mini", @click="hide") 取消
      el-button(size="mini", type="primary", @click="submit") 确定
</template>

<script>
  import * as ProductService from 'src/service/product/index'
  import * as TenantApi from 'src/api/tenant'

  export default {
    components: {},
    props: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        dataList: {
          data: []
        },
        queryParams: {
          key: '',
          page: 1,
          limit: 10
        },
        checkedItemIds: [],
        paramsTenant: {
          supply_scope_tp: 1,
          supply_tenants: []
        },
        ...$global.$mapConst({
          'allSupplyType': ProductService.allSupplyType
        })
      }
    },
    computed: {
      checkedItemIdsProxy: {
        get () {
          return this.checkedItemIds
        },
        set (newValue) {
          if (newValue.length > this.checkedItemIds.length) {
            const diff = this.R.difference(newValue)(this.checkedItemIds)
            this.R.forEach((item) => {
              this.addCheckProduct(item)
            })(diff || [])
          } else {
            const diff = this.R.difference(this.checkedItemIds)(newValue)
            this.R.forEach((item) => {
              this.removeCheckProduct(item)
            })(diff || [])
          }
          this.checkedItemIds = newValue
        }
      },
      showSelectItem () {
        if (!this.paramsTenant.supply_scope_tp || this.paramsTenant.supply_scope_tp === ProductService.allSupplyType.unlimited.value) {
          return '无限制'
        }
        let tenants = ''
        this.paramsTenant.supply_tenants.forEach((item, index) => {
          tenants += `${index === 0 ? '' : '、'}${item.id}-${item.nick_name}`
        })
        return tenants
      }
    },
    methods: {
      async show (paramsTenant) {
        this.queryParams.text = ''
        this.queryParams.page = 1
        this.paramsTenant.supply_scope_tp = this.R.clone(paramsTenant.supply_scope_tp)
        if (this.paramsTenant.supply_scope_tp === ProductService.allSupplyType.supply.value) {
          this.checkedItemIds = this.R.map((item) => {
            return item.id
          })(paramsTenant.supply_tenants)
          this.paramsTenant.supply_tenants = this.R.clone(paramsTenant.supply_tenants)
        }
        this.dialogVisible = true
        await this.refreshList()
      },
      hide () {
        this.dialogVisible = false
      },
      handleSearch () {
        this.refreshList()
      },
      handleRowClick (item) {
        const i = this.R.indexOf(item.id)(this.checkedItemIds)
        if (i === -1) {
          this.addCheckProduct(item.id)
          this.checkedItemIds.push(item.id)
        } else {
          this.removeCheckProduct(item.id)
          this.checkedItemIds.splice(i, 1)
        }
      },
      disableProduct () {
        return this.paramsTenant.supply_scope_tp === ProductService.allSupplyType.unlimited.value
      },
      typeChange () {
        this.paramsTenant.supply_tenants = []
        this.checkedItemIds = []
      },
      addCheckProduct (id) {
        const newItem = this.R.find((tenant) => {
          return tenant.id === id
        })(this.dataList.data || [])
        if (newItem) {
          this.paramsTenant.supply_tenants.push(newItem)
        }
      },
      removeCheckProduct (id) {
        const i = this.R.findIndex((tenant) => {
          return tenant.id === id
        })(this.paramsTenant.supply_tenants)
        if (i !== -1) {
          this.paramsTenant.supply_tenants.splice(i, 1)
        }
      },
      changePage (page) {
        this.queryParams.page = page
        this.refreshList()
      },
      async refreshList () {
        this.loading = true
        try {
          const res = await TenantApi.getList(this.queryParams)
          this.dataList = res.data || []
        } finally {
          this.loading = false
        }
      },
      submit () {
        this.$emit('choose', this.paramsTenant)
        this.hide()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .radio-content {
    display: flex;
  }

  .selected-content {
    margin-top: 10px;
    width: 350px;
    display: flex;

    .sel {
      flex: 1;
    }
  }

  .search-el-input {
    margin-top: 10px;
    width: 300px;
  }

  .list-content {
    margin-top: 10px;
  }

  .table-content {
    margin: 10px 0;
  }

  .ck {
    height: 40px;
    line-height: 40px;
    display: inline-block;
  }
</style>
