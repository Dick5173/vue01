<template lang="pug">
  el-dialog(:title="showTitle()", :visible.sync="dialogVisible", @close="handleClose()")
    el-form(ref="form", :model="formData", :rules="formRules", labelWidth="120px")
      el-form-item(label="名称：", prop="name")
        el-input.tiny-x-el-input(v-model="formData.name", :maxlength="20")
    span(slot="footer" class="dialog-footer")
      el-button(@click="dialogVisible = false") 取 消
      el-button(type="primary", @click="submit", v-loading="loading") 确 定
</template>

<script>
  import * as AuthorizationManagementApi from 'src/api/authorization-management'

  export default {
    props: {},
    components: {},
    data () {
      return {
        loading: false,
        dialogVisible: false,
        formData: {
          id: 0,
          name: '',
          tp: 1,
          parent_id: 0
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
          parent_id: 0
        }
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      show (tp, pid = 0, item) {
        if (item) {
          this.formData.id = item.id
          this.formData.name = item.name
          this.formData.tp = item.tp
          this.formData.parent_id = item.parent_id
          this.initialData = item
        } else {
          this.formData.tp = tp
          this.formData.parent_id = pid
        }
        this.dialogVisible = true
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
