<template lang="pug">
    div
      smart-table.large-el-table(:dataList="tenantLevelList")
        div(slot-scope="scope")
          el-form-item(:label="scope.index")
            el-input(v-model="scope.description")

</template>

<script>
    import {SmartTable, SmartTableColumn} from '@baibao/zeratul'

    export default {
      props: {
        supply_levels: {
          type: Array,
          required: true
        },
        tenantLevelList: {
          type: Array,
          required: true
        }
      },
      components: {
        SmartTable,
        SmartTableColumn
      },
      data () {
        return {}
      },
      computed: {},
      watch: {},
      methods: {}
    }
</script>


<style lang="scss" scoped>

</style>
