<template lang="pug">
  div
    el-button(type="primary", icon="el-icon-plus", @click="create") 添加
    div.list
      el-table(style="width: 450px;", :data="serviceTagList", row-key="id", border, :show-header="false", v-loading="loading")
        el-table-column(label="", prop="name", width="299")
          template(slot-scope="scope")
            el-button(type="text", @click="edit(scope.row)") {{scope.row.name}}
        el-table-column(label="", width="150")
          template(slot-scope="scope")
            el-button(size="small", type="danger", @click="del(scope.row)") 删 除
    edit-dialog(ref="dlgEdit", @created="refresh", @updated="refresh")
</template>

<script>
  import * as ServiceTagApi from 'src/api/servicetag'
  import EditDialog from './Edit'

  export default {
    props: {},
    components: {
      EditDialog
    },
    data () {
      return {
        loading: false,
        serviceTagList: []
      }
    },
    computed: {},
    watch: {},
    methods: {
      create () {
        this.$refs.dlgEdit.show()
      },
      del (row) {

      },
      edit (row) {

      },
      async refresh () {
        try {
          this.loading = true
          let res = await ServiceTagApi.getList()
          this.serviceTagList = res.data.data
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>


<style lang="scss" scoped>
  .list {
    margin-top: 20px;
  }
</style>
