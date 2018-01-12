<template lang="pug">
  div
    el-dialog(title="服务说明", :visible.sync="dialogVisible", width="30%")
      el-form(ref="form", :model="formData", :rules="rules", label-width="80px")
        el-form-item(label="服务名称" prop="name")
          el-input(placeholder="最多5个字", v-model.trim="formData.name", :maxlength="5")
        el-form-item(label="服务描述", prop="desc")
          el-input(type="textarea", :autosize="{ minRows: 5, maxRows: 5}", placeholder="", v-model.trim="formData.desc", :maxlength="100")
          span.input-tip {{formData.desc ? formData.desc.length : 0}}/100
      div.dialog-footer(slot="footer")
        el-button(@click="dialogVisible = false") 取 消
        el-button(type="primary", @click="submit") 确 定
</template>

<script>
  export default {
    props: {},
    components: {},
    data () {
      return {
        dialogVisible: false,
        originData: '',
        formData: {
          id: 0,
          name: '',
          desc: ''
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      show (row) {
        this.dialogVisible = true
        this.originData = row
        if (row) {
          this.formData.id = row.id
          this.formData.name = row.name
          this.formData.desc = row.desc
        } else {
          let formData = {
            id: 0,
            name: '',
            desc: ''
          }
          this.formData = formData
        }
      },
      submit () {
        if (this.originData) {
          this.$emit('created', this.formData)
        } else {
          this.$emit('updated', this.formData)
        }
      }
    }
  }
</script>


<style lang="scss" scoped>

</style>
