<template lang="pug">
  el-dialog(title="无需发货", :visible.sync="dialogVisible")
    el-form(ref="form", :model="formData", :rules="formRules")
      el-form-item(label-width="20px")
        div {{orderItem.product_name}}, {{orderItem.spec}}, {{orderItem.price | price}} x {{orderItem.count}}
      el-form-item(label="备注：", prop="remark", label-width="80px")
        el-input(v-model="formData.remark", placeholder="请输入内容", type="textarea", :rows="3", maxlength="30", style="width: 400px")
      el-form-item(label-width="80px")
        div.txt-desc {{formData.remark.length}} / 30 用户不可见
    div(slot="footer", class="dialog-footer")
      el-button(size="mini", @click="dialogVisible = false") 取 消
      el-button(size="mini", type="primary", @click="submitForm", :loading="loading") 确 定
</template>

<script>
  import * as ElUtil from 'src/util/el'

  export default {
    components: {},
    props: {},
    data () {
      return {
        loading: false,
        orderItem: {},
        dialogVisible: false,
        formData: {
          remark: ''
        },
        formRules: {
          remark: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 30, message: '名称最长30个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {},
    methods: {
      show (orderItem) {
        this.orderItem = orderItem
        this.formData.remark = ''
        this.dialogVisible = true
      },
      submitForm () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              //
            } catch (err) {
              console.log(err)
            }
          } else {
            ElUtil.scrollToInvalidFirstElement(this.$refs.form)
          }
        })
        this.loading = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
