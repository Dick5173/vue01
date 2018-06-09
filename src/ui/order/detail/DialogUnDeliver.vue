<template lang="pug">
  el-dialog(title="无需发货", :visible.sync="dialogVisible")
    el-form(ref="form", :model="formData", :rules="formRules")
      el-form-item(label-width="20px")
        div {{orderItem.product_name}}, {{orderItem.spec}}, {{orderItem.price | price}} x {{orderItem.count}}
      el-form-item(label="备注：", prop="txt", label-width="80px")
        el-input(v-model="formData.txt", placeholder="请输入内容", type="textarea", :rows="3", maxlength="30", style="width: 400px")
      el-form-item(label-width="80px")
        div.txt-desc {{formData.txt.length}} / 30 用户不可见
    div(slot="footer", class="dialog-footer")
      el-button(size="mini", @click="dialogVisible = false") 取 消
      el-button(size="mini", type="primary", @click="submitForm", :loading="loading") 确 定
</template>

<script>
  import * as ElUtil from 'src/util/el'
  import * as OrderApi from 'src/api/order'

  export default {
    components: {},
    props: {},
    data () {
      return {
        loading: false,
        orderItem: {},
        dialogVisible: false,
        formData: {
          txt: ''
        },
        formRules: {
          txt: [
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
        this.formData.txt = ''
        this.dialogVisible = true
      },
      submitForm () {
        this.loading = true
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            try {
              await this.$confirm('确定无需发货？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
              await this.$confirm('真的确定无需发货？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
              await OrderApi.noNeedDelivery(this.orderItem.id, this.formData)
              this.$message({
                message: '设置无需发货成功',
                type: 'success'
              })
              this.$emit('submit')
              this.dialogVisible = false
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
