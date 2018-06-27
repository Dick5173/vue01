<template lang="pug">
  el-dialog(:title="showTitle()", :visible.sync="dialogVisible", @close="handleClose()")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="120px")
      el-form-item(label="名称：", prop="name")
        el-input.tiny-x-el-input(v-model="formData.name", :maxlength="20")
      el-form-item(label="选择父权限组：")
        el-select(v-model="formData.parent_id", clearable, :disabled="disableSelect")
          el-option(v-for="item in authGroupList", :key="item.id", :label="item.name", :value="item.id")
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogVisible = false") 取 消
      el-button(type="primary", @click="submit", v-loading="loading") 确 定
</template>

<script>
  import * as AuthorizationManagementApi from 'src/api/authorization-management'
  import * as AuthorizationManagementService from 'src/service/authorization-management/index'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        authGroupList: [],
        formData: {
          id: 0,
          name: '',
          tp: 1,
          parent_id: ''
        },
        initialData: null,
        formRules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'},
            {max: 20, message: '名称最长20个字符', trigger: 'blur'}]
        }
      }
    },
    computed: {
      isEdit () {
        return !!this.initialData
      },
      disableSelect () {
        return this.initialData && this.initialData.children && this.initialData.children.length > 0
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
                await AuthorizationManagementApi.editAuthGroup(this.formData)
                this.dialogVisible = false
                this.$emit('refresh')
              } else {
                await AuthorizationManagementApi.createAuthGroup(this.formData)
                this.dialogVisible = false
                this.$emit('refresh')
              }
            } finally {
              this.loading = false
            }
          }
        })
      },
      handleClose () {
        this.initialData = null
        this.formData = {
          id: 0,
          name: '',
          tp: 1,
          parent_id: ''
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      show (tp, pid = 0, item) {
        this.getAuthGroup(tp)
        if (item) {
          this.formData.id = item.id
          this.formData.name = item.name
          this.formData.tp = item.tp
          this.formData.parent_id = item.parent_id === 0 ? '' : item.parent_id
          this.initialData = item
        } else {
          this.formData.tp = tp
          this.formData.parent_id = pid === 0 ? '' : pid
        }
        this.dialogVisible = true
      },
      async getAuthGroup (tp) {
        this.loading = true
        try {
          let res = await AuthorizationManagementApi.getAuthGroupList(tp)
          this.authGroupList = AuthorizationManagementService.filterParentGroup(res.data.data)
        } finally {
          this.loading = false
        }
      },
      showTitle () {
        let model = this.isEdit ? '编辑' : '创建'
        let tp = this.formData.tp === 1 ? '平台' : '店铺'
        return `${model}${tp}权限组`
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
