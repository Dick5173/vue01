<template lang="pug">
  el-dialog(:title="showTitle()", :visible.sync="dialogVisible", @close="handleClose()", width="800px")
    el-form(ref="form", :model="formData", :rules="formRules", v-loading="loading")
      el-form-item(label="名称：", prop="name", labelWidth="120px")
        el-input.tiny-x-el-input(v-model="formData.name", :maxlength="20")
      el-form-item(label="权限组：", labelWidth="120px")
        div {{auth_group_name}}
      el-form-item(label="类型：", labelWidth="120px")
        el-radio-group(v-model="formData.s_tp")
          el-radio(:label="1") 一般
          el-radio(:label="2") 其他
      el-button(@click="addPath", type="primary", size="small") 添加权限路径
      el-form-item(prop="paths")
        smart-table(:dataList.sync="formData.paths")
          smart-table-column(label="名称")
            div(slot-scope="scope")
              el-form-item.show-validate-el-form(:prop="'paths.' + scope.index + '.name'", :rules="formRules.name")
                el-input(v-model.trim="scope.row.name")
          smart-table-column(label="API路径")
            div(slot-scope="scope")
              el-form-item.show-validate-el-form(:prop="'paths.' + scope.index + '.path'", :rules="formRules.path")
                el-input(v-model.trim="scope.row.path")
          smart-table-column(label="操作", width="80px")
            div(slot-scope="scope")
              el-button.show-validate-el-form(plain, type="danger", @click="deletePath(scope.row)", size="small") 删除
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogVisible = false") 取 消
      el-button(type="primary", @click="submit", v-loading="loading") 确 定
</template>

<script>
  import * as AuthorizationManagementApi from 'src/api/authorization-management'
  import { SmartTable, SmartTableColumn } from '@baibao/zeratul'

  export default {
    props: {},
    components: {
      SmartTable,
      SmartTableColumn
    },
    data () {
      const pathsValidator = (rule, value, callback) => {
        if (this.formData.paths.length === 0) {
          callback(new Error('请添加权限路径'))
          return
        }
        callback()
      }
      return {
        loading: false,
        dialogVisible: false,
        authGroupList: [],
        auth_group_name: '',
        formData: {
          id: 0,
          name: '',
          tp: 1,
          s_tp: 1,
          auth_group_id: 0,
          paths: [{
            id: 0,
            name: '',
            path: ''
          }]
        },
        initialData: null,
        formRules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'},
            {max: 20, message: '名称最长20个字符', trigger: 'blur'}],
          path: [{required: true, message: '不能为空', trigger: 'blur'}],
          paths: [{validator: pathsValidator, trigger: 'blur'}]
        }
      }
    },
    computed: {
      isEdit () {
        return !!this.initialData
      }
    },
    watch: {},
    methods: {
      submit () {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.loading = true
            try {
              if (this.isEdit) {
                await AuthorizationManagementApi.editAuth(this.formData)
                this.dialogVisible = false
                this.$emit('refresh')
              } else {
                await AuthorizationManagementApi.createAuth(this.formData)
                this.dialogVisible = false
                this.$emit('refresh')
              }
            } finally {
              this.loading = false
            }
          }
        })
      },
      addPath () {
        this.formData.paths.push({id: 0,
          name: '',
          path: ''})
      },
      deletePath (row) {
        let index = this.formData.paths.indexOf(row)
        if (index !== -1) {
          this.formData.paths.splice(index, 1)
        }
      },
      handleClose () {
        this.initialData = null
        this.auth_group_name = ''
        this.formData = {
          id: 0,
          name: '',
          tp: 1,
          s_tp: 1,
          auth_group_id: 0,
          paths: [{id: 0,
            name: '',
            path: ''}]
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      show (tp, group, item) {
        if (item) {
          this.getAuth(item.id)
          this.initialData = item
        } else {
          this.formData.tp = tp
          this.formData.auth_group_id = group.id
        }
        this.auth_group_name = group.name
        this.dialogVisible = true
      },
      async getAuth (id) {
        this.loading = true
        try {
          let res = await AuthorizationManagementApi.getAuthItem(id)
          this.formData = res.data
          if (!this.formData.paths) {
            this.formData.paths = [{id: 0,
              name: '',
              path: ''}]
          }
        } finally {
          this.loading = false
        }
      },
      showTitle () {
        let model = this.isEdit ? '编辑' : '创建'
        let tp = this.formData.tp === 1 ? '平台' : '店铺'
        return `${model}${tp}权限`
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
